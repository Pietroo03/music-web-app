/** Sends the current local-storage JWT with requests to protected API endpoints. */
export default function apiFetch(input, init = {}) {
    const headers = new Headers(init.headers);
    const token = localStorage.getItem("token");

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(input, { ...init, headers });
}
