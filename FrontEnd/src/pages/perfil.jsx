/* =========================================================
   1. IMPORTS, ESTADO Y EFECTOS
   ========================================================= */

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import "../styles/interfaces_navbar/perfil.css";

const STORAGE_KEYS = {
    colorMode: "aethel_color_mode",
    textSize: "aethel_text_size",
    usuario: "usuario"
};

function Perfil() {
    const navigate = useNavigate();
    const avatarInputRef = useRef(null);

    const [colorMode, setColorMode] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.colorMode);
        return saved === "light" || saved === "dark" ? saved : "dark";
    });

    const [textSize, setTextSize] = useState(() => {
        const saved = Number(localStorage.getItem(STORAGE_KEYS.textSize));
        return saved >= 80 && saved <= 130 ? saved : 100;
    });

    const [usuario, setUsuario] = useState({
        nombre: "",
        correo: "",
        foto: ""
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

    useEffect(() => {
        let activo = true;

        const cargarPerfil = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/iniciar-sesion", { replace: true });
                return;
            }

            try {
                const response = await apiFetch("/api/usuarios/perfil");
                const datos = await response.json().catch(() => ({}));

                if (!response.ok) {
                    if (activo) navigate("/iniciar-sesion", { replace: true });
                    return;
                }

                if (activo) {
                    setUsuario({
                        nombre: datos.nombre || "",
                        correo: datos.correo || "",
                        foto: datos.ruta_foto_perfil || ""
                    });
                    localStorage.setItem(STORAGE_KEYS.usuario, JSON.stringify(datos));
                }
            } catch (error) {
                console.error("No se pudo verificar la sesión:", error);
                if (activo) navigate("/iniciar-sesion", { replace: true });
            }
        };

        cargarPerfil();
        return () => {
            activo = false;
        };
    }, [navigate]);


    /* =========================================================
       2. HANDLERS
       ========================================================= */

    const handleOpenAvatarPicker = () => {
        avatarInputRef.current?.click();
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];
        if (!file || !file.type.startsWith("image/")) return;

        const reader = new FileReader();
        reader.onload = () => {
            const nextPhoto = typeof reader.result === "string" ? reader.result : "";
            if (!nextPhoto) return;

            setUsuario((prev) => ({
                ...prev,
                foto: nextPhoto
            }));

            try {
                const rawSaved = localStorage.getItem(STORAGE_KEYS.usuario);
                const parsed = rawSaved ? JSON.parse(rawSaved) : {};
                localStorage.setItem(
                    STORAGE_KEYS.usuario,
                    JSON.stringify({
                        ...parsed,
                        foto: nextPhoto,
                        foto_perfil: nextPhoto
                    })
                );
            } catch (error) {
                console.error("Error al guardar la foto de perfil:", error);
            }
        };

        reader.readAsDataURL(file);
        event.target.value = "";
    };

    const handleCerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem(STORAGE_KEYS.usuario);

        sessionStorage.removeItem("token");
        sessionStorage.removeItem(STORAGE_KEYS.usuario);

        navigate("/usuario");
    };


    /* =========================================================
       3. RENDER PRINCIPAL
       ========================================================= */

    return (
        <div
            className="perfil-container"
            data-theme={colorMode}
            style={{ "--cfg-text-scale": textScale }}
        >

            <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="perfil-file-input"
                onChange={handleAvatarChange}
            />

            <div className="perfil-content">

                <span className="perfil-subtitle">
                    AETHEL MUSIC
                </span>

                <h1>MI PERFIL</h1>

                <div className="perfil-card">

                    <div className="perfil-avatar-wrapper">

                        <div className="perfil-foto">

                            {usuario.foto ? (
                                <img
                                    src={usuario.foto}
                                    alt="Foto de perfil"
                                />
                            ) : (
                                <span>
                                    {usuario.nombre
                                        ? usuario.nombre.charAt(0).toUpperCase()
                                        : "U"
                                    }
                                </span>
                            )}

                        </div>

                        <button
                            type="button"
                            className="perfil-edit-pencil"
                            onClick={handleOpenAvatarPicker}
                            title="Cambiar foto de perfil"
                            aria-label="Cambiar foto de perfil"
                        >
                            ✎
                        </button>

                    </div>

                    <div className="perfil-identity">

                        <h2>
                            {usuario.nombre || "Usuario"}
                        </h2>

                        <span className="perfil-status-pill">
                            CUENTA ACTIVA
                        </span>

                    </div>

                    <div className="perfil-datos">

                        <div className="perfil-dato">

                            <span className="perfil-label">
                                CORREO ELECTRÓNICO
                            </span>

                            <p>
                                {usuario.correo || "Sin correo registrado"}
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        className="perfil-logout"
                        onClick={handleCerrarSesion}
                    >
                        CERRAR SESIÓN
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Perfil;