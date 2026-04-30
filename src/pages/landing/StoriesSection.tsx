import type { Story } from './LandingPage';
import './LandingPage.scss';

export default function StoriesSection() { 

    const MOCK_STORIES: Story[] = [
      { id: "1", name: "Dona Conceição, 72 anos", location: "Porto Alegre", quote: "Perdi tudo, mas encontrei minha família.", detail: "A água subiu de madrugada. Em 20 minutos minha casa estava coberta. O Pronto Abrigo me ajudou a encontrar meu filho no Ginásio Décio." },
      { id: "2", name: "Família Rodrigues", location: "Canoas", quote: "Chegamos ao abrigo sem nada. Saímos com esperança.", detail: "Quatro filhos, uma sogra e dois cachorros. O abrigo nos recebeu. A solidariedade do povo brasileiro é incrível." },
      { id: "3", name: "Roberto, 34 anos", location: "São Leopoldo", quote: "Não sabia que tanta gente queria ajudar.", detail: "Voluntário de São Paulo, vim de carro com 400kg de doações. Através do mapa consegui levar direto para quem precisava." },
    ];

    return(
        <section className="stories section" id="historias">
            <div className="container">
            <div className="section-header">
                <span className="section-tag">Histórias reais</span>
                <h2 className="section-title">A força do povo<br />brasileiro</h2>
                <p className="section-desc">De cada tragédia, histórias de resiliência que precisam ser contadas.</p>
            </div>
            <div className="stories__grid">
                {MOCK_STORIES.map((s, i) => (
                <div key={s.id} className={`story-card ${i === 0 ? "story-card--featured" : ""}`}>
                    <div className="story-card__quote">"</div>
                    <blockquote>{s.quote}</blockquote>
                    <p className="story-card__detail">{s.detail}</p>
                    <div className="story-card__author">
                    <div className="story-card__avatar">{s.name[0]}</div>
                    <div>
                        <strong>{s.name}</strong>
                        <span>📍 {s.location}</span>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </section>
        );
}