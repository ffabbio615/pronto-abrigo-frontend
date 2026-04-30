import './SupplyRegister.scss';
import { useEffect, useState } from 'react';
import useStore from '../../../store/useStore';
import useAlertStore from "../../../store/useAlertStore";
import { createSupply } from "../../../services/supplies";

type Props = {
  setProfileMenuItem: React.Dispatch<
    React.SetStateAction<
      "default" | "updateShelter" | "getSupplies" | "getEntities" | "getDonations" | 
      "registerEntity" | "registerSupply" | "confirmDonations"
    >
  >;
};

export default function SupplyRegister({ setProfileMenuItem }: Props) {

    const { alert } = useAlertStore();
    const { setLocalLoader } = useStore();

    useEffect(() => {
        setTimeout(()=> setLocalLoader(false), 1000);
    }, [setLocalLoader]);

    const [form, setForm] = useState({
        name: "",
        min_quantity: "",
        max_quantity: "",
        current_quantity: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!form.name) newErrors.name = "Nome é obrigatório";
        if (!form.min_quantity) newErrors.min_quantity = "Mínimo é obrigatório";
        if (!form.max_quantity) newErrors.max_quantity = "Máximo é obrigatório";
        if (!form.current_quantity) newErrors.current_quantity = "Quantidade atual é obrigatória";

        if (Number(form.min_quantity) > Number(form.max_quantity)) {
        newErrors.min_quantity = "Mínimo não pode ser maior que o máximo";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
        await alert("Preencha os campos corretamente!");
        return;
        }

        try {
        setLocalLoader(true);

        await createSupply({
            name: form.name,
            min_quantity: Number(form.min_quantity),
            max_quantity: Number(form.max_quantity),
            current_quantity: Number(form.current_quantity)
        });

        await alert("Mantimento cadastrado com sucesso!");

        setForm({
            name: "",
            min_quantity: "",
            max_quantity: "",
            current_quantity: ""
        });

        } catch (error) {
        console.error(error);
        await alert("Erro ao cadastrar mantimento!");
        } finally {
        setLocalLoader(false);
        }
    };

    return (
        <div className='supply-register-container'>

            <div className='supply-register-title-container'>
                <h2>Cadastrar Mantimento</h2>
                <p>Preencha os dados do mantimento</p>
            </div>

            <form onSubmit={handleSubmit}>

                <label htmlFor="name">Nome:</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} className={errors.name ? "error" : ""} />

                <label htmlFor="min_quantity">Quantidade mínima:</label>
                <input id="min_quantity" className={errors.min_quantity ? "error" : ""} type="number" name="min_quantity" value={form.min_quantity} onChange={handleChange} />

                <label htmlFor="max_quantity">Quantidade máxima:</label>
                <input id="max_quantity" className={errors.max_quantity ? "error" : ""} type="number" name="max_quantity" value={form.max_quantity} onChange={handleChange} />

                <label htmlFor="current_quantity">Quantidade atual:</label>
                <input id="current_quantity" className={errors.current_quantity ? "error" : ""} type="number" name="current_quantity" value={form.current_quantity} onChange={handleChange} />

                <div className='supply-register-buttons-container'>
                    <button onClick={() => setProfileMenuItem("default")} type="button">Cancelar</button>
                    <button type="submit">Cadastrar</button>
                </div>

            </form>
        </div>
    );
}