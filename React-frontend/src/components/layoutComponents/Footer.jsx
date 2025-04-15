export default function Footer() {
    return (
        <footer className="flex justify-between items-center p-8 bg-gray-800 text-white">
            <p className="text-lg">&copy; {new Date().getFullYear()} Album Collection - Tutti i diritti riservati</p>
            <nav className="flex gap-4 mt-2 sm:mt-0">
                <a href="https://www.linkedin.com/in/pietro-ponte-333829348/" className="text-lg bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Linkedin</a>
                <a href="https://pietroponte.com/" className="text-lg bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">MyPortfolio</a>
            </nav>
        </footer>
    );
}
