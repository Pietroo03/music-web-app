export default function EditAlbumForm({ handleSubmit, album, handleChange, generi, handleGenreChange, artisti }) {

    return (

        <div className="min-h-screen bg-gray-100 py-15 flex justify-center items-center">
            <div className="max-w-3xl w-full flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-6">Modifica Album</h1>
                <form onSubmit={handleSubmit} className="w-full bg-white p-8 rounded-2xl shadow-lg">
                    <div className="mb-4">
                        <label htmlFor="foto" className="block text-2xl font-medium mb-2">Foto dell'album</label>
                        <input
                            type="text"
                            id="foto"
                            name="foto"
                            value={album.foto}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block  text-2xl" htmlFor="nome">Nome Album</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={album.nome}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="link" className="block text-2xl font-medium mb-2">Link Spotify</label>
                        <input
                            type="text"
                            id="link"
                            name="link"
                            value={album.link}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block  text-2xl" htmlFor="dataPubblicazione">Data di Pubblicazione</label>
                        <input
                            type="date"
                            id="dataPubblicazione"
                            name="dataPubblicazione"
                            value={album.dataPubblicazione}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="tracce" className="block text-2xl font-medium mb-2">Numero di tracce</label>
                        <input
                            type="number"
                            id="tracce"
                            name="tracce"
                            value={album.tracce}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block  text-2xl" htmlFor="descrizione">Descrizione</label>
                        <textarea
                            id="descrizione"
                            name="descrizione"
                            value={album.descrizione}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="artistaId" className="block text-2xl font-medium mb-2">Seleziona l'artista</label>
                        <select
                            id="artistaId"
                            name="artistaId"
                            value={album.artistaId}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            required
                        >
                            <option value="">-- seleziona --</option>
                            {Array.isArray(artisti) && artisti.map((artista) => (
                                <option key={artista.id} value={artista.id}>
                                    {artista.alias}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block  text-2xl">Generi</label>
                        <div className="flex flex-wrap space-x-5">
                            {generi.map((genere) => (
                                <div key={genere.id} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id={`genre-${genere.id}`}
                                        value={genere.id}
                                        checked={album.generi?.some((g) => g.id === genere.id) || false}  // Verifica se il genere è già selezionato
                                        onChange={handleGenreChange}  // Gestisce la modifica dei checkbox
                                        className="mr-2 h-5 w-5"
                                    />
                                    <label htmlFor={`genre-${genere.id}`} className="">{genere.nome}</label>
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