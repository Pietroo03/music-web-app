import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateArtistForm from "../components/artistsComponents/CreateArtistForm";

export default function CreateArtistPage() {
    const [formData, setFormData] = useState({
        alias: "",
        foto: "",
        nome: "",
        cognome: "",
        link: "",
        dataNascita: "",
        etichetta: "",
        descrizione: "",
        generi: [],
    });
    const [generi, setGeneri] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const base_api_url = import.meta.env.VITE_EXPRESS_API_SERVER;
    const genresUrl = `${base_api_url}/genres`; // Aggiungi la rotta per recuperare i generi

    // Recupera i generi dal DB
    useEffect(() => {
        const fetchGeneri = async () => {
            try {
                const response = await fetch(genresUrl);
                const data = await response.json();
                setGeneri(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching genres:", error);
                setLoading(false);
            }
        };

        fetchGeneri();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleGeneriChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevState) => {
            let updatedGeneri = [...prevState.generi];
            if (checked) {
                updatedGeneri.push(parseInt(value, 10));
            } else {
                updatedGeneri = updatedGeneri.filter((id) => id !== parseInt(value, 10));
            }
            return { ...prevState, generi: updatedGeneri };
        });
    };

    const validateFormData = () => {
        if (!formData.alias.trim()) {
            return "L'alias dell'artista è obbligatorio.";
        }
        if (!formData.nome.trim()) {
            return "Il nome dell'artista è obbligatorio.";
        }
        if (!formData.cognome.trim()) {
            return "Il cognome dell'artista è obbligatorio.";
        }
        if (!formData.dataNascita) {
            return "La data di nascita è obbligatoria.";
        }
        if (!formData.etichetta.trim()) {
            return "L'etichetta è obbligatoria.";
        }
        return null; // Nessun errore
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const error = validateFormData();
        if (error) {
            alert(error);
            return;
        }

        // Formatta correttamente i generi per la richiesta API
        const formattedData = {
            ...formData,
            generi: formData.generi.map(id => ({ id })) // Generi come array di oggetti con ID
        };

        try {
            const response = await fetch(`${base_api_url}/artists`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                throw new Error("Failed to create artist");
            }

            const data = await response.json();
            console.log("Artist created successfully:", data);
            navigate(`/artists/${data.id}`);
        } catch (error) {
            console.error("Error creating artist:", error);
        }
    };

    return (
        <CreateArtistForm handleSubmit={handleSubmit} formData={formData} handleChange={handleChange} loading={loading} generi={generi} handleGeneriChange={handleGeneriChange} />
    );
}
