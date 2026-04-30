import './ActiveDonationsList.scss';
import { useEffect, useState } from "react";
import { getActiveDonations } from "../../../services/donations";
import type { Donation } from "../../../services/donations";
import useStore from "../../../store/useStore";
import useAlertStore from "../../../store/useAlertStore";
import ConfirmDonationCard from '../../../components/donation/ConfirmDonationCard';

export default function ActiveDonationsList() {

  const [donations, setDonations] = useState<Donation[]>([]);
  const { setLocalLoader } = useStore();
  const { alert } = useAlertStore();
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLocalLoader(true);

        const data = await getActiveDonations();
        setDonations(data);

      } catch (err) {
        console.error(err);
        await alert("Erro ao buscar doações!");
      } finally {
        setLocalLoader(false);
        setRefreshComponent(false);
        setRefreshComponent(false);
        setTimeout(()=> setRefreshComponent(true), 60000);
      }
    };

    fetchDonations();
  }, [setLocalLoader, alert, refreshComponent]);

  const handleConfirmSuccess = (id: number) => {
        setDonations(prev =>
            prev.map(d =>
            d.id === id ? { ...d, status: "completed" } : d
            )
        );
        setRefreshComponent(true);
    };

  return (
    <div className="active-donations-main-container">

      <div className="donations-title">
        <h2>Lista de Doações Ativas</h2>
        <p>Confirme as doações que foram recebidas</p>
      </div>

      <div className="donations-list">
        {donations.length === 0 ? (
          <p>Nenhuma doação registrada</p>
        ) : (
          donations.map((donation) => (
            <ConfirmDonationCard 
              key={donation.id} 
              donation={donation} 
              onConfirmSuccess={handleConfirmSuccess}
            />
          ))
        )}

      </div>
    </div>
  );
}