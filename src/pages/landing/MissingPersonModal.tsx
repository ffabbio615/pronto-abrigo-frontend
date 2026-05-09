import type { MissingPerson } from "./LandingPage";
import { getShelterById } from "../../services/shelters"
import useStore from "../../store/useStore";
import useAlertStore from "../../store/useAlertStore";
import "./LandingPage.scss";

export default function MissingPersonModal({ entity, onClose }: { entity: MissingPerson; onClose: () => void; }) {

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

      const shelter = await getShelterById(entity.shelter_id);

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
        <button className="modal__close" onClick={onClose}>
          ✕
        </button>

        <div className="modal__header">
          <img className="modal__photo" src={entity.photo_url ? entity.photo_url : 
            entity.type=="person" ? "./icon/personIcon.png" : "./icon/animalIcon.png"} 
            alt={entity.name ? `Foto de ${entity.name}` : "Foto do desabrigado"} 
          />

          <div>
            <span className={`badge badge--red`}>⚠ Em busca da família</span>
            <h2 className="modal__name">{entity.name ?? "Sem nome definido"}</h2>
            <div className="modal-header-age-date-container">
              <p className="modal__meta"> {`${entity.estimated_age} ano(s)`}</p>
              <p className="modal__meta"> {`Abrigado em: ${new Date(entity.created_at)
                .toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})
                .replace(',', ' às')}h`}
              </p>
            </div>
          </div>

        </div>

        <div className="modal__body">
          {entity.type==="animal" &&
            <div className="modal-body-animal-container">
              <p> <strong>Espécie:</strong>{" "}{entity.species ?? "Não informada"} </p>
              <p> <strong>Raça:</strong>{" "}{entity.breed ?? "Não informada"} </p>
            </div>
          }

          <p> <strong>Descrição:</strong> {entity.description} </p>

          <div className="modal__actions">
            <button className="btn btn--yellow btn--full" onClick={handleFindShelter}> {`Encontrar ${entity.name ? entity.name.split(" ")[0] : "este desabrigado"}`}</button>
            <button className="btn btn--outline btn--full" onClick={onClose}>Fechar</button>
          </div>

        </div>
      </div>
    </div>
  );
}