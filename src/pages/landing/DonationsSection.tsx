import { useState } from 'react';
import './LandingPage.scss';
import type { Supply, Donation } from './LandingPage';
import { getNearbySupplies } from '../../services/supplies';
import DonationItemModal from './DonationItemModal';

export default function DonationsSection(){

    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [supplies, setSupplies] = useState<Supply[]>([]);
    const [searched, setSearched] = useState(false);
    const [selected, setSelected] = useState<Supply | null>(null);
    const [selectedShelterGroup, setSelectedShelterGroup] = useState<number | null>(null);

    const handleSearch = async () => {
        setLoading(true);
        setSearched(true);

        try {
            let latitude;
            let longitude;

            // USA ENDEREÇO DIGITADO
            if (address.trim()) {

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
                );

                const result = await response.json();

                if (!result.length) {
                    throw new Error("ENDERECO_NAO_ENCONTRADO");
                }

                latitude = parseFloat(result[0].lat);
                longitude = parseFloat(result[0].lon);

            } 
            
            // USA GEOLOCALIZAÇÃO
            else {

                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });

                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
            }

            const data = await getNearbySupplies(
                latitude,
                longitude
            );

            setSupplies(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    };

    const getSupplyStatus = (current: number, min: number, max: number) => {
        if (current < min) return "high";
        if (current === min) return "highWarning";
        if (current < max * 0.7) return "medium";
        return "low";
    };

    const urgencyLabel = { high: "🔴 Alta", highWarning: "🔴 Alta" , medium: "🟡 Média", low: "🟢 Baixa" };

    const selectDonation = (supply : Supply, item : Donation)=>{
        setSelected(
            {
                shelter_id: supply.shelter_id,
                shelter_name: supply.shelter_name,
                shelter_address: supply.shelter_address,
                distance: supply.distance,
                items: [{
                    id: item.id,
                    name: item.name,
                    current: item.current,
                    needed: item.needed,
                    ideal: item.ideal,
                }]
            }
        )
    }

    return (
        <section className="donations section section--yellow" id="doacoes">
        <div className="container">
            <div className="section-header">
            <span className="section-tag section-tag--dark">Rede de doações</span>
            <h2 className="section-title">O que está faltando<br />perto de você?</h2>
            <p className="section-desc">Digite seu endereço ou clique direto em "Buscar doações" para listar as doações que os abrigos precisam.</p>
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
                {[1,2,3].map(i => <div key={i} className="skeleton skeleton--supply" />)}
            </div>
            )}
            {!loading && searched && supplies.length > 0 && (
                <div className="shelter-supplies-cards-container">
                    {supplies.map( (shelter, index) =>
                        <div key={index} className='shelter-cards-container'>
                            <h3 className={selectedShelterGroup === index ? " shelter-card-title-selected shelter-card-title" : "shelter-card-title"} 
                            onClick={selectedShelterGroup !== index ? ()=> setSelectedShelterGroup(index) : ()=> setSelectedShelterGroup(null)}>
                                🏠 {shelter.shelter_name}<span>❯</span>
                            </h3>
                            <div className={selectedShelterGroup === index ? "supplies-grid supplies-grid-selected" : "supplies-grid"}>
                                {
                                    shelter.items.map((item) => (
                                        <div key={item.id} className={`supply-card supply-card--${getSupplyStatus(item.current, item.needed, item.ideal)}`}>
                                            <div className='supply-card-urgency-name-container'>
                                                <span className="supply-card__urgency">{`${urgencyLabel[getSupplyStatus(item.current, item.needed, item.ideal)]} Urgência`}</span>
                                                <strong className="supply-card__name">{item.name}</strong>
                                            </div>
            
                                            <div className='supply-card-urgency-donation-button'>
                                                <button onClick={()=> selectDonation(shelter, item)} className='btn btn--sm btn--yellow'>Doar</button>
                                            </div>
            
                                            <div className="supply-card__footer">
                                                {getSupplyStatus(item.current, item.needed, item.ideal) === "high" ? 
                                                    <span>📦 Falta(m)  <strong>{`${item.needed - item.current} `}</strong>para alcançar o mínimo.</span>
                                                : getSupplyStatus(item.current, item.needed, item.ideal) === "highWarning" ?
                                                    <span>📦 Quantidade  <strong>{`(${item.ideal - item.current}) `}</strong>está exatamente no mínimo.</span>
                                                : getSupplyStatus(item.current, item.needed, item.ideal) === "medium" ?
                                                    <span>📦 Falta(m)  <strong>{`${item.ideal - item.current} `}</strong>para alcançar o máximo.</span>
                                                :
                                                    <span>📦 Falta(m)  <strong>{`${item.ideal - item.current} `}</strong>para alcançar o máximo.</span>
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* MODAL */}
            {selected && (
                <DonationItemModal donation={selected} onClose={() => {setSelected(null); handleSearch();}} userAddress={address} />
            )}


            {!loading && searched && supplies.length === 0 && (
                <div className="donation-empty-state">
                    <span>📦</span> 
                    <p>Nenhum item encontrado em sua região.</p>
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