import './Login.scss';
import { useEffect, useState } from "react";
import useStore from '../../store/useStore';
import useAlertStore from "../../store/useAlertStore";
import { login } from "../../services/auth";
import { Link, useNavigate } from "react-router-dom";
import CommonBackground from "../../components/CommonBackground";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setLoader } = useStore();
  const { alert } = useAlertStore();

  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 2000);
  }, [setLoader]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoader(true);

    try {
      await login({ email, password });

      await alert("Login feito com sucesso!");
      setLoader(false);
      // redireciona para home page
      navigate("/home");
    } catch (error) {
        console.error(error);
        await alert("Email ou senha inválidos!");
        setLoader(false);
    }
  };

  return (
    <main className='main-login-container'>
        <CommonBackground />
        <div className='login-foreground-container'>
            <div className='login-img-container'><img src='/img/shelterFormImg.png' alt='Imagem do Formulário' /></div>

            <form className='login-form-container' onSubmit={handleSubmit}>
                <div className='login-form-title-container'>
                    <h1>BEM-VINDO AO <br></br> PRONTO ABRIGO!</h1>
                    <p>Seja a luz que guiará quem já perdeu tudo que tinha nas enchentes.</p>
                </div>
                <div className='login-form-inputs-container'>
                    <h2>Faça o login</h2>
                    <input type="email" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Entrar</button>
                    <p>Novo por aqui? <Link to="/shelter/register" className='login-form-link'>Cadastre seu abrigo</Link></p>
                </div>
                <div className='login-form-logo-img'>
                    <img src='/img/prontoAbrigoLogo.png' alt='Logo do Pronto Abrigo' onClick={()=> navigate("/")} />
                </div>
            </form>
        </div>
    </main>
  );
}
