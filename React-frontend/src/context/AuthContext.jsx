// AuthProvider conserva in un unico punto il ruolo ricavato dal JWT e lo rende disponibile alle pagine.
import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./authContext";

export const AuthProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);

    const loadUserRole = useCallback(() => {
        // Il token è la sessione corrente; se manca o non è decodificabile l'utente non ha un ruolo attivo.
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserRole(decoded.roles?.[0] ?? null);
            } catch {
                setUserRole(null);
            }
        } else {
            setUserRole(null);
        }
    }, []);

    useEffect(() => {
        // Rilegge il token quando l'app viene caricata, così lo stato React corrisponde alla sessione salvata.
        loadUserRole();
    }, [loadUserRole]);

    return (
        <AuthContext.Provider value={{ userRole, loadUserRole, setUserRole }}>
            {children}
        </AuthContext.Provider>
    );
};
