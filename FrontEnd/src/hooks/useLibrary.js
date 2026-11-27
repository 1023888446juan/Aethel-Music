import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import { getLocalTracks, subscribeToLocalLibrary } from "../services/localLibrary";

export function useLibrary() {
    const [songs, setSongs] = useState([]);
    const [loadingSongs, setLoadingSongs] = useState(true);
    const [libraryError, setLibraryError] = useState("");

    const refreshSongs = useCallback(async () => {
        setLoadingSongs(true);
        const [localResult, remoteResult] = await Promise.allSettled([
            getLocalTracks(),
            api.tracks()
        ]);
        const localSongs = localResult.status === "fulfilled"
            ? localResult.value.map((track) => ({ ...track, genre: "Todas", local: true }))
            : [];
        const remoteSongs = remoteResult.status === "fulfilled"
            ? remoteResult.value.map((track) => ({
                id: track.id_pista,
                title: track.titulo,
                artist: track.artista || "Artista desconocido",
                genre: "Todas",
                duration: Number(track.duracion) || 0,
                format: track.formato,
                path: track.ruta_archivo,
                audioUrl: ""
            }))
            : [];

        setSongs([...localSongs, ...remoteSongs]);
        setLibraryError(remoteResult.status === "rejected"
            ? remoteResult.reason?.message || "No se pudo cargar la biblioteca del servidor."
            : localResult.status === "rejected"
                ? localResult.reason?.message || "No se pudo cargar la biblioteca local."
                : "");
        setLoadingSongs(false);
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeToLocalLibrary(refreshSongs);
        const timer = window.setTimeout(refreshSongs, 0);
        return () => {
            window.clearTimeout(timer);
            unsubscribe();
        };
    }, [refreshSongs]);

    return { songs, loadingSongs, libraryError, refreshSongs };
}
