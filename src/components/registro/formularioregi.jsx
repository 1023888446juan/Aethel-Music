import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/interfaces_navbar/registro.css";

function FormularioRegi() {
    const navigate = useNavigate();

    const handleCrearCuenta = (event) => {
        event.preventDefault();

        navigate("/crear-cuenta");
    };

    return (
        <div className="registro-container">

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

                    <div className="registro-field">

                        <label htmlFor="usuario">
                            USUARIO
                        </label>

                        <input
                            type="text"
                            id="usuario"
                            name="usuario"
                            placeholder="Ingresa tu usuario"
                        />

                    </div>

                    <div className="registro-field">

                        <label htmlFor="correo">
                            CORREO
                        </label>

                        <input
                            type="email"
                            id="correo"
                            name="correo"
                            placeholder="Ingresa tu correo"
                        />

                    </div>

                    <div className="registro-field">

                        <label htmlFor="contrasena">
                            CONTRASEÑA
                        </label>

                        <input
                            type="password"
                            id="contrasena"
                            name="contrasena"
                            placeholder="Ingresa tu contraseña"
                        />

                    </div>

                    <div className="registro-field">

                        <label htmlFor="confirmarContrasena">
                            CONFIRMAR CONTRASEÑA
                        </label>

                        <input
                            type="password"
                            id="confirmarContrasena"
                            name="confirmarContrasena"
                            placeholder="Confirma tu contraseña"
                        />

                    </div>

                    <button
                        type="button"
                        className="registro-button"
                        onClick={() => navigate("/iniciar-sesion")}

                    >
                        CREAR CUENTA
                        
                    </button>

                </form>

                <button
                    type="button"
                    className="registro-back"
                    onClick={() => navigate("/usuario")}
                >
                    VOLVER
                </button>

            </div>

        </div>
    );
}

export default FormularioRegi;