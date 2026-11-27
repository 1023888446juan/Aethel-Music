const DATABASE_NAME = "aethel-local-library";
const STORE_NAME = "tracks";
const CHANGE_EVENT = "aethel-local-library-changed";

function openDatabase() {
    return new Promise((resolve, reject) => {
        if (!globalThis.indexedDB) {
            reject(new Error("Este navegador no permite guardar una biblioteca local."));
            return;
        }

        const request = indexedDB.open(DATABASE_NAME, 1);
        request.onupgradeneeded = () => {
            if (!request.result.objectStoreNames.contains(STORE_NAME)) {
                request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function addLocalFiles(fileList) {
    const files = Array.from(fileList || []).filter((file) =>
        file.type.startsWith("audio/") || /\.(mp3|wav|ogg|oga|m4a|aac|flac|opus|aiff|aif|wma)$/i.test(file.name)
    );
    if (!files.length) return [];

    const tracks = files.map((file) => ({
        id: `local:${crypto.randomUUID()}`,
        title: file.name.replace(/\.[^.]+$/, ""),
        artist: "Archivo local",
        genre: "Todas",
        duration: 0,
        format: file.name.split(".").pop()?.toUpperCase() || "AUDIO",
        path: file.webkitRelativePath || file.name,
        local: true,
        file
    }));
    const database = await openDatabase();
    await new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, "readwrite");
        tracks.forEach((track) => transaction.objectStore(STORE_NAME).put(track));
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
    }).finally(() => database.close());
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return tracks.map(({ id, title, artist, path }) => ({ id, title, artist, path }));
}

export async function getLocalTracks() {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, "readonly");
        const request = transaction.objectStore(STORE_NAME).getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        transaction.oncomplete = () => database.close();
    });
}

export function subscribeToLocalLibrary(callback) {
    window.addEventListener(CHANGE_EVENT, callback);
    return () => window.removeEventListener(CHANGE_EVENT, callback);
}

const playlistKey = (id) => `aethel_local_playlist_${id}`;

export function getLocalPlaylistTrackIds(playlistId) {
    try {
        return JSON.parse(localStorage.getItem(playlistKey(playlistId)) || "[]");
    } catch {
        return [];
    }
}

export function addTracksToLocalPlaylist(playlistId, trackIds) {
    localStorage.setItem(playlistKey(playlistId), JSON.stringify([
        ...new Set([...getLocalPlaylistTrackIds(playlistId), ...trackIds])
    ]));
}
