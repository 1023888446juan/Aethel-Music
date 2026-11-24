import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/interfaces_navbar/perfil.css";

function Perfil() {

    const navigate = useNavigate();

    // Datos del usuario.
    // Por ahora están vacíos.
    // Posteriormente serán obtenidos desde el backend.
    const [usuario, setUsuario] = useState({
        nombre: "",
        correo: "",
        foto: ""
    });

    useEffect(() => {

        // Aquí posteriormente irá la petición al backend.
        //
        // Ejemplo:
        //
        // fetch("http://localhost:8000/usuario/perfil")
        //     .then(response => response.json())
        //     .then(data => setUsuario(data));

    }, []);

    const handleCerrarSesion = () => {

        // Limpieza de datos de sesión.
        // Posteriormente aquí también se podrá eliminar
        // el token o sesión proporcionada por el backend.

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("usuario");

        // Regresar a la pantalla de usuario.
        navigate("/usuario");
    };

    return (
        <div className="perfil-container">

            <div className="perfil-content">

                <span className="perfil-subtitle">
                    AETHEL MUSIC
                </span>

                <h1>MI PERFIL</h1>

                <div className="perfil-card">

                    <div className="perfil-foto">

                        {usuario.foto ? (
                            <img
                                src={usuario.foto}
                                alt="Foto de perfil"
                            />
                        ) : (
                            <span>U</span>
                        )}

                    </div>

                    <h2>
                        {usuario.nombre || "Usuario"}
                    </h2>

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