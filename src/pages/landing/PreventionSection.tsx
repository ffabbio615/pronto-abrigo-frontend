import './LandingPage.scss';

export default function PreventionSection(){ 

    const PREVENTION_TIPS = [
      { icon: "📦", title: "Monte um kit de emergência", desc: "Água, documentos, remédios, lanterna e rádio para 72h." },
      { icon: "🗺️", title: "Conheça as rotas de fuga", desc: "Identifique as saídas mais seguras da sua região." },
      { icon: "📱", title: "Instale alertas oficiais", desc: "Ative notificações da Defesa Civil no seu celular." },
      { icon: "🏘️", title: "Ajude os vizinhos", desc: "Idosos e pessoas com mobilidade reduzida precisam de apoio." },
      { icon: "🔌", title: "Desligue a eletricidade", desc: "Em caso de alagamento, desligue o disjuntor principal." },
      { icon: "🚗", title: "Não trafegue em vias alagadas", desc: "30 cm de água já podem arrastar um carro." },
    ];

    return(
        <section className="prevention section section--light" id="prevencao">
            <div className="container">
            <div className="section-header">
                <span className="section-tag">Prevenção</span>
                <h2 className="section-title">Prepare-se antes<br />que chegue a chuva</h2>
                <p className="section-desc">Conhecimento salva vidas. Compartilhe com quem você ama.</p>
            </div>
            <div className="prevention__grid">
                {PREVENTION_TIPS.map(t => (
                <div key={t.icon} className="prevention-card">
                    <div className="prevention-card__icon">{t.icon}</div>
                    <h3>{t.title}</h3>
                    <p>{t.desc}</p>
                </div>
                ))}
            </div>
            </div>
        </section>
    );
}