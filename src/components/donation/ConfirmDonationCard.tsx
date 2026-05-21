import { useCountdown } from '../../hooks/useCountdown'
import type { Donation } from "../../services/donations";
import { completeActiveDonation } from "../../services/donations";
import useAlertStore from "../../store/useAlertStore";
import useStore from "../../store/useStore";

export default function ConfirmDonationCard({ donation, onConfirmSuccess }: { donation: Donation; onConfirmSuccess: (id: number) => void; }) {
  
  const { hours, minutes, seconds } = useCountdown(donation.expires_at);
  const isUrgent = hours === 0 && minutes < 30;

  const { alert } = useAlertStore();
    const { setLocalLoader } = useStore();

    const handleConfirm = async () => {
        try {
            setLocalLoader(true);

            await completeActiveDonation(donation.id);
            onConfirmSuccess(donation.id);
            await alert("Doação confirmada com sucesso!");

        } catch (err) {
            console.error(err);
            await alert("Erro ao confirmar doação");
        } finally {
            setLocalLoader(false);
        }
    };

  const getStatusName = (status: "active" | "expired" | "completed")=>{
    if(status === "active") return "Ativa";
    if(status === "expired") return "Expirada";
    if(status === "completed") return "Concluída";
  }

  return (
    <div className={`donation-card ${donation.status}`}>
      
      <div className="card-header">
        <span className={`status-badge ${donation.status}`}>{getStatusName(donation.status)}</span>
        <span className="date">{new Date(donation.created_at).toLocaleDateString()}</span>
      </div>

      <div className="card-body">
        <h3 className="item-name">{donation.item_name}</h3>
        <p className="quantity">Quantidade: <strong>{donation.quantity}</strong></p>
      </div>

      <div className="card-timer">
        <div className="time-box">
          <strong className={isUrgent ? "danger" : ""}>{String(hours).padStart(2, "0")}</strong>
          <span>Horas</span>
        </div>

        <div className="time-box">
          <strong className={isUrgent ? "danger" : ""}>{String(minutes).padStart(2, "0")}</strong>
          <span>Minutos</span>
        </div>

        <div className="time-box">
          <strong>{String(seconds).padStart(2, "0")}</strong>
          <span className={isUrgent ? "danger" : ""}>Segundos</span>
        </div>
      </div>

      <div className="confirmation-card">
        <button className='confirmation-card-button' onClick={handleConfirm}>Confirmar Doação</button>
      </div>

    </div>
  );
}