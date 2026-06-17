const API_URL = "https://biblioteca-backend-eb0w.onrender.com/api/prestamos";

// 🔥 GET
export const getPrestamos = async () => {
    const user = JSON.parse(localStorage.getItem("usuarioLogueado"));

    // 🔥 SI NO HAY USUARIO → NO HACER REQUEST
    if (!user) {
        console.warn("No hay usuario logueado");
        return [];
    }

    const response = await fetch(
        `${API_URL}?usuario_id=${user.id}&rol=${user.rol}`
    );

    if (!response.ok) {
        throw new Error("Error al obtener préstamos");
    }

    return await response.json();
};

// 🔥 POST (ESTO TE FALTA)
export const createPrestamo = async (data) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Error al crear préstamo");
    }

    return await response.json();
};