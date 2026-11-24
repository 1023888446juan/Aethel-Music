/* =========================================================
   1. IMPORTS, ESTADO Y EFECTOS
   ========================================================= */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/interfaces_navbar/registro.css";

const STORAGE_KEYS = {
    colorMode: "aethel_color_mode",
    textSize: "aethel_text_size"
};

function FormularioRegi() {
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
    const [contrasena, setContrasena] = useState("");
    const [confirmarContrasena, setConfirmarContrasena] = useState("");

    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
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

    const handleCrearCuenta = async (event) => {
        event.preventDefault();

        setError("");
        setMensaje("");

        if (contrasena !== confirmarContrasena) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setCargando(true);

        try {
            const respuesta = await fetch(
                "http://127.0.0.1:8000/usuarios/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nombre_usuario: usuario,
                        correo_usuario: correo,
                        contrasena_usuario: contrasena
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                setError(
                    datos.detail || "No se pudo crear la cuenta."
                );
                return;
            }

            setMensaje("Cuenta creada correctamente.");
            console.log("Usuario creado:", datos);

            setUsuario("");
            setCorreo("");
            setContrasena("");
            setConfirmarContrasena("");

            setTimeout(() => {
                navigate("/iniciar-sesion");
            }, 1500);
        } catch (err) {
            console.error("Error al conectar con el backend:", err);
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
            className="registro-container"
            data-theme={colorMode}
            style={{ "--cfg-text-scale": textScale }}
        >

            <div className="registro-content">

                <span className="registro-subtitle">
                    AETHEL MUSIC
                </span>

                <span className="crear-cuenta">
                    <h1>CREAR CUENTA</h1>
                </span>

                <form
                    className="registro-card"
                    onSubmit={handleCrearCuenta}
                >

                    {/* USUARIO */}
                    <div className="registro-field">

                        <label htmlFor="usuario">
                            USUARIO
                        </label>

                        <input
                            type="text"
                            id="usuario"
                            name="usuario"
                            placeholder="Ingresa tu usuario"
                            value={usuario}
                            onChange={(e) =>
                                setUsuario(e.target.value)
                            }
                            required
                        />

                    </div>

                    {/* CORREO */}
                    <div className="registro-field">

                        <label htmlFor="correo">
                            CORREO
                        </label>

                        <input
                            type="email"
                            id="correo"
                            name="correo"
                            placeholder="Ingresa tu correo"
                            value={correo}
                            onChange={(e) =>
                                setCorreo(e.target.value)
                            }
                            required
                        />

                    </div>

                    {/* CONTRASEÑA */}
                    <div className="registro-field">

                        <label htmlFor="contrasena">
                            CONTRASEÑA
                        </label>

                        <input
                            type="password"
                            id="contrasena"
                            name="contrasena"
                            placeholder="Ingresa tu contraseña"
                            value={contrasena}
                            onChange={(e) =>
                                setContrasena(e.target.value)
                            }
                            required
                        />

                    </div>

                    {/* CONFIRMAR CONTRASEÑA */}
                    <div className="registro-field">

                        <label htmlFor="confirmarContrasena">
                            CONFIRMAR CONTRASEÑA
                        </label>

                        <input
                            type="password"
                            id="confirmarContrasena"
                            name="confirmarContrasena"
                            placeholder="Confirma tu contraseña"
                            value={confirmarContrasena}
                            onChange={(e) =>
                                setConfirmarContrasena(e.target.value)
                            }
                            required
                        />

                    </div>

                    {/* MENSAJE DE ERROR */}
                    {error && (
                        <p className="registro-error">
                            {error}
                        </p>
                    )}

                    {/* MENSAJE DE ÉXITO */}
                    {mensaje && (
                        <p className="registro-success">
                            {mensaje}
                        </p>
                    )}

                    {/* CREAR CUENTA */}
                    <button
                        type="submit"
                        className="registro-button"
                        disabled={cargando}
                    >
                        {cargando
                            ? "CREANDO CUENTA..."
                            : "CREAR CUENTA"
                        }
                    </button>

                    {/* VOLVER (DENTRO DE LA TARJETA, DEBAJO DE CREAR CUENTA) */}
                    <button
                        type="button"
                        className="registro-back"
                        onClick={() => navigate("/usuario")}
                    >
                        VOLVER
                    </button>

                </form>

            </div>

        </div>
    );
}

export default FormularioRegi;