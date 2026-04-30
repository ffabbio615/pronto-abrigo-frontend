import { useState } from 'react';
import './LandingPage.scss';
import type { MissingPerson } from './LandingPage';
import MissingPersonModal from './MissingPersonModal';

export default function MissingSection() {

    const MOCK_MISSING: MissingPerson[] = [
      { id: "1", name: "Maria Aparecida dos Santos", age: 67, lastSeen: "Porto Alegre, RS", description: "Cabelos brancos, 1,55m, usava blusa azul e calça preta.", status: "missing", contact: "(51) 99234-5678", photo: "https://i.pravatar.cc/150?img=47" },
      { id: "2", name: "João Carlos Ferreira", age: 14, lastSeen: "Canoas, RS", description: "Adolescente, 1,60m, cabelos escuros, usava uniforme escolar.", status: "missing", contact: "(51) 98765-4321", photo: "https://i.pravatar.cc/150?img=12" },
      { id: "3", name: "Ana Lúcia Mendes", age: 43, lastSeen: "São Leopoldo, RS", description: "Mulher morena, 1,62m, cabelos cacheados.", status: "found", contact: "(51) 97654-3210", photo: "https://i.pravatar.cc/150?img=32" },
      { id: "4", name: "Pedro Alves Correia", age: 8, lastSeen: "Eldorado do Sul, RS", description: "Criança, 1,20m, cabelos claros, olhos castanhos.", status: "missing", contact: "(51) 96543-2109", photo: "https://i.pravatar.cc/150?img=7" },
      { id: "5", name: "Rosângela Lima Pereira", age: 55, lastSeen: "Gravataí, RS", description: "Mulher parda, 1,58m, cabelos pretos com mechas brancas.", status: "missing", contact: "(51) 95432-1098", photo: "https://i.pravatar.cc/150?img=45" },
    ];

    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<MissingPerson | null>(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<MissingPerson[]>(MOCK_MISSING);

    const handleSearch = (val: string) => {
        setQuery(val);
        setLoading(true);
        setTimeout(() => {
        setResults(MOCK_MISSING.filter(p =>
            p.name.toLowerCase().includes(val.toLowerCase()) ||
            p.lastSeen.toLowerCase().includes(val.toLowerCase())
        ));
        setLoading(false);
        }, 400);
    };

    return (
        <section className="missing section section--dark" id="pessoas">
        <div className="container">
            <div className="section-header section-header--light">
            <span className="section-tag section-tag--light">Busca de pessoas</span>
            <h2 className="section-title">Encontre quem você<br />está procurando</h2>
            <p className="section-desc">Cada busca pode salvar uma vida. Pesquise por nome ou cidade.</p>
            </div>
            <div className="search-bar">
            <span className="search-bar__icon">🔍</span>
            <input
                type="text"
                placeholder="Nome, cidade ou característica..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-bar__input"
            />
            {query && (
                <button className="search-bar__clear" onClick={() => handleSearch("")}>✕</button>
            )}
            </div>
            {loading ? (
            <div className="loading-row">
                {[1,2,3].map(i => <div key={i} className="skeleton skeleton--person" />)}
            </div>
            ) : results.length === 0 ? (
            <div className="empty-state">
                <span>🔍</span>
                <p>Nenhuma pessoa encontrada para "<em>{query}</em>"</p>
                <small>Tente buscar pelo nome completo ou cidade</small>
            </div>
            ) : (
            <div className="missing__grid">
                {results.map((p) => (
                <button key={p.id} className="person-card" onClick={() => setSelected(p)}>
                    <img src={p.photo || `https://i.pravatar.cc/150?u=${p.id}`} alt={p.name} className="person-card__photo" />
                    <div className="person-card__info">
                    <span className={`badge badge--${p.status === "missing" ? "red" : "green"} badge--sm`}>
                        {p.status === "missing" ? "Desaparecido" : "Encontrado"}
                    </span>
                    <strong>{p.name}</strong>
                    <span>{p.age} anos · {p.lastSeen}</span>
                    </div>
                    <span className="person-card__arrow">›</span>
                </button>
                ))}
            </div>
            )}
            <div className="missing__footer">
            <a href="#" className="btn btn--outline-light">Ver todos os registros →</a>
            <a href="#" className="btn btn--yellow">+ Registrar pessoa desaparecida</a>
            </div>
        </div>
        {selected && <MissingPersonModal person={selected} onClose={() => setSelected(null)} />}
        </section>
    );
};