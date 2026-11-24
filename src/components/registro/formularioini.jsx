import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/interfaces_navbar/iniciar_sesion.css";

function FormularioIni() {

    const navigate = useNavigate();

    const [usuario, setUsuario] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Inicio de sesión:", {
            usuario,
            correo,
            password
        });
    };

    return (
        <div className="login-container">

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


                    {/* INICIAR SESIÓN */}

                    <button
                        type="submit"
                        className="login-button"
                        onClick={() => navigate("/perfil")}
                    >
                        INICIAR SESIÓN
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