"""Generate both CV PDFs from the same curated data; no browser or network required."""
import hashlib
import json
import sys
from functools import partial
from pathlib import Path
from xml.sax.saxutils import escape

from fontTools.ttLib import TTFont as SourceFont
from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import BaseDocTemplate, Flowable, Frame, KeepTogether, PageBreak, PageTemplate, Paragraph, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parent.parent
DATA = json.load(sys.stdin)
OUT = ROOT / 'public' / 'docs'
WORK = ROOT / '.redesign' / 'cv-professional-20261106' / 'fonts'
OUT.mkdir(parents=True, exist_ok=True)
WORK.mkdir(parents=True, exist_ok=True)
for weight, name in [('400', 'CVRegular'), ('600', 'CVBold')]:
    source = ROOT / 'node_modules' / '@fontsource' / 'inter' / 'files' / f'inter-latin-{weight}-normal.woff'
    font = SourceFont(source)
    font.flavor = None
    target = WORK / f'{name}.ttf'
    font.save(target)
    pdfmetrics.registerFont(TTFont(name, str(target)))
pdfmetrics.registerFontFamily('CVRegular', normal='CVRegular', bold='CVBold', italic='CVRegular', boldItalic='CVBold')

INK = colors.HexColor('#17232e')
BODY = colors.HexColor('#303942')
MUTED = colors.HexColor('#4d5b67')
LINE = colors.HexColor('#cbd3d9')
WIDTH, HEIGHT = A4
CONTENT = WIDTH - 32 * mm
styles = {
    'body': ParagraphStyle('Body', fontName='CVRegular', fontSize=9.7, leading=13.5, textColor=BODY, alignment=TA_LEFT),
    'small': ParagraphStyle('Small', fontName='CVRegular', fontSize=8.5, leading=11.8, textColor=MUTED),
    'name': ParagraphStyle('Name', fontName='CVBold', fontSize=27, leading=30, textColor=INK),
    'role': ParagraphStyle('Role', fontName='CVBold', fontSize=11.5, leading=16, textColor=INK),
    'heading': ParagraphStyle('Heading', fontName='CVBold', fontSize=10.3, leading=14, textColor=INK, spaceBefore=9, spaceAfter=5, keepWithNext=True),
    'entry': ParagraphStyle('Entry', fontName='CVBold', fontSize=10, leading=13.5, textColor=INK, keepWithNext=True),
    'bullet': ParagraphStyle('Bullet', fontName='CVRegular', fontSize=9.7, leading=13.5, textColor=BODY, leftIndent=9, firstLineIndent=-9, spaceAfter=2),
}


def p(text, style='body'):
    return Paragraph(text, styles[style])


def text(value):
    return escape(str(value))


def link(label, href):
    return f'<link href="{escape(href, {chr(34): "&quot;"})}" color="#25465e">{text(label)}</link>'


class Portrait(Flowable):
    """Clip the unmodified original photograph to an upper-body CV portrait."""
    def __init__(self):
        super().__init__()
        self.width, self.height = 26 * mm, 34 * mm

    def draw(self):
        canvas = self.canv
        image = ImageReader(str(ROOT / 'public' / 'assets' / 'me-sunset.jpeg'))
        width, height = image.getSize()
        scale = self.width / 600
        crop_top = 180
        crop_height = self.height / scale
        canvas.saveState()
        path = canvas.beginPath()
        path.rect(0, 0, self.width, self.height)
        canvas.clipPath(path, stroke=0)
        canvas.drawImage(image, -220 * scale, -(height - crop_top - crop_height) * scale, width=width * scale, height=height * scale, mask='auto')
        canvas.restoreState()
        canvas.setStrokeColor(LINE)
        canvas.setLineWidth(.45)
        canvas.rect(0, 0, self.width, self.height, fill=0, stroke=1)


def heading(title):
    return p(text(title), 'heading')


def bullets(items):
    return [p('• ' + text(item), 'bullet') for item in items]


def project_entry(note, language):
    project = next(item for item in DATA['projects'] if item['id'] == note['projectId'])
    title = project['title'].replace(' — ', ' / ')
    items = [p(f'{text(title)} <font color="#4d5b67">| {project["year"]}</font>', 'entry'),
             p(f'{text(project["role"])} / {text(project["client"])}', 'small'), Spacer(1, 3)]
    items.extend(bullets(note['points'][language]))
    items.append(p('<b>' + ('Teknologi' if language == 'id' else 'Stack') + ':</b> ' + text(', '.join(project['tech'])), 'small'))
    url = project.get('links', {}).get('live', '')
    if url.startswith('https://'):
        items.append(p(link(url.removeprefix('https://').rstrip('/'), url), 'small'))
    items.append(Spacer(1, 7))
    return KeepTogether(items)


