import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditAlbumForm from '../components/albumsComponents/EditAlbumForm';

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

        <EditAlbumForm handleSubmit={handleSubmit} album={album} handleChange={handleChange} generi={generi} handleGenreChange={handleGenreChange} />

    );
}
