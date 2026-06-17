const API_URL = "http://localhost:3001/api/libros";

export const getLibros = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error("Error al obtener libros");
    }
    return await response.json();
};
