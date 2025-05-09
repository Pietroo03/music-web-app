import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import SingleArtistcard from '../components/artistsComponents/SingleArtistCard';

export default function SingleArtistPage() {
    const base_api_url = import.meta.env.VITE_EXPRESS_API_SERVER;
    const artists_api_url = base_api_url + '/artists';
    const { id } = useParams();
    const [artista, setArtista] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const response = await fetch(`${artists_api_url}/${id}`);
                const data = await response.json();
                setArtista(data);
            } catch (error) {
                console.error("Errore nel recuperare l'artista:", error);
            }
        };

        fetchArtist();
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

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`${artists_api_url}/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                console.log('Artista eliminato');

                window.location.href = '/artists';
            } else {
                console.error('Errore nell\'eliminare l\'artista');
            }
        } catch (error) {
            console.error('Errore nella richiesta di eliminazione:', error);
        }
        setIsModalOpen(false);
    };

    if (!artista) {
        return <div>Loading...</div>;
    }

    return (

        <SingleArtistcard artista={artista} userRole={userRole} toggleModal={toggleModal} isModalOpen={isModalOpen} handleDelete={handleDelete} />

    );
}
