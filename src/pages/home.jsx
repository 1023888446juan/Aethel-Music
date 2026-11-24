import { useState } from "react";
import "../styles/interfaces_navbar/home.css";

import List from "../components/List";

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
import Noseencontro from "../assets/img/reproductor_icons/notfound.png";

function Home() {

    // =========================================
    // ESTADO DEL REPRODUCTOR
    // =========================================

    const [isPlaying, setIsPlaying] = useState(false);

    // =========================================
    // CANCIÓN SELECCIONADA
    // =========================================

    const [selectedSong, setSelectedSong] = useState(null);

    // =========================================
    // SELECCIONAR CANCIÓN DESDE LIST
    // =========================================

    const handleSongClick = (song) => {
        setSelectedSong(song);
        setIsPlaying(true);
    };

    // =========================================
    // INTERFAZ
    // =========================================

    return (
        <div className="home-container">

            {/* =====================================
                LISTA DE CANCIONES
                ===================================== */}

            <aside className="playlist-side">

                <List
                    onSongSelect={handleSongClick}
                />

            </aside>

            {/* =====================================
                REPRODUCTOR
                ===================================== */}

            <main
              className={`player-side ${
                  isPlaying ? "is-playing" : ""
             }`}  
            >
                <div className="player-background"></div>

                <div className="player-content">

                    {/* =================================
                        PORTADA
                        ================================= */}

                    <div className="album-art">

                        <div className="album-glow"></div>

                        <img
                            src={Noseencontro}
                            alt="Aethel Music"
                            className="logo-player"
                        />

                    </div>

                    {/* =================================
                        INFORMACIÓN DE LA CANCIÓN
                        ================================= */}

                    <div className="now-playing">

                        <span className="playing-label">
                            REPRODUCIENDO
                        </span>

                        <h2>
                            {selectedSong
                                ? selectedSong.title
                                : "No hay canciones"}
                        </h2>

                        <p>
                            {selectedSong
                                ? selectedSong.artist
                                : "Agrega música para comenzar"}
                        </p>

                    </div>

                    {/* =================================
                        PROGRESO
                        ================================= */}

                    <div className="time-controls">

                        <span>
                            00:00
                        </span>

                        <div className="progress-bar">

                            <div className="progress-fill"></div>

                            <div className="progress-dot"></div>

                        </div>

                        <span>
                            {selectedSong?.duration || "02:49"}
                        </span>

                    </div>

                    {/* =================================
                        CONTROLES PRINCIPALES
                        ================================= */}

                    <div className="player-controls">

                        {/* ATRÁS 15 */}

                        <button
                            type="button"
                            title="Retroceder 15 segundos"
                        >
                            <img
                                src={atras15Icon}
                                alt="Retroceder 15 segundos"
                            />
                        </button>

                        {/* CANCIÓN ANTERIOR */}

                        <button
                            type="button"
                            title="Canción anterior"
                        >
                            <img
                                src={atrasIcon}
                                alt="Canción anterior"
                            />
                        </button>

                        {/* PLAY / PAUSA */}

                        <button
                            type="button"
                            className="play-button"
                            title={
                                isPlaying
                                    ? "Pausar"
                                    : "Reproducir"
                            }
                            onClick={() =>
                                setIsPlaying(!isPlaying)
                            }
                        >
                            <img
                                src={
                                    isPlaying
                                        ? pausaIcon
                                        : playIcon
                                }
                                alt={
                                    isPlaying
                                        ? "Pausar"
                                        : "Reproducir"
                                }
                            />
                        </button>

                        {/* CANCIÓN SIGUIENTE */}

                        <button
                            type="button"
                            title="Canción siguiente"
                        >
                            <img
                                src={adelanteIcon}
                                alt="Canción siguiente"
                            />
                        </button>

                        {/* ADELANTE 15 */}

                        <button
                            type="button"
                            title="Avanzar 15 segundos"
                        >
                            <img
                                src={adelante15Icon}
                                alt="Avanzar 15 segundos"
                            />
                        </button>

                    </div>

                    {/* =================================
                        CONTROLES SECUNDARIOS
                        ================================= */}

                    <div className="secondary-controls">

                        {/* REPETIR */}

                        <button
                            type="button"
                            title="Repetir"
                        >
                            <img
                                src={repetirIcon}
                                alt="Repetir"
                            />
                        </button>

                        {/* FAVORITOS */}

                        <button
                            type="button"
                            title="Favorito"
                        >
                            <img
                                src={favoritosIcon}
                                alt="Favorito"
                            />
                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Home;