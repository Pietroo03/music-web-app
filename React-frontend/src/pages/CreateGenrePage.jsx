import apiFetch from "../utils/apiFetch";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditGenrePage() {
    const [formData, setFormData] = useState({ nome: "" });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    const base_api_url = import.meta.env.VITE_EXPRESS_API_SERVER;
    const genreUrl = `${base_api_url}/genres/${id}`;

    // Carica i dati del genere al montaggio
    useEffect(() => {
        apiFetch(genreUrl)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Errore nel caricamento del genere");
                }
                return res.json();
            })
            .then((data) => {
                setFormData({ nome: data.nome });
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Errore:", err);
                setIsLoading(false);
            });
    }, [genreUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateFormData = () => {
        if (!formData.nome.trim()) {
            return "Il nome del genere è obbligatorio.";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const error = validateFormData();
        if (error) {
            alert(error);
            return;
        }

        try {
            const response = await apiFetch(genreUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Errore nella modifica del genere");
            }

            const data = await response.json();
            console.log("Genere modificato:", data);
            navigate("/genres");
        } catch (err) {
            console.error("Errore durante l'aggiornamento:", err);
        }
    };

    if (isLoading) {
        return <p>Caricamento in corso...</p>;
    }

    return (
        <div className="container mt-4">
            <h2>Modifica Genere</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nome" className="form-label">Nome del genere</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Salva modifiche</button>
            </form>
        </div>
    );
}
