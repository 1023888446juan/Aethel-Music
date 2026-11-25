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

    const [songs, setSongs] = useState([]);

    const [albumSeleccionado, setAlbumSeleccionado] =
        useState(null);

    const [mostrarFavoritos, setMostrarFavoritos] =
        useState(false);

    const fileInputRef = useRef(null);
    const contentRef = useRef(null);

    const textScale = textSize / 100;

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
                const response = await fetch(
                    "http://127.0.0.1:8000/albumes/"
                );

                const data = await response.json();

                if (!response.ok) {
                    console.error(
                        "Error obteniendo álbumes:",
                        data
                    );

                    return;
                }

                const albumesFormateados = data.map(
                    (album) => ({
                        id: album.id_album,

                        name: album.titulo_album,

                        description:
                            album.descripcion_album ||
                            "Sin descripción",

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

    useEffect(() => {
        const obtenerCanciones = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/pistas/"
                );

                const data = await response.json();

                if (!response.ok) {
                    console.error(
                        "Error obteniendo canciones:",
                        data
                    );

                    return;
                }

                const cancionesFormateadas = data.map(
                    (pista) => ({
                        id: pista.id_pista,

                        title: pista.titulo_pista,

                        artist:
                            pista.artista ||
                            "Artista desconocido",

                        genre: "Todas",

                        albumId:
                            pista.fk_id_album,

                        duration:
                            pista.duracion_pista,

                        format:
                            pista.formato_pista,

                        path:
                            pista.ruta_pista
                    })
                );

                setSongs(
                    cancionesFormateadas
                );
            } catch (error) {
                console.error(
                    "Error obteniendo canciones:",
                    error
                );
            }
        };

        obtenerCanciones();
    }, []);


    /* =========================================================
       2. HANDLERS
       ========================================================= */

    const handleSelectAlbum = (album) => {
        setAlbumSeleccionado(
            album
        );
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
        const archivo =
            event.target.files[0];

        if (!archivo) {
            return;
        }

        if (!albumSeleccionado) {
            alert(
                "Primero selecciona un álbum."
            );

            event.target.value = "";

            return;
        }

        const formData =
            new FormData();

        formData.append(
            "archivo",
            archivo
        );

        formData.append(
            "id_album",
            albumSeleccionado.id
        );

        try {
            const response =
                await fetch(
                    "http://127.0.0.1:8000/pistas/upload",
                    {
                        method: "POST",
                        body: formData
                    }
                );

            const data =
                await response.json();

            console.log(
                "Respuesta del servidor:",
                data
            );

            if (!response.ok) {
                alert(
                    data.detail ||
                    "No se pudo subir la canción"
                );

                return;
            }

            alert(
                "Canción subida correctamente"
            );

            const nuevaCancion = {
                id:
                    data.id_pista,

                title:
                    data.titulo,

                artist:
                    data.artista ||
                    "Artista desconocido",

                genre:
                    "Todas",

                albumId:
                    data.id_album,

                duration:
                    data.duracion,

                format:
                    data.formato,

                path:
                    data.ruta
            };

            setSongs(
                (previousSongs) => [
                    ...previousSongs,
                    nuevaCancion
                ]
            );
        } catch (error) {
            console.error(
                "Error al subir la canción:",
                error
            );

            alert(
                "No se pudo conectar con el servidor"
            );
        } finally {
            event.target.value = "";
        }
    };

    const handleCreateAlbum = async (
        newAlbum
    ) => {
        try {
            const response =
                await fetch(
                    "http://127.0.0.1:8000/albumes/",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            titulo_album:
                                newAlbum.titulo_album,

                            descripcion_album:
                                newAlbum.descripcion_album,

                            fecha_lanzamiento:
                                newAlbum.fecha_lanzamiento
                        })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                alert(
                    data.detail ||
                    "No se pudo crear el álbum"
                );

                return;
            }

            const albumCreado = {
                id:
                    data.id_album,

                name:
                    data.titulo_album,

                description:
                    data.descripcion_album ||
                    "Sin descripción",

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
            const response =
                await fetch(
                    `http://127.0.0.1:8000/albumes/${albumId}`,
                    {
                        method: "DELETE"
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                alert(
                    data.detail ||
                    "No se pudo eliminar el álbum"
                );

                return;
            }

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

    const handleUpdateAlbum = (
        updatedAlbum
    ) => {
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
                                    SUBIR MÚSICA
                                </span>

                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".mp3,.wav,.aiff,.m4a,.opus"
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

        </div>
    );
}

export default Albumes;