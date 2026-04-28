import './Home.scss';
import { usePageLoader } from "../../hooks/usePageLoader";
import { useEffect, useState } from 'react';
import { getMyShelter } from "../../services/shelters";
import { useAuthStore } from "../../store/useAuthStore";
import ShelterUpdate from '../shelter/update/ShelterUpdate';
import SupplyUpdate from '../supply/update/SupplyUpdate';
import LocalLoader from '../../components/loader/LocalLoader';
import useStore  from '../../store/useStore';

export default function Home() {

    interface UpdateData {
        name: string;
        nickname: string;
        description: string;
        address: string;
        email: string;
        password: string;
        latitude: number | string;
        longitude: number | string;
        status: string;
        capacity: number | string;
        photo_url: string;
    }

    usePageLoader();
    const { setLocalLoader } = useStore();
    const [shelter, setShelter] = useState<UpdateData | null>(null);
    const { logout } = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
        try {
            const data = await getMyShelter();
            setShelter(data);
        } catch (error) {
            console.error(error);
        }
    };

    fetchData();
  }, []);

    const[profileMenuItem, setProfileMenuItem] = useState<"updateShelter" | "getSupplies" | "getEntities" | "getDonations" | "default">("default");

    return(
        <div className="home-main-container">
            <div className='home-panels-container'>
                <div className="profile-panel">
                    <img className="home-profile-picture" src={shelter?.photo_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="Foto de perfil"/>
                    <p>{`Seja bem-vinda, ${shelter?.nickname || "Nome do Abrigo"}!`}</p>
                    <button onClick={()=> { setLocalLoader(true); setTimeout(()=> setLocalLoader(false), 1000);  setProfileMenuItem("default"); }}>Início</button>
                    <button onClick={() => { setLocalLoader(true);  setProfileMenuItem("updateShelter"); }}>Editar Cadastro</button>
                    <button onClick={()=> { setLocalLoader(true);  setProfileMenuItem("getSupplies"); }}>Mantimentos</button>
                    <button onClick={()=> { setLocalLoader(true);  setProfileMenuItem("getEntities"); }}>Acolhidos</button>
                    <button onClick={()=> { setLocalLoader(true);  setProfileMenuItem("getDonations"); }}>Doações</button>
                    <button onClick={logout}>Sair</button>
                </div>

                <div className="menu-panel">
                    <LocalLoader />
                    {profileMenuItem === "default" && 
                        <div>
                            <button>Cadastrar Acolhido</button>
                            <button>Cadastrar Mantimento</button>
                            <button>Confirmar Doações</button>
                            <button></button>

                        </div>
                    }
                    {profileMenuItem === "updateShelter" && shelter && <ShelterUpdate shelter={shelter} />}
                    {profileMenuItem === "getSupplies" && <SupplyUpdate />}
                    {profileMenuItem === "getEntities" && <p>Acolhidos</p>}
                    {profileMenuItem === "getDonations" && <p>Doações</p>}
                </div>
            </div>
        </div>
    );
}