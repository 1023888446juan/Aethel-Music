import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/interfaces_navbar/usuario.css";

import logoAethel from "../assets/img/logoblanco.png";

function Usuario() {

    const navigate = useNavigate();

    return (
        <div className="usuario-container">

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