/* =========================================================
   1. IMPORTS, ESTADO Y EFECTOS
   ========================================================= */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/interfaces_navbar/usuario.css";

import logoAethel from "../assets/img/logoblanco.png";

const STORAGE_KEYS = {
    colorMode: "aethel_color_mode",
    textSize: "aethel_text_size"
};

function Usuario() {
    const navigate = useNavigate();

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

    // Si ya existe una sesión guardada, abrir el perfil en vez de volver
    // a mostrar la pantalla de inicio de sesión.
    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/perfil", { replace: true });
        }
    }, [navigate]);



    /* =========================================================
       2. RENDER PRINCIPAL
       ========================================================= */

    return (
        <div
            className="usuario-container"
            data-theme={colorMode}
            style={{ "--cfg-text-scale": textScale }}
        >

            <div className="usuario-background"></div>

            <div className="usuario-content">

                <span className="usuario-subtitle">
                    AETHEL MUSIC
                </span>

                <h1>MI PERFIL</h1>

                <p className="usuario-description">
                    Ingresa con tu cuenta para guardar tu música,
                    tus preferencias y tus datos en la nube.
                </p>

                <div className="usuario-actions">

                    <button
                        className="usuario-button primary"
                        onClick={() => navigate("/iniciar-sesion")}
                    >
                        <span>INICIAR SESIÓN</span>
                    </button>

                    <button
                        className="usuario-button secondary"
                        onClick={() => navigate("/registro")}
                    >

                        <img
                            src={logoAethel}
                            alt="Aethel Music"
                            className="usuario-button-logo"
                        />

                        <span>CREAR CUENTA</span>

                    </button>

                </div>

            </div>

        </div>
    );
}

export default Usuario;