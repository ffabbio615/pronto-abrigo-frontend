// import './EntityUpdate.scss';
// import { useEffect, useMemo, useState } from "react";
// import { getEntitiesByShelter } from "../../../services/entities";
// import useStore from "../../../store/useStore";
// import useAlertStore from "../../../store/useAlertStore";

// type Entity = {
//   id: number;
//   type: "person" | "animal";
//   name: string;
//   birth_date?: string;
//   estimated_age?: number;
//   species?: string;
//   breed?: string;
//   description?: string;
//   photo_url?: string;
//   allow_public_photo: boolean;
//   status: "in_shelter" | "looking_for_family" | "reunited" | "released";
//   exit_reason?: string;
//   created_at: string;
// };

// export default function EntityUpdate() {

//     const [entities, setEntities] = useState<Entity[]>([]);
//     const [filters, setFilters] = useState({
//         name: "",
//         birth_date: "",
//         estimated_age: "",
//         species: "",
//         breed: "",
//         description: "",
//     });

//     const { setLocalLoader } = useStore();
//     const { alert } = useAlertStore();

//     useEffect(() => {
//         const fetchEntities = async () => {
//             try {
//                 const data = await getEntitiesByShelter();
//                 setEntities(data);
//             } catch (err) {
//                 console.error(err);
//                 await alert("Erro ao buscar entidades!");
//             } finally {
//                 setLocalLoader(false);
//             }
//         };

//         fetchEntities();
//     }, [setLocalLoader, alert]);

//     const formatDate = (dateString: string) => {
//         if (!dateString) return "-";

//         return new Date(dateString).toLocaleDateString("pt-BR", {
//             day: "2-digit",
//             month: "2-digit",
//             year: "numeric"
//         });
//     };

//     const filteredEntities = useMemo(() => {
//         return entities.filter((e) => {

//             const nameMatch = !filters.name || e.name.toLowerCase().includes(filters.name.toLowerCase());

//             const birthMatch = !filters.birth_date || (e.birth_date && e.birth_date.slice(0, 10) === filters.birth_date);

//             const ageMatch = !filters.estimated_age || e.estimated_age === Number(filters.estimated_age);

//             const speciesMatch = !filters.species || (e.species && e.species.toLowerCase().includes(filters.species.toLowerCase()));

//             const breedMatch = !filters.breed || (e.breed && e.breed.toLowerCase().includes(filters.breed.toLowerCase()));

//             const descriptionMatch = !filters.description || (e.description && filters.description.toLowerCase().split(" ").every(word => e.description?.toLowerCase().includes(word) ));

//             return (
//                 nameMatch &&
//                 birthMatch &&
//                 ageMatch &&
//                 speciesMatch &&
//                 breedMatch &&
//                 descriptionMatch
//             );
//         });
//     }, [entities, filters]);

//     const handleFilterChange = (field: string, value: string) => {
//         setFilters(prev => ({
//         ...prev,
//         [field]: value
//         }));
//     };

//     const calculateAge = (birthDate?: string, estimatedAge?: number) => {
//         if (!birthDate) return estimatedAge ?? "-";

//         const today = new Date();
//         const birth = new Date(birthDate);

//         let age = today.getFullYear() - birth.getFullYear();
//         const monthDiff = today.getMonth() - birth.getMonth();

//         // Ajuste se ainda não fez aniversário esse ano
//         if (
//             monthDiff < 0 ||
//             (monthDiff === 0 && today.getDate() < birth.getDate())
//         ) {
//             age--;
//         }

//         return age;
//     };

//     const getStatusName = (status: "in_shelter" | "looking_for_family" | "reunited" | "released")=>{
//         if (status === "in_shelter") return "No abrigo";
//         if (status === "looking_for_family") return "Em busca";
//         if (status === "released") return "Liberado";
//         if (status === "reunited") return "Reunido";
//     }

//     return (
//         <div className="entity-update-main-container">
//             <div className="entity-title-container">
//                 <h2>Gerenciar Pessoas e Animais</h2>
//                 <p>Filtre e visualize os acolidos cadastrados em seu abrigo</p>
//             </div>


