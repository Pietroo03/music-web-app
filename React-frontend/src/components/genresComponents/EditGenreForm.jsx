export default function EditGenreForm({ handleSubmit, formData, handleChange }) {

    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Modifica Genere</h1>
                <form onSubmit={handleSubmit}>
                    <label className="block text-gray-700 mb-2" htmlFor="nome">
                        Nome
                    </label>
                    <input
                        id="nome"
                        name="nome"
                        type="text"
                        value={formData.nome}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Salva
                    </button>
                </form>
            </div>
        </div>
    );

}