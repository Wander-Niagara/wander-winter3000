"""Derive the unlit facade, per-portal glow overlays and the snow plate from one lit render.
Composite check: unlit + screen(glow_i) ~= lit."""
import sys, json
import numpy as np
from PIL import Image, ImageFilter

NAVY = np.array([18, 28, 51], np.float32)

def lum(a): return (0.2126*a[...,0] + 0.7152*a[...,1] + 0.0722*a[...,2])

def blur(mask, r):
    im = Image.fromarray((np.clip(mask,0,1)*255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(r))).astype(np.float32)/255

def dilate(mask, r):
    im = Image.fromarray((mask>0.5).astype(np.uint8)*255)
    return np.asarray(im.filter(ImageFilter.MaxFilter(2*r+1))).astype(np.float32)/255

def erode(mask, r):
    im = Image.fromarray((mask>0.5).astype(np.uint8)*255)
    return np.asarray(im.filter(ImageFilter.MinFilter(2*r+1))).astype(np.float32)/255

def close(mask, r): return erode(dilate(mask, r), r)

def fill_holes(m, box):
    """fill enclosed holes inside the box: flood the background from the box corner."""
    from PIL import ImageDraw
    x0,y0,x1,y1 = box
    crop = (m[y0:y1, x0:x1] > 0.5)
    im = Image.fromarray(np.where(crop, 255, 0).astype(np.uint8))
    ImageDraw.floodfill(im, (0,0), 128)           # reachable background -> 128
    arr = np.asarray(im)
    filled = (arr != 128).astype(np.float32)      # glass + enclosed holes
    out = m.copy(); out[y0:y1, x0:x1] = filled; return out

def box_mask(shape, box):
    m = np.zeros(shape[:2], np.float32); x0,y0,x1,y1 = box; m[y0:y1, x0:x1] = 1; return m

def sky_lift(a):
    L = lum(a)/255
    k = np.clip(1-L, 0, 1)**2.5
    return np.clip(a + NAVY[None,None,:]*k[...,None]*0.8, 0, 255)

