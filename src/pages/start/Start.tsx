import "./Start.scss";
import { useEffect } from "react";
import useStore from "../../store/useStore";

type Props = {
  setProfileMenuItem: React.Dispatch<
    React.SetStateAction<
      | "default"
      | "updateShelter"
      | "getSupplies"
      | "getEntities"
      | "getDonations"
      | "registerEntity"
      | "registerSupply"
      | "confirmDonations"
    >
  >;
};

export default function Start({ setProfileMenuItem }: Props) {

  const { setLocalLoader } = useStore();

  useEffect(() => {
    setTimeout(() => setLocalLoader(false), 1000);
  }, [setLocalLoader]);

  return (
    <div className="start-menu-container">
      <div className="start-title-container">
        <h1>Sistema Pronto Abrigo</h1>
        <p>
          Utilize o menu abaixo e o painel lateral para realizar alguma ação.
        </p>
      </div>
      <div className="buttons-container">
        <button className="menu-card" onClick={() => { setLocalLoader(true); setProfileMenuItem("registerEntity"); }}>
          <img src="/icon/entitiesIcon.svg" alt="Ícone do botão de cadastro de desabrigados" />{" "} Cadastrar Desabrigado
        </button>
        <button className="menu-card" onClick={() => { setLocalLoader(true); setProfileMenuItem("registerSupply"); }}>
          <img src="/icon/supplyIcon.svg" alt="Ícone do botão de cadastro de mantimentos" />{" "} Cadastrar Mantimento </button>
        <button className="menu-card" onClick={() => { setLocalLoader(true); setProfileMenuItem("confirmDonations"); }}>
          <img src="/icon/donationsIcon.svg" alt="Ícone do botão de confirmar doações" />{" "} Confirmar Doações </button>
        {/* <button></button> */}
      </div>
      <img className="pronto-abrigo-logo" src="/img/prontoAbrigoLogo.png" alt="Logo Pronto Abrigo" />
    </div>
  );
}
