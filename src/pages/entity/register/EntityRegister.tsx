import './EntityRegister.scss';
import { useEffect, useState } from 'react';
import useStore from '../../../store/useStore';
import useAlertStore from "../../../store/useAlertStore";
import { createEntity } from "../../../services/entities";
import type {Entity} from "../../../services/entities";

export default function EntityRegister() {

    const { setLocalLoader } = useStore();
    const { alert } = useAlertStore();

    useEffect(() => {
        setTimeout(()=> setLocalLoader(false), 1000);
    }, [setLocalLoader]);

    const [form, setForm] = useState({
        type: "person",
        name: "",
        birth_date: "",
        estimated_age: "",
        species: "",
        breed: "",
        description: "",
        photo_url: "",
        allow_public_photo: false,
        status: "in_shelter"
    });

    const [errors, setErrors] = useState<Record<string, string>>({});


    const isAnimal = form.type === "animal";


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;

        setForm(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
        }));
    };


    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!form.name) newErrors.name = "Nome é obrigatório";

        if (!form.birth_date && !form.estimated_age) {
        newErrors.birth_date = "Informe data de nascimento ou idade estimada";
        }

        if (isAnimal && !form.species) {
        newErrors.species = "Espécie é obrigatória para animais";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
        await alert("Preencha os campos obrigatórios!");
        return;
        }

        try {
        setLocalLoader(true);

        const dataToSend: Entity = {
            ...form,
            species: isAnimal ? form.species : null,
            breed: isAnimal ? form.breed : null,
            photo_url: form.allow_public_photo ? form.photo_url : null
        };

        await createEntity(dataToSend);

        await alert("Novo abrigado cadastrado com sucesso!");

        setForm({
            type: "person",
            name: "",
            birth_date: "",
            estimated_age: "",
            species: "",
            breed: "",
            description: "",
            photo_url: "",
            allow_public_photo: false,
            status: "in_shelter"
        });

        } catch (err) {
        console.error(err);
        await alert("Erro ao cadastrar acolhido!");
        } finally {
        setLocalLoader(false);
        }
    };

    return (
        <div className="entity-register-container">

        <div className="entity-title-container">
            <h2>Cadastrar Desabrigado</h2>
            <p>Preencha os dados do desabrigado abaixo</p>
        </div>

        <form onSubmit={handleSubmit}>

            <label htmlFor="type">Tipo:</label>
            <select id="type" name="type" value={form.type} onChange={handleChange}>
                <option value="person">Pessoa</option>
                <option value="animal">Animal</option>
            </select>

            <label htmlFor="name"><span>*</span>Nome:</label>
            <input className={errors.name ? "error" : ""} id="name" name="name" value={form.name} onChange={handleChange} placeholder={isAnimal ? "Ex.: Thor" : "Ex.: João da Silva"} />

            <div className='birth-container'>
                <div>
                    <label htmlFor="birth_date">Data de nascimento:</label>
                    <input id="birth_date" type="date" name="birth_date" value={form.birth_date} onChange={handleChange} />
                </div>
                <p>ou</p>
                <div>
                    <label htmlFor="estimated_age">Idade estimada:</label>
                    <input id="estimated_age" type="number" name="estimated_age" value={form.estimated_age} onChange={handleChange} placeholder="Somente número. Ex.: 5"/>
                </div>
            </div>

            {isAnimal && (
            <>
                <label htmlFor="species"><span>*</span>Espécie:</label>
                <input className={errors.species ? "error" : ""} id="species" name="species" value={form.species} onChange={handleChange} placeholder="Ex.: Cachorro, Gato" />

                <label htmlFor="breed">Raça:</label>
                <input id="breed" name="breed" value={form.breed} onChange={handleChange} placeholder="Ex.: Poodle, SRD" />
            </>
            )}

            <label htmlFor="description">Descrição:</label>
            <input id="description" name="description" value={form.description} onChange={handleChange} 
            placeholder={isAnimal ? "Animal cor caramelo, cauda encaracolada, dócil e saudável" : "Ex.: Cabelos brancos, óculos, dificuldade de fala e locomoção"} />

            <label className="public-photo-checkbox" htmlFor="allow_public_photo">
                <input id="allow_public_photo" type="checkbox" name="allow_public_photo" checked={form.allow_public_photo} onChange={handleChange} /> Permitir foto pública
            </label>

            {form.allow_public_photo && (
            <>
                <label htmlFor="photo_url">URL da foto:</label>
                <input id="photo_url" name="photo_url" value={form.photo_url} onChange={handleChange} placeholder="Cole o link da imagem" />

                {form.photo_url && (
                    <img src={form.photo_url} alt="Miniatura da foto do acolhido" style={{ width: 150, marginTop: 10 }} />
                )}
            </>
            )}

            <label htmlFor="status">Status:</label>
            <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="in_shelter">Abrigado</option>
                <option value="looking_for_family">Esperando por família</option>
            </select>

            <button type="submit">Cadastrar</button>

        </form>
        </div>
    );
}