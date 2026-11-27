import { useRef, useState } from "react";
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
import { addLocalFiles } from "../services/localLibrary";


function List({ songs = [], onSongSelect, loading = false, error = "" }) {

    const [selectedSong, setSelectedSong] = useState(null);
    const filesRef = useRef(null);
    const folderRef = useRef(null);

    const handleImport = async (event) => {
        try {
            const imported = await addLocalFiles(event.target.files);
            if (event.target.files?.length && !imported.length) {
                window.alert("No se encontraron archivos de audio compatibles.");
            }
        } catch (importError) {
            window.alert(importError.message || "No se pudo guardar la música localmente.");
        } finally {
            event.target.value = "";
        }
    };

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

                    <div className="library-import-actions">
                        <input ref={filesRef} type="file" accept="audio/*" multiple hidden onChange={handleImport} />
                        <input ref={folderRef} type="file" accept="audio/*" multiple hidden webkitdirectory="" onChange={handleImport} />
                        <button type="button" onClick={() => filesRef.current?.click()} title="Agregar canciones desde el computador">+ Archivos</button>
                        <button type="button" onClick={() => folderRef.current?.click()} title="Agregar una carpeta de música">+ Carpeta</button>
                    </div>

                </div>


                {/* LISTA DE MÚSICA */}

                <div className="music-scroll">

                    {!songs.length && (
                        <p className="empty-library" role={error ? "alert" : undefined}>
                            {loading ? "Cargando tu música…" : error || "Aún no hay canciones en tu biblioteca."}
                        </p>
                    )}

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

