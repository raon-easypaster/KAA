import { TESTIMONIALS } from '@/data/testimonials';

export default function Testimonials() {
    return (
        <div className="testimonials">
            <h3 className="testimonials-title">💬 참가자 한마디</h3>
            <div className="testimonials-grid">
                {TESTIMONIALS.map((t) => (
                    <figure key={t.quote} className="testimonial-card">
                        <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                        <figcaption>— {t.who}</figcaption>
                    </figure>
                ))}
            </div>
        </div>
    );
}
