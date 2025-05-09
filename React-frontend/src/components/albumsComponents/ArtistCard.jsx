import { Link } from "react-router-dom"

export default function ArtistCard({ artists }) {

    return (

        <div className="min-h-screen bg-gray-100 py-15 flex justify-center">
            <div className="container max-w-6xl">
                <h1 className="text-5xl font-bold text-center mb-8">Artist Collection</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {artists && artists.map((artist) => (
                        <Link to={`/artists/${artist.id}`} key={artist.id} className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 h-full block text-center">
                            <img
                                src={artist.foto}
                                alt={artist.alias}
                                className="w-full h-48 object-cover rounded-xl mb-4"
                            />
                            <h2 className="text-xl font-bold text-gray-600">{artist.alias}</h2>
                            <p className="text-lg text-gray-600"><strong>Nome:</strong> {artist.nome} {artist.cognome}</p>
                            <p className="text-lg text-gray-600"><strong>Data di Nascita:</strong> {new Date(artist.dataNascita).toLocaleDateString()}</p>
                            <p className="text-lg text-gray-600"><strong>Etichetta:</strong> {artist.etichetta}</p>

                            <p className="text-gray-500 text-xl mt-5 h-40 overflow-y-auto">
                                {artist.descrizione}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>

    )
}