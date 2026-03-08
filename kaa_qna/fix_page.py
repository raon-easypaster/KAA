import re

with open('/Users/galeb76/anti/kaa_qna/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix malformed section tags
content = content.replace('</section > >', '</section>')
content = content.replace('</section >', '</section>')
content = content.replace('< section className = "section founder-section" >', '<section className="section founder-section">')
content = content.replace('{/* ================= Founders ================= */ }', '{/* ================= Founders ================= */}')
content = content.replace('{/* ================= Contact ================= */ }', '{/* ================= Contact ================= */}')
content = content.replace('                </div>\n            </div>\n        </section>\n\n        {/* ================= Founders ================= */}', '                </div>\n        </section>\n\n        {/* ================= Founders ================= */}')

# Let's cleanly output it
with open('/Users/galeb76/anti/kaa_qna/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
