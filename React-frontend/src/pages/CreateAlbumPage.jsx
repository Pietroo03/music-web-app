import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateAlbumForm from "../components/albumsComponents/CreateAlbumForm";

export default function CreateAlbumPage() {
    const [formData, setFormData] = useState({
        foto: "",
        nome: "",
        dataPubblicazione: "",
        tracce: "",
        descrizione: "",
        artistaId: "",
        generi: [],
    });
    const [generi, setGeneri] = useState([]);
    const [artisti, setArtisti] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const base_api_url = import.meta.env.VITE_EXPRESS_API_SERVER;
    const genresUrl = `${base_api_url}/genres`;
    const artistsUrl = `${base_api_url}/artists`;

    useEffect(() => {
        const fetchGeneri = async () => {
            try {
                const response = await fetch(genresUrl);
                const data = await response.json();
                setGeneri(data);
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };

        const fetchArtisti = async () => {
            try {
                const response = await fetch(artistsUrl);
                const data = await response.json();
                setArtisti(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching artists:", error);
                setLoading(false);
            }
        };

        fetchGeneri();
        fetchArtisti();
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
        if (!formData.nome.trim()) {
            return "Il nome dell'album è obbligatorio.";
        }
        if (!formData.dataPubblicazione) {
            return "La data di pubblicazione è obbligatoria.";
        }
        if (!formData.artistaId) {
            return "Devi selezionare un artista.";
        }
        if (formData.tracce <= 0 || isNaN(formData.tracce)) {
            return "Il numero di tracce deve essere un numero positivo.";
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

        // Formatta correttamente i generi e l'artista per la richiesta API
        const formattedData = {
            ...formData,
            tracce: parseInt(formData.tracce, 10),
            artista: { id: parseInt(formData.artistaId, 10) }, // Artista come oggetto con ID
            generi: formData.generi.map(id => ({ id })) // Generi come array di oggetti con ID
        };

        try {
            const response = await fetch(`${base_api_url}/albums`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                throw new Error("Failed to create album");
            }

            const data = await response.json();
            console.log("Album created successfully:", data);
            navigate(`/albums/${data.id}`);
        } catch (error) {
            console.error("Error creating album:", error);
        }
    };


    return (
        <CreateAlbumForm formData={formData} handleChange={handleChange} artisti={artisti} generi={generi} loading={loading} handleGeneriChange={handleGeneriChange} handleSubmit={handleSubmit} />
    );
}
