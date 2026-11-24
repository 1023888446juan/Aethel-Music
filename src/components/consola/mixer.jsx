/* =========================================================
   1. IMPORTS, ESTADO Y EFECTOS
   ========================================================= */

import React from "react";

function Mixer({
    leftChannelLevel,
    setLeftChannelLevel,
    rightChannelLevel,
    setRightChannelLevel,
    crossfade,
    setCrossfade
}) {

    /* =========================================================
       2. HANDLERS
       ========================================================= */

    const handleLeftChange = (e) => {
        setLeftChannelLevel(Number(e.target.value));
    };

    const handleRightChange = (e) => {
        setRightChannelLevel(Number(e.target.value));
    };

    const handleCrossfadeChange = (e) => {
        setCrossfade(Number(e.target.value));
    };


    /* =========================================================
       3. RENDER PRINCIPAL
       ========================================================= */

    return (
        <section className="mixer">

            <div className="mixer-title">
                MIXER
            </div>

            {/* -------------------------------------------------
                FADER A
            ------------------------------------------------- */}

            <div className="vertical-fader">

                <span>
                    8
                </span>

                <input
                    type="range"
                    min="0"
                    max="8"
                    value={leftChannelLevel}
                    onChange={handleLeftChange}
                    style={{
                        "--fader-progress": `${
                            (leftChannelLevel / 8) *
                            100
                        }%`,
                    }}
                />

                <span>
                    0
                </span>

            </div>

            {/* -------------------------------------------------
                FADER B
            ------------------------------------------------- */}

            <div className="vertical-fader">

                <span>
                    8
                </span>

                <input
                    type="range"
                    min="0"
                    max="8"
                    value={rightChannelLevel}
                    onChange={handleRightChange}
                    style={{
                        "--fader-progress": `${
                            (rightChannelLevel / 8) *
                            100
                        }%`,
                    }}
                />

                <span>
                    0
                </span>

            </div>

            {/* -------------------------------------------------
                CROSSFADER
            ------------------------------------------------- */}

            <div className="crossfader">

                <span>
                    A
                </span>

                <input
                    type="range"
                    min="0"
                    max="100"
                    value={crossfade}
                    style={{
                        "--crossfade-progress": `${crossfade}%`,
                    }}
                    onChange={handleCrossfadeChange}
                />

                <span>
                    B
                </span>

            </div>

        </section>
    );
}

export default Mixer;