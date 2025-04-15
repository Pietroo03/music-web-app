import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function SingleAlbumPage() {
    const base_api_url = import.meta.env.VITE_EXPRESS_API_SERVER;
    const albums_api_url = base_api_url + '/albums';
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    /* const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    }; */

    /* const handleDelete = async () => {
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
    }; */

    if (!album) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-15 flex justify-center items-center">
            <div className="max-w-3xl w-full flex flex-col items-center">
                <div className="flex justify-around text-center mb-8 ">
                    <Link to="/albums" className="text-xl bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mr-4">
                        Torna agli Albums
                    </Link>

                    <Link to={`/artists/${album.artista.id}`} className="text-xl bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mr-4" >
                        Vedi {album.artista.alias}
                    </Link >

                    {/* <Link to={`/albums/edit/${album.id}`} className="text-xl bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300" >
                        Modifica Album
                    </Link > */}

                    {/* <button
                        onClick={toggleModal}
                        className="text-xl bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ml-4 cursor-pointer"
                    >
                        Delete Album
                    </button> */}
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg w-full text-center">
                    <h1 className="text-3xl font-bold text-center mb-6">{album.nome}</h1>
                    <img
                        src={album.foto}
                        alt={album.nome}
                        className="w-full h-100 object-cover rounded-xl mb-6"
                    />
                    <div className="text-2xl text-gray-600 mb-4">
                        <p className="text-gray-600"><strong>Artista:</strong> {album.artista ? album.artista.alias : "Unknown Artist"}</p>
                        <p className="text-gray-600"><strong>Pubblicato il:</strong> {new Date(album.dataPubblicazione).toLocaleDateString()}</p>
                        <p className="text-gray-600"><strong>Tracce:</strong> {album.tracce}</p>
                        <p className="text-gray-600 mt-4"><strong>Descrizione:</strong> {album.descrizione}</p>
                        <p className="text-gray-600 mt-4"><strong>Generi:</strong> {album.generi.map((genere) => genere.nome).join(', ')}</p>
                    </div>
                </div>
            </div>

            {/* Modale di conferma */}
            {/* {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl mb-4">Sei sicuro di voler eliminare questo album?</h2>
                        <div className="flex justify-between">
                            <button
                                onClick={toggleModal}
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
            )} */}
        </div>
    );
}
