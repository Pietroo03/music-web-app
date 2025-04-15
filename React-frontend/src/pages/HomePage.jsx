import { Link } from "react-router-dom"

export default function HomePage() {

    return (
        <>
            <div className="text-center">
                <h1 className="text-5xl font-bold text-center my-6">Benvenuto</h1>

                <div class="my-5 flex justify-center align-center">
                    <Link to="/albums" class="text-xl bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mr-4">Guarda gli Album</Link>
                    <Link to="/artists" class="text-xl bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mr-4">Guarda gli Artisti</Link>
                </div>
            </div>
        </>
    )
}