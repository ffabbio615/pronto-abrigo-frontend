import type { Supply } from "./LandingPage";
import useStore from "../../store/useStore";
import useAlertStore from "../../store/useAlertStore";
import { useState } from "react";
import { createReservation } from "../../services/donations";

export default function DonationItemModal({ donation, onClose, userAddress }: { donation: Supply; onClose: () => void; userAddress: string | null }) {

    const { setLoader } = useStore();
    const { alert } = useAlertStore();
    const percent = (donation.items[0].current / donation.items[0].ideal) * 100;
    const [donationQuantity, setDonationQuantity] = useState<number>(0);

    const getDonationStatus = (current: number, min: number, max: number) => {
        if (current <= min) return "high";
        if (current < max * 0.7) return "medium";
        return "low";
    };

    const handleFindShelter = async () => {
        try {
            setLoader(true);

            let origin: string;

            // USA ENDEREÇO DIGITADO
            if (userAddress?.trim()) {

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(userAddress)}`
                );

                const result = await response.json();

                if (!result.length) {
                    throw new Error("ENDERECO_NAO_ENCONTRADO");
                }

                origin = `${result[0].lat},${result[0].lon}`;

            } 
            
            // USA GEOLOCALIZAÇÃO
            else {

                const position = await new Promise<GeolocationPosition>(
                    (resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject);
                    }
                );

                origin = `${position.coords.latitude},${position.coords.longitude}`;
            }

            const destination = encodeURIComponent(
                donation.shelter_address
            );

            const mapsUrl =
                `https://www.google.com/maps/dir/?api=1` +
                `&origin=${origin}` +
                `&destination=${destination}` +
                `&travelmode=driving`;

            window.open(mapsUrl, "_blank");

        } catch (error) {

            console.error(error);

            await alert("Não foi possível obter a rota.");

        } finally {
            setLoader(false);
        }
    };

    const getOptionDonationQuantity = (max : number, current : number)=>{
        const remaining = max - current;

        return Array.from({ length: remaining }, (_, index) => (
            <option key={index + 1} value={index + 1}>
                {index + 1} unidade{index > 0 ? "s" : ""}
            </option>
        ));
    };

    const handleScheduleDonation = async ()=>{
        const maxDonationQuantity = donation.items[0].ideal - donation.items[0].current;
        
        if (donationQuantity <= 0 || donationQuantity > maxDonationQuantity) {
            await alert("Valor não selecionado ou maior que o permitido");
            return;
        }
        setLoader(true);
        try{
            await createReservation({
                shelter_id: donation.shelter_id,
                supply_id: donation.items[0].id,
                quantity: donationQuantity
            });

            await alert("Doação reservada com sucesso!");
            onClose();

        } catch{
            await alert("Ocorreu um erro ao fazer a reserva de doação!");

        } finally{
            setLoader(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-donation-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal__close" onClick={onClose}>✕</button>

                <div className="modal__header modal__header--donation">
                    <div className="header-donation-title-container">
                        <h3 className="modal__name">{donation.shelter_name}</h3>
                        <p className="modal__meta">{`📍${donation.shelter_address} - ${donation.distance.toFixed(1)}km`}</p>
                    </div>
                </div>

                <div className="modal__body modal-body-donation-container">

                    <div className="body-donation-container">

                        <div className="donation-info-progress-container">
                            <div className="donation-info-container">
                                <h4 className="body-donation-name">📦 {donation.items[0].name} (quantidade):</h4>
                                <p><strong>-</strong> Atual: {donation.items[0].current}</p>
                                <p><strong>-</strong> Mínima: {donation.items[0].needed}</p>
                                <p><strong>-</strong> Máxima: {donation.items[0].ideal}</p>
                            </div>

                            <div className={`donation-circle ${getDonationStatus(donation.items[0].current, donation.items[0].needed, donation.items[0].ideal)}`} style={{background: `conic-gradient(currentColor ${percent}%, #e7e7e7 ${percent}%)`}}>
                                <div className="donation-circle__inner">
                                    <strong>{Math.round(percent)}%</strong>
                                </div>
                            </div>
                        </div>

                        <div className="donation-quantity-container">
                            <label>Quantidade de {donation.items[0].name}:</label>
                            <select value={donationQuantity} onChange={(e) => setDonationQuantity(Number(e.target.value))}>
                                <option key={0} value={0} defaultValue={0}>Selecione aqui a quantidade</option>
                                {getOptionDonationQuantity(donation.items[0].ideal, donation.items[0].current)}
                            </select>
                        </div>
                    </div>

                    <div className="modal__actions modal-button-actions">
                        <button className="btn btn--outline btn--full" onClick={()=> handleFindShelter()}>Como Chegar?</button>
                        <button className="btn btn--yellow btn--full" onClick={()=> handleScheduleDonation()}>Agendar Doação</button>
                    </div>
                </div>
            </div>
        </div>
    );
}