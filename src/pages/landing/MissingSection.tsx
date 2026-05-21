import { useEffect, useState } from "react";
import "./LandingPage.scss";
import type { MissingPerson } from "./LandingPage";
import MissingPersonModal from "./MissingPersonModal";
import { getEntities } from "../../services/entities";

export default function MissingSection() {
  const [people, setPeople] = useState<MissingPerson[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<MissingPerson[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MissingPerson | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadEntities() {
      setLoading(true);
      try {
        const data = await getEntities();
        setPeople(data);
        setFilteredPeople(data);
      } catch (error) {
        console.error("Erro ao buscar os abrigados:", error);
      } finally {
        setLoading(false);
      }
    }

    loadEntities();
  }, []);

  const handleSearch = (val: string) => {
    setQuery(val);

    const filtered = people.filter((p) =>
      (p.name ?? "").toLowerCase().includes(val.toLowerCase())
    );

    setFilteredPeople(filtered);
  };

  return (
    <section className="missing section section--dark" id="pessoas">
      <div className="container">

        <div className="section-header section-header--light">
          <span className="section-tag section-tag--light"> Busca de pessoas </span>
          <h2 className="section-title">Encontre quem você<br />está procurando</h2>
          <p className="section-desc">Cada busca pode salvar uma vida. Pesquise por nome.</p>
        </div>

        {/* SEARCH */}
        <div className="search-bar">
          <span className="search-bar__icon">🔍</span>
          <input type="text" placeholder="Nome..." value={query} onChange={(e) => handleSearch(e.target.value)} className="search-bar__input" />

          {query && (
            <button className="search-bar__clear" onClick={() => handleSearch("")}>✕</button>
          )}
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="loading-row">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton skeleton--person" />
            ))}
          </div>
        ) : filteredPeople.length === 0 ? (
          <div className="empty-state">
            <span>🔍</span>
            <p>Nenhuma pessoa encontrada ainda...</p>
          </div>
        ) : (
          <div className="missing__grid">
            {filteredPeople.slice(0, 5).map((p) => (
              <button key={p.id} className="person-card" onClick={() => setSelected(p)}>
                <img className="person-card__photo" src={p.photo_url ? p.photo_url : p.type==="person" ? "./icon/personIcon.png" : "./icon/animalIcon.png"} 
                  alt={p.name ? `Foto de ${p.name}` : "Foto do desabrigado"} 
                />

                <div className="person-card__info">
                  <span className="badge badge--red badge--sm"> {p.status === "looking_for_family" ? "Em busca da família" : "Localizado"} </span>

                  {p.type === "person" ?
                  <>
                    <div>
                      <strong>{p.name ?? "Sem nome"}</strong>
                      <strong>{" - Humano"}</strong>
                    </div>

                    <span> {`Idade estimada: ${p.estimated_age} ano(s)`} </span>
                  </>
                  :
                  <>
                    <div>
                      <strong>{"Animal - "}</strong>
                      <strong>{p.name ?? "Sem Nome"}</strong>
                    </div>
                    <div>
                      <span>{p.species ?? "Espécie não informada"}</span>
                      <span> {` | Idade estimada: ${p.estimated_age} ano(s)`} </span>
                      <span>{p.breed ? ` | Raça: ${p.breed}` : " | Raça não informada"}</span>
                    </div>
                  </>
                  }

                  <span> {`Abrigado em: ${new Date(p.created_at)
                    .toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})
                    .replace(',', ' às')}h`}
                  </span>

                </div>

                <span className="person-card__arrow">›</span>
              </button>
            ))}
          </div>
        )}

        {/* MODAL */}
        {selected && (
          <MissingPersonModal
            entity={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </section>
  );
}