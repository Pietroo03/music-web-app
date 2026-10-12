import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/layoutComponents/Header";
import Footer from "../components/layoutComponents/Footer";
import MusicBackground from "../components/layoutComponents/MusicBackground";

export default function AppLayout() {
    // La pagina di accesso usa un layout dedicato per centrare la scheda senza alterare le altre pagine.
    const { pathname } = useLocation();
    const isLoginPage = pathname === "/";

    return (
        <div className="app-shell relative isolate flex min-h-screen flex-col">
            <MusicBackground />
            <Header />

            {/* Outlet è il punto in cui React Router inserisce la pagina corrispondente all'URL. */}
            <main className={`relative z-10 flex-1 ${isLoginPage ? "flex flex-col" : ""}`}>
                <Outlet />
            </main>

            <div className="relative z-10"><Footer /></div>
        </div>
    );
}
