from pathlib import Path

root = Path(__file__).resolve().parents[1]
source = root / 'src'
shell = (source / 'shell.html').read_text()
styles = '\n'.join((source / name).read_text() for name in ['styles.css', 'progression.css'])
scripts = '\n'.join((source / name).read_text() for name in ['reference.js', 'cases.js', 'game.js'])
assert '</script>' not in scripts.lower(), 'Una cadena cerraría prematuramente el script.'
html = shell.replace('{{STYLES}}', styles).replace('{{SCRIPTS}}', "'use strict';\n" + scripts)
assert '{{STYLES}}' not in html and '{{SCRIPTS}}' not in html
output = root / 'public' / 'index.html'
output.write_text(html)
print(f'HTML autónomo generado: {output} ({output.stat().st_size} bytes)')
