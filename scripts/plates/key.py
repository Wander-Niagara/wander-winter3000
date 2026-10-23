import sys
from PIL import Image, ImageFilter
import numpy as np
def key(src, dst, lo=110, hi=200, pad=12, despill=True):
    im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(np.float32)
    r,g,b = a[...,0],a[...,1],a[...,2]
    greenness = g - np.maximum(r,b)
    alpha = np.clip((hi - greenness)/(hi-lo), 0, 1)
    # soften alpha slightly
    al = Image.fromarray((alpha*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    alpha = np.asarray(al).astype(np.float32)/255
    out = a.copy()
    if despill:
        edge = (alpha < 0.999) & (alpha > 0)
        cap = np.maximum(r,b)*1.0 + 10
        out[...,1] = np.where(edge, np.minimum(g, cap), g)
        # also kill residual key spill in opaque-ish but greenish-bright pixels
        spill = (greenness > 60) & (g > 180) & (alpha >= 0.999)
        out[...,1] = np.where(spill, np.minimum(out[...,1], np.maximum(r,b)+25), out[...,1])
    rgba = np.dstack([out, alpha*255]).astype(np.uint8)
    img = Image.fromarray(rgba, 'RGBA')
    bbox = Image.fromarray((alpha>0.02).astype(np.uint8)*255).getbbox()
    x0,y0,x1,y1 = bbox
    x0=max(0,x0-pad);y0=max(0,y0-pad);x1=min(img.width,x1+pad);y1=min(img.height,y1+pad)
    img = img.crop((x0,y0,x1,y1)); img.save(dst)
    print(dst, img.size, 'alpha coverage %.1f%%' % (100*(alpha>0.5).mean()))
key('wreath-raw.png','wreath.png')
key('lantern-raw.png','lantern.png')
key('evergreen-raw.png','evergreen.png', pad=0)
# brass: mirror tile to seamless 2048, downscale to 1024
im = Image.open('brass-raw.png').convert('RGB'); w,h = im.size
big = Image.new('RGB',(w*2,h*2))
big.paste(im,(0,0)); big.paste(im.transpose(Image.FLIP_LEFT_RIGHT),(w,0))
big.paste(im.transpose(Image.FLIP_TOP_BOTTOM),(0,h)); big.paste(im.transpose(Image.ROTATE_180),(w,h))
big.resize((1024,1024), Image.LANCZOS).save('brass-texture.png'); print('brass-texture.png 1024x1024 seamless')
# preview sheets on light and dark grounds
for name in ['wreath','lantern','evergreen']:
    fg = Image.open(name+'.png'); W,H = fg.size
    sheet = Image.new('RGB',(W*2+30,H+20),(255,255,255))
    dark = Image.new('RGB',(W,H),(18,28,51)); dark.paste(fg,(0,0),fg)
    light = Image.new('RGB',(W,H),(243,233,214)); light.paste(fg,(0,0),fg)
    sheet.paste(light,(10,10)); sheet.paste(dark,(W+20,10))
    sheet.thumbnail((1400,1400)); sheet.save(name+'-check.png')
