export const API_URL = (
    import.meta.env.VITE_API_URL || "https://aethel-music-2.onrender.com"
).replace(/\/$/, "");

export async function obtenerUsuarios() {
    const response = await fetch(`${API_URL}/usuarios/`);

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
}
