/* =========================================================
   1. IMPORTS, ESTADO Y EFECTOS
   ========================================================= */

import React from "react";

function Personalizar({
    colorMode,
    onColorModeChange,
    textSize,
    onTextSizeChange,
    onSave,
    onClose
}) {

    /* =========================================================
       2. HANDLERS
       ========================================================= */

    const handleSelectMode = (mode) => {
        if (typeof onColorModeChange === "function") {
            onColorModeChange(mode);
        }
    };

    const handleRangeInput = (event) => {
        if (typeof onTextSizeChange === "function") {
            onTextSizeChange(Number(event.target.value));
        }
    };


    /* =========================================================
       3. RENDER PRINCIPAL
       ========================================================= */

    const textScale = (textSize || 100) / 100;

    return (
        <div
            className="personalizar-overlay"
            data-theme={colorMode}
            style={{ "--cfg-text-scale": textScale }}
        >
            <div
                className="personalizar-modal"
                data-theme={colorMode}
                style={{ "--cfg-text-scale": textScale }}
            >

                {/* -------------------------------------------------
                    ENCABEZADO
                ------------------------------------------------- */}

                <div className="personalizar-modal-header">
                    <div>
                        <span className="config-modal-label">
                            APARIENCIA
                        </span>

                        <h2>PERSONALIZAR COLORES Y PANTALLA </h2>

                        <p>
                            Ajusta la apariencia de Aethel Music a tu gusto.
                        </p>
                    </div>
                </div>


                {/* -------------------------------------------------
                    CONTENIDO
                ------------------------------------------------- */}

                <div className="personalizar-content">

                    {/* COLORES */}
                    <section className="personalizar-section">

                        <div className="personalizar-section-title">
                            <div className="personalizar-section-icon">
                                ◐
                            </div>

                            <div>
                                <h3>Modo de color</h3>
                                <p>
                                    Selecciona el ambiente visual de la aplicación.
                                </p>
                            </div>
                        </div>

                        <div className="appearance-options">

                            <button
                                type="button"
                                className={`appearance-option ${
                                    colorMode === "dark" ? "selected" : ""
                                }`}
                                onClick={() => handleSelectMode("dark")}
                            >
                                <div className="appearance-preview dark-preview">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>

                                <div className="appearance-option-info">
                                    <strong>Oscuro</strong>
                                    <small>
                                        Ideal para escuchar música durante la noche.
                                    </small>
                                </div>

                                <div className="appearance-check">
                                    {colorMode === "dark" && "✓"}
                                </div>
                            </button>

                            <button
                                type="button"
                                className={`appearance-option ${
                                    colorMode === "light" ? "selected" : ""
                                }`}
                                onClick={() => handleSelectMode("light")}
                            >
                                <div className="appearance-preview light-preview">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>

                                <div className="appearance-option-info">
                                    <strong>Claro</strong>
                                    <small>
                                        Una interfaz más luminosa y limpia.
                                    </small>
                                </div>

                                <div className="appearance-check">
                                    {colorMode === "light" && "✓"}
                                </div>
                            </button>

                        </div>
                    </section>

                    {/* TAMAÑO DEL TEXTO */}
                    <section className="personalizar-section">

                        <div className="personalizar-section-title">
                            <div className="personalizar-section-icon">
                                Aa
                            </div>

                            <div>
                                <h3>Tamaño del texto</h3>
                                <p>
                                    Modifica el tamaño general de los textos.
                                </p>
                            </div>
                        </div>

                        <div className="range-setting">

                            <div className="range-labels">
                                <span className="text-small">A</span>

                                <span className="current-setting">
                                    {textSize}%
                                </span>

                                <span className="text-large">A</span>
                            </div>

                            <input
                                type="range"
                                min="80"
                                max="130"
                                step="5"
                                value={textSize}
                                onChange={handleRangeInput}
                            />

                        </div>
                    </section>

                </div>


                {/* -------------------------------------------------
                    FOOTER
                ------------------------------------------------- */}

                <div className="personalizar-modal-footer">

                    <span className="settings-status">
                        Los cambios se aplicarán a tu interfaz.
                    </span>

                    <div className="personalizar-actions">

                        <button
                            type="button"
                            className="personalizar-cancel"
                            onClick={onClose}
                        >
                            CANCELAR
                        </button>

                        <button
                            type="button"
                            className="personalizar-save"
                            onClick={onSave}
                        >
                            GUARDAR CAMBIOS
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default Personalizar;