//             <div className="filters-container">
//                 <div className='name-filter-container'>
//                     <label htmlFor="filter-name">Nome:</label>
//                     <input id="filter-name" placeholder="Ex.: João da Silva" value={filters.name} onChange={(e) => handleFilterChange("name", e.target.value)} />
//                 </div>

//                 <div className='birth-date-filter-container'>
//                     <label htmlFor="filter-birth">Data de nascimento:</label>
//                     <input id="filter-birth" type="date" value={filters.birth_date} onChange={(e) => handleFilterChange("birth_date", e.target.value)} />    
//                 </div>
                
//                 <div className='estimated-age-filter-container'>
//                     <label htmlFor="filter-age">Idade estimada:</label>
//                     <input id="filter-age" type="number" placeholder="Ex: 30" value={filters.estimated_age} onChange={(e) => handleFilterChange("estimated_age", e.target.value)} />    
//                 </div>
                
//                 <div className='species-filter-container'>
//                     <label htmlFor="filter-species">Espécie (animal):</label>
//                     <input id="filter-species" placeholder="Ex: cachorro, gato" value={filters.species} onChange={(e) => handleFilterChange("species", e.target.value)} />
//                 </div>
                
//                 <div className='breed-filter-container'>
//                     <label htmlFor="filter-breed">Raça (animal):</label>
//                     <input id="filter-breed" placeholder="Ex: poodle, labrador" value={filters.breed} onChange={(e) => handleFilterChange("breed", e.target.value)} />
//                 </div>

//                 <div className='description-filter-container'>
//                     <label htmlFor="filter-description">Descrição:</label>
//                     <input id="filter-description" placeholder="Buscar por palavras (ex: óculos barba)" value={filters.description} onChange={(e) => handleFilterChange("description", e.target.value)} />
//                 </div>
//             </div>


            // <div className="entity-list">

            //     {filteredEntities.length === 0 ? (
            //         <p>Nenhum registro encontrado</p>
            //     ) : (
            //         filteredEntities.map((item) => (


            //             <div className="entity-card" key={item.id}>
                            
            //                 <div className="card-header">
            //                     {item.allow_public_photo && item.photo_url && (
            //                         <div className="card-image">
            //                             <img src={item.photo_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={`Foto de ${item.name}`} />
            //                         </div>
            //                     )}
            //                 </div>



            //                 <div className="card-body">
            //                     <div className='name-age-container'>
            //                         <div className="name-icon">
            //                             <strong className='entity-name'>{item.name}</strong>
            //                             {item.type === "person" ? 
            //                                 <img src='./icon/personIcon.png' alt='Imagem da pessoa acolhida' /> 
            //                                 :
            //                                 <img src='./icon/animalIcon.png' alt='Imagem do animal acolhido' />
            //                             }
            //                         </div>
            //                             <p className='entity-age'>{calculateAge(item.birth_date, item.estimated_age)} anos</p>
            //                     </div>

            //                     {/* <p><strong>Idade:</strong> {item.estimated_age ?? "-"}</p> */}
            //                     <div className='animal-informations-container'>
            //                         {item.type === "animal" && (
            //                             <>
            //                                 <p className='entity-species'><strong>Espécie:</strong> {item.species}</p>
            //                                 <p className='entity-breed'><strong>Raça:</strong> {item.breed}</p>
            //                             </>
            //                         )}
            //                     </div>
                                
            //                     <p className='entity-description'>{item.description}</p>
            //                 </div>




            //                 <div className="card-footer">
            //                     <div>
            //                         <p className="entity-register-date"> <span>Entrada:</span> {formatDate(item.created_at)} </p>
            //                         <p className={`entity-status ${item.status}`}>{getStatusName(item.status)} </p>
            //                     </div>
            //                     {(item.status==="reunited" || item.status === "released") &&
            //                         <p className='entity-exit-reason'><span>Motivo da saída: </span>{ item.exit_reason}</p>
            //                     }
            //                 </div>
            //             </div>
            //         ))
            //     )}


            // </div>
