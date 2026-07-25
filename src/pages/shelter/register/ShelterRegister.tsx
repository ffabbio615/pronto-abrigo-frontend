import './ShelterRegister.scss';
import { usePageLoader } from "../../../hooks/usePageLoader";
import { useState, useRef } from 'react';
import useStore from '../../../store/useStore';
import useAlertStore from "../../../store/useAlertStore";
import axios from "axios";
import CommonBackground from "../../../components/CommonBackground";
import { registerShelter } from "../../../services/shelters";
import { useNavigate } from 'react-router-dom';
import supabase from "../../../services/supabase";

export default function Register() {

  usePageLoader();
  const { setLoader } = useStore();
  const { alert } = useAlertStore();
  const navigate = useNavigate();
  const inputFileRef = useRef<HTMLInputElement>(null);


  const [image, setImage] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: "",
    nickname: "",
    description: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
    latitude: "",
    longitude: "",
    type: "human",
    capacity: "",
    photo_url: ""
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
    if (!form.email) newErrors.email = "Email é obrigatório";
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

      //Faz o upload da imagem
      let photoUrl = "";

      if (image) {
        const fileName = `${form.nickname}-${Date.now()}-shelter-${image.name}`;

        const { data: uploadData, error } = await supabase.storage.from("shelters").upload(fileName, image);

        if (error) {
          await alert("Houve um erro ao enviar o arquivo. Tente novamente.");
          setLoader(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage.from("shelters").getPublicUrl(uploadData.path);
        photoUrl = publicUrlData.publicUrl;
      }

      //Armazena e envia para o banco de dados
      const { confirmPassword, ...dataToSend } = {...form, photo_url: photoUrl};
      void confirmPassword;
      await registerShelter(dataToSend);

      await alert("Cadastro realizado com sucesso!");
      navigate("/login");

    } catch (error) {
      console.error(error);
      await alert("Erro ao cadastrar abrigo!");
      setLoader(false);
    }
  };

  const handleCancel = () => {
    navigate("/login");
  }


  return (
    <main className='main-register-container'>
      <CommonBackground />
      <div className='register-foreground-container'>
        
        <div className='register-form-title-container'>
          <h1>Cadastro de Abrigos</h1>
          <p>Preencha os campos abaixo para cadastrar seu abrigo.</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className='form-names-container'>
            <div>
              <label htmlFor="name"><span>*</span>Nome completo do abrigo:</label>
              <input className={errors.name ? "error" : ""} id="name" name="name" placeholder="Ex: Abrigo Central RJ" onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="nickname"><span>*</span>Nome comercial:</label>
              <input className={errors.nickname ? "error" : ""} id="nickname" name="nickname" placeholder="Ex: ACNRJ" onChange={handleChange} />
            </div>
          </div>

          <label htmlFor="description"><span>*</span>Descrição:</label>
          <input className={errors.description ? "error" : ""} id="description" name="description" placeholder="Ex: Abrigo com 20 anos de atuação" onChange={handleChange} />

          <label htmlFor="address"><span>*</span>Endereço completo:</label>
          <input className={errors.address ? "error" : ""} id="address" name="address" placeholder="Ex: Rua A, 123 - Rio de Janeiro" onBlur={getCoordinates} onChange={handleChange} />

          <label htmlFor="email"><span>*</span>Email:</label>
          <input className={errors.email ? "error" : ""} id="email" name="email" type="email" placeholder="Ex: contato@abrigo.com" onChange={handleChange} />

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

          <div className='form-type-capacity-container'>
            <div>
              <label htmlFor="type">Tipo de acolhimento:</label>
              <select id="type" name="type" onChange={handleChange}>
                <option value="human">Humano</option>
                <option value="animal">Animal</option>
              </select>
            </div>

            <div>
              <label htmlFor="capacity"><span>*</span>Capacidade:</label>
              <input className={errors.capacity ? "error" : ""} id="capacity" name="capacity" type="number" placeholder="Ex: 100" onChange={handleChange} />
            </div>
          </div>

          <label htmlFor="photo_url">Foto do local:</label>
          <img className={image ? "shelter-img" : "shelter-no-img"} src={image ? URL.createObjectURL(image) : "/icon/imgSubmitIcon.png"} alt="Pré-visualização do abrigo" onClick={() => inputFileRef.current?.click()} />
          <input ref={inputFileRef} id="photo_url" name="photo_url" type="file" hidden accept="image/*" onChange={(e) => { if (e.target.files?.[0]) { setImage(e.target.files[0]); }}}/>

          <div className='form-buttons-container'>
            <button type="button" onClick={handleCancel}>Cancelar</button>
            <button type="submit">Cadastrar</button>
          </div>

        </form>
      </div>
    </main>
  );
}