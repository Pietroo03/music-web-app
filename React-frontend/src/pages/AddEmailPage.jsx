import { useState } from "react";
import { Link } from "react-router-dom";
import apiFetch from "../utils/apiFetch";

export default function AddEmailPage() {
    const apiUrl = `${import.meta.env.VITE_EXPRESS_API_SERVER}/auth/email-verification`;
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setMessage("");
        try {
            const response = await apiFetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Richiesta non riuscita.");
            setMessage(data.message);
        } catch (requestError) {
            setError(requestError.message || "Impossibile contattare il server.");
        }
    }

    return (
        <section className="mx-auto mt-12 w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
            <h1 className="mb-3 text-2xl font-bold">Aggiungi un'email di recupero</h1>
            <p className="mb-6 text-gray-600">Per gli account creati prima della verifica email, inserisci un indirizzo che possiedi.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block font-semibold" htmlFor="account-email">Email</label>
                <input id="account-email" type="email" autoComplete="email" required maxLength={254}
                    value={email} onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2" />
                {message && <p role="status" className="text-green-700">{message}</p>}
                {error && <p role="alert" className="text-red-600">{error}</p>}
                <button className="w-full rounded-xl bg-blue-600 py-2 text-white hover:bg-blue-700">
                    Invia link di verifica
                </button>
            </form>
            <Link className="mt-5 inline-block text-sm text-blue-600 hover:underline" to="/home">Torna alla home</Link>
        </section>
    );
}
