// Aggiunge l'autorizzazione alle chiamate API se esiste un token, lasciando invariati URL e opzioni fetch.
export default function apiFetch(input, init = {}) {
    const headers = new Headers(init.headers);
    const token = localStorage.getItem("token");

    // Le API pubbliche accettano comunque la richiesta; quelle protette usano questo header per identificare l'utente.
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(input, { ...init, headers });
}
