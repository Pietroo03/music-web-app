import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function RegisterPage() {
    const base_api_url = import.meta.env.VITE_EXPRESS_API_SERVER
    const register_api_url = base_api_url + '/auth/register'

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isAdmin, setIsAdmin] = useState(false)
    const [secret, setSecret] = useState("")
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError("Le password non coincidono")
            return
        }

        const userData = {
            username,
            password
        }

        if (isAdmin) {
            userData.secret = secret
        }

        fetch(register_api_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Registrazione fallita")
                }
                return res.json()
            })
            .then(() => {
                navigate("/login")
            })
            .catch(err => {
                setError(err.message)
            })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Registrati</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Conferma Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                        />
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
                                    setSecret("") // Reset campo segreto
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
                                required={isAdmin}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                            />
                        </div>
                    )}

                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
                    >
                        Registrati
                    </button>
                </form>
            </div>
        </div>
    )
}
