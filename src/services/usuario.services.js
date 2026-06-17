const API_URL = "http://localhost:3001/api/usuarios";

export const createUsuario = async (data) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Error al crear usuario");
    }

    return await response.json();
};

// 🔥 OBTENER USUARIOS
export const getUsuarios = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Error al obtener usuarios");
    }

    return await response.json();
};

// 🔥 INHABILITAR USUARIO
export const inhabilitarUsuario = async (id) => {
    const response = await fetch(`${API_URL}/inhabilitar/${id}`, {
        method: "PUT"
    });

    if (!response.ok) {
        throw new Error("Error al inhabilitar usuario");
    }
};

// 🔥 HABILITAR USUARIO
export const habilitarUsuario = async (id) => {
    const response = await fetch(`${API_URL}/habilitar/${id}`, {
        method: "PUT"
    });

    if (!response.ok) {
        throw new Error("Error al habilitar usuario");
    }
};