import QRCode from 'qrcode';
import { QR_LINKS } from '@/data/qrLinks';
import { SITE_URL } from '@/data/site';

export const metadata = {
    title: '강의용 QR 코드 | 한국AI연구소',
    description: '강의 슬라이드나 인쇄물에 붙여 쓸 QR 코드 모음입니다.',
};

export default async function QrPage() {
    const items = await Promise.all(
        QR_LINKS.map(async (l) => {
            const url = `${SITE_URL}${l.path}`;
            const svg = await QRCode.toString(url, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#0c2b44', light: '#ffffff' } });
            return { ...l, url, svg };
        })
    );
    return (
        <section className="section course-page">
            <div className="container course-container qr-container">
                <span className="start-eyebrow">QR CODES</span>
                <h1 className="section-title course-h1">강의용 QR 코드</h1>
                <p className="course-lead">
                    강의 첫 화면에 띄우거나 인쇄해 두세요. 휴대폰 카메라로 비추면 바로 열립니다. QR 그림을 마우스 오른쪽 버튼으로 눌러 복사하거나, 이 화면을 그대로 띄워도 됩니다.
                </p>
                <div className="qr-grid">
                    {items.map((it) => (
                        <figure key={it.path} className="qr-card">
                            <div className="qr-img" role="img" aria-label={`${it.title} QR 코드`} dangerouslySetInnerHTML={{ __html: it.svg }} />
                            <figcaption>
                                <strong>{it.title}</strong>
                                <span>{it.desc}</span>
                                <a href={it.path} className="qr-url">{it.url.replace('https://', '')}</a>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}
