export default function CreateGenreForm({ handleSubmit, formData, handleChange }) {

    return (

        <div className="container mx-auto mt-10 py-15 p-4">
            <h1 className="text-3xl font-bold text-center mb-8">Crea un Nuovo Genere</h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label htmlFor="nome" className="block text-2xl font-medium mb-2">Nome del genere</label>
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

                <button type="submit" className="w-full bg-blue-500 text-xl text-white py-2 rounded-md hover:bg-blue-600">
                    Crea Genere
                </button>
            </form>
        </div>

    )

}