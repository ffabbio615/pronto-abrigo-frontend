import './Home.scss';
import { usePageLoader } from "../../hooks/usePageLoader";
import { useEffect, useState } from 'react';
import { getMyShelter } from "../../services/shelters";
import { useAuthStore } from "../../store/useAuthStore";
import Start from '../start/Start';
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
    const [profilePanelActive, setProfilePanelActive] = useState<boolean>(false);
    
    useEffect(() => {
        const token = useAuthStore.getState().token;
        if (!token) {
            logout();
        }
    }, [logout]);

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
    "start" | "updateShelter" | "getSupplies" | "getEntities" | "getDonations" | 
    "registerEntity" | "registerSupply" | "confirmDonations">("start");

    const checkMobileMenuActivation = ()=> {
        if (profilePanelActive) setProfilePanelActive(!profilePanelActive);
    }

    return(
        <div className="home-main-container">
            <div className='home-panels-container'>

                <div className={profilePanelActive  ? "profile-panel profile-mobile-panel" : "profile-panel"}>
                    <div className='home-profile-container'>
                        <img className="home-profile-picture" src={shelter?.photo_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="Foto de perfil"/>
                        <p>{`Seja bem-vindo${shelter?.nickname ? ", " + shelter.nickname : ""}!`}</p>
                    </div>
                    
                    <button className={profileMenuItem === "start" ? 'active-page': ''} 
                    onClick={()=> { if(profileMenuItem !=="start") setLocalLoader(true); setTimeout(()=> setLocalLoader(false), 1000);  setProfileMenuItem("start"); checkMobileMenuActivation(); }}>
                        <img src='/icon/homeIcon.svg' alt='Ícone do botão de início'/>Início
                    </button>

                    <button className={profileMenuItem === "updateShelter" ? 'active-page': ''} 
                    onClick={() => { if(profileMenuItem !=="updateShelter") setLocalLoader(true);  setProfileMenuItem("updateShelter"); checkMobileMenuActivation(); }}>
                        <img src='/icon/shelterEditIcon.svg' alt='Ícone do botão de editar cadastro'/> Editar Cadastro
                    </button>

                    <button className={profileMenuItem === "getEntities" ? 'active-page': ''} 
                    onClick={()=> { if(profileMenuItem !=="getEntities") setLocalLoader(true);  setProfileMenuItem("getEntities"); checkMobileMenuActivation(); }}>
                        <img src='/icon/entitiesIcon.svg' alt='Ícone do botão de acolhidos'/> Acolhidos
                    </button>

                    <button className={profileMenuItem === "getSupplies" ? 'active-page': ''} 
                    onClick={()=> { if(profileMenuItem !=="getSupplies") setLocalLoader(true);  setProfileMenuItem("getSupplies"); checkMobileMenuActivation(); }}>
                        <img src='/icon/supplyIcon.svg' alt='Ícone do botão de mantimentos'/> Mantimentos
                    </button>

                    <button className={profileMenuItem === "getDonations" ? 'active-page': ''} 
                    onClick={()=> { if(profileMenuItem !=="getDonations") setLocalLoader(true);  setProfileMenuItem("getDonations"); checkMobileMenuActivation(); }}>
                        <img src='/icon/donationsIcon.svg' alt='Ícone do botão de doações'/> Doações
                    </button>

                    <button onClick={logout}>
                        <img src='/icon/logoutIcon.svg' alt='Ícone do botão de sair do sistema'/> Sair
                    </button>
                </div>


                <button className='profile-mobile-button-menu'><span onClick={()=> setProfilePanelActive(!profilePanelActive)}>☰</span></button>
                {profilePanelActive  &&
                    <button className='profile-mobile-button-close-menu' onClick={()=> setProfilePanelActive(!profilePanelActive)}></button>
                }
        

                <div className="panel-menu">
                    <LocalLoader />
                    <div className='menu-panel-background'></div>
                    <div className='panel-content-container'>
                        {/* Páginas dos botões de dentro do menu lateral  */}
                        {profileMenuItem === "start" && <Start setProfileMenuItem={setProfileMenuItem} />}
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