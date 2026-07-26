import './EntityEditModal.scss';
import { useState, useRef } from "react";

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

type Props = {
  entity: Entity;
  onClose: () => void;
  onSave: (data: UpdateEntity, image: File | null) => void;
};

export default function EntityEditModal({ entity, onClose, onSave }: Props) {

  const [form, setForm] = useState<UpdateEntity>({
    name: entity.name,
    birth_date: entity.birth_date,
    estimated_age: entity.estimated_age,
    species: entity.species,
    breed: entity.breed,
    description: entity.description,
    photo_url: entity.photo_url,
    allow_public_photo: entity.allow_public_photo,
    status: entity.status,
    exit_reason: entity.exit_reason
  });

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);

  const handleChange = <K extends keyof UpdateEntity>(
    field: K,
    value: UpdateEntity[K]
  ) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="entity-modal-overlay">
      <div className="entity-modal-container">

        <h3>Editar registro</h3>

        <input value={form.name || ""} onChange={(e) => handleChange("name", e.target.value)} placeholder="Nome" />

        <input type="date" value={form.birth_date?.slice(0, 10) || ""} onChange={(e) => handleChange("birth_date", e.target.value)} />

        <input type="number" value={form.estimated_age ?? ""} onChange={(e) => handleChange("estimated_age", Number(e.target.value))} placeholder="Idade estimada" />

        {entity.type === "animal" && (
          <>
            <input value={form.species || ""} onChange={(e) => handleChange("species", e.target.value)} placeholder="Espécie" />

            <input value={form.breed || ""} onChange={(e) => handleChange("breed", e.target.value)} placeholder="Raça" />
          </>
        )}

        <textarea value={form.description || ""} onChange={(e) => handleChange("description", e.target.value)} placeholder="Descrição" />

        <label className='check-container'><input type="checkbox" checked={form.allow_public_photo || false} onChange={(e) => handleChange("allow_public_photo", e.target.checked)} /> Permitir foto </label>

        {form.allow_public_photo && (
          <>
            <div className='photo-container'>
                {/* <img src={form.photo_url || "/icon/anonymousEntityIcon.png"} alt="preview" /> */}
                <img className={(image || form.photo_url) ? "entity-img" : "entity-no-img"} src={image ? URL.createObjectURL(image) : form.photo_url ? form.photo_url : "/icon/imgSubmitIcon.png"} alt="Pré-visualização do abrigo" onClick={() => inputFileRef.current?.click()} />
            </div>
            <input ref={inputFileRef} id="photo_url" name="photo_url" type="file" hidden accept="image/*" onChange={(e) => { if (e.target.files?.[0]) { setImage(e.target.files[0]); }}}/>
            {/* <input value={form.photo_url || ""} onChange={(e) => handleChange("photo_url", e.target.value)} placeholder="URL da imagem" /> */}
          </>
        )}

        <div className='status-container'>
            <label>Status: </label>
            <select
            value={form.status}
            onChange={(e) =>
                handleChange(
                "status",
                e.target.value as UpdateEntity["status"]
                )
            }>
                <option value="in_shelter">No abrigo</option>
                <option value="looking_for_family">Em busca</option>
                <option value="reunited">Reunido</option>
                <option value="released">Liberado</option>
            </select>
        </div>

        {(form.status === "reunited" || form.status === "released") && (
          <input
            value={form.exit_reason || ""}
            onChange={(e) => handleChange("exit_reason", e.target.value)}
            placeholder="Motivo da saída"
          />
        )}

        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={() => onSave(form, image)}>Salvar</button>
        </div>

      </div>
    </div>
  );
}