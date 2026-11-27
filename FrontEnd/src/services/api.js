const DEFAULT_API_URL = import.meta.env.DEV
    ? "http://127.0.0.1:8000"
    : "https://aethel-music-2.onrender.com";

export const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, "");
const audioUrls = new Map();

async function request(path, options = {}) {
    const headers = new Headers(options.headers || {});
    const token = localStorage.getItem("aethel_access_token") || localStorage.getItem("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
    let response;
    try { response = await fetch(`${API_URL}${path}`, { ...options, headers }); }
    catch { throw new Error("No se pudo conectar con la API."); }
    const text = await response.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!response.ok) {
        const detail = data?.detail;
        const message = Array.isArray(detail) ? detail.map((item) => item.msg).join(". ") : detail;
        throw new Error(message || `Error HTTP ${response.status}`);
    }
    return data;
}

const json = (method, body) => ({ method, body: JSON.stringify(body) });

export const api = {
    register: (payload) => request("/api/usuarios/registro", json("POST", payload)),
    login: async (correo, password) => {
        const result = await request("/api/auth/login", json("POST", { correo, password }));
        localStorage.setItem("aethel_access_token", result.access_token);
        localStorage.setItem("token", result.access_token);
        localStorage.setItem("usuario", JSON.stringify(result.usuario));
        return result;
    },
    tracks: () => request("/api/pistas/"),
    profile: () => request("/api/usuarios/perfil"),
    uploadProfilePhoto: (file) => {
        const form = new FormData();
        form.append("archivo", file);
        return request("/api/usuarios/perfil/foto", { method: "POST", body: form });
    },
    playlists: () => request("/api/playlists/"),
    createPlaylist: (nombre) => request("/api/playlists/", json("POST", { nombre })),
    updatePlaylist: (id, nombre) => request(`/api/playlists/${id}`, json("PUT", { nombre })),
    deletePlaylist: (id) => request(`/api/playlists/${id}`, { method: "DELETE" }),
    importTrack: (file) => {
        const form = new FormData(); form.append("archivo", file);
        return request("/api/pistas/importar", { method: "POST", body: form });
    },
    addPlaylistTrack: (playlistId, trackId) => request(`/api/playlists/${playlistId}/pistas`, json("POST", { fk_id_pista: trackId }))
};

export async function loadProfilePhotoUrl() {
    const token = localStorage.getItem("aethel_access_token") || localStorage.getItem("token");
    if (!token) throw new Error("Inicia sesión para cargar tu foto de perfil.");
    let response;
    try {
        response = await fetch(`${API_URL}/api/usuarios/perfil/foto`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch {
        throw new Error("No se pudo conectar con la API.");
    }
    if (!response.ok) {
        let message = `No se pudo cargar la foto (${response.status}).`;
        try { message = (await response.json()).detail || message; } catch { /* Respuesta sin JSON */ }
        throw new Error(message);
    }
    return URL.createObjectURL(await response.blob());
}

export async function loadTrackAudioUrl(trackId) {
    const id = String(trackId);
    if (audioUrls.has(id)) return audioUrls.get(id);
    const token = localStorage.getItem("aethel_access_token") || localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    let response;
    try { response = await fetch(`${API_URL}/api/pistas/${encodeURIComponent(id)}/audio`, { headers }); }
    catch { throw new Error("No se pudo conectar con el servidor de audio."); }
    if (!response.ok) {
        let message = `No se pudo cargar el audio (${response.status}).`;
        try { message = (await response.json()).detail || message; } catch { /* Respuesta sin JSON */ }
        throw new Error(message);
    }
    const url = URL.createObjectURL(await response.blob());
    audioUrls.set(id, url);
    return url;
}

export async function obtenerUsuarios() {
    return request("/api/usuarios/perfil");
}
