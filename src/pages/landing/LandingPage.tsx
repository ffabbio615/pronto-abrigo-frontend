import React, { useEffect, useState } from "react";
import "./LandingPage.scss";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MissingPerson {
  id: string;
  name: string;
  age: number;
  lastSeen: string;
  description: string;
  photo?: string;
  status: "missing" | "found";
  contact: string;
}

export interface Shelter {
  id: string;
  name: string;
  address: string;
  city: string;
  status: "open" | "closed" | "full";
  capacity: number;
  occupancy: number;
  phone: string;
  needs: string[];
  coordinates: { lat: number; lng: number };
}

export interface Supply {
  id: string;
  name: string;
  category: string;
  urgency: "critical" | "high" | "medium";
  shelter: string;
  distance: string;
}

export interface Story {
  id: string;
  name: string;
  location: string;
  quote: string;
  detail: string;
}

export interface WeatherAlert {
  id: string;
  title: string;
  severity: "extreme" | "severe" | "moderate";
  area: string;
  issued: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_MISSING: MissingPerson[] = [
  { id: "1", name: "Maria Aparecida dos Santos", age: 67, lastSeen: "Porto Alegre, RS", description: "Cabelos brancos, 1,55m, usava blusa azul e calça preta.", status: "missing", contact: "(51) 99234-5678", photo: "https://i.pravatar.cc/150?img=47" },
  { id: "2", name: "João Carlos Ferreira", age: 14, lastSeen: "Canoas, RS", description: "Adolescente, 1,60m, cabelos escuros, usava uniforme escolar.", status: "missing", contact: "(51) 98765-4321", photo: "https://i.pravatar.cc/150?img=12" },
  { id: "3", name: "Ana Lúcia Mendes", age: 43, lastSeen: "São Leopoldo, RS", description: "Mulher morena, 1,62m, cabelos cacheados.", status: "found", contact: "(51) 97654-3210", photo: "https://i.pravatar.cc/150?img=32" },
  { id: "4", name: "Pedro Alves Correia", age: 8, lastSeen: "Eldorado do Sul, RS", description: "Criança, 1,20m, cabelos claros, olhos castanhos.", status: "missing", contact: "(51) 96543-2109", photo: "https://i.pravatar.cc/150?img=7" },
  { id: "5", name: "Rosângela Lima Pereira", age: 55, lastSeen: "Gravataí, RS", description: "Mulher parda, 1,58m, cabelos pretos com mechas brancas.", status: "missing", contact: "(51) 95432-1098", photo: "https://i.pravatar.cc/150?img=45" },
];

const MOCK_SHELTERS: Shelter[] = [
  { id: "1", name: "Ginásio Municipal Décio Dall'Agnol", address: "Rua dos Andradas, 1234", city: "Porto Alegre", status: "open", capacity: 400, occupancy: 280, phone: "(51) 3211-1234", needs: ["água", "fraldas", "colchões"], coordinates: { lat: -30.03, lng: -51.22 } },
  { id: "2", name: "CEFET-RS Unidade Porto Alegre", address: "Av. Farrapos, 8888", city: "Porto Alegre", status: "open", capacity: 250, occupancy: 210, phone: "(51) 3211-5678", needs: ["alimentos", "remédios"], coordinates: { lat: -30.01, lng: -51.20 } },
  { id: "3", name: "Arena do Grêmio", address: "Av. Padre Leopoldo Brentano, 110", city: "Porto Alegre", status: "full", capacity: 800, occupancy: 800, phone: "(51) 3011-2222", needs: ["tudo"], coordinates: { lat: -29.97, lng: -51.18 } },
  { id: "4", name: "Escola Estadual Dr. Rodrigues", address: "Rua Independência, 456", city: "Canoas", status: "open", capacity: 180, occupancy: 95, phone: "(51) 3475-9999", needs: ["roupas", "água"], coordinates: { lat: -29.92, lng: -51.18 } },
  { id: "5", name: "Centro Comunitário São José", address: "Rua XV de Novembro, 789", city: "São Leopoldo", status: "closed", capacity: 120, occupancy: 0, phone: "(51) 3568-7777", needs: [], coordinates: { lat: -29.76, lng: -51.14 } },
];

const MOCK_SUPPLIES: Supply[] = [
  { id: "1", name: "Água potável (garrafas)", category: "Essenciais", urgency: "critical", shelter: "Ginásio Décio Dall'Agnol", distance: "2.3 km" },
  { id: "2", name: "Alimentos não perecíveis", category: "Alimentos", urgency: "critical", shelter: "CEFET-RS", distance: "3.1 km" },
  { id: "3", name: "Fraldas (todos os tamanhos)", category: "Higiene", urgency: "high", shelter: "Arena do Grêmio", distance: "4.7 km" },
  { id: "4", name: "Cobertores e colchões", category: "Descanso", urgency: "high", shelter: "Escola Dr. Rodrigues", distance: "6.2 km" },
  { id: "5", name: "Remédios para pressão e diabetes", category: "Saúde", urgency: "critical", shelter: "CEFET-RS", distance: "3.1 km" },
  { id: "6", name: "Roupas adulto (P, M, G)", category: "Vestuário", urgency: "medium", shelter: "Ginásio Décio Dall'Agnol", distance: "2.3 km" },
];

const MOCK_STORIES: Story[] = [
  { id: "1", name: "Dona Conceição, 72 anos", location: "Porto Alegre", quote: "Perdi tudo, mas encontrei minha família.", detail: "A água subiu de madrugada. Em 20 minutos minha casa estava coberta. O Pronto Abrigo me ajudou a encontrar meu filho no Ginásio Décio." },
  { id: "2", name: "Família Rodrigues", location: "Canoas", quote: "Chegamos ao abrigo sem nada. Saímos com esperança.", detail: "Quatro filhos, uma sogra e dois cachorros. O abrigo nos recebeu. A solidariedade do povo brasileiro é incrível." },
  { id: "3", name: "Roberto, 34 anos", location: "São Leopoldo", quote: "Não sabia que tanta gente queria ajudar.", detail: "Voluntário de São Paulo, vim de carro com 400kg de doações. Através do mapa consegui levar direto para quem precisava." },
];

const MOCK_ALERTS: WeatherAlert[] = [
  { id: "1", title: "Chuva forte com risco de alagamentos", severity: "extreme", area: "Vale do Sinos e Grande Porto Alegre", issued: "Hoje, 14:00" },
  { id: "2", title: "Ventos de até 80 km/h", severity: "severe", area: "Litoral Gaúcho", issued: "Hoje, 12:30" },
  { id: "3", title: "Risco de deslizamentos em encostas", severity: "moderate", area: "Serra Gaúcha", issued: "Hoje, 09:00" },
];

const PREVENTION_TIPS = [
  { icon: "📦", title: "Monte um kit de emergência", desc: "Água, documentos, remédios, lanterna e rádio para 72h." },
  { icon: "🗺️", title: "Conheça as rotas de fuga", desc: "Identifique as saídas mais seguras da sua região." },
  { icon: "📱", title: "Instale alertas oficiais", desc: "Ative notificações da Defesa Civil no seu celular." },
  { icon: "🏘️", title: "Ajude os vizinhos", desc: "Idosos e pessoas com mobilidade reduzida precisam de apoio." },
  { icon: "🔌", title: "Desligue a eletricidade", desc: "Em caso de alagamento, desligue o disjuntor principal." },
  { icon: "🚗", title: "Não trafegue em vias alagadas", desc: "30 cm de água já podem arrastar um carro." },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const NavBar: React.FC = () => {
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
          <span className="navbar__logo-icon">🏠</span>
          <span className="navbar__logo-text">Pronto<strong>Abrigo</strong></span>
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

const HeroSection: React.FC = () => (
  <section className="hero" id="hero">
    <div className="hero__bg-grid" />
    <div className="hero__water-waves">
      <div className="wave wave--1" />
      <div className="wave wave--2" />
      <div className="wave wave--3" />
    </div>
    <div className="hero__content">
      <div className="hero__badge">🚨 Situação de emergência ativa no RS</div>
      <h1 className="hero__title">
        Cada segundo<br />
        <span className="hero__title-accent">importa.</span>
      </h1>
      <p className="hero__subtitle">
        Conectamos vítimas de enchentes, abrigos e doadores em tempo real.
        Juntos, encontramos quem está perdido e levamos ajuda a quem precisa.
      </p>
      <div className="hero__ctas">
        <a href="#pessoas" className="btn btn--lg btn--yellow">
          <span>🔍</span> Encontrar pessoas
        </a>
        <a href="#doacoes" className="btn btn--lg btn--white">
          <span>📦</span> Doar mantimentos
        </a>
        <a href="#abrigos" className="btn btn--lg btn--outline">
          <span>🏠</span> Cadastrar abrigo
        </a>
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

const AboutSection: React.FC = () => (
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

const MissingPersonModal: React.FC<{ person: MissingPerson; onClose: () => void }> = ({ person, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <button className="modal__close" onClick={onClose}>✕</button>
      <div className="modal__header">
        <img src={person.photo || `https://i.pravatar.cc/150?u=${person.id}`} alt={person.name} className="modal__photo" />
        <div>
          <span className={`badge badge--${person.status === "missing" ? "red" : "green"}`}>
            {person.status === "missing" ? "⚠ Desaparecido" : "✓ Encontrado"}
          </span>
          <h2 className="modal__name">{person.name}</h2>
          <p className="modal__meta">{person.age} anos · Visto pela última vez em {person.lastSeen}</p>
        </div>
      </div>
      <div className="modal__body">
        <p><strong>Descrição:</strong> {person.description}</p>
        <div className="modal__contact">
          <span>📞</span>
          <div>
            <small>Entre em contato</small>
            <strong>{person.contact}</strong>
          </div>
        </div>
        <div className="modal__actions">
          <button className="btn btn--yellow btn--full">Tenho informações</button>
          <button className="btn btn--outline btn--full" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  </div>
);

const MissingSection: React.FC = () => {
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

const ShelterCard: React.FC<{ shelter: Shelter; onClick: () => void }> = ({ shelter, onClick }) => {
  const pct = Math.round((shelter.occupancy / shelter.capacity) * 100);
  const statusLabel = { open: "Aberto", closed: "Fechado", full: "Lotado" };
  return (
    <button className={`shelter-card shelter-card--${shelter.status}`} onClick={onClick}>
      <div className="shelter-card__top">
        <div>
          <strong className="shelter-card__name">{shelter.name}</strong>
          <span className="shelter-card__city">{shelter.city}</span>
        </div>
        <span className={`badge badge--${shelter.status === "open" ? "green" : shelter.status === "full" ? "orange" : "gray"}`}>
          {statusLabel[shelter.status]}
        </span>
      </div>
      {shelter.status !== "closed" && (
        <div className="shelter-card__capacity">
          <div className="capacity-bar">
            <div className="capacity-bar__fill" style={{ width: `${pct}%`, backgroundColor: pct > 85 ? "var(--red)" : "var(--teal)" }} />
          </div>
          <span>{shelter.occupancy}/{shelter.capacity} vagas</span>
        </div>
      )}
      {shelter.needs.length > 0 && (
        <div className="shelter-card__needs">
          {shelter.needs.slice(0, 3).map(n => <span key={n} className="need-tag">{n}</span>)}
        </div>
      )}
    </button>
  );
};

const ShelterModal: React.FC<{ shelter: Shelter; onClose: () => void }> = ({ shelter, onClose }) => {
  const pct = Math.round((shelter.occupancy / shelter.capacity) * 100);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>✕</button>
        <div className="modal__header modal__header--shelter">
          <span className="shelter-modal__icon">🏠</span>
          <div>
            <span className={`badge badge--${shelter.status === "open" ? "green" : "orange"}`}>
              {shelter.status === "open" ? "Aberto" : shelter.status === "full" ? "Lotado" : "Fechado"}
            </span>
            <h2 className="modal__name">{shelter.name}</h2>
            <p className="modal__meta">{shelter.address} — {shelter.city}</p>
          </div>
        </div>
        <div className="modal__body">
          <div className="shelter-modal__stats">
            <div className="shelter-stat">
              <strong>{shelter.capacity}</strong><span>Capacidade</span>
            </div>
            <div className="shelter-stat">
              <strong>{shelter.occupancy}</strong><span>Ocupação atual</span>
            </div>
            <div className="shelter-stat">
              <strong>{shelter.capacity - shelter.occupancy}</strong><span>Vagas livres</span>
            </div>
          </div>
          <div className="capacity-bar" style={{ height: 10, marginBottom: 16 }}>
            <div className="capacity-bar__fill" style={{ width: `${pct}%`, backgroundColor: pct > 85 ? "var(--red)" : "var(--teal)" }} />
          </div>
          {shelter.needs.length > 0 && (
            <>
              <p><strong>Necessidades urgentes:</strong></p>
              <div className="shelter-modal__needs">
                {shelter.needs.map(n => <span key={n} className="need-tag need-tag--lg">{n}</span>)}
              </div>
            </>
          )}
          <div className="modal__contact" style={{ marginTop: 20 }}>
            <span>📞</span>
            <div>
              <small>Telefone do abrigo</small>
              <strong>{shelter.phone}</strong>
            </div>
          </div>
          <div className="modal__actions">
            <button className="btn btn--yellow btn--full">Quero contribuir</button>
            <button className="btn btn--outline btn--full" onClick={onClose}>Fechar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SheltersSection: React.FC = () => {
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

const DonationsSection: React.FC = () => {
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
};

const WeatherSection: React.FC = () => (
  <section className="weather section section--dark" id="alertas">
    <div className="container">
      <div className="section-header section-header--light">
        <span className="section-tag section-tag--light">Clima e alertas</span>
        <h2 className="section-title">Alertas ativos<br />agora no RS</h2>
      </div>
      <div className="weather__layout">
        <div className="weather__alerts">
          {MOCK_ALERTS.map(a => (
            <div key={a.id} className={`alert-card alert-card--${a.severity}`}>
              <div className="alert-card__left">
                <span className="alert-card__icon">
                  {a.severity === "extreme" ? "🚨" : a.severity === "severe" ? "⚠️" : "ℹ️"}
                </span>
              </div>
              <div className="alert-card__body">
                <strong>{a.title}</strong>
                <span>{a.area}</span>
                <small>Emitido: {a.issued}</small>
              </div>
              <div className={`alert-card__sev alert-card__sev--${a.severity}`}>
                {a.severity === "extreme" ? "EXTREMO" : a.severity === "severe" ? "SEVERO" : "MODERADO"}
              </div>
            </div>
          ))}
        </div>
        <div className="weather__forecast">
          <div className="forecast-card">
            <h3>Previsão 5 dias — Porto Alegre</h3>
            <div className="forecast__days">
              {[
                { day: "Hoje", icon: "⛈️", high: 21, low: 15, rain: 92 },
                { day: "Qui", icon: "🌧️", high: 18, low: 13, rain: 80 },
                { day: "Sex", icon: "🌦️", high: 22, low: 14, rain: 55 },
                { day: "Sáb", icon: "🌤️", high: 26, low: 16, rain: 20 },
                { day: "Dom", icon: "☀️", high: 28, low: 17, rain: 10 },
              ].map(d => (
                <div key={d.day} className="forecast__day">
                  <span className="forecast__label">{d.day}</span>
                  <span className="forecast__icon">{d.icon}</span>
                  <span className="forecast__temp">{d.high}°<em>{d.low}°</em></span>
                  <div className="forecast__rain-bar">
                    <div className="forecast__rain-fill" style={{ width: `${d.rain}%` }} />
                  </div>
                  <span className="forecast__rain-pct">{d.rain}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const StoriesSection: React.FC = () => (
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

const PreventionSection: React.FC = () => (
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

const FinalCTA: React.FC = () => (
  <section className="final-cta">
    <div className="final-cta__bg" />
    <div className="container final-cta__content">
      <div className="final-cta__badge">🤝 Faça parte da mudança</div>
      <h2 className="final-cta__title">
        A reconstrução começa<br />com cada um de nós.
      </h2>
      <p className="final-cta__desc">
        Doações, voluntariado, abrigos cadastrados. Cada ação, por menor que seja, salva uma vida.
      </p>
      <div className="final-cta__buttons">
        <a href="#doacoes" className="btn btn--lg btn--yellow">📦 Fazer doação</a>
        <a href="#abrigos" className="btn btn--lg btn--white">🏠 Cadastrar abrigo</a>
      </div>
      <p className="final-cta__note">
        Precisa de ajuda? Ligue <strong>199</strong> (Defesa Civil) ou <strong>193</strong> (Bombeiros)
      </p>
    </div>
  </section>
);

const Footer: React.FC = () => (
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
      <p>© 2024 Pronto Abrigo. Feito com urgência e cuidado para o povo brasileiro.</p>
    </div>
  </footer>
);

// ─── LandingPage ──────────────────────────────────────────────────────────────

const LandingPage: React.FC = () => {
  useEffect(() => {
    // Smooth scroll polyfill for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener("click", (e) => {
        const href = (a as HTMLAnchorElement).getAttribute("href");
        if (href && href !== "#") {
          e.preventDefault();
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }, []);

  return (
    <div className="landing">
      <NavBar />
      <HeroSection />
      <AboutSection />
      <MissingSection />
      <SheltersSection />
      <DonationsSection />
      <WeatherSection />
      <StoriesSection />
      <PreventionSection />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
