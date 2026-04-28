import './SupplyUpdate.scss';
import { useEffect, useState } from "react";
import { getSupplies } from "../../../services/supplies";
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


    return (
        <div className="supply-update-main-container">
            <div className='supply-title-container'>
                <h2>Confirma Abaixo a Lista de Mantimentos</h2>
                <p>Atualize ou remova a quantidade de cada um</p>
            </div>

            <div className='supply-cards-container'>
                {supplies.length === 0 ? (
                    <p>Nenhum mantimento cadastrado</p>
                ) : (
                    supplies.map((item) => (
                        <div className='card-container' key={item.id}>
                            <div className={`title-icon-container ${getSupplyStatus(item.current_quantity, item.min_quantity, item.max_quantity)}`}>
                                <img src='/icon/supplyIcon.svg' alt='Ícone de suprimento'/>
                                <strong>{item.name}</strong>
                            </div>
                            <div className='quantities-container'>
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
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
    }