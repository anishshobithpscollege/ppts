"""Rescale a Slidev pptx-editable export (10 x 5.625 in) to PowerPoint Widescreen
(13.333 x 7.5 in) so that 1 CSS px on the 960px canvas = 1 pt, i.e. font sizes
match the MSIS template (28pt titles, 20pt body...). Also names Calibri, not Carlito."""
import re, sys, os, zipfile
F = 4 / 3
SCALE = {  # element -> attributes to scale
    'a:off': ('x', 'y'), 'a:ext': ('cx', 'cy'), 'a:chOff': ('x', 'y'), 'a:chExt': ('cx', 'cy'),
    'a:ln': ('w',), 'a:bodyPr': ('lIns', 'tIns', 'rIns', 'bIns'),
    'a:pPr': ('marL', 'indent', 'defTabSz'), 'a:outerShdw': ('blurRad', 'dist'),
    'a:rPr': ('sz', 'kern', 'spc'), 'a:endParaRPr': ('sz', 'kern', 'spc'), 'a:defRPr': ('sz', 'kern', 'spc'),
    'a:spcPts': ('val',), 'p:sldSz': ('cx', 'cy'), 'a:tab': ('pos',),
}
for n in range(1, 10):
    SCALE[f'a:lvl{n}pPr'] = ('marL', 'indent', 'defTabSz')

def fix_tag(m):
    tag, attrs = m.group(1), m.group(2)
    names = SCALE.get(tag)
    if not names:
        return m.group(0)
    def rep(a):
        k, v = a.group(1), a.group(2)
        return f'{k}="{round(int(v) * F)}"' if k in names else a.group(0)
    return '<' + tag + re.sub(r'([\w:]+)="(-?\d+)"', rep, attrs)

def convert(path):
    src = zipfile.ZipFile(path); tmp = path + '.tmp'
    out = zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED)
    for info in src.infolist():
        data = src.read(info.filename)
        if info.filename.endswith('.xml') and info.filename.startswith('ppt/') and 'notesSlide' not in info.filename and 'notesMaster' not in info.filename:
            t = data.decode('utf8')
            t = re.sub(r'<([\w:]+)((?:\s+[\w:]+="[^"]*")*)', fix_tag, t)
            t = t.replace('typeface="Carlito"', 'typeface="Calibri"')
            data = t.encode('utf8')
        out.writestr(info, data)
    out.close(); src.close(); os.replace(tmp, path)

for p in sys.argv[1:]:
    convert(p); print('converted', p)
