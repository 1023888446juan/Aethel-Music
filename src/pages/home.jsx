/* =========================================================
   1. IMPORTS, ESTADO Y EFECTOS
   ========================================================= */

import { useEffect, useState } from "react";
import "../styles/interfaces_navbar/home.css";

import List from "../components/List";

import playIcon from "../assets/img/reproductor_icons/play.png";
import pausaIcon from "../assets/img/reproductor_icons/pausa.png";
import atras15Icon from "../assets/img/reproductor_icons/atras15.png";
import atrasIcon from "../assets/img/reproductor_icons/atras.png";
import repetirIcon from "../assets/img/reproductor_icons/repetir.png";
import adelante15Icon from "../assets/img/reproductor_icons/adelante15.png";
import adelanteIcon from "../assets/img/reproductor_icons/adelante.png";
import favoritosIcon from "../assets/img/reproductor_icons/favoritos.png";
import Noseencontro from "../assets/img/reproductor_icons/notfound.png";

const STORAGE_KEYS = {
    colorMode: "aethel_color_mode",
    textSize: "aethel_text_size"
};

function Home() {
    const [colorMode, setColorMode] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.colorMode);
        return saved === "light" || saved === "dark" ? saved : "dark";
    });

    const [textSize, setTextSize] = useState(() => {
        const saved = Number(localStorage.getItem(STORAGE_KEYS.textSize));
        return saved >= 80 && saved <= 130 ? saved : 100;
    });

    const [isPlaying, setIsPlaying] = useState(false);

    const [selectedSong, setSelectedSong] = useState(null);

    const [isRepeat, setIsRepeat] = useState(false);

    const [isFavorite, setIsFavorite] = useState(false);

    const [favoriteAnimState, setFavoriteAnimState] = useState("");

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


    /* =========================================================
       2. HANDLERS
       ========================================================= */

    const handleSongClick = (song) => {
        setSelectedSong(song);
        setIsPlaying(true);
    };

    const handleTogglePlay = () => {
        setIsPlaying((prev) => !prev);
    };

    const handleToggleRepeat = () => {
        setIsRepeat((prev) => !prev);
    };

    const handleToggleFavorite = () => {
        setIsFavorite((prev) => {
            const nextValue = !prev;
            setFavoriteAnimState(nextValue ? "is-popping" : "is-unfavoriting");
            return nextValue;
        });
    };

    const handleFavoriteAnimationEnd = () => {
        setFavoriteAnimState("");
    };


    /* =========================================================
       3. RENDER PRINCIPAL
       ========================================================= */

    return (
        <div
            className="home-container"
            data-theme={colorMode}
            style={{ "--cfg-text-scale": textScale }}
        >

            {/* -----------------------------------------------------
                LISTA DE CANCIONES
            ----------------------------------------------------- */}

            <aside className="playlist-side">

                <List
                    onSongSelect={handleSongClick}
                />

            </aside>


            {/* -----------------------------------------------------
                REPRODUCTOR
            ----------------------------------------------------- */}

            <main
                className={`player-side ${
                    isPlaying ? "is-playing" : ""
                }`}
                data-theme={colorMode}
                style={{ "--cfg-text-scale": textScale }}
            >
                <div className="player-background"></div>

                <div className="player-content">

                    {/* ---------------------------------------------
                        PORTADA
                    --------------------------------------------- */}

                    <div className="album-art">

                        <div className="album-glow"></div>

                        <img
                            src={Noseencontro}
                            alt="Aethel Music"
                            className="logo-player"
                        />

                    </div>


                    {/* ---------------------------------------------
                        INFORMACIÓN DE LA CANCIÓN
                    --------------------------------------------- */}

                    <div className="now-playing">

                        <span className="playing-label">
                            REPRODUCIENDO
                        </span>

                        <h2>
                            {selectedSong
                                ? selectedSong.title
                                : "No hay canciones"}
                        </h2>

                        {selectedSong?.artist && (
                            <p>
                                {selectedSong.artist}
                            </p>
                        )}

                    </div>


                    {/* ---------------------------------------------
                        PROGRESO
                    --------------------------------------------- */}

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


                    {/* ---------------------------------------------
                        CONTROLES PRINCIPALES
                    --------------------------------------------- */}

                    <div className="player-controls">

                        <button
                            type="button"
                            title="Retroceder 15 segundos"
                        >
                            <img
                                src={atras15Icon}
                                alt="Retroceder 15 segundos"
                            />
                        </button>

                        <button
                            type="button"
                            title="Canción anterior"
                        >
                            <img
                                src={atrasIcon}
                                alt="Canción anterior"
                            />
                        </button>

                        <button
                            type="button"
                            className="play-button"
                            title={
                                isPlaying
                                    ? "Pausar"
                                    : "Reproducir"
                            }
                            onClick={handleTogglePlay}
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

                        <button
                            type="button"
                            title="Canción siguiente"
                        >
                            <img
                                src={adelanteIcon}
                                alt="Canción siguiente"
                            />
                        </button>

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


                    {/* ---------------------------------------------
                        CONTROLES SECUNDARIOS
                    --------------------------------------------- */}

                    <div className="secondary-controls">

                        <button
                            type="button"
                            className={`repeat-button ${
                                isRepeat ? "is-active" : ""
                            }`}
                            aria-pressed={isRepeat}
                            title={
                                isRepeat
                                    ? "Repetir: Activado"
                                    : "Repetir: Desactivado"
                            }
                            onClick={handleToggleRepeat}
                        >
                            <img
                                src={repetirIcon}
                                alt="Repetir"
                            />
                        </button>

                        <button
                            type="button"
                            className={`favorite-button ${
                                isFavorite ? "is-favorite" : ""
                            } ${favoriteAnimState}`}
                            aria-pressed={isFavorite}
                            title={
                                isFavorite
                                    ? "Quitar de favoritos"
                                    : "Agregar a favoritos"
                            }
                            onClick={handleToggleFavorite}
                            onAnimationEnd={handleFavoriteAnimationEnd}
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