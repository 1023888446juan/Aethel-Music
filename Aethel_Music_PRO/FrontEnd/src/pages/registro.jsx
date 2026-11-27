/* =========================================================
   1. IMPORTS, ESTADO Y EFECTOS
   ========================================================= */

import React, { useEffect, useState } from "react";
import FormularioRegi from "../components/registro/formularioregi";
import "../styles/interfaces_navbar/usuario.css";

const STORAGE_KEYS = {
    colorMode: "aethel_color_mode",
    textSize: "aethel_text_size"
};

function Registro() {
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
       2. RENDER PRINCIPAL
       ========================================================= */

    return (
        <div
            className="registro-container"
            data-theme={colorMode}
            style={{ "--cfg-text-scale": textScale }}
        >

            <div className="registro-background"></div>

            <FormularioRegi />

        </div>
    );
}

export default Registro;