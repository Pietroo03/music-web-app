import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
    const base_api_url = import.meta.env.VITE_EXPRESS_API_SERVER
    const login_api_url = base_api_url + '/auth/login'
    const register_api_url = base_api_url + '/auth/register'

    const [isRegistering, setIsRegistering] = useState(false)

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isAdmin, setIsAdmin] = useState(false)
    const [secret, setSecret] = useState("")

    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const { loadUserRole } = useContext(AuthContext)

    const [showPassword, setShowPassword] = useState(false); // Stato per la visibilità della password
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Stato per la conferma della password

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const handleLogin = (e) => {
        e.preventDefault()

        fetch(login_api_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })
            .then(res => {
                if (!res.ok) {
                    // Se la risposta non è ok, leggi la risposta come JSON
                    return res.json().then(data => {
                        // Gestisci gli errori specifici per username e password
                        if (data.error === "Username non valido") {
                            throw new Error("Username non valido");
                        } else if (data.error === "Password errata") {
                            throw new Error("Password errata");
                        } else {
                            throw new Error("Credenziali non valide");
                        }
                    });
                }
                return res.json();  // Se la risposta è OK, prosegui come normale
            })

            .then(data => {
                const token = data.token?.replace('Bearer ', '');  // Estrai il token
                if (!token) throw new Error("Token mancante nella risposta");

                localStorage.setItem("token", token);  // Salva il token nel localStorage
                loadUserRole();  // Carica il ruolo dell'utente
                navigate("/home");  // Naviga alla pagina principale
            })
            .catch(err => {
                console.error("Login failed:", err);
                setError(err.message);  // Mostra il messaggio di errore
            });
    }

    const handleRegister = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError("Le password non coincidono")
            return
        }

        if (isAdmin && secret !== 'pescePalla1501') { // Cambia con la tua parola segreta
            setError("La parola segreta non è corretta");
            return;
        }

        const userData = { username, password };
        if (isAdmin) {
            userData.adminKey = secret;  // Aggiungi la parola segreta solo se èAdmin
        }

        console.log(userData);

        fetch(register_api_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        })
            .then(res => {
                if (!res.ok) throw new Error("Registrazione fallita")
                return res.json()
            })
            .then((data) => {

                if (data.token) {
                    localStorage.setItem("token", data.token); // Salva il token nel localStorage
                }

                setIsRegistering(false)
                setUsername("")
                setPassword("")
                setConfirmPassword("")
                setIsAdmin(false)
                setSecret("")
                setError(null)
                loadUserRole();
                navigate("/home")

            })
            .catch(err => setError(err.message))
    }





    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">{isRegistering ? "Registrati" : "Login"}</h2>

                <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"} // Modifica il tipo dell'input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Icona per l'occhio */}
                            </button>
                        </div>
                    </div>

                    {isRegistering && (
                        <>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Conferma Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"} // Modifica il tipo dell'input
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />} {/* Icona per l'occhio */}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Sei un admin?</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdmin(true)}
                                        className={`px-4 py-1 rounded-xl border ${isAdmin ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                                    >
                                        Sì
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAdmin(false)
                                            setSecret("")
                                        }}
                                        className={`px-4 py-1 rounded-xl border ${!isAdmin ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>

                            {isAdmin && (
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Parola segreta</label>
                                    <input
                                        type="text"
                                        value={secret}
                                        onChange={(e) => setSecret(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className={`w-full ${isRegistering ? "bg-green-600" : "bg-blue-600"} text-white py-2 rounded-xl hover:opacity-90 transition`}
                    >
                        {isRegistering ? "Registrati" : "Accedi"}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <button
                        onClick={() => {
                            setIsRegistering(!isRegistering)
                            setError(null)
                        }}
                        className="text-blue-600 hover:underline"
                    >
                        {isRegistering ? "Hai già un account? Accedi" : "Non hai un account? Registrati"}
                    </button>
                </div>
            </div>
        </div>
    )
}
