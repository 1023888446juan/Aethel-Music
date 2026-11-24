import { useState } from "react";
import "../styles/interfaces_navbar/consol.css";

import List from "../components/List";

import DeckA from "../components/consola/deckA";
import DeckB from "../components/consola/deckB";
import Mixer from "../components/consola/mixer";

function Consol() {

    // =========================================
    // ESTADOS DE LOS DECKS
    // =========================================

    const [leftSong, setLeftSong] = useState(null);
    const [rightSong, setRightSong] = useState(null);

    const [leftPlaying, setLeftPlaying] = useState(false);
    const [rightPlaying, setRightPlaying] = useState(false);

    const [leftVolume, setLeftVolume] = useState(70);
    const [rightVolume, setRightVolume] = useState(70);

    // =========================================
    // MIXER
    // =========================================

    const [leftChannelLevel, setLeftChannelLevel] = useState(3);
    const [rightChannelLevel, setRightChannelLevel] = useState(6);

    const [crossfade, setCrossfade] = useState(50);

    // =========================================
    // PERFORMANCE PADS
    // =========================================

    const [leftPad, setLeftPad] = useState(null);
    const [rightPad, setRightPad] = useState(null);

    // =========================================
    // SHUFFLE
    // =========================================

    const [leftShuffle, setLeftShuffle] = useState(false);
    const [rightShuffle, setRightShuffle] = useState(false);

    // =========================================
    // SELECCIONAR CANCIÓN
    // =========================================

    const selectSong = (song) => {

        if (!leftPlaying) {
            setLeftSong(song);
        } else {
            setRightSong(song);
        }

    };

    // =========================================
    // PLAY / PAUSE
    // =========================================

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

    // =========================================
    // SHUFFLE
    // =========================================

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

    // =========================================
    // PERFORMANCE PADS
    // =========================================

    const handleLeftPad = (pad) => {

        setLeftPad(pad);

        setTimeout(() => {
            setLeftPad(null);
        }, 250);

    };

    const handleRightPad = (pad) => {

        setRightPad(pad);

        setTimeout(() => {
            setRightPad(null);
        }, 250);

    };

    // =========================================
    // INTERFAZ
    // =========================================

    return (
        <div className="consol-container">

            {/* =====================================
                LISTA DE CANCIONES
                ===================================== */}

            <aside className="consol-playlist">

                <div className="consol-playlist-content">

                    <List
                        onSongSelect={selectSong}
                    />

                </div>

            </aside>

            {/* =====================================
                DJ CONSOLE
                ===================================== */}

            <main className="dj-console">

                <header className="console-header">

                    <div>

                        <span>
                            AETHEL MUSIC
                        </span>

                        <h1>
                            DJ CONSOLE
                        </h1>

                    </div>

                    <div className="console-status">
                        LIVE
                    </div>

                </header>

                {/* =====================================
                    DECKS
                    ===================================== */}

                <div className="decks-container">

                    <DeckA
                        song={leftSong}
                        playing={leftPlaying}
                        volume={leftVolume}
                        setVolume={setLeftVolume}
                        pad={leftPad}
                        shuffle={leftShuffle}
                        onPrevious={() => {}}
                        onNext={() => {}}
                        onTogglePlay={toggleLeftPlay}
                        onToggleShuffle={toggleLeftShuffle}
                        onPad={handleLeftPad}
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
                        volume={rightVolume}
                        setVolume={setRightVolume}
                        pad={rightPad}
                        shuffle={rightShuffle}
                        onPrevious={() => {}}
                        onNext={() => {}}
                        onTogglePlay={toggleRightPlay}
                        onToggleShuffle={toggleRightShuffle}
                        onPad={handleRightPad}
                    />

                </div>

            </main>

        </div>
    );
}

export default Consol;