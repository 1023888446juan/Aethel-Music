export const API_URL = (
    import.meta.env.VITE_API_URL || "https://aethel-music-2.onrender.com"
).replace(/\/$/, "");

/**
 * Realiza peticiones al backend incluyendo el JWT guardado al iniciar sesión.
 * El token se conserva en localStorage para sobrevivir a recargas y navegación.
 */
export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("token");
    const headers = new Headers(options.headers || {});

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    if (
        options.body &&
        !(options.body instanceof FormData) &&
        !headers.has("Content-Type")
    ) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers
    });

    // Un token rechazado/expirado no debe dejar la interfaz en un falso estado autenticado.
    if (response.status === 401 && token && !path.includes("/api/auth/login")) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("usuario");
    }

    return response;
}

export async function obtenerUsuarios() {
    const response = await apiFetch("/usuarios/");

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
}
