"""Extract plain text + inline italic markers from a .docx file.

Preserves paragraphs (blank paragraphs become blank lines).
Wraps italic runs with *asterisks* so we can re-render them.
Leading tab/indent style gets a leading '>>>TAB ' marker (rare).
"""
import sys
import zipfile
import xml.etree.ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

def extract(docx_path: str) -> str:
    with zipfile.ZipFile(docx_path) as z:
        with z.open('word/document.xml') as f:
            tree = ET.parse(f)
    root = tree.getroot()
    body = root.find(f'{W}body')
    out_lines = []
    for p in body.findall(f'{W}p'):
        # check indentation (w:pPr/w:ind w:firstLine or w:left)
        leading_spaces = 0
        pPr = p.find(f'{W}pPr')
        if pPr is not None:
            ind = pPr.find(f'{W}ind')
            if ind is not None:
                # units are 1/20 of a point; convert roughly: 360 twips ~= 6 spaces
                for attr in ('firstLine', 'left', 'start'):
                    v = ind.get(f'{W}{attr}')
                    if v:
                        try:
                            leading_spaces = max(leading_spaces, int(v) // 120)
                        except ValueError:
                            pass
        parts = []
        for r in p.findall(f'{W}r'):
            rPr = r.find(f'{W}rPr')
            italic = rPr is not None and rPr.find(f'{W}i') is not None
            text_parts = []
            for t in r:
                tag = t.tag.split('}', 1)[-1]
                if tag == 't':
                    text_parts.append(t.text or '')
                elif tag == 'tab':
                    text_parts.append('\t')
                elif tag == 'br':
                    text_parts.append('\n')
            text = ''.join(text_parts)
            if italic and text.strip():
                parts.append(f'*{text}*')
            else:
                parts.append(text)
        line = ''.join(parts)
        if leading_spaces:
            line = (' ' * leading_spaces) + line
        out_lines.append(line)
    return '\n'.join(out_lines)

if __name__ == '__main__':
    print(extract(sys.argv[1]))
