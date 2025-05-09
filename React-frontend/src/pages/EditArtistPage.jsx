import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditArtistForm from '../components/artistsComponents/EditArtistForm';

export default function EditArtistPage() {
    const { id } = useParams();
    const navigate = useNavigate(); // Usa useNavigate al posto di useHistory

    const base_api_url = import.meta.env.VITE_EXPRESS_API_SERVER;
    const artists_api_url = `${base_api_url}/artists`;
    const genres_api_url = `${base_api_url}/genres`;  // URL per ottenere i generi
    const [artist, setArtist] = useState(null);
    const [generi, setGeneri] = useState([]);  // Lista dei generi

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const response = await fetch(`${artists_api_url}/${id}`);
                const data = await response.json();
                setArtist(data);
            } catch (error) {
                console.error('Errore nel recuperare l\'artista:', error);
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

        fetchArtist();
        fetchGeneri();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setArtist((prevArtist) => ({
            ...prevArtist,
            [name]: value
        }));
    };

    const handleGenreChange = (e) => {
        const { value, checked } = e.target;
        const selectedGenre = generi.find((genere) => genere.id === parseInt(value));

        setArtist((prevArtist) => {
            let updatedGeneri;

            if (checked) {
                // Aggiungi il genere all'array se il checkbox è selezionato
                updatedGeneri = [...prevArtist.generi, selectedGenre];
            } else {
                // Rimuovi il genere se il checkbox è deselezionato
                updatedGeneri = prevArtist.generi.filter((genere) => genere.id !== selectedGenre.id);
            }

            return { ...prevArtist, generi: updatedGeneri };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepara l'oggetto per l'aggiornamento
        const updatedArtist = { ...artist };
        delete updatedArtist.albums; // Rimuove albums prima di inviare la richiesta

        try {
            const response = await fetch(`${artists_api_url}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedArtist),  // Invia l'intero oggetto con artisti e album
            });

            const responseBody = await response.json();
            console.log(responseBody);  // Logga la risposta del server

            if (response.ok) {
                console.log('Artista modificato');
                navigate(`/artists/${id}`); // Redirige alla pagina dell'artista dopo la modifica
            } else {
                console.error('Errore nella modifica dell\'artista', responseBody);
            }
        } catch (error) {
            console.error('Errore nella richiesta di modifica:', error);
        }
    };



    if (!artist || !generi.length) {
        return <div>Loading...</div>;
    }

    return (

        <EditArtistForm handleSubmit={handleSubmit} artist={artist} handleChange={handleChange} generi={generi} handleGenreChange={handleGenreChange} />

    );
}
