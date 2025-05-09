import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import SingleAlbumCard from '../components/albumsComponents/SingleAlbumCard';

export default function SingleAlbumPage() {
    const base_api_url = import.meta.env.VITE_EXPRESS_API_SERVER;
    const albums_api_url = base_api_url + '/albums';
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const response = await fetch(`${albums_api_url}/${id}`);
                const data = await response.json();
                setAlbum(data);
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

    return (
        <SingleAlbumCard album={album} userRole={userRole} toggleModal={toggleModal} isModalOpen={isModalOpen} handleDelete={handleDelete} />
    );
}
