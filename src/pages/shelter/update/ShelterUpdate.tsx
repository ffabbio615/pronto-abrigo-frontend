import './ShelterUpdate.scss';
import { useState, useEffect } from 'react';
import useStore from '../../../store/useStore';
import useAlertStore from "../../../store/useAlertStore";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { updateShelter } from "../../../services/shelters";

type UpdateData = {
  name: string;
  nickname: string;
  description: string;
  address: string;
  password: string;
  latitude: number | string;
  longitude: number | string;
  capacity: number | string;
  status: string;
  photo_url: string;
}

export default function ShelterUpdate({ shelter }: { shelter: UpdateData }){

    const { alert } = useAlertStore();
    const navigate = useNavigate();
    
    const { setLoader, setLocalLoader } = useStore();
    useEffect(() => {
        setTimeout(()=> setLocalLoader(false), 1000);
    }, [setLocalLoader]);

    const [form, setForm] = useState({
        name: shelter.name || "",
        nickname: shelter.nickname || "",
        description: shelter.description || "",
        address: shelter.address || "",
        password: "",
        confirmPassword: "",
        latitude: shelter.latitude || "",
        longitude: shelter.longitude || "",
        status: shelter.status || "open",
        capacity: shelter.capacity || "",
        photo_url: shelter.photo_url || ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({
        ...prev,
        [name]: value
        }));
    };


    const passwordRules = {
        length: form.password.length >= 8,
        upper: /[A-Z]/.test(form.password),
        lower: /[a-z]/.test(form.password),
        number: /\d/.test(form.password),
    };


    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!form.name) newErrors.name = "Nome é obrigatório";
        if (!form.nickname) newErrors.nickname = "Nickname é obrigatório";
        if (!form.description) newErrors.description = "Descrição é obrigatória";
        if (!form.address) newErrors.address = "Descrição é obrigatória";
        if (!form.password) newErrors.password = "Senha é obrigatória";
        if (!form.confirmPassword) newErrors.confirmPassword = "Confirmação de senha é obrigatória";
        if (form.password !== form.confirmPassword) newErrors.confirmPassword = "As senhas não coincidem";
        if (!form.capacity) newErrors.capacity = "Capacidade é obrigatória";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const getCoordinates = async () => {
        if (!form.address) return;

        try {
        const res = await axios.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            {
            params: {
                address: form.address,
                key: import.meta.env.VITE_GOOGLE_MAPS_KEY
            }
            }
        );

        const location = res.data.results[0].geometry.location;

        setForm((prev) => ({
            ...prev,
            latitude: location.lat,
            longitude: location.lng
        }));

        } catch (err) {
        console.error("Erro ao buscar coordenadas", err);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
        await alert("Preencha os campos obrigatórios!");
        return;
        }

        if (!Object.values(passwordRules).every(Boolean)) {
        await alert("A senha não atende aos requisitos!");
        return;
        }

        if (!form.confirmPassword) {
        await alert("Confirme sua senha!");
        return;
        }

        if (form.password !== form.confirmPassword) {
        await alert("As senhas não coincidem!");
        return;
        }

        if (!form.latitude || !form.longitude) {
        await alert("Endereço inválido ou não encontrado!");
        return;
        }

        try {

        setLoader(true);
        const { confirmPassword, ...dataToSend } = form;
        void confirmPassword;
        console.log("Enviando:", dataToSend);
        await updateShelter(dataToSend);

        } catch (error) {
        console.error(error);
        await alert("Erro ao atualizar dados do abrigo!");
        setLoader(false);
        } finally{
            await alert("Dados atualizados com sucesso!");
            navigate(0);
        }
    };


    return (
        <div className='shelter-update-foreground-container'>

            <div className='shelter-update-form-title-container'>
                <h2>Editar dados do Abrigo</h2>
                <p>Preencha os campos abaixo para editar os dados do seu abrigo.</p>
            </div>

            <form onSubmit={handleSubmit}>

                <div className='form-names-container'>
                    <div>
                    <label htmlFor="name"><span>*</span>Nome completo do abrigo:</label>
                    <input className={errors.name ? "error" : ""} id="name" name="name" placeholder="Ex: Abrigo Central RJ" value={form.name} onChange={handleChange} />
                    </div>
                    <div>
                    <label htmlFor="nickname"><span>*</span>Nome comercial:</label>
                    <input className={errors.nickname ? "error" : ""} id="nickname" name="nickname" placeholder="Ex: ACNRJ" value={form.nickname} onChange={handleChange} />
                    </div>
                </div>

                <label htmlFor="description"><span>*</span>Descrição:</label>
                <input className={errors.description ? "error" : ""} id="description" name="description" placeholder="Ex: Abrigo com 20 anos de atuação" value={form.description} onChange={handleChange} />

                <label htmlFor="address"><span>*</span>Endereço completo:</label>
                <input className={errors.address ? "error" : ""} id="address" name="address" placeholder="Ex: Rua A, 123 - Rio de Janeiro" value={form.address} onBlur={getCoordinates} onChange={handleChange} />

                    <div className='form-password-container'>
                        <div>
                            <label htmlFor="password"><span>*</span>Senha:</label>
                            <input className={errors.password ? "error" : ""} id="password" name="password" type="password" onChange={handleChange} />
                            <ul className="password-rules">
                                <li className={passwordRules.length ? "ok" : ""}>Mínimo de 8 caracteres</li>
                                <li className={passwordRules.upper ? "ok" : ""}>Letra maiúscula</li>
                                <li className={passwordRules.lower ? "ok" : ""}>Letra minúscula</li>
                                <li className={passwordRules.number ? "ok" : ""}>Número</li>
                            </ul>
                        </div>

                        <div>
                        <label htmlFor="confirmPassword">Repita a senha:</label>
                        <input className={errors.password || errors.confirmPassword ? "error" : ""} id="confirmPassword" name="confirmPassword" type="password" onChange={handleChange} />
                        </div>

                    </div>

                    <label htmlFor="status">Estado de funcionamento:</label>
                    <select id="status" name="status" onChange={handleChange}>
                        <option value="open">Aberto</option>
                        <option value="closed">Fechado</option>
                    </select>

                    <label htmlFor="capacity"><span>*</span>Capacidade:</label>
                    <input className={errors.capacity ? "error" : ""} id="capacity" name="capacity" type="number" placeholder="Ex: 100" value={form.capacity} onChange={handleChange} />

                    <div className='form-photo-container'>
                        <div>
                            <label htmlFor="photo_url">Foto do local:</label>
                            <input id="photo_url" name="photo_url" placeholder="Cole a URL da imagem" value={form.photo_url} onChange={handleChange} />
                        </div>
                        <div>
                            {form.photo_url && (
                                <img src={form.photo_url} alt="Pré-visualização do abrigo" />
                            )}
                        </div>
                    </div>

                <div className='form-buttons-container'>
                    <button type="submit">Atualizar</button>
                </div>

            </form>
            
        </div>
    );
}