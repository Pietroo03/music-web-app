import { Link } from "react-router-dom"

export default function SingleAlbumCard({ album, userRole, toggleModal, isModalOpen, handleDelete, tracks, formatDuration }) {

    return (
        <div className="min-h-screen bg-gray-100 py-15 flex justify-center items-center">
            <div className="max-w-3xl w-full flex flex-col items-center">
                <div className="flex justify-around text-center mb-8 ">
                    <Link to="/albums" className="text-xl bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mr-4">
                        Torna agli Albums
                    </Link>

                    <Link to={`/artists/${album.artista?.id}`} className="text-xl bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mr-4" >
                        Vedi {album.artista?.alias || "Artista sconosciuto"}
                    </Link >


                    {userRole === 'ADMIN' && (
                        <>
                            <Link to={`/albums/edit/${album.id}`} className="text-xl bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300" >
                                Modifica Album
                            </Link >
                            <button
                                onClick={toggleModal}
                                className="text-xl bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ml-4 cursor-pointer"
                            >
                                Delete Album
                            </button>
                        </>
                    )}
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg w-full text-center">
                    <h1 className="text-3xl font-bold text-center mb-6">{album.nome}</h1>
                    <img
                        src={album.foto}
                        alt={album.nome}
                        className="w-full h-100 object-cover rounded-xl mb-6"
                    />
                    <div className="text-2xl text-gray-600 mb-4">
                        <p className="text-gray-600"><strong>Artista:</strong> {album.artista ? album.artista.alias : "Unknown Artist"}</p>
                        <p className="text-gray-600"><strong>Pubblicato il:</strong> {new Date(album.dataPubblicazione).toLocaleDateString()}</p>
                        <p className="text-gray-600"><strong>Tracce:</strong> {album.tracce}</p>
                        <p className="text-gray-600 mt-4"><strong>Descrizione:</strong> {album.descrizione}</p>
                        <p className="text-gray-600 mt-4"><strong>Generi:</strong>{' '}
                            {Array.isArray(album.generi)
                                ? album.generi.map((genere) => genere.nome).join(', ')
                                : 'Nessun genere disponibile'}
                        </p>

                    </div>

                    {tracks.map((track, index) => (
                        <li key={index} className="flex items-center space-x-4 text-2xl text-gray-600 mb-4">
                            <span><strong>{track.title}</strong></span>
                            <span>({formatDuration(track.duration)})</span>
                            {track.preview && (
                                <audio controls className="w-48">
                                    <source src={track.preview} type="audio/mpeg" />
                                    Il tuo browser non supporta l'elemento audio.
                                </audio>
                            )}
                        </li>
                    ))}



                </div>
            </div>

            {/* Modale di conferma */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl mb-4">Sei sicuro di voler eliminare questo album?</h2>
                        <div className="flex justify-between">
                            <button
                                onClick={toggleModal}
                                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                            >
                                Conferma
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}