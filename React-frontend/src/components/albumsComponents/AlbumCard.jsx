import { Link } from "react-router-dom"

export default function AlbumCard({ albums, }) {

    return (

        <div className="min-h-screen bg-gray-100 py-15 flex justify-center">
            <div className="container max-w-6xl">
                <h1 className="text-5xl font-bold text-center mb-8">Album Collection</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-center">
                    {albums && albums.map((album) => (
                        <Link to={`/albums/${album.id}`} key={album.id} className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 h-full block">
                            <img
                                src={album.foto}
                                alt={album.nome}
                                className="w-full h-48 object-cover rounded-xl mb-4"
                            />
                            <h1 className="text-xl font-bold text-gray-600">{album.nome}</h1>
                            <p className="text-lg text-gray-600"><strong>Artista:</strong> {album.artista && album.artista.alias ? album.artista.alias : "Unknown Artist"}</p>
                            <p className="text-lg text-gray-600"><strong>Pubblicato il:</strong> {new Date(album.dataPubblicazione).toLocaleDateString()}</p>
                            <p className="text-lg text-gray-600"><strong>Tracce:</strong> {album.tracce}</p>

                            <p className="text-gray-500 text-xl mt-5 h-40 overflow-y-auto">
                                {album.descrizione}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>

    )

}