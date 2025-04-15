import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function GenresPage() {
    const base_api_url = import.meta.env.VITE_EXPRESS_API_SERVER;
    const genres_api_url = base_api_url + "/genres";
    const [genres, setGenres] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState(null);

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        try {
            const res = await fetch(genres_api_url);
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const data = await res.json();
            setGenres(data);
        } catch (err) {
            console.error("Errore nel recuperare i generi:", err);
        }
    };

    const toggleModal = (genre) => {
        setSelectedGenre(genre);
        setIsModalOpen(!isModalOpen);
    };

    const handleDelete = async () => {
        if (!selectedGenre) return;

        try {
            const res = await fetch(`${genres_api_url}/${selectedGenre.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setGenres(genres.filter((g) => g.id !== selectedGenre.id));
                console.log("Genere eliminato");
            } else {
                console.error("Errore nell'eliminare il genere");
            }
        } catch (err) {
            console.error("Errore nella richiesta di eliminazione:", err);
        }

        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-15 flex justify-center">
            <div className="container max-w-6xl">
                <h1 className="text-5xl font-bold text-center mb-8">Generi Musicali</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {genres.map((genre) => (
                        <div key={genre.id} className="flex items-center justify-between border p-3 rounded-lg shadow-md bg-white">
                            <h1 className="text-lg font-semibold text-gray-600">{genre.nome}</h1>
                            <div className="flex gap-2">
                                <Link
                                    to={`/genres/${genre.id}`}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
                                >
                                    Edita
                                </Link>
                                <button
                                    onClick={() => toggleModal(genre)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer"
                                >
                                    Elimina
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modale di conferma */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl mb-4">
                            Sei sicuro di voler eliminare il genere "{selectedGenre?.nome}"?
                        </h2>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                            >
                                Conferma
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