//         </div>
//     );
// }



import './EntityUpdate.scss';
import { useEffect, useMemo, useState } from "react";
import { getEntitiesByShelter, updateEntity } from "../../../services/entities";
import useStore from "../../../store/useStore";
import useAlertStore from "../../../store/useAlertStore";
import EntityEditModal from "./EntityEditModal";

type Entity = {
  id: number;
  type: "person" | "animal";
  name: string;
  birth_date?: string;
  estimated_age?: number;
  species?: string;
  breed?: string;
  description?: string;
  photo_url?: string;
  allow_public_photo: boolean;
  status: "in_shelter" | "looking_for_family" | "reunited" | "released";
  exit_reason?: string;
  created_at: string;
};

type UpdateEntity = {
  name?: string;
  birth_date?: string;
  estimated_age?: number;
  species?: string;
  breed?: string;
  description?: string;
  photo_url?: string;
  allow_public_photo?: boolean;
  status?: "in_shelter" | "looking_for_family" | "reunited" | "released";
  exit_reason?: string;
};

export default function EntityUpdate() {

    const [entities, setEntities] = useState<Entity[]>([]);
    const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

    const [filters, setFilters] = useState({
        name: "",
        birth_date: "",
        estimated_age: "",
        species: "",
        breed: "",
        description: "",
    });

    const { setLocalLoader } = useStore();
    const { alert } = useAlertStore();

    useEffect(() => {
        const fetchEntities = async () => {
            try {
                const data = await getEntitiesByShelter();
                setEntities(data);
            } catch (err) {
                console.error(err);
                await alert("Erro ao buscar entidades!");
            } finally {
                setLocalLoader(false);
            }
        };

        fetchEntities();
    }, [setLocalLoader, alert]);

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";

        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    const calculateAge = (birthDate?: string, estimatedAge?: number) => {
        if (!birthDate) return estimatedAge ?? "-";

        const today = new Date();
        const birth = new Date(birthDate);

        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
            age--;
        }

        return age;
    };

    const getStatusName = (status: Entity["status"]) => {
        if (status === "in_shelter") return "No abrigo";
        if (status === "looking_for_family") return "Em busca";
        if (status === "released") return "Liberado";
        if (status === "reunited") return "Reunido";
    };

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const filteredEntities = useMemo(() => {
        return entities.filter((e) => {

            const nameMatch = !filters.name || e.name.toLowerCase().includes(filters.name.toLowerCase());

            const birthMatch = !filters.birth_date || (e.birth_date && e.birth_date.slice(0, 10) === filters.birth_date);

            const ageMatch = !filters.estimated_age || e.estimated_age === Number(filters.estimated_age);

            const speciesMatch = !filters.species || (e.species && e.species.toLowerCase().includes(filters.species.toLowerCase()));

            const breedMatch = !filters.breed || (e.breed && e.breed.toLowerCase().includes(filters.breed.toLowerCase()));

            const descriptionMatch = !filters.description ||
                (e.description &&
                    filters.description
                        .toLowerCase()
                        .split(" ")
                        .every(word => e.description?.toLowerCase().includes(word)));

            return (
                nameMatch &&
                birthMatch &&
                ageMatch &&
                speciesMatch &&
                breedMatch &&
                descriptionMatch
            );
        });
    }, [entities, filters]);

