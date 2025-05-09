export default function CreateAlbumForm({ formData, handleChange, artisti, generi, loading, handleGeneriChange, handleSubmit }) {

    return (

        <div className="container mx-auto mt-10 py-15 p-4">
            <h1 className="text-3xl font-bold text-center mb-8">Crea un Nuovo Album</h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label htmlFor="foto" className="block text-2xl font-medium mb-2">Foto dell'album</label>
                    <input
                        type="text"
                        id="foto"
                        name="foto"
                        value={formData.foto}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="nome" className="block text-2xl font-medium mb-2">Nome dell'album</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="dataPubblicazione" className="block text-2xl font-medium mb-2">Data di pubblicazione</label>
                    <input
                        type="date"
                        id="dataPubblicazione"
                        name="dataPubblicazione"
                        value={formData.dataPubblicazione}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="tracce" className="block text-2xl font-medium mb-2">Numero di tracce</label>
                    <input
                        type="number"
                        id="tracce"
                        name="tracce"
                        value={formData.tracce}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="descrizione" className="block text-2xl font-medium mb-2">Descrizione</label>
                    <textarea
                        id="descrizione"
                        name="descrizione"
                        value={formData.descrizione}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="artistaId" className="block text-2xl font-medium mb-2">Seleziona l'artista</label>
                    <select
                        id="artistaId"
                        name="artistaId"
                        value={formData.artistaId}
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
                    <label className="block text-2xl font-medium mb-2">Seleziona i generi</label>
                    {loading ? (
                        <p>Caricamento generi...</p>
                    ) : (
                        <div className="flex flex-wrap space-x-5">
                            {Array.isArray(generi) && generi.length > 0 ? (
                                generi.map((genre) => (
                                    <div key={genre.id} className="flex items-center mb-4">
                                        <input
                                            type="checkbox"
                                            id={`genre-${genre.id}`}
                                            value={genre.id}
                                            onChange={handleGeneriChange}
                                            className="mr-3 h-5 w-5"
                                        />
                                        <label htmlFor={`genre-${genre.id}`} className="text-xl">{genre.nome}</label>
                                    </div>
                                ))
                            ) : (
                                <p>Nessun genere disponibile</p>
                            )}
                        </div>
                    )}
                </div>

                <button type="submit" className="w-full bg-blue-500 text-xl text-white py-2 rounded-md hover:bg-blue-600">
                    Crea Album
                </button>
            </form>
        </div>

    )
}