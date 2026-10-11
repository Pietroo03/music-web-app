// AuthContext.jsx
import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./authContext";

export const AuthProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);

    const loadUserRole = useCallback(() => {
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
        loadUserRole();
    }, [loadUserRole]);

    return (
        <AuthContext.Provider value={{ userRole, loadUserRole, setUserRole }}>
            {children}
        </AuthContext.Provider>
    );
};
