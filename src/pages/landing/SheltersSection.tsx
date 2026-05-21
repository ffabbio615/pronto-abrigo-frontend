import { useEffect, useState } from 'react';
import './LandingPage.scss';
import { Link } from 'react-router-dom';
import type { Shelter } from './LandingPage';
import ShelterModal from './ShelterModal';
import ShelterCard from './ShelterCard';
import { getAllShelters } from '../../services/shelters';

export default function SheltersSection() {

    const [shelter, setShelter] = useState<Shelter[]>([]);
    useEffect(()=>{
        async function loadShelters(){
            try{
                const data = await getAllShelters();
                setShelter(data);
            } catch(error){
                console.error("Erro ao buscar os abrigos:", error);
            }
        }

        loadShelters();
    },[]);

    const [selected, setSelected] = useState<Shelter | null>(null);
    const [filter, setFilter] = useState<"all" | "open">("all");
    const visible = filter === "all" ? shelter : shelter.filter(s => s.status === "open");

    return (
        <section className="shelters section" id="abrigos">
        <div className="container">
            <div className="section-header">
            <span className="section-tag">Rede de abrigos</span>
            <h2 className="section-title">Abrigos disponíveis<br />na sua região</h2>
            <p className="section-desc">Encontre onde buscar acolhimento ou como contribuir com um abrigo próximo.</p>
            </div>
            <div className="filter-bar">
            <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>Todos ({shelter.length})</button>
            <button className={`filter-btn ${filter === "open" ? "active" : ""}`} onClick={() => setFilter("open")}>Abertos ({shelter.filter(s => s.status === "open").length})</button>
            </div>
            <div className="shelters__grid">
            {visible.map(s => (
                <ShelterCard key={s.id} shelter={s} onClick={() => setSelected(s)} />
            ))}
            </div>
            <div className="shelters__footer">
                <Link to={"/login"} className="btn btn--yellow">+ Cadastrar novo abrigo</Link>
            </div>
        </div>
        {selected && <ShelterModal shelter={selected} onClose={() => setSelected(null)} />}
        </section>
    );
};