import './LandingPage.scss';

export default function AboutSection() {
    return(
        <section className="about section" id="sobre">
            <div className="container">
            <div className="section-header">
                <span className="section-tag">O que fazemos</span>
                <h2 className="section-title">Uma plataforma feita<br />na hora de maior necessidade</h2>
                <p className="section-desc">
                O Pronto Abrigo nasceu das enchentes para servir às enchentes. Uma ferramenta humana, rápida e acessível.
                </p>
            </div>
            <div className="about__cards">
                {[
                { icon: "🔎", title: "Localizar Pessoas", desc: "Busca por desaparecidos com filtros por cidade e status. Registro feito pela comunidade e Defesa Civil." },
                { icon: "🏠", title: "Mapa de Abrigos", desc: "Abrigos cadastrados com capacidade, ocupação e lista de necessidades em tempo real." },
                { icon: "📦", title: "Rede de Doações", desc: "Conectamos doadores com abrigos próximos. Saiba exatamente o que cada abrigo precisa agora." },
                { icon: "⚡", title: "Alertas Climáticos", desc: "Integração com dados meteorológicos para antecipar riscos e agir antes da tragédia." },
                ].map((c) => (
                <div key={c.icon} className="about__card">
                    <div className="about__card-icon">{c.icon}</div>
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                </div>
                ))}
            </div>
            </div>
        </section>
    );
}