import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
        <div className="container mx-auto mt-10 py-15 p-4">
            <h1 className="text-3xl font-bold text-center mb-8">Crea un Nuovo Album</h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label htmlFor="foto" className="block text-2xl font-medium mb-2">Foto dell'album</label>
                    <input
                        type="text"
                        id="foto"
                        name="foto"
                        value={formData.foto}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="nome" className="block text-2xl font-medium mb-2">Nome dell'album</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="dataPubblicazione" className="block text-2xl font-medium mb-2">Data di pubblicazione</label>
                    <input
                        type="date"
                        id="dataPubblicazione"
                        name="dataPubblicazione"
                        value={formData.dataPubblicazione}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="tracce" className="block text-2xl font-medium mb-2">Numero di tracce</label>
                    <input
                        type="number"
                        id="tracce"
                        name="tracce"
                        value={formData.tracce}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="descrizione" className="block text-2xl font-medium mb-2">Descrizione</label>
                    <textarea
                        id="descrizione"
                        name="descrizione"
                        value={formData.descrizione}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="artistaId" className="block text-2xl font-medium mb-2">Seleziona l'artista</label>
                    <select
                        id="artistaId"
                        name="artistaId"
                        value={formData.artistaId}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    >
                        <option value="">-- seleziona --</option>
                        {Array.isArray(artisti) && artisti.map((artista) => (
                            <option key={artista.id} value={artista.id}>
                                {artista.alias}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-2xl font-medium mb-2">Seleziona i generi</label>
                    {loading ? (
                        <p>Caricamento generi...</p>
                    ) : (
                        <div className="flex flex-wrap space-x-5">
                            {Array.isArray(generi) && generi.length > 0 ? (
                                generi.map((genre) => (
                                    <div key={genre.id} className="flex items-center mb-4">
                                        <input
                                            type="checkbox"
                                            id={`genre-${genre.id}`}
                                            value={genre.id}
                                            onChange={handleGeneriChange}
                                            className="mr-3 h-5 w-5"
                                        />
                                        <label htmlFor={`genre-${genre.id}`} className="text-xl">{genre.nome}</label>
                                    </div>
                                ))
                            ) : (
                                <p>Nessun genere disponibile</p>
                            )}
                        </div>
                    )}
                </div>

                <button type="submit" className="w-full bg-blue-500 text-xl text-white py-2 rounded-md hover:bg-blue-600">
                    Crea Album
                </button>
            </form>
        </div>
    );
}
