import { useContext, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export default function ResetPasswordPage() {
    const apiUrl = `${import.meta.env.VITE_EXPRESS_API_SERVER}/auth/reset-password`;
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const { loadUserRole } = useContext(AuthContext);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setMessage("");
        if (!token) {
            setError("Il link non contiene un token valido.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Le password non coincidono.");
            return;
        }
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Link non valido o scaduto.");
            localStorage.removeItem("token");
            loadUserRole();
            setMessage(data.message);
        } catch (requestError) {
            setError(requestError.message || "Impossibile contattare il server.");
        }
    }

    return (
        <section className="mx-auto mt-12 w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
            <h1 className="mb-6 text-2xl font-bold">Imposta una nuova password</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block font-semibold" htmlFor="new-password">Nuova password</label>
                <input id="new-password" type="password" autoComplete="new-password" required minLength={6} maxLength={72}
                    value={password} onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2" />
                <label className="block font-semibold" htmlFor="confirm-password">Conferma password</label>
                <input id="confirm-password" type="password" autoComplete="new-password" required minLength={6} maxLength={72}
                    value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2" />
                {message && <p role="status" className="text-green-700">{message}</p>}
                {error && <p role="alert" className="text-red-600">{error}</p>}
                {!message && <button className="w-full rounded-xl bg-blue-600 py-2 text-white hover:bg-blue-700">Aggiorna password</button>}
            </form>
            {message && <Link className="mt-5 inline-block text-blue-600 hover:underline" to="/">Accedi</Link>}
        </section>
    );
}