def footer(canvas, doc):
    canvas.saveState()
    canvas.setTitle('Aditya Anugrah | CV | Full-stack Developer')
    canvas.setAuthor('Aditya Anugrah')
    canvas.setSubject('Professional curriculum vitae')
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(.45)
    canvas.line(16 * mm, 13 * mm, WIDTH - 16 * mm, 13 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont('CVRegular', 7.5)
    canvas.drawString(16 * mm, 9 * mm, 'Aditya Anugrah / adityaanugrah.me')
    canvas.drawRightString(WIDTH - 16 * mm, 9 * mm, f'{doc.page} / 2')
    canvas.restoreState()


def build(language):
    is_id = language == 'id'
    person = DATA['cvIdentity']
    path = OUT / f'aditya-anugrah-cv-{language}.pdf'
    doc = BaseDocTemplate(str(path), pagesize=A4, leftMargin=16 * mm, rightMargin=16 * mm,
                          topMargin=15 * mm, bottomMargin=18 * mm, pageCompression=1,
                          title=f'Aditya Anugrah - CV - {language.upper()}', author=person['name'])
    frame = Frame(doc.leftMargin, doc.bottomMargin, CONTENT, HEIGHT - doc.topMargin - doc.bottomMargin, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates(PageTemplate(id='Resume', frames=frame, onPage=footer))
    contacts = [p(text(person['name']), 'name'), p(text(person['role']), 'role'), p(text(person['location']), 'small'), Spacer(1, 5),
                p(link(person['email'], 'mailto:' + person['email']) + ' / ' + link(person['phone'], 'tel:+6281379430432'), 'small'),
                p(link('adityaanugrah.me', person['website']) + ' / ' + link('github.com/adiityaanugrah', person['github']), 'small'),
                p(link('linkedin.com/in/aditya-anugrah', person['linkedin']), 'small')]
    header = Table([[contacts, Portrait()]], colWidths=[CONTENT - 33 * mm, 33 * mm])
    header.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('ALIGN', (1, 0), (1, 0), 'RIGHT'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 8), ('LINEBELOW', (0, 0), (-1, -1), 1, INK)]))
    story = [header, heading('Ringkasan profesional' if is_id else 'Professional summary'), p(text(DATA['cvSummary'][language])), heading('Keahlian teknis' if is_id else 'Technical skills')]
    rows = [[p('<b>' + text(group[language]) + '</b>', 'small'), p(text(' · '.join(group['items'])), 'small')] for group in DATA['cvSkills']]
    skills = Table(rows, colWidths=[36 * mm, CONTENT - 36 * mm], hAlign='LEFT')
    skills.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (0, -1), 7), ('RIGHTPADDING', (1, 0), (1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 1), ('BOTTOMPADDING', (0, 0), (-1, -1), 3)]))
    story.extend([skills, heading('Pengalaman proyek pilihan' if is_id else 'Selected project experience')])
    story.extend(project_entry(note, language) for note in DATA['cvProjectNotes'][:2])
    story.append(heading('Pendidikan' if is_id else 'Education'))
    for item in DATA['cvEducation']:
        detail = ' / ' + item['detail'][language] if item.get('detail') else ''
        story.append(KeepTogether([p(text(item['institution']) + ' <font color="#4d5b67">| ' + item['year'] + '</font>', 'entry'), p(text(item['qualification'][language] + detail)), Spacer(1, 5)]))
    story.append(heading('Organisasi selama kuliah' if is_id else 'University activities'))
    story.extend(bullets(DATA['cvOrganizations'][language]))
    story.extend([PageBreak(), p(text(person['name']), 'role'), p(text(person['role']) + ' / ' + link('adityaanugrah.me', person['website']), 'small'), heading('Pengalaman kerja' if is_id else 'Work experience')])
    for item in DATA['cvEmployment']:
        story.append(KeepTogether([p(text(item['role'][language]) + ' <font color="#4d5b67">| ' + text(item['period']) + '</font>', 'entry'), p(text(item['organization'] + ' / ' + item['location']), 'small'), Spacer(1, 3), *bullets(item['points'][language])]))
    story.append(heading('Pelatihan & pengembangan kompetensi' if is_id else 'Training & professional development'))
    for item in DATA['cvTraining']:
        story.append(KeepTogether([p(text(item['title'][language]) + ' <font color="#4d5b67">| ' + item['year'] + '</font>', 'entry'), p(text(item['organization'] + ' / ' + item['location']), 'small'), Spacer(1, 3), *bullets(item['points'][language]), Spacer(1, 6)]))
    story.append(heading('Proyek lanjutan' if is_id else 'Additional project experience'))
    story.extend(project_entry(note, language) for note in DATA['cvProjectNotes'][2:])
    story.append(heading('Proyek lainnya' if is_id else 'Other projects'))
    for note in DATA['cvOtherProjects']:
        project = next(item for item in DATA['projects'] if item['id'] == note['projectId'])
        url = project['links']['live']
        story.append(p('<b>' + text(project['title'].split(' — ')[0]) + ':</b> ' + text(note['description'][language]) + ' ' + link(url.removeprefix('https://').rstrip('/'), url)))
        story.append(Spacer(1, 4))
    story.extend([heading('Kompetensi pendukung' if is_id else 'Additional competencies'), p(text(' · '.join(DATA['cvCompetencies'][language]) + '.'))])
    doc.build(story, canvasmaker=partial(Canvas, initialFontName='CVRegular', initialFontSize=9.7, initialLeading=13.5))
    pdf = PdfReader(str(path))
    if len(pdf.pages) != 2:
        raise RuntimeError(f'{path.name}: expected two A4 pages, got {len(pdf.pages)}')
    content = '\n'.join(page.extract_text() for page in pdf.pages)
    for required in ['Aditya Anugrah', 'Bangkit', 'Greatedu', 'Universitas Dian Nuswantoro', 'Kesyahbandaran']:
        if required not in content:
            raise RuntimeError(f'Missing CV content: {required}')
    for page in pdf.pages:
        if abs(float(page.mediabox.width) - WIDTH) > 1 or abs(float(page.mediabox.height) - HEIGHT) > 1:
            raise RuntimeError('Unexpected page size')
    print(f'PDF: {path.name}; A4; pages=2; photo=yes; text/selectable=yes; bytes={path.stat().st_size}; sha256={hashlib.sha256(path.read_bytes()).hexdigest()}')


for locale in ['id', 'en']:
    build(locale)
