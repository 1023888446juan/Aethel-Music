import { useState } from "react";
import "../styles/interfaces_navbar/list.css";

// =========================================
// ICONOS
// =========================================
// =========================================
// ICONOS
// =========================================
// =========================================
// ICONOS
// =========================================

import playIcon from "../assets/img/reproductor_icons/play.png";


function List({ songs = [], onSongSelect }) {

    const [selectedSong, setSelectedSong] = useState(null);

    const genres = ["Todas"];


    // =========================================
    // SELECCIONAR CANCIÓN
    // =========================================

    const handleSongClick = (song) => {

        setSelectedSong(song);

        if (onSongSelect) {
            onSongSelect(song);
        }

    };


    return (

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

    );

}

export default List;