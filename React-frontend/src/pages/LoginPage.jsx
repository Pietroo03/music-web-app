import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"

export default function LoginPage() {
    const base_api_url = import.meta.env.VITE_EXPRESS_API_SERVER
    const login_api_url = base_api_url + '/auth/login'

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const { loadUserRole } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault()

        fetch(login_api_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Credenziali non valide")
                }
                return res.json()
            })
            .then(data => {
                // Verifica che il token sia presente nella risposta
                const token = data.token

                if (token) {
                    // Rimuove il prefisso 'Bearer ' dal token, se presente
                    const cleanToken = token.replace('Bearer ', '')

                    // Salvo il token nel localStorage
                    localStorage.setItem("token", cleanToken)
                    loadUserRole();

                    // Opzionale: puoi salvare anche il ruolo o username se vuoi
                    // localStorage.setItem("username", data.username)
                    // localStorage.setItem("roles", JSON.stringify(data.roles))

                    // Redirect dopo il login
                    navigate("/home")
                } else {
                    throw new Error("Token mancante nella risposta")
                }
            })
            .catch(err => {
                setError(err.message)
            })
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                        Accedi
                    </button>
                </form>
            </div>
        </div>
    )
}
