/* =========================================================
   1. IMPORTS, ESTADO Y EFECTOS
   ========================================================= */

import { useEffect, useRef, useState } from "react";
import atrasarIcon from "../../assets/img/DJ_icons/atrasar.png";
import delantarIcon from "../../assets/img/DJ_icons/delantar.png";
import efectosIcon from "../../assets/img/DJ_icons/efectos.png";
import noteIcon from "../../assets/img/DJ_icons/note.png";
import noteFondoIcon from "../../assets/img/DJ_icons/noteondo.png";
import pausaIcon from "../../assets/img/DJ_icons/pausa_blanco.png";
import resumeIcon from "../../assets/img/DJ_icons/resume.png";
import shuffleIcon from "../../assets/img/DJ_icons/shuffle.png";
import settingsIcon from "../../assets/img/DJ_icons/settings_cons.png";

const BAR_COUNT = 58;
const BASE_WAVE_PATTERN = Array.from({ length: BAR_COUNT }, (_, index) =>
    22 + Math.abs(Math.sin(index * 1.7)) * 68
);

function formatTime(seconds = 0) {
    const safeSeconds = Math.max(0, Number(seconds) || 0);
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = Math.floor(safeSeconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function DeckA({
    song,
    playing,
    setPlaying = () => {},
    volume,
    setVolume,
    pads = [],
    maxPads = 9,
    onImportPadFile = () => {},
    pad,
    shuffle,
    onPrevious,
    onNext,
    onTogglePlay,
    onToggleShuffle,
    onPad,
    currentTime = 0,
    setCurrentTime = () => {},
    duration = 0,
    setDuration = () => {}
}) {
    const [pointerAngle, setPointerAngle] = useState(0);
    const [seekDirection, setSeekDirection] = useState("");
    const [isHoveringDisc, setIsHoveringDisc] = useState(false);
    const [isScrubbingWave, setIsScrubbingWave] = useState(false);
    const [freqBars, setFreqBars] = useState(BASE_WAVE_PATTERN);

    const fileInputRef = useRef(null);
    const waveformRef = useRef(null);
    const audioRef = useRef(null);
    const audioCtxRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const rafRef = useRef(null);

    const hasSong = Boolean(song);
    const isSpinning = Boolean(playing && hasSong);
    const effectiveDuration =
        duration > 0 ? duration : Number(song?.duration) || 0;
    const progressRatio =
        hasSong && effectiveDuration > 0
            ? Math.min(1, Math.max(0, currentTime / effectiveDuration))
            : 0;
    const progressDeg = progressRatio * 360;

    const audioSrc =
        song?.audioUrl || song?.url || song?.src || song?.previewUrl || "";

    useEffect(() => {
        const audioEl = audioRef.current;
        if (!audioEl) return;

        audioEl.volume = Math.min(1, Math.max(0, volume / 100));
    }, [volume]);

    useEffect(() => {
        const audioEl = audioRef.current;
        if (!audioEl || !audioSrc) {
            if (!hasSong) {
                setFreqBars(BASE_WAVE_PATTERN);
            }
            return;
        }

        if (audioEl.src !== audioSrc) {
            audioEl.src = audioSrc;
            audioEl.load();
        }
    }, [audioSrc, hasSong]);

    useEffect(() => {
        const audioEl = audioRef.current;
        if (!audioEl) return;

        if (isSpinning && audioSrc) {
            const AudioContextClass =
                window.AudioContext || window.webkitAudioContext;

            if (AudioContextClass && !audioCtxRef.current) {
                try {
                    const ctx = new AudioContextClass();
                    const analyser = ctx.createAnalyser();
                    analyser.fftSize = 128;

                    if (!sourceNodeRef.current) {
                        sourceNodeRef.current = ctx.createMediaElementSource(audioEl);
                        sourceNodeRef.current.connect(analyser);
                        analyser.connect(ctx.destination);
                    }

                    audioCtxRef.current = ctx;
                    analyserRef.current = analyser;
                } catch {
                    // Fallback visual si el audio no permite WebAudio CORS
                }
            }

            if (audioCtxRef.current?.state === "suspended") {
                audioCtxRef.current.resume().catch(() => {});
            }

            audioEl.play().catch(() => {});
        } else {
            audioEl.pause();
        }
    }, [isSpinning, audioSrc]);

    useEffect(() => {
        let fallbackInterval = null;

        if (!isSpinning) {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
            return;
        }

        const updateFrequencyBars = () => {
            const analyser = analyserRef.current;

            if (analyser) {
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                analyser.getByteFrequencyData(dataArray);

                const nonZeroSum = dataArray.reduce((acc, v) => acc + v, 0);

                if (nonZeroSum > 0) {
                    const nextBars = Array.from({ length: BAR_COUNT }, (_, idx) => {
                        const binIndex = Math.min(
                            bufferLength - 1,
                            Math.floor((idx / BAR_COUNT) * bufferLength)
                        );
                        const normalized = dataArray[binIndex] / 255;
                        return Math.max(12, Math.min(98, normalized * 96));
                    });
                    setFreqBars(nextBars);
                } else {
                    const now = performance.now() * 0.006;
                    setFreqBars(
                        Array.from({ length: BAR_COUNT }, (_, idx) => {
                            const wave = Math.abs(
                                Math.sin(now + idx * 0.45) * Math.cos(now * 0.7 - idx * 0.2)
                            );
                            return Math.max(16, Math.min(95, wave * 90));
                        })
                    );
                }
            } else {
                const now = performance.now() * 0.006;
                setFreqBars(
                    Array.from({ length: BAR_COUNT }, (_, idx) => {
                        const wave = Math.abs(
                            Math.sin(now + idx * 0.45) * Math.cos(now * 0.7 - idx * 0.2)
                        );
                        return Math.max(16, Math.min(95, wave * 90));
                    })
                );
            }

            rafRef.current = requestAnimationFrame(updateFrequencyBars);
        };

        rafRef.current = requestAnimationFrame(updateFrequencyBars);

        if (!audioSrc && effectiveDuration > 0) {
            fallbackInterval = setInterval(() => {
                setCurrentTime((prev) => {
                    if (prev + 0.15 >= effectiveDuration) {
                        setPlaying(false);
                        return 0;
                    }
                    return prev + 0.15;
                });
            }, 150);
        }

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
            if (fallbackInterval) {
                clearInterval(fallbackInterval);
            }
        };
    }, [isSpinning, audioSrc, effectiveDuration, setCurrentTime, setPlaying]);

    useEffect(() => {
        if (!isScrubbingWave) return;

        const handleWindowMove = (e) => {
            seekFromWaveformClientX(e.clientX);
        };

        const handleWindowUp = () => {
            setIsScrubbingWave(false);
        };

        window.addEventListener("mousemove", handleWindowMove);
        window.addEventListener("mouseup", handleWindowUp);

        return () => {
            window.removeEventListener("mousemove", handleWindowMove);
            window.removeEventListener("mouseup", handleWindowUp);
        };
    });


    /* =========================================================
       2. HANDLERS
       ========================================================= */

    const handleSeek = (newTime) => {
        const clamped = Math.max(
            0,
            Math.min(effectiveDuration || newTime, newTime)
        );
        setCurrentTime(clamped);

        if (audioRef.current && audioSrc && Number.isFinite(clamped)) {
            audioRef.current.currentTime = clamped;
        }
    };

    const seekFromWaveformClientX = (clientX) => {
        if (!hasSong || !effectiveDuration || !waveformRef.current) return;

        const rect = waveformRef.current.getBoundingClientRect();
        const ratio = Math.min(
            1,
            Math.max(0, (clientX - rect.left) / rect.width)
        );
        handleSeek(ratio * effectiveDuration);
    };

    const handleWaveformMouseDown = (e) => {
        if (!hasSong || !effectiveDuration) return;
        setIsScrubbingWave(true);
        seekFromWaveformClientX(e.clientX);
    };

    const calculateAngleFromMouse = (e, element) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
        angle += 90;

        if (angle < 0) {
            angle += 360;
        }

        return angle;
    };

    const handleDiscMouseMove = (e) => {
        const angle = calculateAngleFromMouse(e, e.currentTarget);
        const delta = angle - pointerAngle;

        if (Math.abs(delta) > 0.6) {
            const wrappedDelta =
                delta > 180 ? delta - 360 : delta < -180 ? delta + 360 : delta;
            setSeekDirection(wrappedDelta >= 0 ? "forward" : "backward");
        }

        setPointerAngle(angle);
        setIsHoveringDisc(true);
    };

    const handleDiscSeek = (e) => {
        if (!hasSong || !effectiveDuration) return;

        const angle = calculateAngleFromMouse(e, e.currentTarget);
        setPointerAngle(angle);

        const percentage = angle / 360;
        handleSeek(percentage * effectiveDuration);
    };

    const handleOpenFileDialog = () => {
        if (pads.length >= maxPads) return;
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            onImportPadFile(selectedFile);
        }
        e.target.value = "";
    };


    /* =========================================================
       3. RENDER PRINCIPAL
       ========================================================= */

    return (
        <section
            className={
                isSpinning
                    ? "deck deck-playing"
                    : "deck"
            }
        >

            <audio
                ref={audioRef}
                crossOrigin="anonymous"
                onLoadedMetadata={(e) => {
                    if (Number.isFinite(e.currentTarget.duration)) {
                        setDuration(e.currentTarget.duration);
                    }
                }}
                onTimeUpdate={(e) => {
                    setCurrentTime(e.currentTarget.currentTime || 0);
                }}
                onEnded={() => {
                    setPlaying(false);
                    setCurrentTime(0);
                }}
            />

            <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden-file-input"
                onChange={handleFileChange}
            />

            {/* -------------------------------------------------
                TÍTULO
            ------------------------------------------------- */}

            <div className="deck-title">

                <span>
                    DECK A
                </span>

                <div className="deck-song">

                    {hasSong
                        ? song.title
                        : "Sin canción"}

                    <small>
                        {hasSong
                            ? song.artist
                            : "Selecciona una canción"}
                    </small>

                </div>

            </div>


            {/* -------------------------------------------------
                WAVEFORM INTERACTIVO Y REACTIVO A FRECUENCIA
            ------------------------------------------------- */}

            <div
                ref={waveformRef}
                className={`waveform ${hasSong ? "waveform-interactive" : ""}`}
                onMouseDown={handleWaveformMouseDown}
                title={
                    hasSong
                        ? "Haz clic o arrastra libremente para moverte por la canción"
                        : "Selecciona una canción"
                }
            >

                {freqBars.map((barHeight, index) => {
                    const barRatio = index / BAR_COUNT;
                    const isPassed = hasSong && barRatio <= progressRatio;

                    return (
                        <span
                            key={index}
                            className={isPassed ? "is-passed" : ""}
                            style={{
                                height: `${barHeight}%`
                            }}
                        ></span>
                    );
                })}

                {hasSong && (
                    <div
                        className="waveform-playhead"
                        style={{ left: `${progressRatio * 100}%` }}
                    />
                )}

            </div>

            <div className="waveform-time">

                <span>
                    {hasSong ? formatTime(currentTime) : "0:00"}
                </span>

                <span>
                    {hasSong ? formatTime(effectiveDuration) : "0:00"}
                </span>

            </div>


            {/* -------------------------------------------------
                CONTROLES PRINCIPALES
            ------------------------------------------------- */}

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
                        isSpinning
                            ? "dj-icon-button play-icon-button playing-button"
                            : "dj-icon-button play-icon-button"
                    }
                    type="button"
                    onClick={onTogglePlay}
                    title={
                        isSpinning
                            ? "Pausar"
                            : "Reproducir"
                    }
                >

                    <img
                        src={
                            isSpinning
                                ? pausaIcon
                                : resumeIcon
                        }
                        alt={
                            isSpinning
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


            {/* -------------------------------------------------
                DISCO INTERACTIVO CON GUÍA DE DIRECCIÓN
            ------------------------------------------------- */}

            <div className="vinyl-stage">

                <span
                    className={`vinyl-guide-arrow vinyl-guide-left ${
                        seekDirection === "backward" && isHoveringDisc ? "is-active" : ""
                    }`}
                    aria-hidden="true"
                >
                    ↶
                </span>

                <div
                    className={
                        isSpinning
                            ? "vinyl vinyl-spinning vinyl-interactive"
                            : "vinyl vinyl-interactive"
                    }
                    onMouseMove={handleDiscMouseMove}
                    onMouseEnter={() => setIsHoveringDisc(true)}
                    onMouseLeave={() => {
                        setIsHoveringDisc(false);
                        setSeekDirection("");
                    }}
                    onClick={handleDiscSeek}
                    title={
                        hasSong
                            ? "Mueve o haz clic alrededor del disco para avanzar o retroceder"
                            : "Selecciona una canción para activar el disco"
                    }
                >

                    <div
                        className={`vinyl-progress ${
                            !hasSong ? "is-empty" : ""
                        }`}
                        style={{
                            transform: hasSong
                                ? `rotate(${progressDeg}deg)`
                                : "rotate(0deg)"
                        }}
                    ></div>

                    <div
                        className={`vinyl-mouse-guide ${
                            isHoveringDisc ? "is-visible" : ""
                        }`}
                        style={{
                            transform: `translate(-50%, -50%) rotate(${pointerAngle}deg)`
                        }}
                    >
                        <span className="vinyl-mouse-chevron">
                            {seekDirection === "backward" ? "‹" : "›"}
                        </span>
                    </div>

                    <div className="vinyl-highlight"></div>

                    <div className="vinyl-center">

                        <div className="vinyl-center-inner">

                            <div className="vinyl-hole"></div>

                        </div>

                    </div>

                </div>

                <span
                    className={`vinyl-guide-arrow vinyl-guide-right ${
                        seekDirection === "forward" && isHoveringDisc ? "is-active" : ""
                    }`}
                    aria-hidden="true"
                >
                    ↷
                </span>

            </div>


            {/* -------------------------------------------------
                VOLUMEN
            ------------------------------------------------- */}

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


            {/* -------------------------------------------------
                AÑADIR ARCHIVO -> AGREGA PAD
            ------------------------------------------------- */}

            <button
                className="add-song-button"
                type="button"
                onClick={handleOpenFileDialog}
                disabled={pads.length >= maxPads}
                title={
                    pads.length >= maxPads
                        ? `Máximo ${maxPads} pads`
                        : "Importar audio desde tu PC para crear un pad"
                }
            >

                <img
                    src={noteFondoIcon}
                    alt=""
                />

                <span>
                    Añadir
                </span>

            </button>


            {/* -------------------------------------------------
                PERFORMANCE PADS DINÁMICOS (BASE 0, MÁX 9)
            ------------------------------------------------- */}

            <div className="pads-title">
                PERFORMANCE PADS IZQUIERDO ({pads.length}/{maxPads})
            </div>

            {pads.length > 0 && (
                <div className="performance-pads-columns">
                    {pads.map((padItem) => (
                        <button
                            key={padItem.id}
                            type="button"
                            className={
                                pad === padItem.id
                                    ? "performance-pad pad-active"
                                    : "performance-pad"
                            }
                            title={padItem.name}
                            onClick={() => onPad(padItem)}
                        >
                            <img
                                src={noteIcon}
                                alt={padItem.name}
                            />
                        </button>
                    ))}
                </div>
            )}


            {/* -------------------------------------------------
                BOTONES INFERIORES
            ------------------------------------------------- */}

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

export default DeckA;