'use client';

import { useEffect, useState } from 'react';

export default function VisitorCounter() {
    const [visits, setVisits] = useState<{ total: number; today: number }>({ total: 1381, today: 1 });

    useEffect(() => {
        try {
            const hasHit = sessionStorage.getItem('kaa_session_hit');
            const method = hasHit ? 'GET' : 'POST';
            fetch('/api/counter', { method })
                .then(res => res.json())
                .then(data => {
                    if (data && data.total) {
                        setVisits({ total: data.total, today: data.today });
                        if (!hasHit) {
                            sessionStorage.setItem('kaa_session_hit', 'true');
                        }
                    }
                })
                .catch(err => console.warn('Visitor counter fetch error:', err));
        } catch (e) {
            console.warn(e);
        }
    }, []);

    return (
        <div className="footer-visitor-counter">
            <span className="v-icon">👥</span>
            <span>방문자 Total <strong>{visits.total.toLocaleString()}</strong></span>
            <span className="v-sep">|</span>
            <span>Today <strong className="today-count">{visits.today.toLocaleString()}</strong></span>
        </div>
    );
}
