import './Home.scss';
import { usePageLoader } from "../../hooks/usePageLoader";
import { useEffect, useState } from 'react';
import { getMyShelter } from "../../services/shelters";
import { useAuthStore } from "../../store/useAuthStore";
import ShelterUpdate from '../shelter/update/ShelterUpdate';
import SupplyUpdate from '../supply/update/SupplyUpdate';
import LocalLoader from '../../components/loader/LocalLoader';
import useStore  from '../../store/useStore';
import SupplyRegister from '../supply/register/SupplyRegister';
import DonationsList from '../donation/get/DonationsList';
import ActiveDonationsList from '../donation/put/ActiveDonationsList';
import EntityRegister from '../entity/register/EntityRegister';
import EntityUpdate from '../entity/update/EntityUpdate';

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

    const[profileMenuItem, setProfileMenuItem] = useState<
    "default" | "updateShelter" | "getSupplies" | "getEntities" | "getDonations" | 
    "registerEntity" | "registerSupply" | "confirmDonations">("default");

    return(
        <div className="home-main-container">
            <div className='home-panels-container'>
                <div className="profile-panel">
                    <img className="home-profile-picture" src={shelter?.photo_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="Foto de perfil"/>
                    <p>{`Seja bem-vindo${shelter?.nickname ? ", " + shelter.nickname : ""}!`}</p>
                    
                    <button className={profileMenuItem === "default" ? 'active-page': ''} 
                    onClick={()=> { if(profileMenuItem !=="default") setLocalLoader(true); setTimeout(()=> setLocalLoader(false), 1000);  setProfileMenuItem("default"); }}>
                        <img src='/icon/homeIcon.svg' alt='Ícone de mantimentos'/>Início
                    </button>

                    <button className={profileMenuItem === "updateShelter" ? 'active-page': ''} 
                    onClick={() => { if(profileMenuItem !=="updateShelter") setLocalLoader(true);  setProfileMenuItem("updateShelter"); }}>
                        <img src='/icon/shelterEditIcon.svg' alt='Ícone de mantimentos'/> Editar Cadastro
                    </button>

                    <button className={profileMenuItem === "getEntities" ? 'active-page': ''} 
                    onClick={()=> { if(profileMenuItem !=="getEntities") setLocalLoader(true);  setProfileMenuItem("getEntities"); }}>
                        <img src='/icon/entitiesIcon.svg' alt='Ícone de mantimentos'/> Acolhidos
                    </button>

                    <button className={profileMenuItem === "getSupplies" ? 'active-page': ''} 
                    onClick={()=> { if(profileMenuItem !=="getSupplies") setLocalLoader(true);  setProfileMenuItem("getSupplies"); }}>
                        <img src='/icon/supplyIcon.svg' alt='Ícone de mantimentos'/> Mantimentos
                    </button>

                    <button className={profileMenuItem === "getDonations" ? 'active-page': ''} 
                    onClick={()=> { if(profileMenuItem !=="getDonations") setLocalLoader(true);  setProfileMenuItem("getDonations"); }}>
                        <img src='/icon/donationsIcon.svg' alt='Ícone de mantimentos'/> Doações
                    </button>

                    <button onClick={logout}>
                        <img src='/icon/logoutIcon.svg' alt='Ícone de mantimentos'/> Sair
                    </button>
                </div>

                <div className="panel-menu">
                    <LocalLoader />
                    <div className='menu-panel-background'></div>
                    <div className='panel-content-container'>
                        {profileMenuItem === "default" && 
                            <div className='home-menu-container'>
                                <div className='home-title-container'>
                                    <h1>Sistema Pronto Abrigo</h1>
                                    <p>Utilize o menu abaixo e o painel lateral para realizar alguma ação.</p>
                                </div>
                                <div className='buttons-container'>
                                    <button className='menu-card' onClick={()=> { setLocalLoader(true);  setProfileMenuItem("registerEntity"); }}>
                                        <img src='/icon/entitiesIcon.svg' alt='Ícone de mantimentos'/> Cadastrar Desabrigado</button>
                                    <button className='menu-card' onClick={()=> { setLocalLoader(true);  setProfileMenuItem("registerSupply"); }}>
                                        <img src='/icon/supplyIcon.svg' alt='Ícone de mantimentos'/> Cadastrar Mantimento</button>
                                    <button className='menu-card' onClick={()=> { setLocalLoader(true);  setProfileMenuItem("confirmDonations"); }}>
                                        <img src='/icon/donationsIcon.svg' alt='Ícone de mantimentos'/> Confirmar Doações</button>
                                    <button></button>
                                </div>
                                    <img className='pronto-abrigo-logo' src='/img/prontoAbrigoLogo.png' alt='Logo Pronto Abrigo' />
                                
                            </div>
                        }

                        {/* Páginas dos botões de dentro do menu lateral  */}
                        {profileMenuItem === "updateShelter" && shelter && <ShelterUpdate shelter={shelter} />}
                        {profileMenuItem === "getEntities" && <EntityUpdate />}
                        {profileMenuItem === "getSupplies" && <SupplyUpdate />}
                        {profileMenuItem === "getDonations" && <DonationsList />}

                        {/* Páginas dos botões de dentro do menu central  */}
                        {profileMenuItem === "registerEntity" && <EntityRegister setProfileMenuItem={setProfileMenuItem} />}
                        {profileMenuItem === "registerSupply" && <SupplyRegister setProfileMenuItem={setProfileMenuItem} />}
                        {profileMenuItem === "confirmDonations" && <ActiveDonationsList />}
                    </div>
                </div>
            </div>
        </div>
    );
}