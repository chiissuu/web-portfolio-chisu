"""Verify actual static routes, local HTML references and anchor targets."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
import json
import re

root = Path(__file__).resolve().parents[4]
dist = root / 'dist'
routes = ['/', '/servicios/', '/tools/', '/tools/video-converter/']

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.ids, self.refs, self.h1, self.meta, self.lang = [], [], 0, {}, ''
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs: self.ids.append(attrs['id'])
        if tag == 'h1': self.h1 += 1
        if tag == 'html': self.lang = attrs.get('lang', '')
        if tag == 'meta' and 'name' in attrs: self.meta[attrs['name']] = attrs.get('content', '')
        for attr in ['href', 'src']:
            if attr in attrs: self.refs.append(attrs[attr])

pages = {route: Page((dist / route.strip('/') / 'index.html').read_text(encoding='utf-8')) for route in routes}
missing = []
count = 0
for route, page in pages.items():
    for ref in page.refs:
        url = urlsplit(urljoin('http://audit.local' + route, ref))
        if url.netloc != 'audit.local' or url.scheme != 'http': continue
        count += 1
        target = dist / unquote(url.path).lstrip('/')
        if target.is_dir(): target /= 'index.html'
        if not target.is_file(): missing.append({'route': route, 'ref': ref})
        elif url.fragment:
            other = Page(target.read_text(encoding='utf-8'))
            if unquote(url.fragment) not in other.ids: missing.append({'route': route, 'ref': ref, 'reason': 'anchor'})
summary = {'routes': {r: {'h1': p.h1, 'lang': p.lang, 'description': p.meta.get('description'),
                        'duplicate_ids': [i for i in set(p.ids) if p.ids.count(i) > 1]} for r, p in pages.items()},
           'local_references': count, 'missing': missing}
Path(__file__).with_name('verificacion-build.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(summary, ensure_ascii=False, indent=2))
assert not missing
assert all(p.h1 == 1 and p.lang == 'es' and p.meta.get('description') and len(p.ids) == len(set(p.ids)) for p in pages.values())

# Keep the script-free fixture in sync with the current build's hashed CSS.
home = (dist / 'index.html').read_text(encoding='utf-8')
services = (dist / 'servicios/index.html').read_text(encoding='utf-8')
styles = '\n'.join(re.findall(r'<link[^>]+rel="stylesheet"[^>]*>', home))
forms = ''.join(re.search(r'<form\b.*?</form>', source, re.S).group(0) for source in [home, services])
Path(__file__).with_name('forms-sin-scripts.html').write_text(
    '<!doctype html><html lang="es"><meta charset="utf-8"><title>Formularios generados sin scripts</title>'
    + styles + '<body class="redesign"><h1>Diagnóstico: formularios del build sin scripts</h1>'
    + forms + '</body></html>', encoding='utf-8')
