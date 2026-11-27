/* =========================================================
   1. IMPORTS, ESTADO Y EFECTOS
   ========================================================= */

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/interfaces_navbar/perfil.css";
import { api, loadProfilePhotoUrl } from "../services/api";

const STORAGE_KEYS = {
    colorMode: "aethel_color_mode",
    textSize: "aethel_text_size",
    usuario: "usuario"
};

function leerUsuarioGuardado() {
    try {
        const datos = JSON.parse(localStorage.getItem(STORAGE_KEYS.usuario) || "{}");
        return {
            nombre: datos.nombre_usuario || datos.nombre || "",
            correo: datos.correo_usuario || datos.correo || "",
            foto: datos.foto_perfil || datos.foto || ""
        };
    } catch {
        return { nombre: "", correo: "", foto: "" };
    }
}

function Perfil() {
    const navigate = useNavigate();
    const avatarInputRef = useRef(null);
    const photoUrlRef = useRef(null);
    const [savingPhoto, setSavingPhoto] = useState(false);
    const [photoError, setPhotoError] = useState("");

    const [colorMode, setColorMode] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.colorMode);
        return saved === "light" || saved === "dark" ? saved : "dark";
    });

    const [textSize, setTextSize] = useState(() => {
        const saved = Number(localStorage.getItem(STORAGE_KEYS.textSize));
        return saved >= 80 && saved <= 130 ? saved : 100;
    });

    const [usuario, setUsuario] = useState(leerUsuarioGuardado);

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
        let cancelled = false;
        const cargarPerfil = async () => {
            if (!localStorage.getItem("aethel_access_token") && !localStorage.getItem("token")) return;
            try {
                const datos = await api.profile();
                if (cancelled) return;
                setUsuario((previous) => ({
                    ...previous,
                    nombre: datos.nombre || previous.nombre,
                    correo: datos.correo || previous.correo
                }));
                localStorage.setItem(STORAGE_KEYS.usuario, JSON.stringify(datos));
                if (datos.ruta_foto_perfil) {
                    const photoUrl = await loadProfilePhotoUrl();
                    if (cancelled) {
                        URL.revokeObjectURL(photoUrl);
                        return;
                    }
                    photoUrlRef.current = photoUrl;
                    setUsuario((previous) => ({ ...previous, foto: photoUrl }));
                }
            } catch (error) {
                console.error("No se pudo cargar el perfil desde la API:", error);
            }
        };
        cargarPerfil();
        return () => {
            cancelled = true;
            if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
        };
    }, []);


    /* =========================================================
       2. HANDLERS
       ========================================================= */

    const handleOpenAvatarPicker = () => {
        avatarInputRef.current?.click();
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !file.type.startsWith("image/")) return;
        const previousPhoto = usuario.foto;
        const previewUrl = URL.createObjectURL(file);
        setUsuario((prev) => ({ ...prev, foto: previewUrl }));
        setSavingPhoto(true);
        setPhotoError("");
        try {
            const savedPhoto = await api.uploadProfilePhoto(file);
            const persistedUrl = await loadProfilePhotoUrl();
            if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
            photoUrlRef.current = persistedUrl;
            URL.revokeObjectURL(previewUrl);
            setUsuario((prev) => ({ ...prev, foto: persistedUrl }));
            const savedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.usuario) || "{}");
            localStorage.setItem(STORAGE_KEYS.usuario, JSON.stringify({
                ...savedUser,
                nombre: usuario.nombre,
                correo: usuario.correo,
                ruta_foto_perfil: savedPhoto.ruta_foto_perfil
            }));
        } catch (error) {
            URL.revokeObjectURL(previewUrl);
            setUsuario((prev) => ({ ...prev, foto: previousPhoto }));
            setPhotoError(error.message || "No se pudo guardar la foto de perfil.");
        } finally {
            setSavingPhoto(false);
            event.target.value = "";
        }
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
                            title={savingPhoto ? "Guardando foto de perfil" : "Cambiar foto de perfil"}
                            aria-label="Cambiar foto de perfil"
                            disabled={savingPhoto}
                        >
                            ✎
                        </button>

                        {savingPhoto && <span role="status">Guardando foto…</span>}
                        {photoError && <span role="alert">{photoError}</span>}

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
