import { useEffect, useState } from 'react';
import './LandingPage.scss';

export default function NavBar(){

  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <a href="#" className="navbar__logo">
          {/* <span className="navbar__logo-icon">🏠</span> */}
          {/* <span className="navbar__logo-text">Pronto<strong>Abrigo</strong></span> */}
          <img className="navbar__logo-image" src="/img/ProntoAbrigoLogoBranco.svg" alt="" />
        </a>
        <div className="navbar__links">
          <a href="#pessoas">Pessoas</a>
          <a href="#abrigos">Abrigos</a>
          <a href="#doacoes">Doações</a>
          <a href="#alertas">Alertas</a>
        </div>
        <a href="#doacoes" className="btn btn--sm btn--yellow">Doe Agora</a>
      </div>
    </nav>
  );
};