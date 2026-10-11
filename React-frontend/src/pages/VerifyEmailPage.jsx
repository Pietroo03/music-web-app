import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function VerifyEmailPage() {
    const apiUrl = `${import.meta.env.VITE_EXPRESS_API_SERVER}/auth/verify-email`;
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const started = useRef(false);
    const [message, setMessage] = useState("Verifica in corso...");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token || started.current) {
            if (!token) setError("Il link non contiene un token valido.");
            return;
        }
        started.current = true;

        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        })
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Link non valido o scaduto.");
                setMessage(data.message);
            })
            .catch((requestError) => setError(requestError.message || "Impossibile contattare il server."));
    }, [apiUrl, token]);

    return (
        <section className="mx-auto mt-12 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-md">
            <h1 className="mb-4 text-2xl font-bold">Verifica email</h1>
            {error ? <p role="alert" className="text-red-600">{error}</p> : <p role="status">{message}</p>}
            <Link className="mt-6 inline-block text-blue-600 hover:underline" to="/">Vai al login</Link>
        </section>
    );
}
