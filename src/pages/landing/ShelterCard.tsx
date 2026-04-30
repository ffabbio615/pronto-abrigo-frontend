import type { Shelter } from './LandingPage';
import './LandingPage.scss';

export default function ShelterCard({ shelter, onClick } : { shelter: Shelter; onClick: () => void }) {

    const pct = Math.round((shelter.occupancy / shelter.capacity) * 100);
    const statusLabel = { open: "Aberto", closed: "Fechado", full: "Lotado" };
    
    return (
        <button className={`shelter-card shelter-card--${shelter.status}`} onClick={onClick}>
        <div className="shelter-card__top">
            <div>
            <strong className="shelter-card__name">{shelter.name}</strong>
            <span className="shelter-card__city">{shelter.city}</span>
            </div>
            <span className={`badge badge--${shelter.status === "open" ? "green" : shelter.status === "full" ? "orange" : "gray"}`}>
            {statusLabel[shelter.status]}
            </span>
        </div>
        {shelter.status !== "closed" && (
            <div className="shelter-card__capacity">
            <div className="capacity-bar">
                <div className="capacity-bar__fill" style={{ width: `${pct}%`, backgroundColor: pct > 85 ? "var(--red)" : "var(--teal)" }} />
            </div>
            <span>{shelter.occupancy}/{shelter.capacity} vagas</span>
            </div>
        )}
        {shelter.needs.length > 0 && (
            <div className="shelter-card__needs">
            {shelter.needs.slice(0, 3).map(n => <span key={n} className="need-tag">{n}</span>)}
            </div>
        )}
        </button>
    );
};