// La home verifica la presenza di una sessione JWT e propone i collegamenti alle raccolte principali.
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Usa questa se il modulo espone 'jwtDecode' come una funzione nominata


export default function HomePage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                jwtDecode(token); // Verifica che il token sia valido
            } catch (error) {
                console.error("Errore nel decodificare il token:", error);
            }
        } else {
            // Se non c'è token, fai il redirect alla pagina di login
            navigate('/');
        }
    }, [navigate]);

    return (
        <>
            <div className="text-center">
                <h1 className="text-5xl font-bold text-center my-6">Benvenuto</h1>

                <div className="my-5 flex justify-center align-center">
                    <Link
                        to="/albums"
                        className="text-xl bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mr-4"
                    >
                        Guarda gli Album
                    </Link>
                    <Link
                        to="/artists"
                        className="text-xl bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mr-4"
                    >
                        Guarda gli Artisti
                    </Link>
                </div>
            </div>
        </>
    );
}
