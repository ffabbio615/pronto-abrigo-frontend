import useConfirmStore from "../../store/useConfirmStore";
import "./ConfirmBox.scss";

export default function ConfirmBox() {
  const { message, confirmYes, confirmNo } = useConfirmStore();

  if (!message) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <p className="confirm-box-title">Confirmação</p>
        <p className="confirm-box-message">{message}</p>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={confirmNo}>Cancelar</button>
          <button onClick={confirmYes}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}