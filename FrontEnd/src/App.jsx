import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useRef } from "react";

import "./styles/App.css";

import Navbar from "./components/Navbar";

import Home from "./pages/home";
import Consol from "./pages/consol";
import Albumes from "./pages/albumes";
import Config from "./pages/config";

import Usuario from "./pages/usuario";
import IniciarSesion from "./pages/iniciar_sesion";
import Registro from "./pages/registro";
import Perfil from "./pages/perfil";

import logoTri from "./assets/img/Logotri.png";
import logoText from "./assets/img/Logotext.png";
import carpeta from "./assets/img/carp.png";
import { addLocalFiles } from "./services/localLibrary";

function Inicio() {

    const navigate = useNavigate();
    const audioFilesRef = useRef(null);
    const folderFilesRef = useRef(null);

    const handleArchivo = async (e) => {
        const files = e.target.files;
        if (!files?.length) return;

        try {
            const addedTracks = await addLocalFiles(files);
            if (!addedTracks.length) {
                window.alert("No se encontraron archivos de audio compatibles.");
                return;
            }
            navigate("/home");
        } catch (error) {
            window.alert(error.message || "No se pudo guardar la música en este dispositivo.");
        } finally {
            e.target.value = "";
        }
    };

    return (

        <main className="inicio">

            <div className="inicio-orb inicio-orb-left"></div>

            <div className="inicio-orb inicio-orb-right"></div>

            <div className="inicio-grid"></div>

            <div className="contenedor">

                <div className="logo-area">

                    <div className="logo-glow"></div>

                    <img
                        src={logoTri}
                        className="logo-tri"
                        alt="Aethel Music"
                    />

                </div>

                <div className="contenido-inicio">

                    <div className="welcome-text">

                        <span className="welcome-line">
                            BIENVENIDO A
                        </span>

                        <span className="welcome-small">
                            TU ESPACIO
                        </span>

                    </div>

                    <div className="logo-text-area">

                        <img
                            src={logoText}
                            className="logo-text"
                            alt="Aethel Music"
                        />

                    </div>

                    <p className="inicio-description">
                        Tu música, tus mezclas, tu espacio.
                    </p>

                    <div className="archivo-area">

                        <input
                            type="file"
                            ref={audioFilesRef}
                            hidden
                            accept="audio/*"
                            multiple
                            onChange={handleArchivo}
                        />
                        <input
                            ref={folderFilesRef}
                            type="file"
                            hidden
                            accept="audio/*"
                            multiple
                            webkitdirectory=""
                            onChange={handleArchivo}
                        />

                        <button
                            type="button"
                            className="boton-archivo"
                            onClick={() => {
                                audioFilesRef.current?.click();
                            }}
                        >

                            <span className="icono-archivo">

                                <img
                                    src={carpeta}
                                    alt=""
                                />

                            </span>

                            <span className="texto-archivo">
                                ABRIR ARCHIVOS
                            </span>

                            <span className="brillo-boton"></span>

                        </button>

                        <button
                            type="button"
                            className="boton-archivo"
                            onClick={() => folderFilesRef.current?.click()}
                        >
                            <span className="icono-archivo">
                                <img src={carpeta} alt="" />
                            </span>
                            <span className="texto-archivo">
                                ABRIR CARPETA DE MÚSICA
                            </span>
                            <span className="brillo-boton"></span>
                        </button>
                    </div>

                    <div className="inicio-status">

                        <span className="status-dot"></span>

                        <span>
                            LISTO PARA REPRODUCIR
                        </span>

                    </div>

                </div>

            </div>

            <section className="info-aethel">

                <div className="info-titulo">

                    <span>
                        DESCUBRE AETHEL MUSIC
                    </span>

                    <h2>
                        TODO LO QUE NECESITAS PARA TU MÚSICA
                    </h2>

                </div>

                <div className="info-cards">

                    <button
                        type="button"
                        className="info-card"
                        onClick={() => navigate("/home")}
                    >

                        <div className="card-icon">
                            ♪
                        </div>

                        <div className="card-content">

                            <span className="card-label">
                                MÚSICA
                            </span>

                            <h3>
                                Tu biblioteca
                            </h3>

                            <p>
                                Escucha y organiza toda tu música
                                desde un solo lugar.
                            </p>

                        </div>

                        <span className="card-arrow">
                            →
                        </span>

                    </button>

                    <button
                        type="button"
                        className="info-card"
                        onClick={() => navigate("/consol")}
                    >

                        <div className="card-icon">
                            ♫
                        </div>

                        <div className="card-content">

                            <span className="card-label">
                                DJ
                            </span>

                            <h3>
                                Consola de mezclas
                            </h3>

                            <p>
                                Mezcla tus canciones y crea
                                tu propia experiencia musical.
                            </p>

                        </div>

                        <span className="card-arrow">
                            →
                        </span>

                    </button>

                    <button
                        type="button"
                        className="info-card"
                        onClick={() => navigate("/albumes")}
                    >

                        <div className="card-icon">
                            ♬
                        </div>

                        <div className="card-content">

                            <span className="card-label">
                                COLECCIÓN
                            </span>

                            <h3>
                                Tus álbumes
                            </h3>

                            <p>
                                Encuentra tus álbumes y organiza
                                tus canciones favoritas.
                            </p>

                        </div>

                        <span className="card-arrow">
                            →
                        </span>

                    </button>

                </div>

                <footer className="aethel-footer">

                    <span className="equalizer">

                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>

                    </span>

                    <span>
                        TU MÚSICA · TU MOMENTO · TU ESPACIO
                    </span>

                    <span className="equalizer">

                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>

                    </span>

                </footer>

            </section>

        </main>
    );
}

function App() {

    return (

        <BrowserRouter>

            <div className="app-layout">

                <Navbar />

                <div className="page-content">

                    <Routes>

                        <Route
                            path="/"
                            element={<Inicio />}
                        />

                        <Route
                            path="/home"
                            element={<Home />}
                        />

                        <Route
                            path="/consol"
                            element={<Consol />}
                        />

                        <Route
                            path="/albumes"
                            element={<Albumes />}
                        />

                        <Route
                            path="/config"
                            element={<Config />}
                        />

                        <Route
                            path="/usuario"
                            element={<Usuario />}
                        />

                        <Route
                            path="/iniciar-sesion"
                            element={<IniciarSesion />}
                        />

                        <Route
                            path="/registro"
                            element={<Registro />}
                        />

                        <Route 
                            path="/perfil" 
                            element={<Perfil />} 
                        />

                    </Routes>

                </div>

            </div>

        </BrowserRouter>
    );
}

export default App;
