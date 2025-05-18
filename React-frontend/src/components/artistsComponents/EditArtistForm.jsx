export default function EditArtistForm({ handleSubmit, artist, handleChange, generi, handleGenreChange }) {

    return (

        <div className="min-h-screen bg-gray-100 py-15 flex justify-center items-center">
            <div className="max-w-3xl w-full flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-6">Modifica Artista</h1>
                <form onSubmit={handleSubmit} className="w-full bg-white p-8 rounded-2xl shadow-lg">
                    <div className="mb-4">
                        <label className="block text-gray-600 text-2xl" htmlFor="nome">Nome</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={artist.nome}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-2xl" htmlFor="cognome">Cognome</label>
                        <input
                            type="text"
                            id="cognome"
                            name="cognome"
                            value={artist.cognome}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-2xl" htmlFor="alias">Alias</label>
                        <input
                            type="text"
                            id="alias"
                            name="alias"
                            value={artist.alias}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-2xl" htmlFor="link">Link Spotify</label>
                        <input
                            type="text"
                            id="link"
                            name="link"
                            value={artist.link}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-2xl" htmlFor="dataNascita">Data di Nascita</label>
                        <input
                            type="date"
                            id="dataNascita"
                            name="dataNascita"
                            value={artist.dataNascita}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-2xl" htmlFor="etichetta">Etichetta</label>
                        <input
                            type="text"
                            id="etichetta"
                            name="etichetta"
                            value={artist.etichetta}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-2xl" htmlFor="foto">Foto (URL)</label>
                        <input
                            type="text"
                            id="foto"
                            name="foto"
                            value={artist.foto}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-2xl" htmlFor="descrizione">Descrizione</label>
                        <textarea
                            id="descrizione"
                            name="descrizione"
                            value={artist.descrizione}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-2xl">Generi</label>
                        <div className="flex flex-wrap space-x-5">
                            {generi.map((genere) => (
                                <div key={genere.id} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id={`genre-${genere.id}`}
                                        value={genere.id}
                                        checked={artist.generi.some((g) => g.id === genere.id)}  // Verifica se il genere è già selezionato
                                        onChange={handleGenreChange}  // Gestisce la modifica dei checkbox
                                        className="mr-2 h-6 w-6"
                                    />
                                    <label htmlFor={`genre-${genere.id}`} className="text-gray-600">{genere.nome}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Salva Modifiche
                    </button>
                </form>
            </div>
        </div>

    )

}