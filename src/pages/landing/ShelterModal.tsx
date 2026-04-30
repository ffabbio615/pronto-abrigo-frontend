import type { Shelter } from "./LandingPage";

export default function ShelterModal({ shelter, onClose } : { shelter: Shelter; onClose: () => void }) {
  const pct = Math.round((shelter.occupancy / shelter.capacity) * 100);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>✕</button>
        <div className="modal__header modal__header--shelter">
          <span className="shelter-modal__icon">🏠</span>
          <div>
            <span className={`badge badge--${shelter.status === "open" ? "green" : "orange"}`}>
              {shelter.status === "open" ? "Aberto" : shelter.status === "full" ? "Lotado" : "Fechado"}
            </span>
            <h2 className="modal__name">{shelter.name}</h2>
            <p className="modal__meta">{shelter.address} — {shelter.city}</p>
          </div>
        </div>
        <div className="modal__body">
          <div className="shelter-modal__stats">
            <div className="shelter-stat">
              <strong>{shelter.capacity}</strong><span>Capacidade</span>
            </div>
            <div className="shelter-stat">
              <strong>{shelter.occupancy}</strong><span>Ocupação atual</span>
            </div>
            <div className="shelter-stat">
              <strong>{shelter.capacity - shelter.occupancy}</strong><span>Vagas livres</span>
            </div>
          </div>
          <div className="capacity-bar" style={{ height: 10, marginBottom: 16 }}>
            <div className="capacity-bar__fill" style={{ width: `${pct}%`, backgroundColor: pct > 85 ? "var(--red)" : "var(--teal)" }} />
          </div>
          {shelter.needs.length > 0 && (
            <>
              <p><strong>Necessidades urgentes:</strong></p>
              <div className="shelter-modal__needs">
                {shelter.needs.map(n => <span key={n} className="need-tag need-tag--lg">{n}</span>)}
              </div>
            </>
          )}
          <div className="modal__contact" style={{ marginTop: 20 }}>
            <span>📞</span>
            <div>
              <small>Telefone do abrigo</small>
              <strong>{shelter.phone}</strong>
            </div>
          </div>
          <div className="modal__actions">
            <button className="btn btn--yellow btn--full">Quero contribuir</button>
            <button className="btn btn--outline btn--full" onClick={onClose}>Fechar</button>
          </div>
        </div>
      </div>
    </div>
  );
};