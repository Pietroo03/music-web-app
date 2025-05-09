import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateGenreForm from "../components/genresComponents/CreateGenreForm";

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
        <CreateGenreForm handleSubmit={handleSubmit} formData={formData} handleChange={handleChange} />
    );
}
