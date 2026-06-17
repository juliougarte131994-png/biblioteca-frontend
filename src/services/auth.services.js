const API_URL = "http://localhost:3001/api/auth/login";

export const login = async (data) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Credenciales incorrectas");
    }

    return await response.json();
};