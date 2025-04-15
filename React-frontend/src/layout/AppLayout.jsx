import { Outlet } from "react-router-dom";
import Header from "../components/layoutComponents/Header";
import Footer from "../components/layoutComponents/Footer";

export default function AppLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 bg-light">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
