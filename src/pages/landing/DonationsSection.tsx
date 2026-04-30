import { useState } from 'react';
import './LandingPage.scss';
import type { Supply } from './LandingPage';

export default function DonationsSection(){

    const MOCK_SUPPLIES: Supply[] = [
      { id: "1", name: "Água potável (garrafas)", category: "Essenciais", urgency: "critical", shelter: "Ginásio Décio Dall'Agnol", distance: "2.3 km" },
      { id: "2", name: "Alimentos não perecíveis", category: "Alimentos", urgency: "critical", shelter: "CEFET-RS", distance: "3.1 km" },
      { id: "3", name: "Fraldas (todos os tamanhos)", category: "Higiene", urgency: "high", shelter: "Arena do Grêmio", distance: "4.7 km" },
      { id: "4", name: "Cobertores e colchões", category: "Descanso", urgency: "high", shelter: "Escola Dr. Rodrigues", distance: "6.2 km" },
      { id: "5", name: "Remédios para pressão e diabetes", category: "Saúde", urgency: "critical", shelter: "CEFET-RS", distance: "3.1 km" },
      { id: "6", name: "Roupas adulto (P, M, G)", category: "Vestuário", urgency: "medium", shelter: "Ginásio Décio Dall'Agnol", distance: "2.3 km" },
    ];

    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [supplies, setSupplies] = useState<Supply[]>([]);
    const [searched, setSearched] = useState(false);

    const handleSearch = () => {
        if (!address.trim()) return;
        setLoading(true);
        setSearched(true);
        setTimeout(() => {
        setSupplies(MOCK_SUPPLIES);
        setLoading(false);
        }, 800);
    };

    const urgencyLabel = { critical: "🔴 Crítico", high: "🟠 Alto", medium: "🟡 Médio" };

    return (
        <section className="donations section section--yellow" id="doacoes">
        <div className="container">
            <div className="section-header">
            <span className="section-tag section-tag--dark">Rede de doações</span>
            <h2 className="section-title">O que está faltando<br />perto de você?</h2>
            <p className="section-desc">Digite seu endereço e veja o que os abrigos mais próximos precisam agora.</p>
            </div>
            <div className="donations__search">
            <input
                type="text"
                placeholder="Ex: Rua das Flores, 123, Porto Alegre"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input input--lg"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="btn btn--blue btn--lg" onClick={handleSearch} disabled={loading}>
                {loading ? "Buscando..." : "Buscar doações"}
            </button>
            </div>
            {loading && (
            <div className="loading-row">
                {[1,2,3,4].map(i => <div key={i} className="skeleton skeleton--supply" />)}
            </div>
            )}
            {!loading && searched && supplies.length > 0 && (
            <div className="supplies__grid">
                {supplies.map(s => (
                <div key={s.id} className={`supply-card supply-card--${s.urgency}`}>
                    <div className="supply-card__urgency">{urgencyLabel[s.urgency]}</div>
                    <strong className="supply-card__name">{s.name}</strong>
                    <span className="supply-card__cat">{s.category}</span>
                    <div className="supply-card__footer">
                    <span>📍 {s.shelter}</span>
                    <span className="supply-card__dist">{s.distance}</span>
                    </div>
                </div>
                ))}
            </div>
            )}
            {!loading && searched && supplies.length === 0 && (
            <div className="empty-state">
                <span>📦</span>
                <p>Nenhum item encontrado na sua região.</p>
            </div>
            )}
            {!searched && (
            <div className="donations__hint">
                <div className="donations__hint-icon">📦</div>
                <p>Digite seu endereço acima para ver o que está faltando perto de você.</p>
            </div>
            )}
        </div>
        </section>
    );
}