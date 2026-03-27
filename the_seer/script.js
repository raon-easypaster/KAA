
// Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking a link (mobile)
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Scroll Animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
});

// Copy to Clipboard Function
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        // Modern approach
        navigator.clipboard.writeText(text).then(() => {
            alert("후원계좌번호가 복사되었습니다: " + text);
        }).catch(err => {
            console.error('복사 실패', err);
            prompt("복사를 위해 키를 눌러주세요 (Ctrl+C)", text);
        });
    } else {
        // Fallback for older browsers or non-secure contexts
        let textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            alert("후원계좌번호가 복사되었습니다: " + text);
        } catch (err) {
            console.error('복사 실패', err);
            prompt("복사를 위해 키를 눌러주세요 (Ctrl+C)", text);
        }
        textArea.remove();
    }
}
