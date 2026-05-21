import './LandingPage.scss';

export default function Footer() {
    return(
        <footer className="footer">
            <div className="container footer__inner">
            <div className="footer__brand">
                <span className="navbar__logo-text">Pronto<strong>Abrigo</strong></span>
                <p>Conectando ajuda a quem precisa, em tempo real.</p>
            </div>
            <div className="footer__links">
                <div>
                <strong>Plataforma</strong>
                <a href="#">Busca de pessoas</a>
                <a href="#">Abrigos</a>
                <a href="#">Doações</a>
                <a href="#">Alertas</a>
                </div>
                <div>
                <strong>Emergências</strong>
                <a href="#">Defesa Civil: 199</a>
                <a href="#">Bombeiros: 193</a>
                <a href="#">SAMU: 192</a>
                <a href="#">Polícia: 190</a>
                </div>
            </div>
            </div>
            <div className="footer__bottom">
            <p>© 2026 Pronto Abrigo. Último desafio Fullstack para o curso Kodie Academy, desenvolvido por Fábio Marques.</p>
            </div>
        </footer>
    );
}