def process(src, out_dir, groups, upscale=1.0, snow_from=None, snow_grade=True, tag=""):
    import os; os.makedirs(out_dir, exist_ok=True)
    lit = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
    lit = sky_lift(lit)
    H, W = lit.shape[:2]
    L = lum(lit)
    warm = (L > 88) & ((lit[...,0]-lit[...,2]) > 16)
    unlit = lit.copy()
    report = {}
    glass_all = np.zeros((H,W), np.float32)
    spill_all = np.zeros((H,W), np.float32)
    group_masks = {}
    for name, g in groups.items():
        gm = np.zeros((H,W), np.float32)   # glass of this group
        sm = np.zeros((H,W), np.float32)   # spill source of this group
        for box in g.get('glass', []):
            bm = box_mask(lit.shape, box)
            m = (warm & (bm>0)).astype(np.float32)
            m = close(m, g.get('close', 10)) * bm
            m = fill_holes(m, box)
            # keep candle flame cores (very bright, bottom 40% of the pane) lit
            ys, xs = np.where(m>0.5)
            if len(ys):
                y0,y1 = ys.min(), ys.max()
                flame = (L > 251) & (m>0.5) & (np.arange(H)[:,None] > y0 + 0.6*(y1-y0))
                flame = dilate(flame.astype(np.float32), 2)
                m = m * (1-flame)
            gm = np.maximum(gm, m)
        for box in g.get('source', []):   # extra spill sources that stay lit (lantern)
            bm = box_mask(lit.shape, box)
            sm = np.maximum(sm, ((L>200)&(bm>0)).astype(np.float32))
        gm_f = blur(gm, 1.5)
        # dark glass: navy, structure kept faintly
        Ln = (L/255)[...,None]
        sat = (lit.max(axis=2)-lit.min(axis=2))[...,None]
        muntin = ((L>200)[...,None] & (sat<70)).astype(np.float32)
        dark = NAVY[None,None,:] * (0.28 + 0.62*Ln) + muntin*np.array([26,30,38],np.float32)
        unlit = unlit*(1-gm_f[...,None]) + dark*gm_f[...,None]
        # spill: halation zone around glass + sources, darkened in the unlit plate
        src_m = np.maximum(gm, sm)
        spill = blur(dilate(src_m, g.get('spill_r', 30)), g.get('spill_blur', 40))
        spill = np.clip(spill - gm_f, 0, 1) * (1 - sm)   # not inside glass, not on the lantern itself
        spill = np.minimum(spill, 1) * g.get('spill_k', 0.45)
        unlit = unlit * (1 - spill[...,None])
        glass_all = np.maximum(glass_all, gm_f); spill_all = np.maximum(spill_all, spill)
        group_masks[name] = (gm_f, spill, src_m)
        ys, xs = np.where(gm>0.5)
        report[name] = {'glass_bbox': [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())] if len(xs) else None}
    unlit = np.clip(unlit, 0, 255)
    # glow = inverse screen
    litn, unn = lit/255, unlit/255
    glow = 1 - (1-litn)/np.maximum(1-unn, 1e-3)
    glow = np.clip(glow, 0, 1)
    glow[unn > 0.985] = 0
    out = {}
    def save(a, name, scale=upscale):
        im = Image.fromarray(a.astype(np.uint8))
        if scale != 1.0: im = im.resize((round(im.width*scale), round(im.height*scale)), Image.LANCZOS)
        im.save(f"{out_dir}/{name}"); return im.size
    for name, g in groups.items():
        gm_f, spill, src_m = group_masks[name]
        region = np.maximum(gm_f, spill/ max(g.get('spill_k',0.45),1e-3)) 
        region = np.maximum(region, src_m)
        ys, xs = np.where(region > 0.02)
        pad = g.get('pad', 12)
        x0,x1 = max(0, xs.min()-pad), min(W, xs.max()+pad); y0,y1 = max(0, ys.min()-pad), min(H, ys.max()+pad)
        rgb = glow[y0:y1, x0:x1]
        a = np.clip(rgb.max(axis=2)*1.6, 0, 1)
        # feather alpha to zero at the crop border
        fy = np.minimum(np.arange(y1-y0)/pad, (y1-y0-1-np.arange(y1-y0))/pad)[:,None]
        fx = np.minimum(np.arange(x1-x0)/pad, (x1-x0-1-np.arange(x1-x0))/pad)[None,:]
        a = a * np.clip(np.minimum(fy,fx),0,1)
        rgba = np.dstack([rgb*255, a*255])
        size = save(rgba, f"glow-{name}.png")
        report[name].update({'crop': [int(x0),int(y0),int(x1-x0),int(y1-y0)], 'pct': [x0/W, y0/H, (x1-x0)/W, (y1-y0)/H], 'file': f"glow-{name}.png", 'size': size})
    report['_source'] = {'size':[W,H], 'upscale': upscale}
    report['_facade'] = {'size': save(unlit, 'facade.png')}
    save(lit, 'facade-lit-check.png', scale=0.5)
    # composite check
    comp = unlit/255
    for name in groups: 
        gm_f, spill, src_m = group_masks[name]
        comp = 1 - (1-comp)*(1-glow)   # whole-frame screen is equivalent to per-crop screen where glow>0
        break
    err = np.abs(comp*255 - lit).mean()
    report['_composite_mean_abs_error'] = float(err)
    # debug sheet: lit | unlit | recomposite | glow alpha
    sheet = np.concatenate([lit, unlit, comp*255, np.repeat((glow.max(axis=2)*255)[...,None],3,axis=2)], axis=1)
    Image.fromarray(sheet.astype(np.uint8)).resize((sheet.shape[1]//2, sheet.shape[0]//2)).save(f"{out_dir}/debug-sheet.png")
    if snow_from is not None:
        y0, fade = snow_from
        snow = lit[y0:].copy()
        if snow_grade:
            # cool and deepen the snow so white type reads on it; keep a little amber near the top (the steps)
            Ls = lum(snow)/255
            cool = np.array([0.80, 0.88, 1.08], np.float32)
            snow = snow*cool[None,None,:]
            rows = np.linspace(0,1,snow.shape[0])[:,None,None]
            snow = snow*(0.78 - 0.18*rows)   # darker toward the bottom of the band
            snow = np.clip(snow, 0, 255)
        a = np.ones(snow.shape[:2], np.float32)
        a[:fade] = np.linspace(0,1,fade)[:,None]
        rgba = np.dstack([snow, a*255])
        report['_snow'] = {'size': save(rgba, 'snow-ground.png'), 'crop_y': y0, 'fade': fade}
    json.dump(report, open(f"{out_dir}/report.json",'w'), indent=2)
    print(json.dumps(report, indent=1))

if __name__ == '__main__':
    which = sys.argv[1]
    if which == 'portrait':
        groups = {
          'dormer-left':  {'glass': [(230,110,380,290)], 'spill_r': 22, 'spill_blur': 28, 'pad': 14},
          'dormer-right': {'glass': [(650,110,800,290)], 'spill_r': 22, 'spill_blur': 28, 'pad': 14},
          'dining':       {'glass': [(25,480,235,880)],  'spill_r': 34, 'spill_blur': 44, 'pad': 16},
          'living':       {'glass': [(790,480,1000,880)],'spill_r': 34, 'spill_blur': 44, 'pad': 16},
          'door':         {'glass': [(430,570,595,660)], 'source': [(478,495,548,612)], 'spill_r': 70, 'spill_blur': 90, 'spill_k': 0.5, 'pad': 20},
        }
        process('facade-portrait-raw.png', 'out-portrait', groups, upscale=1.5, snow_from=(1150, 70))
    else:
        groups = {
          'dormer-left':  {'glass': [(505,95,600,195)],   'spill_r': 16, 'spill_blur': 22, 'pad': 12},
          'dormer-right': {'glass': [(930,95,1025,195)],  'spill_r': 16, 'spill_blur': 22, 'pad': 12},
          'upper':        {'glass': [(395,245,505,385),(715,245,820,385),(1020,245,1130,385)], 'spill_r': 20, 'spill_blur': 28, 'pad': 14},
          'dining':       {'glass': [(355,460,520,660)],  'spill_r': 28, 'spill_blur': 36, 'pad': 14},
          'living':       {'glass': [(1005,460,1170,660)],'spill_r': 28, 'spill_blur': 36, 'pad': 14},
          'door':         {'glass': [(700,445,835,505)], 'source': [(740,415,795,485)], 'spill_r': 55, 'spill_blur': 70, 'spill_k': 0.5, 'pad': 18},
        }
        process('facade-wide-raw.png', 'out-wide', groups, upscale=1.0, snow_from=None)
