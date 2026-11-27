/* =========================================================
   1. IMPORTS, ESTADO Y EFECTOS
   ========================================================= */

import { useEffect, useRef, useState } from "react";
import "../styles/interfaces_navbar/consol.css";

import List from "../components/List";

import DeckA from "../components/consola/deckA";
import DeckB from "../components/consola/deckB";
import Mixer from "../components/consola/mixer";
import { useLibrary } from "../hooks/useLibrary";
import { loadTrackAudioUrl } from "../services/api";

const STORAGE_KEYS = {
    colorMode: "aethel_color_mode",
    textSize: "aethel_text_size"
};

const MAX_PADS = 9;

function Consol() {
    const { songs, loadingSongs, libraryError } = useLibrary();
    const [colorMode, setColorMode] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.colorMode);
        return saved === "light" || saved === "dark" ? saved : "dark";
    });

    const [textSize, setTextSize] = useState(() => {
        const saved = Number(localStorage.getItem(STORAGE_KEYS.textSize));
        return saved >= 80 && saved <= 130 ? saved : 100;
    });

    const [leftSong, setLeftSong] = useState(null);
    const [rightSong, setRightSong] = useState(null);

    const [leftPlaying, setLeftPlaying] = useState(false);
    const [rightPlaying, setRightPlaying] = useState(false);

    const [leftCurrentTime, setLeftCurrentTime] = useState(0);
    const [leftDuration, setLeftDuration] = useState(0);

    const [rightCurrentTime, setRightCurrentTime] = useState(0);
    const [rightDuration, setRightDuration] = useState(0);

    const [leftVolume, setLeftVolume] = useState(70);
    const [rightVolume, setRightVolume] = useState(70);

    const [leftChannelLevel, setLeftChannelLevel] = useState(3);
    const [rightChannelLevel, setRightChannelLevel] = useState(6);

    const [crossfade, setCrossfade] = useState(50);

    const [leftPads, setLeftPads] = useState([]);
    const [rightPads, setRightPads] = useState([]);

    const [leftPad, setLeftPad] = useState(null);
    const [rightPad, setRightPad] = useState(null);

    const [leftShuffle, setLeftShuffle] = useState(false);
    const [rightShuffle, setRightShuffle] = useState(false);

    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [downloadPulse, setDownloadPulse] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

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

    const selectSong = async (song) => {
        const side = leftPlaying ? "right" : "left";
        try {
            const audioUrl = await loadTrackAudioUrl(song.id);
            const playableSong = { ...song, audioUrl };
            if (side === "left") {
                setLeftSong(playableSong);
                setLeftCurrentTime(0);
                setLeftDuration(Number(song.duration) || 0);
            } else {
                setRightSong(playableSong);
                setRightCurrentTime(0);
                setRightDuration(Number(song.duration) || 0);
            }
        } catch (error) {
            window.alert(error.message);
        }
    };

    const toggleLeftPlay = () => {
        if (!leftSong) {
            return;
        }

        setLeftPlaying(
            (previous) => !previous
        );
    };

    const toggleRightPlay = () => {
        if (!rightSong) {
            return;
        }

        setRightPlaying(
            (previous) => !previous
        );
    };

    const toggleLeftShuffle = () => {
        setLeftShuffle(
            (previous) => !previous
        );
    };

    const toggleRightShuffle = () => {
        setRightShuffle(
            (previous) => !previous
        );
    };

    const handleImportLeftPadFile = (file) => {
        if (!file) return;

        setLeftPads((prev) => {
            if (prev.length >= MAX_PADS) return prev;
            const nextIndex = prev.length + 1;
            const addedPad = {
                id: nextIndex,
                name: file.name.replace(/\.[^/.]+$/, ""),
                url: URL.createObjectURL(file)
            };
            return [...prev, addedPad];
        });

    };

    const handleImportRightPadFile = (file) => {
        if (!file) return;

        setRightPads((prev) => {
            if (prev.length >= MAX_PADS) return prev;
            const nextIndex = prev.length + 1;
            const addedPad = {
                id: nextIndex,
                name: file.name.replace(/\.[^/.]+$/, ""),
                url: URL.createObjectURL(file)
            };
            return [...prev, addedPad];
        });

    };

    const playPadSample = (padItem) => {
        const sampleSrc = padItem?.url;
        if (!sampleSrc) return;

        const padAudio = new Audio(sampleSrc);
        padAudio.play().catch(() => {});
    };

    const handleLeftPad = (padItem) => {
        const padId = typeof padItem === "object" ? padItem.id : padItem;
        if (typeof padItem === "object") {
            playPadSample(padItem);
        }

        setLeftPad(padId);

        setTimeout(() => {
            setLeftPad(null);
        }, 280);
    };

    const handleRightPad = (padItem) => {
        const padId = typeof padItem === "object" ? padItem.id : padItem;
        if (typeof padItem === "object") {
            playPadSample(padItem);
        }

        setRightPad(padId);

        setTimeout(() => {
            setRightPad(null);
        }, 280);
    };

    const handleToggleRecord = async () => {
        if (isRecording) {
            setIsRecording(false);

            if (
                mediaRecorderRef.current &&
                mediaRecorderRef.current.state !== "inactive"
            ) {
                mediaRecorderRef.current.stop();
            }
            return;
        }

        audioChunksRef.current = [];
        setRecordedChunks([]);
        setIsRecording(true);

        try {
            if (
                typeof navigator !== "undefined" &&
                navigator.mediaDevices &&
                typeof MediaRecorder !== "undefined"
            ) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(stream);
                mediaRecorderRef.current = recorder;

                recorder.ondataavailable = (event) => {
                    if (event.data && event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                recorder.onstop = async () => {
                    const finalChunks = [...audioChunksRef.current];
                    setRecordedChunks(finalChunks);
                    stream.getTracks().forEach((track) => track.stop());

                };

                recorder.start();
            }
        } catch {
            // Mantiene el estado visual de grabación activo si el permiso es denegado
        }
    };

    const handleDownloadSession = () => {
        setDownloadPulse(true);
        setTimeout(() => setDownloadPulse(false), 600);

        const sourceChunks =
            recordedChunks.length > 0 ? recordedChunks : audioChunksRef.current;

        if (sourceChunks.length > 0) {
            const blob = new Blob(sourceChunks, { type: "audio/webm" });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `aethel-dj-sesion-${Date.now()}.webm`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            URL.revokeObjectURL(url);
            return;
        }

        const sessionSummary = JSON.stringify(
            {
                app: "Aethel Music DJ Console",
                exportedAt: new Date().toISOString(),
                deckA: {
                    song: leftSong?.title || null,
                    artist: leftSong?.artist || null,
                    duration: leftDuration,
                    currentTime: leftCurrentTime,
                    volume: leftVolume,
                    channelLevel: leftChannelLevel,
                    shuffle: leftShuffle,
                    pads: leftPads.map((p) => ({ id: p.id, name: p.name }))
                },
                deckB: {
                    song: rightSong?.title || null,
                    artist: rightSong?.artist || null,
                    duration: rightDuration,
                    currentTime: rightCurrentTime,
                    volume: rightVolume,
                    channelLevel: rightChannelLevel,
                    shuffle: rightShuffle,
                    pads: rightPads.map((p) => ({ id: p.id, name: p.name }))
                },
                crossfade
            },
            null,
            2
        );

        const blob = new Blob([sessionSummary], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `aethel-dj-sesion-${Date.now()}.json`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
    };


    /* =========================================================
       3. RENDER PRINCIPAL
       ========================================================= */

    return (
        <div
            className="consol-container"
            data-theme={colorMode}
            style={{ "--cfg-text-scale": textScale }}
        >

            {/* -----------------------------------------------------
                LISTA DE CANCIONES
            ----------------------------------------------------- */}

            <aside className="consol-playlist">

                <div className="consol-playlist-content">

                    <List
                        songs={songs}
                        loading={loadingSongs}
                        error={libraryError}
                        onSongSelect={selectSong}
                    />

                </div>

            </aside>


            {/* -----------------------------------------------------
                CONSOLA DJ
            ----------------------------------------------------- */}

            <main
                className="dj-console"
                data-theme={colorMode}
                style={{ "--cfg-text-scale": textScale }}
            >

                {/* -------------------------------------------------
                    HEADER
                ------------------------------------------------- */}

                <header className="console-header">

                    <div>

                        <span>
                            AETHEL MUSIC
                        </span>

                        <h1>
                            DJ CONSOLE
                        </h1>

                    </div>

                    <div className="console-header-actions">

                        <button
                            type="button"
                            className={`console-record-button ${
                                isRecording ? "is-recording" : ""
                            }`}
                            onClick={handleToggleRecord}
                            title={
                                isRecording
                                    ? "Detener grabación"
                                    : "Grabar sesión"
                            }
                        >
                            <span className="record-dot"></span>
                            <span>
                                {isRecording ? "GRABANDO" : "GRABAR"}
                            </span>
                        </button>

                        <button
                            type="button"
                            className={`console-download-button ${
                                downloadPulse ? "is-downloading" : ""
                            }`}
                            onClick={handleDownloadSession}
                            title="Descargar sesión"
                        >
                            <span className="download-arrow">↓</span>
                            <span>
                                DESCARGAR
                            </span>
                        </button>

                    </div>

                </header>


                {/* -------------------------------------------------
                    DECKS Y MIXER
                ------------------------------------------------- */}

                <div className="decks-container">

                    <DeckA
                        song={leftSong}
                        playing={leftPlaying}
                        setPlaying={setLeftPlaying}
                        volume={leftVolume}
                        setVolume={setLeftVolume}
                        pads={leftPads}
                        maxPads={MAX_PADS}
                        onImportPadFile={handleImportLeftPadFile}
                        pad={leftPad}
                        shuffle={leftShuffle}
                        onPrevious={() => {}}
                        onNext={() => {}}
                        onTogglePlay={toggleLeftPlay}
                        onToggleShuffle={toggleLeftShuffle}
                        onPad={handleLeftPad}
                        currentTime={leftCurrentTime}
                        setCurrentTime={setLeftCurrentTime}
                        duration={leftDuration}
                        setDuration={setLeftDuration}
                    />

                    <Mixer
                        leftChannelLevel={leftChannelLevel}
                        setLeftChannelLevel={setLeftChannelLevel}
                        rightChannelLevel={rightChannelLevel}
                        setRightChannelLevel={setRightChannelLevel}
                        crossfade={crossfade}
                        setCrossfade={setCrossfade}
                    />

                    <DeckB
                        song={rightSong}
                        playing={rightPlaying}
                        setPlaying={setRightPlaying}
                        volume={rightVolume}
                        setVolume={setRightVolume}
                        pads={rightPads}
                        maxPads={MAX_PADS}
                        onImportPadFile={handleImportRightPadFile}
                        pad={rightPad}
                        shuffle={rightShuffle}
                        onPrevious={() => {}}
                        onNext={() => {}}
                        onTogglePlay={toggleRightPlay}
                        onToggleShuffle={toggleRightShuffle}
                        onPad={handleRightPad}
                        currentTime={rightCurrentTime}
                        setCurrentTime={setRightCurrentTime}
                        duration={rightDuration}
                        setDuration={setRightDuration}
                    />

                </div>

            </main>

        </div>
    );
}

export default Consol;
