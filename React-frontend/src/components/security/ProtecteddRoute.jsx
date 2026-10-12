import { Navigate } from "react-router-dom";

// Evita di mostrare pagine riservate se manca il JWT o il ruolo non coincide con quello richiesto.
const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem("token");

    // Se non c'è il token, reindirizza alla pagina di login
    if (!token) {
        return <Navigate to="/login" />;
    }

    // La decodifica legge i claim del JWT; l'autorizzazione effettiva viene comunque verificata dal backend.
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    console.log(decodedToken);
    const userRole = decodedToken.roles && decodedToken.roles.length > 0 ? decodedToken.roles[0] : null;

    // Se l'utente non ha il ruolo richiesto, lo reindirizziamo alla home o altra pagina
    if (userRole !== requiredRole) {
        return <Navigate to="/home" />;
    }

    // Se ha il ruolo richiesto, mostra i figli (la pagina protetta)
    return children;
};

export default ProtectedRoute;
