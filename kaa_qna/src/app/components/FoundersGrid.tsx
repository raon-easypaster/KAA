import { FOUNDERS } from '@/data/founders';

export default function FoundersGrid() {
    return (
        <div className="founders-grid">
            {FOUNDERS.map((f) => (
                <div key={f.name} className="founder-card">
                    <div className="founder-card-header">
                        <div className="founder-photo-frame">
                            <img src={f.photo} alt={f.name} className={`founder-photo-img ${f.photoClass}`} />
                        </div>
                        <div>
                            <span className="founder-title">Co-Representative</span>
                            <h3 className="founder-name">{f.name}</h3>
                        </div>
                    </div>
                    <div className="founder-bio">
                        <p>{f.bio}</p>
                    </div>
                    <div className="founder-history">
                        <h4>주요 학력 및 경력</h4>
                        <ul>
                            {f.history.map((h) => <li key={h}>{h}</li>)}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}
