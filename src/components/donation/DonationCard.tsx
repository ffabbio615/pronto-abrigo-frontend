import { useCountdown } from '../../hooks/useCountdown'
import type { Donation } from "../../services/donations";

export default function DonationCard({ donation }: { donation: Donation }) {
  
  const { hours, minutes, seconds } = useCountdown(donation.expires_at);
  const isUrgent = hours === 0 && minutes < 30;

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
          <strong className={isUrgent ? "danger" : ""}>{donation.status === "active" ? String(hours).padStart(2, "0") : '00'}</strong>
          <span>Horas</span>
        </div>

        <div className="time-box">
          <strong className={isUrgent ? "danger" : ""}>{donation.status === "active" ? String(minutes).padStart(2, "0") : '00'}</strong>
          <span>Minutos</span>
        </div>

        <div className="time-box">
          <strong>{donation.status === "active" ? String(seconds).padStart(2, "0") : '00'}</strong>
          <span className={isUrgent ? "danger" : ""}>Segundos</span>
        </div>
      </div>

    </div>
  );
}