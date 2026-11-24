function Mixer({
    leftChannelLevel,
    setLeftChannelLevel,
    rightChannelLevel,
    setRightChannelLevel,
    crossfade,
    setCrossfade
}) {

    return (
        <section className="mixer">

            <div className="mixer-title">
                MIXER
            </div>

            {/* =================================
                FADER A
                ================================= */}

            <div className="vertical-fader">

                <span>
                    8
                </span>

                <input
                    type="range"
                    min="0"
                    max="8"
                    value={leftChannelLevel}
                    onChange={(e) =>
                        setLeftChannelLevel(
                            Number(
                                e.target.value
                            )
                        )
                    }
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

            {/* =================================
                FADER B
                ================================= */}

            <div className="vertical-fader">

                <span>
                    8
                </span>

                <input
                    type="range"
                    min="0"
                    max="8"
                    value={rightChannelLevel}
                    onChange={(e) =>
                        setRightChannelLevel(
                            Number(
                                e.target.value
                            )
                        )
                    }
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

            {/* =================================
                CROSSFADER
                ================================= */}

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
                    onChange={(e) =>
                        setCrossfade(
                            Number(
                                e.target.value
                            )
                        )
                    }
                />

                <span>
                    B
                </span>

            </div>

        </section>
    );
}

export default Mixer;