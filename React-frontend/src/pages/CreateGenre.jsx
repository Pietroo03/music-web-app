import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateGenrePage() {
    const [formData, setFormData] = useState({
        nome: "",
    });

    const navigate = useNavigate();
    const base_api_url = import.meta.env.VITE_EXPRESS_API_SERVER;
    const genresUrl = `${base_api_url}/genres`;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateFormData = () => {
        if (!formData.nome.trim()) {
            return "Il nome del genere è obbligatorio.";
        }
        return null; // Nessun errore
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const error = validateFormData();
        if (error) {
            alert(error);
            return;
        }

        try {
            const response = await fetch(genresUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to create genre");
            }

            const data = await response.json();
            console.log("Genre created successfully:", data);
            navigate(`/genres`);
        } catch (error) {
            console.error("Error creating genre:", error);
        }
    };

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
    );
}
