import './LandingPage.scss';


export default function FinalCTA(){
    return(
        <section className="final-cta">
            <div className="final-cta__bg" />
            <div className="container final-cta__content">
            <div className="final-cta__badge">Faça parte da mudança</div>
            <h2 className="final-cta__title">
                A reconstrução começa<br />com cada um de nós.
            </h2>
            <p className="final-cta__desc">
                Doações, voluntariado, abrigos cadastrados. Cada ação, por menor que seja, salva uma vida.
            </p>
            <div className="final-cta__buttons">
                <a href="#doacoes" className="btn btn--lg btn--yellow">📦 Fazer doação</a>
                <a href="/login" className="btn btn--lg btn--white">🏠 Cadastrar abrigo</a>
            </div>
            <p className="final-cta__note">
                Precisa de ajuda? Ligue <strong>199</strong> (Defesa Civil) ou <strong>193</strong> (Bombeiros)
            </p>
            </div>
        </section>
    );
}