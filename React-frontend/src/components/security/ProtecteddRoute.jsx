import { Navigate } from "react-router-dom";

// Componente Route Guard
const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem("token");

    // Se non c'è il token, reindirizza alla pagina di login
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Decodifica il token per estrarre i ruoli
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
