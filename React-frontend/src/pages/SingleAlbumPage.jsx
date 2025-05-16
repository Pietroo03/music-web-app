import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import SingleAlbumCard from '../components/albumsComponents/SingleAlbumCard';

export default function SingleAlbumPage() {
    const base_api_url = import.meta.env.VITE_EXPRESS_API_SERVER;
    const albums_api_url = base_api_url + '/albums';
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const response = await fetch(`${albums_api_url}/${id}`);
                const data = await response.json();
                setAlbum(data.album);
            } catch (error) {
                console.error("Errore nel recuperare l'album:", error);
            }
        };

        fetchAlbum();
    }, [id]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Se hai incluso i ruoli come array
                const role = decoded.roles ? decoded.roles[0] : null;
                setUserRole(role);
            } catch (error) {
                console.error("Errore nel decodificare il token:", error);
            }
        }
    }, []);


    useEffect(() => {
        // Funzione per chiamare il backend e prendere dati + tracce da Deezer
        async function fetchTracks() {
            try {
                // Supponiamo che il backend esponga l'endpoint /api/albums/{id} che restituisce Album + tracce Deezer
                const response = await fetch(`http://localhost:8080/api/albums/${id}`);
                if (!response.ok) {
                    throw new Error("Errore nel recupero dati album + tracce");
                }
                const data = await response.json();
                console.log("Data backend:", data);
                // data dovrebbe avere una struttura tipo { album: {...}, tracks: [...] }
                setTracks(data.tracks || []);
            } catch (error) {
                console.error("Errore fetching tracce Deezer:", error);
            }
        }

        fetchTracks();
    }, [id]);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`${albums_api_url}/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                console.log('Album eliminato');

                window.location.href = '/albums';
            } else {
                console.error('Errore nell\'eliminare l\'album');
            }
        } catch (error) {
            console.error('Errore nella richiesta di eliminazione:', error);
        }
        setIsModalOpen(false);
    };

    if (!album) {
        return <div>Loading...</div>;
    }

    function formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }


    return (
        <SingleAlbumCard album={album} userRole={userRole} toggleModal={toggleModal} isModalOpen={isModalOpen} handleDelete={handleDelete} tracks={tracks} formatDuration={formatDuration} />
    );
}
