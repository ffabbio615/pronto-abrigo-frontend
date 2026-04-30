import './SupplyUpdate.scss';
import { useEffect, useState } from "react";
import { getSupplies, updateSupply, deleteSupply } from "../../../services/supplies";
import useAlertStore from "../../../store/useAlertStore";
import useConfirmStore from "../../../store/useConfirmStore";
import useStore from "../../../store/useStore";

type Supplies = {
    id: number;
    name: string;
    current_quantity: number;
    min_quantity: number;
    max_quantity: number;
};

export default function SupplyUpdate() {

    const [supplies, setSupplies] = useState<Supplies[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingItem, setEditingItem] = useState<Supplies | null>(null);
    const { alert } = useAlertStore();
    const { confirm } = useConfirmStore();
    
    const { setLocalLoader } = useStore();
    useEffect(() => {
        const fetchSupplies = async () => {
        try {
            const data = await getSupplies();
            setSupplies(data);
        } catch (error) {
            console.error("Erro ao buscar mantimentos:", error);
        } finally {
            setTimeout(()=> setLocalLoader(false), 1000);
        }
        };

        fetchSupplies();
    }, [setLocalLoader]);


    const getPercentage = (maxQuantity: number, currentQuantity: number)=>{
        return Math.round(maxQuantity > 0 ? (currentQuantity / maxQuantity) * 100 : 0);
    }

    const getSupplyStatus = (current: number, min: number, max: number) => {
        if (current <= min) return "high";
        if (current < max * 0.7) return "medium";
        return "low";
    };

    const handleChange = (field: string, value: string) => {
        setEditingItem(prev => 
            prev ? { ...prev, [field]: Number(value) } : prev
        );
    };
    
    const handleUpdate = async (id: number) => {
        if (!editingItem) return;

        const confirmation = await confirm("Deseja realmente atualizar?");

        if(!confirmation) return;

        setLocalLoader(true);

        try {
            await updateSupply(id, editingItem);

            setSupplies(prev =>
            prev.map(item =>
                item.id === id ? editingItem : item
            )
        );

        setEditingId(null);
        setEditingItem(null);

        } catch (err) {
            console.error(err);
        } finally {
            alert("Mantimento atualizado com sucesso!");
            setTimeout(() => setLocalLoader(false), 1000);
        }
    };

    const handleDelete = async (id: number) => {

        const confirmation = await confirm("Deseja realmente excluir?");

        if(!confirmation) return;

        setLocalLoader(true);
        try {
            await deleteSupply(id);
            setSupplies(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error(err);
        } finally{
            alert("Mantimento excluído com sucesso!");
            setTimeout(()=> setLocalLoader(false), 1000);
        }
    };


    return (
        <div className="supply-update-main-container">
            <div className='supply-title-container'>
                <h2>Confira Abaixo a Lista de Mantimentos</h2>
                <p>Atualize ou remova a quantidade de cada um</p>
            </div>

            <div className='supply-cards-container'>
                {supplies.length === 0 ? (
                    <p>Nenhum mantimento cadastrado</p>
                ) : (
                    supplies.map((item) => (
                        <div className={editingId === item.id && editingItem ? 'card-container card-container-edit-mode' : 'card-container'} key={item.id}>                          

                            <div className={`title-icon-container ${getSupplyStatus(item.current_quantity, item.min_quantity, item.max_quantity)}`}>
                                <img src='/icon/supplyIcon.svg' alt='Ícone de suprimento'/>
                                <strong>{item.name}</strong>
                            </div>

                            <div className={editingId === item.id && editingItem ? 'quantities-container quantities-container-edit-mode' : 'quantities-container'}>
                                <div className='quantity-percentage-container'>
                                    <p>Qtd. Atual: {item.current_quantity}</p>
                                    <strong>{`${getPercentage(item.max_quantity, item.current_quantity)}%`}</strong>
                                </div>
                                <div className='quantity-progress-container'>
                                    <div>
                                        <p>Min: {item.min_quantity}</p>
                                        <p>Max: {item.max_quantity}</p>
                                    </div>
                                    <progress
                                        className={getSupplyStatus(item.current_quantity, item.min_quantity, item.max_quantity)} 
                                        max={item.max_quantity} 
                                        value={item.current_quantity}>
                                    </progress>
                                </div>

                                {editingId === item.id && editingItem && (
                                    <div className="supply-edit-container">
                                        <div className='supply-edit-inputs-container'>
                                            <div>
                                                <label htmlFor="qtdAtual">Qtd. Atual:</label>
                                                <input id="qtdAtual" name="qtdAtual" type="number" value={editingItem.current_quantity} onChange={(e) => handleChange("current_quantity", e.target.value)} />
                                            </div>
                                            <div>
                                                <label htmlFor="qtdMin">Qtd. Min:</label>
                                                <input id="qtdMin" name="qtdMin" type="number" value={editingItem.min_quantity} onChange={(e) => handleChange("min_quantity", e.target.value)} />
                                            </div>
                                            <div>
                                                <label htmlFor="qtdMax">Qtd. Max:</label>
                                                <input id="qtdMax" name="qtdMax" type="number" value={editingItem.max_quantity} onChange={(e) => handleChange("max_quantity", e.target.value)} />
                                            </div>
                                        </div>
                                        <div className='supply-edit-buttons-container'>
                                            <button onClick={() => { setEditingId(null); setEditingItem(null); }}> Cancelar </button>
                                            <button onClick={() => handleUpdate(item.id)}> Salvar </button>
                                        </div>
                                    </div>
                                )}

                            </div>


                            <div className='edit-delete-buttons-container'>
                                <button onClick={() => {setEditingId(item.id); setEditingItem({ ...item });}}><img src='/icon/editIcon.svg' alt='Ícone de mantimentos'/> </button>
                                <button onClick={() => handleDelete(item.id)}><img src='/icon/deleteIcon.svg' alt='Ícone de mantimentos'/> </button>
                            </div>  

                        </div>
                    ))
                )}
            </div>
        </div>
    );
    }