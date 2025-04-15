import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateArtistPage() {
    const [formData, setFormData] = useState({
        alias: "",
        foto: "",
        nome: "",
        cognome: "",
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
        <div className="container mx-auto mt-10 py-15 p-4">
            <h1 className="text-3xl font-bold text-center mb-8">Crea un Nuovo Artista</h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label htmlFor="alias" className="block text-2xl font-medium mb-2">Alias dell'artista</label>
                    <input
                        type="text"
                        id="alias"
                        name="alias"
                        value={formData.alias}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="foto" className="block text-2xl font-medium mb-2">Foto dell'artista</label>
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
                    <label htmlFor="nome" className="block text-2xl font-medium mb-2">Nome dell'artista</label>
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
                    <label htmlFor="cognome" className="block text-2xl font-medium mb-2">Cognome dell'artista</label>
                    <input
                        type="text"
                        id="cognome"
                        name="cognome"
                        value={formData.cognome}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="dataNascita" className="block text-2xl font-medium mb-2">Data di Nascita</label>
                    <input
                        type="date"
                        id="dataNascita"
                        name="dataNascita"
                        value={formData.dataNascita}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="etichetta" className="block text-2xl font-medium mb-2">Etichetta</label>
                    <input
                        type="text"
                        id="etichetta"
                        name="etichetta"
                        value={formData.etichetta}
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
                    Crea Artista
                </button>
            </form>
        </div>
    );
}
