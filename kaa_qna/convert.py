import re

with open('/Users/galeb76/anti/kaa_homepage/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract exactly what is inside <main>...</main>
match = re.search(r'<main.*?>(.*?)</main>', content, re.DOTALL | re.IGNORECASE)
main_content = match.group(1) if match else ""

# Replace class= with className=
main_content = main_content.replace('class=', 'className=')
# Replace comments <!-- ... --> with {/* ... */}
main_content = re.sub(r'<!--(.*?)-->', r'{/*\1*/}', main_content, flags=re.DOTALL)
# Fix unclosed tags like <br>
main_content = main_content.replace('<br>', '<br />')
# Fix style attributes if any (none exist in the snippet except what Next.js allows, but wait, lets check)
# The KAA snippet doesn't have inline styles in main content

# Also update the href to the Q&A board from the static link to the local Next.js Link
main_content = main_content.replace('href="https://kaa-hub.vercel.app/" target="_blank"', 'href="/qa"')

template = """'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
""" + main_content + """
    </>
  );
}
"""

with open('/Users/galeb76/anti/kaa_qna/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(template)

print("Converted successfully.")
