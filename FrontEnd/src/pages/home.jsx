/* =========================================================
   1. IMPORTS, ESTADO Y EFECTOS
   ========================================================= */

import { useEffect, useRef, useState } from "react";
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
import { useLibrary } from "../hooks/useLibrary";
import { loadTrackAudioUrl } from "../services/api";

const STORAGE_KEYS = {
    colorMode: "aethel_color_mode",
    textSize: "aethel_text_size"
};

function Home() {
    const { songs, loadingSongs, libraryError } = useLibrary();
    const audioRef = useRef(null);
    const localAudioUrlRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [audioError, setAudioError] = useState("");
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

    const handleSongClick = async (song) => {
        setIsPlaying(false);
        audioRef.current?.pause();
        setCurrentTime(0);
        setAudioError("");
        if (localAudioUrlRef.current) {
            URL.revokeObjectURL(localAudioUrlRef.current);
            localAudioUrlRef.current = null;
        }
        try {
            const audioUrl = song.local
                ? URL.createObjectURL(song.file)
                : await loadTrackAudioUrl(song.id);
            if (song.local) localAudioUrlRef.current = audioUrl;
            setSelectedSong({ ...song, audioUrl });
        } catch (error) {
            setSelectedSong(song);
            setAudioError(error.message);
        }
    };

    useEffect(() => () => {
        audioRef.current?.pause();
        if (localAudioUrlRef.current) URL.revokeObjectURL(localAudioUrlRef.current);
    }, []);

    const handleTogglePlay = () => {
        const audio = audioRef.current;
        if (!audio || !selectedSong?.audioUrl) {
            setAudioError(selectedSong ? "No se pudo cargar el audio." : "Selecciona una canción primero.");
            return;
        }
        if (audio.paused) {
            audio.play().then(() => setIsPlaying(true)).catch(() => setAudioError("El navegador no pudo reproducir este archivo de audio."));
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    };

    const seekTo = (event) => {
        if (!audioRef.current || !duration) return;
        const rect = event.currentTarget.getBoundingClientRect();
        audioRef.current.currentTime = Math.max(0, Math.min(duration, ((event.clientX - rect.left) / rect.width) * duration));
    };
    const skipBy = (seconds) => {
        if (audioRef.current) audioRef.current.currentTime = Math.max(0, Math.min(duration || 0, audioRef.current.currentTime + seconds));
    };
    const selectAdjacent = (step) => {
        if (!songs.length) return;
        const index = songs.findIndex((song) => song.id === selectedSong?.id);
        const next = (index + step + songs.length) % songs.length;
        handleSongClick(songs[next]);
    };
    const formatTime = (seconds) => `${Math.floor((seconds || 0) / 60)}:${String(Math.floor((seconds || 0) % 60)).padStart(2, "0")}`;

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !selectedSong?.audioUrl) return;
        audio.src = selectedSong.audioUrl;
        audio.load();
    }, [selectedSong?.audioUrl]);

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
                    songs={songs}
                    loading={loadingSongs}
                    error={libraryError}
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
                            {formatTime(currentTime)}
                        </span>

                        <div className="progress-bar" onClick={seekTo} role="slider" aria-label="Posición de reproducción" aria-valuemin={0} aria-valuemax={Math.floor(duration)} aria-valuenow={Math.floor(currentTime)} tabIndex={0}>

                            <div className="progress-fill" style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}></div>

                            <div className="progress-dot"></div>

                        </div>

                        <span>
                            {formatTime(duration || selectedSong?.duration)}
                        </span>

                    </div>


                    {/* ---------------------------------------------
                        CONTROLES PRINCIPALES
                    --------------------------------------------- */}

                    <div className="player-controls">

                        <button
                            type="button"
                            title="Retroceder 15 segundos"
                            onClick={() => skipBy(-15)}
                        >
                            <img
                                src={atras15Icon}
                                alt="Retroceder 15 segundos"
                            />
                        </button>

                        <button
                            type="button"
                            title="Canción anterior"
                            onClick={() => selectAdjacent(-1)}
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
                            onClick={() => selectAdjacent(1)}
                        >
                            <img
                                src={adelanteIcon}
                                alt="Canción siguiente"
                            />
                        </button>

                        <button
                            type="button"
                            title="Avanzar 15 segundos"
                            onClick={() => skipBy(15)}
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

                <audio
                    ref={audioRef}
                    preload="metadata"
                    onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                    onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
                    loop={isRepeat}
                    onEnded={() => {
                        setIsPlaying(false);
                    }}
                />
                {(audioError || libraryError) && <p role="alert" className="player-error">{audioError || libraryError}</p>}

            </main>

        </div>
    );
}

export default Home;
