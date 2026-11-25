/* =========================================================
   1. IMPORTS, ESTADO Y EFECTOS
   ========================================================= */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/interfaces_navbar/iniciar_sesion.css";

const STORAGE_KEYS = {
    colorMode: "aethel_color_mode",
    textSize: "aethel_text_size"
};

function FormularioIni() {
    const navigate = useNavigate();

    const [colorMode, setColorMode] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.colorMode);
        return saved === "light" || saved === "dark" ? saved : "dark";
    });

    const [textSize, setTextSize] = useState(() => {
        const saved = Number(localStorage.getItem(STORAGE_KEYS.textSize));
        return saved >= 80 && saved <= 130 ? saved : 100;
    });

    const [usuario, setUsuario] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setCargando(true);

        try {
            const respuesta = await fetch(
                "http://127.0.0.1:8000/usuarios/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        correo_usuario: correo,
                        contrasena_usuario: password
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                setError(
                    datos.detail || "Correo o contraseña incorrectos."
                );
                return;
            }

            console.log("Inicio de sesión exitoso:", datos);

            localStorage.setItem(
                "usuario",
                JSON.stringify(datos)
            );

            navigate("/perfil");
        } catch (err) {
            console.error(
                "Error al conectar con el backend:",
                err
            );
            setError(
                "No se pudo conectar con el servidor. Verifica que FastAPI esté ejecutándose."
            );
        } finally {
            setCargando(false);
        }
    };


    /* =========================================================
       3. RENDER PRINCIPAL
       ========================================================= */

    return (
        <div
            className="login-container"
            data-theme={colorMode}
            style={{ "--cfg-text-scale": textScale }}
        >

            <div className="login-background"></div>

            <div className="login-content">

                <span className="login-subtitle">
                    AETHEL MUSIC
                </span>

                <h1>INICIAR SESIÓN</h1>

                <form
                    className="login-card"
                    onSubmit={handleSubmit}
                >

                    {/* USUARIO */}
                    <div className="login-field">

                        <label>
                            USUARIO
                        </label>

                        <input
                            type="text"
                            placeholder="Ingresa tu usuario"
                            value={usuario}
                            onChange={(e) =>
                                setUsuario(e.target.value)
                            }
                            required
                        />

                    </div>

                    {/* CORREO */}
                    <div className="login-field">

                        <label>
                            CORREO ELECTRÓNICO
                        </label>

                        <input
                            type="email"
                            placeholder="Ingresa tu correo electrónico"
                            value={correo}
                            onChange={(e) =>
                                setCorreo(e.target.value)
                            }
                            required
                        />

                    </div>

                    {/* CONTRASEÑA */}
                    <div className="login-field">

                        <label>
                            CONTRASEÑA
                        </label>

                        <input
                            type="password"
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>

                    {/* MENSAJE DE ERROR */}
                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    {/* INICIAR SESIÓN */}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={cargando}
                    >
                        {cargando
                            ? "INICIANDO SESIÓN..."
                            : "INICIAR SESIÓN"
                        }
                    </button>

                    {/* VOLVER */}
                    <button
                        type="button"
                        className="login-back"
                        onClick={() => navigate("/usuario")}
                    >
                        VOLVER AL PERFIL
                    </button>

                </form>

            </div>

        </div>
    );
}

export default FormularioIni;