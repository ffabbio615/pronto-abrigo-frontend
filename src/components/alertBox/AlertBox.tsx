import useAlertStore from "../../store/useAlertStore";
import './AlertBox.scss';

export default function AlertBox() {
  const { message, close } = useAlertStore();

  if (!message) return null;

  return (
    <div className="alert-overlay">
      <div className="alert-box">
            <p className="alert-box-title">Atenção!</p>
            <p className="alert-box-message">{message}</p>
            <button className="alert-box-button" onClick={close}>OK</button>
      </div>
    </div>
  );
}