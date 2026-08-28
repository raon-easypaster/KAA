// Scroll Animation
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

// Audience Filter
function filterAudience(audience) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.getAttribute('data-filter') === audience) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    document.querySelectorAll('.archive-card[data-audience]').forEach(card => {
        if (audience === 'all' || card.getAttribute('data-audience') === audience) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });

    // Visitor Counter Fetch
    (function initVisitorCounter() {
        const totalEl = document.getElementById('visitor-total');
        const todayEl = document.getElementById('visitor-today');
        if (!totalEl || !todayEl) return;

        try {
            const hasHit = sessionStorage.getItem('kaa_session_hit');
            const endpoint = 'https://kaaqna.vercel.app/api/counter';
            const method = hasHit ? 'GET' : 'POST';

            fetch(endpoint, { method })
                .then(res => res.json())
                .then(data => {
                    if (data && data.total) {
                        totalEl.textContent = Number(data.total).toLocaleString();
                        todayEl.textContent = Number(data.today).toLocaleString();
                        if (!hasHit) {
                            sessionStorage.setItem('kaa_session_hit', 'true');
                        }
                    }
                })
                .catch(err => {
                    console.warn('Visitor counter fetch error:', err);
                });
        } catch (e) {
            console.warn(e);
        }
    })();
});

