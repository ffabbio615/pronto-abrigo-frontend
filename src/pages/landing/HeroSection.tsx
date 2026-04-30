import './LandingPage.scss';
import { Link } from 'react-router-dom';

export default function HeroSection() {

    return(
        <section className="hero" id="hero">
            <div className="hero__bg-grid" />
            <div className="hero__water-waves">
            <div className="wave wave--1" />
            <div className="wave wave--2" />
            <div className="wave wave--3" />
            </div>
            <div className="hero__content">
            <h1 className="hero__title">
                Cada segundo<br />
                <span className="hero__title-accent">importa.</span>
            </h1>
            <p className="hero__subtitle">
                Conectamos vítimas de enchentes, abrigos e doadores em tempo real.
                Juntos, encontramos quem está perdido e levamos ajuda a quem precisa.
            </p>
            <div className="hero__ctas">
                <a href="#pessoas" className="btn btn--lg btn--outline">
                <span>🔍</span> Encontrar pessoas
                </a>
                <a href="#doacoes" className="btn btn--lg btn--white">
                <span>📦</span> Doar mantimentos
                </a>
                {/* <a href="#abrigos" className="btn btn--lg btn--outline">
                <span>🏠</span> Cadastrar abrigo
                </a> */}
                <Link className="btn btn--lg btn--yellow" to={"/login"}>🏠 Cadastrar abrigo</Link>
            </div>
            <div className="hero__stats">
                <div className="hero__stat"><strong>12.847</strong><span>pessoas atendidas</span></div>
                <div className="hero__stat-divider" />
                <div className="hero__stat"><strong>348</strong><span>abrigos ativos</span></div>
                <div className="hero__stat-divider" />
                <div className="hero__stat"><strong>2.1 ton</strong><span>doações entregues</span></div>
            </div>
            </div>
            <div className="hero__scroll-hint">
            <span>Role para baixo</span>
            <div className="hero__scroll-arrow" />
            </div>
        </section>
    );
}