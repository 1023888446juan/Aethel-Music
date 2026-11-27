/* =========================================================
   1. IMPORTS, ESTADO Y EFECTOS
   ========================================================= */

import { useEffect, useState } from "react";
import "../styles/interfaces_navbar/config.css";

import Personalizar from "../components/configuracion/personalizar";
import settingsIcon from "../assets/img/configuracion/settings_cons.png";

const STORAGE_KEYS = {
    colorMode: "aethel_color_mode",
    textSize: "aethel_text_size"
};

function Config() {
    const [activePage, setActivePage] = useState("personalizar");

    const [colorMode, setColorMode] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.colorMode);
        return saved === "light" || saved === "dark" ? saved : "dark";
    });

    const [textSize, setTextSize] = useState(() => {
        const saved = Number(localStorage.getItem(STORAGE_KEYS.textSize));
        return saved >= 80 && saved <= 130 ? saved : 100;
    });

    const textScale = textSize / 100;

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", colorMode);
        localStorage.setItem(STORAGE_KEYS.colorMode, colorMode);
    }, [colorMode]);

    useEffect(() => {
        document.documentElement.style.setProperty("--cfg-text-scale", String(textScale));
    }, [textScale]);


    /* =========================================================
       2. HANDLERS
       ========================================================= */

    const handleColorModeChange = (nextMode) => {
        if (nextMode === "light" || nextMode === "dark") {
            setColorMode(nextMode);
        }
    };

    const handleTextSizeChange = (nextSize) => {
        const numericSize = Number(nextSize);
        if (!Number.isNaN(numericSize)) {
            setTextSize(numericSize);
        }
    };

    const handleSave = () => {
        localStorage.setItem(STORAGE_KEYS.colorMode, colorMode);
        localStorage.setItem(STORAGE_KEYS.textSize, String(textSize));
    };

    const handleClose = () => {
        const savedMode = localStorage.getItem(STORAGE_KEYS.colorMode);
        const savedText = Number(localStorage.getItem(STORAGE_KEYS.textSize));

        setColorMode(savedMode === "light" || savedMode === "dark" ? savedMode : "dark");
        setTextSize(savedText >= 80 && savedText <= 130 ? savedText : 100);
    };


    /* =========================================================
       3. RENDER PRINCIPAL
       ========================================================= */

    return (
        <div
            className="config-container"
            data-theme={colorMode}
            style={{ "--cfg-text-scale": textScale }}
        >

            {/* -----------------------------------------------------
                FONDO
            ----------------------------------------------------- */}

            <div className="config-background"></div>


            {/* -----------------------------------------------------
                SIDEBAR
            ----------------------------------------------------- */}

            <aside className="config-sidebar">

                <div className="config-sidebar-title">
                    <span>CONFIGURACIÓN</span>
                </div>

                <button
                    type="button"
                    className={
                        activePage === "personalizar"
                            ? "config-menu-item active"
                            : "config-menu-item"
                    }
                    onClick={() => setActivePage("personalizar")}
                >

                    <span className="config-menu-icon">
                        <img
                            src={settingsIcon}
                            alt="Personalizar"
                        />
                    </span>

                    <span>
                        Personalizar
                    </span>

                </button>

            </aside>


            {/* -----------------------------------------------------
                CONTENIDO PRINCIPAL
            ----------------------------------------------------- */}

            <main className="config-main">

        

                {activePage === "personalizar" && (
                    <Personalizar
                        colorMode={colorMode}
                        onColorModeChange={handleColorModeChange}
                        textSize={textSize}
                        onTextSizeChange={handleTextSizeChange}
                        onSave={handleSave}
                        onClose={handleClose}
                    />
                )}

            </main>

        </div>
    );
}

export default Config;