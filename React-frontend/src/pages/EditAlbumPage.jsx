import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditAlbumPage() {
    const { id } = useParams();
    const navigate = useNavigate(); // Usa useNavigate al posto di useHistory

    const base_api_url = import.meta.env.VITE_EXPRESS_API_SERVER;
    const albums_api_url = `${base_api_url}/albums`;
    const genres_api_url = `${base_api_url}/genres`;
    const [album, setAlbum] = useState(null);
    const [generi, setGeneri] = useState([]);

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const response = await fetch(`${albums_api_url}/${id}`);
                const data = await response.json();
                setAlbum(data);
            } catch (error) {
                console.error('Errore nel recuperare l\'album:', error);
            }
        };

        const fetchGeneri = async () => {
            try {
                const response = await fetch(genres_api_url);
                const data = await response.json();
                setGeneri(data);
            } catch (error) {
                console.error('Errore nel recuperare i generi:', error);
            }
        };

        fetchAlbum();
        fetchGeneri();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAlbum((prevAlbum) => ({
            ...prevAlbum,
            [name]: value
        }));
    };

    const handleGenreChange = (e) => {
        const { value, checked } = e.target;
        const selectedGenre = generi.find((genere) => genere.id === parseInt(value));  // Trova il genere corrispondente

        setAlbum((prevAlbum) => {
            let updatedGeneri;

            if (checked) {
                // Aggiungi il genere all'array se il checkbox è selezionato
                updatedGeneri = [...prevAlbum.generi, selectedGenre];
            } else {
                // Rimuovi il genere se il checkbox è deselezionato
                updatedGeneri = prevAlbum.generi.filter((genere) => genere.id !== selectedGenre.id);
            }

            return { ...prevAlbum, generi: updatedGeneri };  // Restituisci l'album aggiornato
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${albums_api_url}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(album),
            });

            if (response.ok) {
                console.log('Album modificato');
                navigate(`/albums/${id}`); // Redirige alla pagina dell'album dopo la modifica
            } else {
                console.error('Errore nella modifica dell\'album');
            }
        } catch (error) {
            console.error('Errore nella richiesta di modifica:', error);
        }
    };

    if (!album || !generi.length) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-15 flex justify-center items-center">
            <div className="max-w-3xl w-full flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-6">Modifica Album</h1>
                <form onSubmit={handleSubmit} className="w-full bg-white p-8 rounded-2xl shadow-lg">
                    <div className="mb-4">
                        <label className="block text-gray-600 text-2xl" htmlFor="nome">Nome Album</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={album.nome}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-2xl" htmlFor="dataPubblicazione">Data di Pubblicazione</label>
                        <input
                            type="date"
                            id="dataPubblicazione"
                            name="dataPubblicazione"
                            value={album.dataPubblicazione}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-2xl" htmlFor="descrizione">Descrizione</label>
                        <textarea
                            id="descrizione"
                            name="descrizione"
                            value={album.descrizione}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-2xl">Generi</label>
                        <div className="flex flex-wrap space-x-5">
                            {generi.map((genere) => (
                                <div key={genere.id} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id={`genre-${genere.id}`}
                                        value={genere.id}
                                        checked={album.generi.some((g) => g.id === genere.id)}  // Verifica se il genere è già selezionato
                                        onChange={handleGenreChange}  // Gestisce la modifica dei checkbox
                                        className="mr-2 h-5 w-5"
                                    />
                                    <label htmlFor={`genre-${genere.id}`} className="text-gray-600">{genere.nome}</label>
                                </div>
                            ))}

                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Salva Modifiche
                    </button>
                </form>
            </div>
        </div>
    );
}
