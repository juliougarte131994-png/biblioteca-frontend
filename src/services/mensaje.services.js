const API_URL = "http://localhost:3001/api/mensajes";

// 🔥 OBTENER MENSAJES
export const getMensajes = async (usuarioId) => {
    const response = await fetch(
        `${API_URL}?usuario_id=${usuarioId}`
    );

    if (!response.ok) {
        throw new Error("Error al obtener mensajes");
    }

    return await response.json();
};

// 🔥 ENVIAR MENSAJE
export const sendMensaje = async (data) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Error al enviar mensaje");
    }

    return await response.json();
};