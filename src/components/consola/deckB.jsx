import atrasarIcon from "../../assets/img/DJ_icons/atrasar.png";
import delantarIcon from "../../assets/img/DJ_icons/delantar.png";
import efectosIcon from "../../assets/img/DJ_icons/efectos.png";
import noteIcon from "../../assets/img/DJ_icons/note.png";
import noteFondoIcon from "../../assets/img/DJ_icons/noteondo.png";
import pausaIcon from "../../assets/img/DJ_icons/pausa_blanco.png";
import resumeIcon from "../../assets/img/DJ_icons/resume.png";
import shuffleIcon from "../../assets/img/DJ_icons/shuffle.png";
import settingsIcon from "../../assets/img/DJ_icons/settings_cons.png";

function DeckB({
    song,
    playing,
    volume,
    setVolume,
    pad,
    shuffle,
    onPrevious,
    onNext,
    onTogglePlay,
    onToggleShuffle,
    onPad,
    currentTime,
    duration,
    onSeek
}) {

    /* =================================
       MOVER EL DISCO
       ================================= */

    const handleDiscSeek = (e) => {

        if (!duration) return;

        const rect =
            e.currentTarget.getBoundingClientRect();

        const centerX =
            rect.left + rect.width / 2;

        const centerY =
            rect.top + rect.height / 2;

        const mouseX =
            e.clientX - centerX;

        const mouseY =
            e.clientY - centerY;

        let angle =
            Math.atan2(mouseY, mouseX) *
            (180 / Math.PI);

        angle += 90;

        if (angle < 0) {
            angle += 360;
        }

        const percentage =
            angle / 360;

        const newTime =
            percentage * duration;

        onSeek(newTime);
    };


    return (
        <section
            className={
                playing
                    ? "deck deck-playing"
                    : "deck"
            }
        >

            {/* =================================
                TÍTULO
                ================================= */}

            <div className="deck-title">

                <span>
                    DECK B
                </span>

                <div className="deck-song">

                    {song
                        ? song.title
                        : "Sin canción"}

                    <small>
                        {song
                            ? song.artist
                            : "Selecciona una canción"}
                    </small>

                </div>

            </div>


            {/* =================================
                WAVEFORM
                ================================= */}

            <div className="waveform">

                {Array.from(
                    { length: 58 },
                    (_, index) => (

                        <span
                            key={index}
                            style={{
                                height: `${
                                    22 +
                                    Math.abs(
                                        Math.cos(
                                            index * 1.5
                                        )
                                    ) * 68
                                }%`,
                            }}
                        ></span>

                    )
                )}

            </div>


            <div className="waveform-time">

                <span>
                    {formatTime(currentTime)}
                </span>

                <span>
                    {formatTime(duration)}
                </span>

            </div>


            {/* =================================
                CONTROLES
                ================================= */}

            <div className="deck-controls-top">

                <button
                    className="dj-icon-button"
                    type="button"
                    onClick={onPrevious}
                    title="Anterior"
                >

                    <img
                        src={atrasarIcon}
                        alt="Anterior"
                    />

                </button>


                <button
                    className={
                        playing
                            ? "dj-icon-button play-icon-button playing-button"
                            : "dj-icon-button play-icon-button"
                    }
                    type="button"
                    onClick={onTogglePlay}
                    title={
                        playing
                            ? "Pausar"
                            : "Reproducir"
                    }
                >

                    <img
                        src={
                            playing
                                ? pausaIcon
                                : resumeIcon
                        }
                        alt={
                            playing
                                ? "Pausa"
                                : "Reproducir"
                        }
                    />

                </button>


                <button
                    className="dj-icon-button"
                    type="button"
                    onClick={onNext}
                    title="Siguiente"
                >

                    <img
                        src={delantarIcon}
                        alt="Siguiente"
                    />

                </button>

            </div>


            {/* =================================
                DISCO INTERACTIVO
                ================================= */}

            <div
                className={
                    playing
                        ? "vinyl vinyl-spinning vinyl-interactive"
                        : "vinyl vinyl-interactive"
                }
                onClick={handleDiscSeek}
                title="Haz clic o mueve el mouse alrededor del disco para avanzar o retroceder"
            >

                {/* Indicador de posición */}

                <div
                    className="vinyl-progress"
                    style={{
                        transform: `
                            rotate(
                                ${
                                    duration
                                        ? (currentTime / duration) * 360
                                        : 0
                                }deg
                            )
                        `
                    }}
                ></div>


                <div className="vinyl-highlight"></div>


                <div className="vinyl-center">

                    <div className="vinyl-center-inner">

                        <div className="vinyl-hole"></div>

                    </div>

                </div>

            </div>


            {/* =================================
                VOLUMEN
                ================================= */}

            <div className="deck-level">

                <span>
                    VOLUME
                </span>

                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    style={{
                        "--volume-progress": `${volume}%`,
                    }}
                    onChange={(e) =>
                        setVolume(
                            Number(
                                e.target.value
                            )
                        )
                    }
                />

                <strong>
                    {volume}
                </strong>

            </div>


            {/* =================================
                AÑADIR
                ================================= */}

            <button
                className="add-song-button"
                type="button"
            >

                <img
                    src={noteFondoIcon}
                    alt=""
                />

                <span>
                    Añadir
                </span>

            </button>


            {/* =================================
                PERFORMANCE PADS
                ================================= */}

            <div className="pads-title">
                PERFORMANCE PADS DERECHOS
            </div>


            <div className="performance-pads">

                {[1, 2, 3].map(
                    (padNumber) => (

                        <button
                            key={padNumber}
                            type="button"
                            className={
                                pad === padNumber
                                    ? "performance-pad pad-active"
                                    : "performance-pad"
                            }
                            onClick={() =>
                                onPad(padNumber)
                            }
                        >

                            <img
                                src={noteIcon}
                                alt=""
                            />

                        </button>

                    )
                )}

            </div>


            {/* =================================
                BOTONES INFERIORES
                ================================= */}

            <div className="deck-bottom-buttons">

                <button
                    className={
                        shuffle
                            ? "console-action active-action"
                            : "console-action"
                    }
                    type="button"
                    onClick={onToggleShuffle}
                    title="Aleatorio"
                >

                    <img
                        src={shuffleIcon}
                        alt="Aleatorio"
                    />

                </button>


                <button
                    className="console-action"
                    type="button"
                    title="Configuración"
                >

                    <img
                        src={settingsIcon}
                        alt="Configuración"
                    />

                </button>


                <button
                    className="console-action"
                    type="button"
                    title="Efectos"
                >

                    <img
                        src={efectosIcon}
                        alt="Efectos"
                    />

                </button>

            </div>

        </section>
    );
}


/* =========================================
   FORMATO DEL TIEMPO
   ========================================= */

function formatTime(seconds = 0) {

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return `${minutes}:${String(
        remainingSeconds
    ).padStart(2, "0")}`;
}


export default DeckB;