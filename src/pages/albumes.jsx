import { useRef, useState, useEffect } from "react";
import "../styles/interfaces_navbar/albumes.css";

// =========================================
// ICONOS DEL REPRODUCTOR
// =========================================

import playIcon from "../assets/img/reproductor_icons/play.png";
import pausaIcon from "../assets/img/reproductor_icons/pausa.png";
import atras15Icon from "../assets/img/reproductor_icons/atras15.png";
import atrasIcon from "../assets/img/reproductor_icons/atras.png";
import repetirIcon from "../assets/img/reproductor_icons/repetir.png";
import adelante15Icon from "../assets/img/reproductor_icons/adelante15.png";
import adelanteIcon from "../assets/img/reproductor_icons/adelante.png";
import favoritosIcon from "../assets/img/reproductor_icons/favoritos.png";

// =========================================
// TEXTURAS DE ÁLBUMES
// =========================================

import albumTexture from "../assets/img/Albumes/Album.png";
import favoritasTexture from "../assets/img/Albumes/Favoritas.png";


function Albumes() {

    // =========================================
    // CANCIONES
    // =========================================

    const [songs, setSongs] = useState([]);


    // =========================================
    // ÁLBUMES / CARPETAS
    // =========================================

    const [albums] = useState([
        {
            id: 1,
            name: "Mis canciones",
            description: "Mi colección personal",
            songs: 12,
            texture: albumTexture
        },
        {
            id: 2,
            name: "Trap favorito",
            description: "Mis canciones de Trap",
            songs: 8,
            texture: albumTexture
        },
        {
            id: 3,
            name: "Para entrenar",
            description: "Música para ponerse serio",
            songs: 15,
            texture: albumTexture
        }
    ]);


    // =========================================
    // ESTADOS
    // =========================================

    const [selectedSong, setSelectedSong] = useState(null);

    const [isPlaying, setIsPlaying] = useState(false);

    const fileInputRef = useRef(null);


    // =========================================
    // GÉNEROS
    // =========================================

    const genres = [
        "Todas"
    ];


    // =========================================
    // SELECCIONAR CANCIÓN
    // =========================================

    const handleSongClick = (song) => {
        setSelectedSong(song);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const cargarPistas = async () => {

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/pistas/"
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(data);
                return;
            }

            const canciones = data.map((pista) => ({
                id: pista.id_pista,
                title: pista.titulo_pista,
                artist: pista.artista || "Artista desconocido",
                album: pista.album || "Álbum desconocido",
                genre: "Todas",
                duration: pista.duracion_pista,
                format: pista.formato_pista,
                path: pista.ruta_pista
            }));

            setSongs(canciones);

            if (canciones.length > 0) {
                setSelectedSong((actual) => actual || canciones[0]);
            }

        } catch (error) {

            console.error(
                "No se pudieron cargar las pistas:",
                error
            );

        }
    };

    const handleFileChange = async (event) => {

        const archivo = event.target.files[0];

        if (!archivo) {
            return;
        }

        const formData = new FormData();

        formData.append("archivo", archivo);

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/pistas/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.detail || "No se pudo subir la canción");
                return;
            }

            alert("Canción subida correctamente");

            await cargarPistas();

        } catch (error) {

            console.error(error);

            alert("No se pudo conectar con el servidor");

        }

        event.target.value = "";
    };

    useEffect(() => {
        cargarPistas();
    }, []);


    // =========================================
    // INTERFAZ
    // =========================================

    return (

        <div className="albumes-container">


            {/* =====================================
                SIDEBAR DE MÚSICA
                ===================================== */}

            <aside className="playlist-side">

                <div className="playlist-background-glow"></div>

                <div className="playlist-content">


                    {/* HEADER */}

                    <div className="playlist-header">

                        <div>

                            <span className="playlist-subtitle">
                                AETHEL MUSIC
                            </span>

                            <h1>
                                MÚSICA
                            </h1>

                        </div>

                        <span className="sort-text">
                            Orden ↕
                        </span>

                    </div>


                    {/* LISTA DE MÚSICA */}

                    <div className="music-scroll">

                        {genres.map((genre) => (

                            <section
                                className="category"
                                key={genre}
                            >

                                <h2 className="category-title">
                                    {genre}
                                </h2>


                                {songs
                                    .filter(
                                        (song) =>
                                            song.genre === genre
                                    )
                                    .map((song) => (

                                        <button
                                            key={song.id}
                                            type="button"
                                            className={
                                                selectedSong?.id === song.id
                                                    ? "song active"
                                                    : "song"
                                            }
                                            onClick={() =>
                                                handleSongClick(song)
                                            }
                                        >

                                            <span className="play-icon">

                                                <img
                                                    src={playIcon}
                                                    alt="Reproducir"
                                                />

                                            </span>


                                            <span className="song-info">

                                                <span className="song-title">
                                                    {song.title}
                                                </span>

                                                <span className="song-artist">
                                                    {song.artist}
                                                </span>

                                            </span>


                                            {selectedSong?.id === song.id && (

                                                <span className="equalizer">

                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>

                                                </span>

                                            )}

                                        </button>

                                    ))}

                            </section>

                        ))}

                    </div>

                </div>

            </aside>


            {/* =====================================
                CONTENIDO DE ÁLBUMES
                ===================================== */}

            <main className="albumes-main">

                <div className="albumes-background"></div>


                <div className="albumes-content">


                    {/* =================================
                        HEADER
                        ================================= */}

                    <div className="albumes-header">

                        <div>

                            <span className="albumes-subtitle">
                                TU BIBLIOTECA
                            </span>

                            <h1>
                                ÁLBUMES
                            </h1>

                            <p>
                                Organiza tu música en tus propias carpetas.
                            </p>

                        </div>


                        {/* BOTÓN CREAR */}

                        <button
                            type="button"
                            className="create-album-button"
                        >

                            <span className="create-icon">
                                +
                            </span>

                            <span>
                                CREAR CARPETA
                            </span>

                        </button>

                        <button
                            type="button"
                            className="upload-music-button"
                            onClick={handleUploadClick}
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
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />

                    </div>


                    {/* =================================
                        FAVORITAS
                        ================================= */}

                    <section className="album-section">

                        <div className="section-title">

                            <div>

                                <span className="section-label">
                                    COLECCIÓN ESPECIAL
                                </span>

                                <h2>
                                    FAVORITAS
                                </h2>

                            </div>

                        </div>


                        <div className="favorite-card">

                            <div
                                className="favorite-image"
                                style={{
                                    backgroundImage:
                                        `url(${favoritasTexture})`
                                }}
                            >

                                <div className="favorite-overlay"></div>

                                <div className="favorite-icon">

                                    <img
                                        src={favoritosIcon}
                                        alt="Favoritas"
                                    />

                                </div>

                            </div>


                            <div className="favorite-info">

                                <span className="card-type">
                                    COLECCIÓN
                                </span>

                                <h3>
                                    Mis favoritas
                                </h3>

                                <p>
                                    Todas las canciones que has marcado
                                    como favoritas.
                                </p>

                                <span className="song-count">
                                    0 canciones
                                </span>

                            </div>


                            <button
                                type="button"
                                className="open-album-button"
                            >
                                ABRIR
                            </button>

                        </div>

                    </section>


                    {/* =================================
                        CARPETAS
                        ================================= */}

                    <section className="album-section folders-section">

                        <div className="section-title">

                            <div>

                                <span className="section-label">
                                    TU MÚSICA
                                </span>

                                <h2>
                                    CARPETAS
                                </h2>

                            </div>

                            <span className="folder-counter">
                                {albums.length} carpetas
                            </span>

                        </div>


                        <div className="albums-grid">

                            {albums.map((album) => (

                                <article
                                    className="album-card"
                                    key={album.id}
                                >

                                    <div
                                        className="album-image"
                                        style={{
                                            backgroundImage:
                                                `url(${album.texture})`
                                        }}
                                    >

                                        <div className="album-image-overlay"></div>

                                        <span className="folder-symbol">
                                            ♪
                                        </span>

                                    </div>


                                    <div className="album-card-info">

                                        <span className="album-card-label">
                                            CARPETA
                                        </span>

                                        <h3>
                                            {album.name}
                                        </h3>

                                        <p>
                                            {album.description}
                                        </p>

                                        <span className="album-song-count">
                                            {album.songs} canciones
                                        </span>

                                    </div>


                                    <button
                                        type="button"
                                        className="album-open-button"
                                    >
                                        ABRIR
                                    </button>

                                </article>

                            ))}


                            {/* CREAR NUEVA CARPETA */}

                            <button
                                type="button"
                                className="new-album-card"
                            >

                                <span className="new-album-plus">
                                    +
                                </span>

                                <span className="new-album-title">
                                    NUEVA CARPETA
                                </span>

                                <span className="new-album-text">
                                    Organiza tus canciones
                                </span>

                            </button>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default Albumes;