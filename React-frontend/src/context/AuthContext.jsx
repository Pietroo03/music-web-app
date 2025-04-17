// AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);

    const loadUserRole = () => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            const role = decoded.roles ? decoded.roles[0] : null;
            setUserRole(role);
        } else {
            setUserRole(null);
        }
    };

    useEffect(() => {
        loadUserRole();
    }, []);

    return (
        <AuthContext.Provider value={{ userRole, loadUserRole, setUserRole }}>
            {children}
        </AuthContext.Provider>
    );
};
