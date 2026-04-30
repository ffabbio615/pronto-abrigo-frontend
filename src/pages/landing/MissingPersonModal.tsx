import type { MissingPerson } from './LandingPage';
import './LandingPage.scss';

export default function MissingPersonModal({ person, onClose }: { person: MissingPerson; onClose: () => void }) { 
    return(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={onClose}>✕</button>
            <div className="modal__header">
                <img src={person.photo || `https://i.pravatar.cc/150?u=${person.id}`} alt={person.name} className="modal__photo" />
                <div>
                <span className={`badge badge--${person.status === "missing" ? "red" : "green"}`}>
                    {person.status === "missing" ? "⚠ Desaparecido" : "✓ Encontrado"}
                </span>
                <h2 className="modal__name">{person.name}</h2>
                <p className="modal__meta">{person.age} anos · Visto pela última vez em {person.lastSeen}</p>
                </div>
            </div>
            <div className="modal__body">
                <p><strong>Descrição:</strong> {person.description}</p>
                <div className="modal__contact">
                <span>📞</span>
                <div>
                    <small>Entre em contato</small>
                    <strong>{person.contact}</strong>
                </div>
                </div>
                <div className="modal__actions">
                <button className="btn btn--yellow btn--full">Tenho informações</button>
                <button className="btn btn--outline btn--full" onClick={onClose}>Fechar</button>
                </div>
            </div>
            </div>
        </div>
    );
}