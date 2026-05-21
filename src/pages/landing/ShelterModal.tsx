import type { Shelter } from "./LandingPage";
import useStore from "../../store/useStore";
import useAlertStore from "../../store/useAlertStore";

export default function ShelterModal({ shelter, onClose } : { shelter: Shelter; onClose: () => void }) {

  const pct = Math.round((shelter.current_occupancy / shelter.capacity) * 100);
  const { setLoader } = useStore();
  const { alert } = useAlertStore();
  
  const handleFindShelter = async () => {
    try {
      setLoader(true);

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      const originLat = position.coords.latitude;
      const originLng = position.coords.longitude;

      const destinationLat = shelter.latitude;
      const destinationLng = shelter.longitude;

      const mapsUrl =
        `https://www.google.com/maps/dir/?api=1` +
        `&origin=${originLat},${originLng}` +
        `&destination=${destinationLat},${destinationLng}` +
        `&travelmode=driving`;

      window.open(mapsUrl, "_blank");

    } catch {
      await alert("Não foi possível obter a rota.");
    } finally {
      setLoader(false);
    }
  };


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>✕</button>
        <div className="modal__header modal__header--shelter">
          {shelter.photo_url ?
            <img className="shelter-modal__photo" src={shelter.photo_url} alt={`Foto do abrigo ${shelter.name}`} />
          :
            <span className="shelter-modal__photo">🏠</span>
          }
          <div>
            <div className="modal-status-container">
              {shelter.type === "human" ? 
                  <img className="modal-status-icon" src="./icon/personIcon.png" alt="Ícone representativo de humanos" />
                :
                  <img className="modal-status-icon" src="./icon/animalIcon.png" alt="Ícone representativo de animais" />
              }
              <span className={`badge badge--${shelter.status === "open" ? "green" : "orange"}`}>
                {shelter.status === "open" ? "Aberto" : shelter.status === "full" ? "Lotado" : "Fechado"}
              </span>
            </div>
            <h2 className="modal__name">{`${shelter.name} - (${shelter.nickname})`}</h2>
            <p className="modal__meta">{shelter.address}</p>
          </div>
        </div>
        <div className="modal__body">
          <div className="shelter-modal__stats">
            <div className="shelter-stat">
              <strong>{shelter.capacity}</strong><span>Capacidade</span>
            </div>
            <div className="shelter-stat">
              <strong>{shelter.current_occupancy}</strong><span>Ocupação atual</span>
            </div>
            <div className="shelter-stat">
              <strong>{shelter.capacity - shelter.current_occupancy}</strong><span>Vagas livres</span>
            </div>
          </div>
          <div className="capacity-bar" style={{ height: 10, marginBottom: 16 }}>
            <div className="capacity-bar__fill" style={{ width: `${pct}%`, backgroundColor: pct > 85 ? "var(--red)" : "var(--teal)" }} />
          </div>
          <div className="modal__description">
            <div>
              <small>{shelter.description}</small>
            </div>
          </div>
          <div className="modal__actions">
            {shelter.status !=="closed" &&
              <button className="btn btn--yellow btn--full" onClick={handleFindShelter}>Como Chegar</button>
            }
            <button className="btn btn--outline btn--full" onClick={onClose}>Fechar</button>
          </div>
        </div>
      </div>
    </div>
  );
};