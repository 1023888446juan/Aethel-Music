/* =========================================================
   1. IMPORTS, ESTADO Y EFECTOS
   ========================================================= */

import { useEffect, useRef, useState } from "react";

import "../styles/interfaces_navbar/albumes.css";

import List from "../components/List";

import Favoritos from "../components/albumes/favoritos";
import ListaDeAlbums from "../components/albumes/listadeAlbums";
import CrearAlbum from "../components/albumes/crearAlbum";

import albumTexture from "../assets/img/Albumes/Album.png";
import { useLibrary } from "../hooks/useLibrary";
import { api, loadTrackAudioUrl } from "../services/api";
import { addLocalFiles, addTracksToLocalPlaylist, getLocalPlaylistTrackIds } from "../services/localLibrary";

const STORAGE_KEYS = {
    colorMode: "aethel_color_mode",
    textSize: "aethel_text_size"
};

function Albumes() {
    const [colorMode, setColorMode] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.colorMode);
        return saved === "light" || saved === "dark" ? saved : "dark";
    });

    const [textSize, setTextSize] = useState(() => {
        const saved = Number(localStorage.getItem(STORAGE_KEYS.textSize));
        return saved >= 80 && saved <= 130 ? saved : 100;
    });

    const [albums, setAlbums] = useState([]);

    const [mostrarCrearAlbum, setMostrarCrearAlbum] =
        useState(false);

    const { songs, loadingSongs, libraryError, refreshSongs } = useLibrary();

    const [albumSeleccionado, setAlbumSeleccionado] =
        useState(null);

    const [mostrarFavoritos, setMostrarFavoritos] =
        useState(false);

    const fileInputRef = useRef(null);
    const contentRef = useRef(null);
    const libraryAudioRef = useRef(null);
    const localAudioUrlRef = useRef(null);
    const [playingTrackId, setPlayingTrackId] = useState(null);
    const [playlistRevision, setPlaylistRevision] = useState(0);

    const textScale = textSize / 100;
    const selectedPlaylistTrackIds = albumSeleccionado
        ? getLocalPlaylistTrackIds(albumSeleccionado.id)
        : [];

    useEffect(() => () => {
        if (localAudioUrlRef.current) URL.revokeObjectURL(localAudioUrlRef.current);
    }, []);

    useEffect(() => {
        const syncPreferences = () => {
            const attrTheme = document.documentElement.getAttribute("data-theme");
            const savedTheme = localStorage.getItem(STORAGE_KEYS.colorMode);
            const nextTheme =
                attrTheme === "light" || attrTheme === "dark"
                    ? attrTheme
                    : savedTheme === "light" || savedTheme === "dark"
                        ? savedTheme
                        : "dark";

            const cssScale = Number(
                getComputedStyle(document.documentElement).getPropertyValue("--cfg-text-scale")
            );
            const savedText = Number(localStorage.getItem(STORAGE_KEYS.textSize));

            setColorMode(nextTheme);

            if (!Number.isNaN(cssScale) && cssScale > 0) {
                setTextSize(Math.round(cssScale * 100));
            } else if (savedText >= 80 && savedText <= 130) {
                setTextSize(savedText);
            }
        };

        syncPreferences();

        const observer = new MutationObserver(syncPreferences);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme", "style"]
        });

        window.addEventListener("storage", syncPreferences);

        return () => {
            observer.disconnect();
            window.removeEventListener("storage", syncPreferences);
        };
    }, []);

    useEffect(() => {
        const obtenerAlbumes = async () => {
            try {
                const data = await api.playlists();

                const albumesFormateados = data.map(
                    (album) => ({
                        id: album.id_playlist,

                        name: album.nombre,

                        description: "Playlist personal",

                        songs: 0,

                        texture: albumTexture
                    })
                );

                setAlbums(
                    albumesFormateados
                );
            } catch (error) {
                console.error(
                    "Error conectando con el backend:",
                    error
                );
            }
        };

        obtenerAlbumes();
    }, []);

    /* =========================================================
       2. HANDLERS
       ========================================================= */

    const handleSelectAlbum = (album) => {
        setAlbumSeleccionado(
            album
        );
    };

    const handlePlayLibraryTrack = async (song) => {
        const audio = libraryAudioRef.current;
        if (!audio) return;
        if (playingTrackId === song.id && !audio.paused) {
            audio.pause();
            setPlayingTrackId(null);
            return;
        }
        try {
            audio.pause();
            if (localAudioUrlRef.current) {
                URL.revokeObjectURL(localAudioUrlRef.current);
                localAudioUrlRef.current = null;
            }
            const audioUrl = song.local
                ? URL.createObjectURL(song.file)
                : await loadTrackAudioUrl(song.id);
            if (song.local) localAudioUrlRef.current = audioUrl;
            audio.src = audioUrl;
            await audio.play();
            setPlayingTrackId(song.id);
        } catch (error) {
            alert(error.message || "No se pudo reproducir la canción.");
        }
    };

    const handleOpenFavorites = () => {
        setMostrarFavoritos(true);
    };

    const handleFavoritesContainerClick = (event) => {
        const openButton = event.target.closest(".open-album-button");
        if (openButton) {
            event.preventDefault();
            event.stopPropagation();
        }

        const favoriteCard = event.target.closest(".favorite-card");
        if (favoriteCard || contentRef.current?.contains(event.target)) {
            handleOpenFavorites();
        }
    };

    const handleUploadClick = () => {
        if (!albumSeleccionado) {
            alert(
                "Primero selecciona un álbum."
            );

            return;
        }

        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const files = event.target.files;
        if (!files?.length) {
            return;
        }

        if (!albumSeleccionado) {
            alert(
                "Primero selecciona un álbum."
            );

            event.target.value = "";

            return;
        }

        try {
            const importedTracks = await addLocalFiles(files);
            if (!importedTracks.length) {
                throw new Error("No se encontraron archivos de audio compatibles.");
            }
            addTracksToLocalPlaylist(
                albumSeleccionado.id,
                importedTracks.map((track) => track.id)
            );
            setPlaylistRevision((revision) => revision + 1);
            await refreshSongs();

            alert(`${importedTracks.length} canción(es) agregada(s) a ${albumSeleccionado.name}.`);

        } catch (error) {
            console.error("Error al agregar música local:", error);

            alert(error.message || "No se pudo guardar la música localmente.");
        } finally {
            event.target.value = "";
        }
    };

    const handleCreateAlbum = async (
        newAlbum
    ) => {
        try {
            const data = await api.createPlaylist(newAlbum.titulo_album);

            const albumCreado = {
                id:
                    data.id_playlist,

                name:
                    data.nombre,

                description:
                    "Playlist personal",

                songs:
                    0,

                texture:
                    newAlbum.texture ||
                    albumTexture
            };

            setAlbums(
                (previousAlbums) => [
                    ...previousAlbums,
                    albumCreado
                ]
            );

            setMostrarCrearAlbum(
                false
            );
        } catch (error) {
            console.error(
                "Error creando álbum:",
                error
            );

            alert(
                "No se pudo conectar con el servidor"
            );
        }
    };

    const handleDeleteAlbum = async (
        albumId
    ) => {
        try {
            await api.deletePlaylist(albumId);

            setAlbums(
                (previousAlbums) =>
                    previousAlbums.filter(
                        (album) =>
                            album.id !== albumId
                    )
            );

            if (
                albumSeleccionado?.id ===
                albumId
            ) {
                setAlbumSeleccionado(
                    null
                );
            }
        } catch (error) {
            console.error(
                "Error eliminando álbum:",
                error
            );

            alert(
                "No se pudo conectar con el servidor"
            );
        }
    };

    const handleAddSongToPlaylist = (song) => {
        if (!albumSeleccionado) return;
        addTracksToLocalPlaylist(albumSeleccionado.id, [song.id]);
        setPlaylistRevision((revision) => revision + 1);
    };

    const handleUpdateAlbum = async (updatedAlbum) => {
        await api.updatePlaylist(updatedAlbum.id, updatedAlbum.name);
        setAlbums(
            (previousAlbums) =>
                previousAlbums.map(
                    (album) =>
                        album.id ===
                        updatedAlbum.id
                            ? {
                                ...album,
                                ...updatedAlbum
                            }
                            : album
                )
        );
    };


    /* =========================================================
       3. RENDER PRINCIPAL
       ========================================================= */

    return (
        <div
            className="albumes-container"
            data-theme={colorMode}
            style={{ "--cfg-text-scale": textScale }}
        >

            {/* -----------------------------------------------------
                LISTA LATERAL
            ----------------------------------------------------- */}

            <List
                songs={songs}
                loading={loadingSongs}
                error={libraryError}
                onSongSelect={handlePlayLibraryTrack}
            />


            {/* -----------------------------------------------------
                CONTENIDO PRINCIPAL
            ----------------------------------------------------- */}

            <main
                className="albumes-main"
                data-theme={colorMode}
                style={{ "--cfg-text-scale": textScale }}
            >

                <div className="albumes-background"></div>

                <div
                    ref={contentRef}
                    className="albumes-content"
                >

                    {/* -------------------------------------------------
                        HEADER
                    ------------------------------------------------- */}

                    <div className="albumes-header">

                        <div>

                            <span className="albumes-subtitle">
                                TU BIBLIOTECA
                            </span>

                            <h1>
                                ÁLBUMES
                            </h1>

                            <p>
                                Organiza tu música en tus propias playlists.
                            </p>

                        </div>

                        <div className="albumes-header-buttons">

                            <button
                                type="button"
                                className="create-album-button"
                                onClick={() =>
                                    setMostrarCrearAlbum(true)
                                }
                            >

                                <span className="create-icon">
                                    +
                                </span>

                                <span>
                                    CREAR PLAYLIST
                                </span>

                            </button>

                            <button
                                type="button"
                                className="upload-music-button"
                                onClick={
                                    handleUploadClick
                                }
                            >

                                <span className="upload-icon">
                                    ↑
                                </span>

                                <span>
                                    AGREGAR MÚSICA LOCAL
                                </span>

                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="audio/*"
                                multiple
                                style={{
                                    display: "none"
                                }}
                                onChange={
                                    handleFileChange
                                }
                            />

                        </div>

                    </div>


                    {/* -------------------------------------------------
                        FAVORITAS
                    ------------------------------------------------- */}

                    <div
                        className="favorites-clickable-wrapper"
                        role="button"
                        tabIndex={0}
                        onClick={handleFavoritesContainerClick}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                handleOpenFavorites();
                            }
                        }}
                    >
                        <Favoritos
                            songs={songs}
                            onOpen={handleOpenFavorites}
                            onSelect={handleOpenFavorites}
                            isOpen={mostrarFavoritos}
                            onClose={() => setMostrarFavoritos(false)}
                        />
                    </div>


                    {/* -------------------------------------------------
                        LISTA DE ÁLBUMES
                    ------------------------------------------------- */}

                    <ListaDeAlbums
                        albums={
                            albums
                        }
                        onCreate={() =>
                            setMostrarCrearAlbum(
                                true
                            )
                        }
                        onDelete={
                            handleDeleteAlbum
                        }
                        onUpdate={
                            handleUpdateAlbum
                        }
                        onSelectAlbum={
                            handleSelectAlbum
                        }
                    />

                    {albumSeleccionado && (
                        <section className="selected-playlist-tracks">
                            <div className="section-title">
                                <div>
                                    <span className="section-label">LISTA SELECCIONADA</span>
                                    <h2>{albumSeleccionado.name}</h2>
                                </div>
                                <span className="folder-counter">Lista guardada en este navegador</span>
                            </div>
                            {songs.length ? (
                                <div className="selected-playlist-song-list" data-playlist-revision={playlistRevision}>
                                    {songs.map((song) => {
                                        const isInPlaylist = selectedPlaylistTrackIds.includes(song.id);
                                        return (
                                            <div className="selected-playlist-song-row" key={song.id}>
                                                <button type="button" className="selected-playlist-play" onClick={() => handlePlayLibraryTrack(song)}>
                                                    <span>{song.title}</span>
                                                    <small>{song.artist}</small>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="selected-playlist-add"
                                                    disabled={isInPlaylist}
                                                    onClick={() => handleAddSongToPlaylist(song)}
                                                >
                                                    {isInPlaylist ? "AGREGADA" : "+ AGREGAR"}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p>Aún no hay canciones en tu biblioteca. Agrega archivos desde el computador o una carpeta usando los controles de la lista.</p>
                            )}
                        </section>
                    )}

                </div>

            </main>


            {/* -----------------------------------------------------
                MODAL CREAR ÁLBUM
            ----------------------------------------------------- */}

            {mostrarCrearAlbum && (
                <CrearAlbum
                    onClose={() =>
                        setMostrarCrearAlbum(
                            false
                        )
                    }
                    onCreate={
                        handleCreateAlbum
                    }
                />
            )}

            <audio
                ref={libraryAudioRef}
                preload="none"
                onEnded={() => setPlayingTrackId(null)}
                onPause={() => setPlayingTrackId(null)}
            />

        </div>
    );
}

export default Albumes;