const handleSave = async (form: UpdateEntity) => {
    if (!selectedEntity) return;

    const updated = {
        ...selectedEntity,
        ...form
    };

    try {
        await updateEntity(selectedEntity.id, updated);

        const updatedList = entities.map(e =>
            e.id === selectedEntity.id ? updated : e
        );

        setEntities(updatedList);
        setSelectedEntity(null);

        await alert("Atualizado com sucesso!");
    } catch (err) {
        console.error(err);
        await alert("Erro ao atualizar!");
    }
};

    return (
        <>
            <div className="entity-update-main-container">

                <div className="entity-title-container">
                    <h2>Gerenciar Pessoas e Animais</h2>
                    <p>Filtre e visualize os acolhidos cadastrados em seu abrigo</p>
                </div>

                <div className="filters-container">

                    <div className='name-filter-container'>
                        <label htmlFor="filter-name">Nome:</label>
                        <input id="filter-name" value={filters.name} onChange={(e) => handleFilterChange("name", e.target.value)} />
                    </div>

                    <div className='birth-date-filter-container'>
                        <label htmlFor="filter-birth">Data de nascimento:</label>
                        <input id="filter-birth" type="date" value={filters.birth_date} onChange={(e) => handleFilterChange("birth_date", e.target.value)} />
                    </div>

                    <div className='estimated-age-filter-container'>
                        <label htmlFor="filter-age">Idade estimada:</label>
                        <input id="filter-age" type="number" value={filters.estimated_age} onChange={(e) => handleFilterChange("estimated_age", e.target.value)} />
                    </div>

                    <div className='species-filter-container'>
                        <label htmlFor="filter-species">Espécie:</label>
                        <input id="filter-species" value={filters.species} onChange={(e) => handleFilterChange("species", e.target.value)} />
                    </div>

                    <div className='breed-filter-container'>
                        <label htmlFor="filter-breed">Raça:</label>
                        <input id="filter-breed" value={filters.breed} onChange={(e) => handleFilterChange("breed", e.target.value)} />
                    </div>

                    <div className='description-filter-container'>
                        <label htmlFor="filter-description">Descrição:</label>
                        <input id="filter-description" value={filters.description} onChange={(e) => handleFilterChange("description", e.target.value)} />
                    </div>

                </div>

            <div className="entity-list">

                {filteredEntities.length === 0 ? (
                    <p>Nenhum registro encontrado</p>
                ) : (
                    filteredEntities.map((item) => (


                        <div className="entity-card" onClick={() => setSelectedEntity(item)} key={item.id}>
                            
                            <div className="card-header">
                                {item.allow_public_photo && item.photo_url && (
                                    <div className="card-image">
                                        <img src={item.photo_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={`Foto de ${item.name}`} />
                                    </div>
                                )}
                            </div>



                            <div className="card-body">
                                <div className='name-age-container'>
                                    <div className="name-icon">
                                        <strong className='entity-name'>{item.name}</strong>
                                        {item.type === "person" ? 
                                            <img src='./icon/personIcon.png' alt='Imagem da pessoa acolhida' /> 
                                            :
                                            <img src='./icon/animalIcon.png' alt='Imagem do animal acolhido' />
                                        }
                                    </div>
                                        <p className='entity-age'>{calculateAge(item.birth_date, item.estimated_age)} anos</p>
                                </div>

                                {/* <p><strong>Idade:</strong> {item.estimated_age ?? "-"}</p> */}
                                <div className='animal-informations-container'>
                                    {item.type === "animal" && (
                                        <>
                                            <p className='entity-species'><strong>Espécie:</strong> {item.species}</p>
                                            <p className='entity-breed'><strong>Raça:</strong> {item.breed}</p>
                                        </>
                                    )}
                                </div>
                                
                                <p className='entity-description'>{item.description}</p>
                            </div>




                            <div className="card-footer">
                                <div>
                                    <p className="entity-register-date"> <span>Entrada:</span> {formatDate(item.created_at)} </p>
                                    <p className={`entity-status ${item.status}`}>{getStatusName(item.status)} </p>
                                </div>
                                {(item.status==="reunited" || item.status === "released") &&
                                    <p className='entity-exit-reason'><span>Motivo da saída: </span>{ item.exit_reason}</p>
                                }
                            </div>
                        </div>
                    ))
                )}


            </div>

            </div>

            {selectedEntity && (
                <EntityEditModal
                    entity={selectedEntity}
                    onClose={() => setSelectedEntity(null)}
                    onSave={handleSave}
                />
            )}
        </>
    );
}