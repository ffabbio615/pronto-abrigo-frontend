import './DonationsList.scss';
import { useEffect, useState } from "react";
import { getDonations } from "../../../services/donations";
import type { Donation } from "../../../services/donations";
import useStore from "../../../store/useStore";
import useAlertStore from "../../../store/useAlertStore";
import DonationCard from '../../../components/donation/DonationCard';

export default function DonationsList() {

  const [donations, setDonations] = useState<Donation[]>([]);
  const { setLocalLoader } = useStore();
  const { alert } = useAlertStore();
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLocalLoader(true);

        const data = await getDonations();
        setDonations(data);

      } catch (err) {
        console.error(err);
        await alert("Erro ao buscar doações!");
      } finally {
        setLocalLoader(false);
        setRefreshComponent(false);
        setTimeout(()=> setRefreshComponent(true), 60000);
      }
    };

    fetchDonations();
  }, [setLocalLoader, alert, refreshComponent]);

  return (
    <div className="donations-main-container">

      <div className="donations-title">
        <h2>Lista de Doações</h2>
        <p>Acompanhe todas as doações recebidas</p>
      </div>

      <div className="donations-list">
        {donations.length === 0 ? (
          <p>Nenhuma doação registrada</p>
        ) : (
          donations.map((donation) => (
            <DonationCard 
              key={donation.id} 
              donation={donation} 
            />
          ))
        )}

      </div>
    </div>
  );
}