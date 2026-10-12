// Questa pagina avvia la cancellazione con password e poi conferma l operazione tramite token email.
import { useContext, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import apiFetch from "../utils/apiFetch";

const apiBaseUrl = `${import.meta.env.VITE_EXPRESS_API_SERVER}/auth`;

export default function AccountDeletionPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isDeleted, setIsDeleted] = useState(false);
    const { loadUserRole } = useContext(AuthContext);

    // Primo passaggio: conferma l'identità con la password e richiede via API un link email di cancellazione.
    async function handleRequest(event) {
        event.preventDefault();
        setError("");
        setMessage("");
        try {
            const response = await apiFetch(`${apiBaseUrl}/account-deletion-request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Richiesta non riuscita.");
            setPassword("");
            setMessage(data.message);
        } catch (requestError) {
            setError(requestError.message || "Impossibile contattare il server.");
        }
    }

    // Secondo passaggio: il link porta un token monouso; se valido, rimuove sessione e ruolo locale.
    async function handleConfirm() {
        setError("");
        try {
            const response = await fetch(`${apiBaseUrl}/account-deletion-confirm`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Link non valido o scaduto.");
            localStorage.removeItem("token");
            loadUserRole();
            setIsDeleted(true);
        } catch (requestError) {
            setError(requestError.message || "Impossibile contattare il server.");
        }
    }

    if (isDeleted) {
        return (
            <section className="mx-auto mt-12 w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
                <h1 className="mb-3 text-2xl font-bold">Account eliminato</h1>
                <p role="status" className="mb-6 text-gray-700">L'account è stato eliminato e la sessione è terminata.</p>
                <Link className="text-blue-600 hover:underline" to="/">Torna alla pagina di accesso</Link>
            </section>
        );
    }

    if (token) {
        return (
            <section className="mx-auto mt-12 w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 shadow-md">
                <h1 className="mb-3 text-2xl font-bold text-red-800">Conferma eliminazione account</h1>
                <p className="mb-6 text-gray-700">
                    L'eliminazione è definitiva. Il link scade dopo 15 minuti. Conferma solo se hai richiesto tu questa operazione.
                </p>
                {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}
                <button onClick={handleConfirm} className="w-full rounded-xl bg-red-700 py-2 font-semibold text-white hover:bg-red-800">
                    Elimina definitivamente l'account
                </button>
                <Link className="mt-5 inline-block text-sm text-blue-600 hover:underline" to="/home">Annulla</Link>
            </section>
        );
    }

    return (
        <section className="mx-auto mt-12 w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 shadow-md">
            <h1 className="mb-3 text-2xl font-bold text-red-800">Elimina il tuo account</h1>
            <p className="mb-6 text-gray-700">
                Per proteggere il tuo account, inserisci la password attuale. Ti invieremo un link all'indirizzo email verificato; l'account verrà eliminato solo dopo la conferma dal link.
            </p>
            <form onSubmit={handleRequest} className="space-y-4">
                <label className="block font-semibold" htmlFor="delete-account-password">Password attuale</label>
                <input id="delete-account-password" type="password" autoComplete="current-password" required
                    value={password} onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2" />
                {message && <p role="status" className="text-green-700">{message}</p>}
                {error && <p role="alert" className="text-red-600">{error}</p>}
                <button className="w-full rounded-xl bg-red-700 py-2 font-semibold text-white hover:bg-red-800">
                    Invia link di conferma
                </button>
            </form>
            <Link className="mt-5 inline-block text-sm text-blue-600 hover:underline" to="/home">Torna alla home</Link>
        </section>
    );
}
