import re

with open('/Users/galeb76/anti/kaa_qna/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# The error is related to broken brackets like </section > and {/* founders */} with spaces
content = content.replace('</section >', '</section>')
content = content.replace('< section className = "section founder-section" >', '<section className="section founder-section">')
content = content.replace('{/* ================= Founders ================= */ }', '{/* ================= Founders ================= */}')
content = content.replace('{/* ================= Contact ================= */ }', '{/* ================= Contact ================= */}')

with open('/Users/galeb76/anti/kaa_qna/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
