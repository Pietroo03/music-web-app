import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from '../../context/AuthContext';

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate()
    const { userRole, setUserRole } = useContext(AuthContext);

    const handleLogout = () => {
        // Rimuovi il token dal localStorage
        localStorage.removeItem("token");

        setUserRole(null);

        // Reindirizza l'utente alla pagina di login
        navigate("/");
    };

    return (
        <header className="flex justify-between items-center p-8 bg-gray-800 text-white sticky top-0 right-0 left-0 z-10">

            {location.pathname.startsWith('/albums') ? (
                <Link to="/albums">
                    <h1 className="text-3xl font-bold">Albums & Artists Collection</h1>
                </Link>
            ) : location.pathname.startsWith('/artists') ? (
                <Link to="/artists">
                    <h1 className="text-3xl font-bold">Albums & Artists Collection</h1>
                </Link>
            ) : location.pathname.startsWith('/genres') ? (
                <Link to="/genres">
                    <h1 className="text-3xl font-bold">Albums & Artists Collection</h1>
                </Link>
            ) : (
                <h1 className="text-3xl font-bold">Albums & Artists Collection</h1>
            )}



            <div className="flex gap-4">

                {location.pathname === '/albums' && (
                    <>
                        <Link
                            to="/artists"
                            className="text-lg bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Vedi Artisti
                        </Link>

                        {userRole === 'ADMIN' && (
                            <>
                                <Link
                                    to="/genres"
                                    className="text-lg bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ml-4"
                                >
                                    Vedi Generi
                                </Link>
                                <Link
                                    to="/albums/create"
                                    className="text-lg bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 ml-4"
                                >
                                    Crea Album
                                </Link>
                            </>
                        )}
                    </>
                )}

                {location.pathname === '/artists' && (
                    <>
                        <Link
                            to="/albums"
                            className="text-lg bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Vedi Albums
                        </Link>
                        {userRole === 'ADMIN' && (
                            <>
                                <Link
                                    to="/genres"
                                    className="text-lg bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ml-4"
                                >
                                    Vedi Generi
                                </Link>
                                <Link
                                    to="/artists/create"
                                    className="text-lg bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 ml-4"
                                >
                                    Crea Artista
                                </Link>
                            </>
                        )}
                    </>
                )}

                {location.pathname === '/genres' && userRole === 'ADMIN' && (
                    <>
                        <Link
                            to="/albums"
                            className="text-lg bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Vedi Albums
                        </Link>
                        <Link
                            to="/artists"
                            className="text-lg bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Vedi Artisti
                        </Link>
                        <Link
                            to="/genres/create"
                            className="text-lg bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
                        >
                            Crea Genere
                        </Link>
                    </>
                )}

                {userRole && (
                    <button
                        onClick={handleLogout}
                        className="text-lg bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300 cursor-pointer ml-4"
                    >
                        Logout
                    </button>
                )}

            </div>
        </header>
    );
}
