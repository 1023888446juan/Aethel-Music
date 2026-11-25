const API_URL = "http://127.0.0.1:8000";

export async function obtenerUsuarios() {
    const response = await fetch(`${API_URL}/usuarios/`);

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
}