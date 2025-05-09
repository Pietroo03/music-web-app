import { Link } from "react-router-dom"

export default function SingleArtistcard({ artista, userRole, toggleModal, isModalOpen, handleDelete }) {

    return (

        <div className="min-h-screen bg-gray-100 py-15 flex justify-center items-center">
            <div className="max-w-3xl w-full flex flex-col items-center">
                <div className="flex text-center mb-8 ">
                    <Link to="/artists" className="text-xl bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mr-4">
                        Torna agli Artisti
                    </Link>

                    {userRole === 'ADMIN' && (
                        <>
                            <Link to={`/artists/edit/${artista.id}`} className="text-xl bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300" >
                                Modifica Artista
                            </Link >

                            <button
                                onClick={toggleModal}
                                className="text-xl bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ml-4 cursor-pointer"
                            >
                                Delete Artist
                            </button>

                        </>
                    )}
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg w-full text-center">
                    <h1 className="text-3xl font-bold text-center mb-6">{artista.alias}</h1>
                    <img
                        src={artista.foto}
                        alt={artista.nome}
                        className="w-full h-100 object-cover rounded-xl mb-6"
                    />
                    <div className="text-2xl text-gray-600 mb-4">
                        <p className="text-gray-600"><strong>Nome:</strong> {artista.nome} {artista.cognome}</p>
                        <p className="text-gray-600"><strong>Data di Nascita:</strong> {new Date(artista.dataNascita).toLocaleDateString()}</p>
                        <p className="text-gray-600"><strong>Etichetta:</strong> {artista.etichetta}</p>
                        <p className="text-gray-600 mt-4"><strong>Descrizione:</strong> {artista.descrizione}</p>
                        <p className="text-gray-600 mt-4"><strong>Generi:</strong> {artista.generi.map((genere) => genere.nome).join(', ')}</p>
                    </div>
                </div>

                {artista.albums && artista.albums.length > 0 && (
                    <div className="mt-12 w-full">
                        <h2 className="text-2xl font-bold text-center mb-6">Album di {artista.alias}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {artista.albums.map((album) => (
                                <Link to={`/albums/${album.id}`} key={album.id} className="bg-white p-3 rounded-2xl shadow-lg hover:shadow-2xl transition duration-200">
                                    <img
                                        src={album.foto}
                                        alt={album.nome}
                                        className="w-full h-48 object-cover rounded-xl mb-4"
                                    />
                                    <h3 className="text-lg font-semibold text-gray-700 text-center">{album.nome}</h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modale di conferma */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl mb-4">Sei sicuro di voler eliminare questo artista?</h2>
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

    )

}