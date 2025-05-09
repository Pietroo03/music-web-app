import { useState, useEffect } from "react";
import GenresCard from "../components/genresComponents/GenresCard";

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
        <GenresCard genres={genres} toggleModal={toggleModal} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} selectedGenre={selectedGenre} handleDelete={handleDelete} />
    );
}
