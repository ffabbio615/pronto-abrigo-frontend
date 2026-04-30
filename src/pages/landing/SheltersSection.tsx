import { useState } from 'react';
import './LandingPage.scss';
import type { Shelter } from './LandingPage';
import ShelterModal from './ShelterModal';
import ShelterCard from './ShelterCard';

export default function SheltersSection() {

    const MOCK_SHELTERS: Shelter[] = [
      { id: "1", name: "Ginásio Municipal Décio Dall'Agnol", address: "Rua dos Andradas, 1234", city: "Porto Alegre", status: "open", capacity: 400, occupancy: 280, phone: "(51) 3211-1234", needs: ["água", "fraldas", "colchões"], coordinates: { lat: -30.03, lng: -51.22 } },
      { id: "2", name: "CEFET-RS Unidade Porto Alegre", address: "Av. Farrapos, 8888", city: "Porto Alegre", status: "open", capacity: 250, occupancy: 210, phone: "(51) 3211-5678", needs: ["alimentos", "remédios"], coordinates: { lat: -30.01, lng: -51.20 } },
      { id: "3", name: "Arena do Grêmio", address: "Av. Padre Leopoldo Brentano, 110", city: "Porto Alegre", status: "full", capacity: 800, occupancy: 800, phone: "(51) 3011-2222", needs: ["tudo"], coordinates: { lat: -29.97, lng: -51.18 } },
      { id: "4", name: "Escola Estadual Dr. Rodrigues", address: "Rua Independência, 456", city: "Canoas", status: "open", capacity: 180, occupancy: 95, phone: "(51) 3475-9999", needs: ["roupas", "água"], coordinates: { lat: -29.92, lng: -51.18 } },
      { id: "5", name: "Centro Comunitário São José", address: "Rua XV de Novembro, 789", city: "São Leopoldo", status: "closed", capacity: 120, occupancy: 0, phone: "(51) 3568-7777", needs: [], coordinates: { lat: -29.76, lng: -51.14 } },
    ];

    const [selected, setSelected] = useState<Shelter | null>(null);
    const [filter, setFilter] = useState<"all" | "open">("all");
    const visible = filter === "all" ? MOCK_SHELTERS : MOCK_SHELTERS.filter(s => s.status === "open");

    return (
        <section className="shelters section" id="abrigos">
        <div className="container">
            <div className="section-header">
            <span className="section-tag">Rede de abrigos</span>
            <h2 className="section-title">Abrigos disponíveis<br />na sua região</h2>
            <p className="section-desc">Encontre onde buscar acolhimento ou como contribuir com um abrigo próximo.</p>
            </div>
            <div className="filter-bar">
            <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>Todos ({MOCK_SHELTERS.length})</button>
            <button className={`filter-btn ${filter === "open" ? "active" : ""}`} onClick={() => setFilter("open")}>Abertos ({MOCK_SHELTERS.filter(s => s.status === "open").length})</button>
            </div>
            <div className="shelters__grid">
            {visible.map(s => (
                <ShelterCard key={s.id} shelter={s} onClick={() => setSelected(s)} />
            ))}
            </div>
            <div className="shelters__footer">
            <a href="#" className="btn btn--yellow">+ Cadastrar novo abrigo</a>
            </div>
        </div>
        {selected && <ShelterModal shelter={selected} onClose={() => setSelected(null)} />}
        </section>
    );
};