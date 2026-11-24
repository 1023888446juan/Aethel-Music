import { useState } from "react";
import "../styles/interfaces_navbar/config.css";

import Personalizar from "../components/configuracion/personalizar";
import Busqueda from "../components/configuracion/busqueda";

import settingsIcon from "../assets/img/configuracion/settings_cons.png";
import searchIcon from "../assets/img/configuracion/search.png";

function Config() {
    const [activePage, setActivePage] = useState("personalizar");

    return (
        <div className="config-container">

            {/* =====================================
                FONDO
            ===================================== */}

            <div className="config-background"></div>


            {/* =====================================
                SIDEBAR
            ===================================== */}

            <aside className="config-sidebar">

                <div className="config-sidebar-title">
                    <span>CONFIGURACIÓN</span>
                </div>


                {/* PERSONALIZAR */}

                <button
                    type="button"
                    className={
                        activePage === "personalizar"
                            ? "config-menu-item active"
                            : "config-menu-item"
                    }
                    onClick={() => setActivePage("personalizar")}
                >

                    <span className="config-menu-icon">

                        <img
                            src={settingsIcon}
                            alt="Personalizar"
                        />

                    </span>

                    <span>
                        Personalizar
                    </span>

                </button>


                {/* BÚSQUEDA */}

                <button
                    type="button"
                    className={
                        activePage === "busqueda"
                            ? "config-menu-item active"
                            : "config-menu-item"
                    }
                    onClick={() => setActivePage("busqueda")}
                >

                    <span className="config-menu-icon">

                        <img
                            src={searchIcon}
                            alt="Búsqueda"
                        />

                    </span>

                    <span>
                        Búsqueda
                    </span>

                </button>

            </aside>


            {/* =====================================
                CONTENIDO PRINCIPAL
            ===================================== */}

            <main className="config-main">

                <header className="config-header">

                    <span className="config-subtitle">
                        AETHEL MUSIC
                    </span>

                    <h1>
                        CONFIGURACIÓN
                    </h1>

                    <p>
                        Personaliza tu experiencia en Aethel Music.
                    </p>

                </header>


                {/* =================================
                    PERSONALIZAR
                ================================= */}

                {activePage === "personalizar" && (
                    <Personalizar />
                )}


                {/* =================================
                    BÚSQUEDA
                ================================= */}

                {activePage === "busqueda" && (
                    <Busqueda />
                )}

            </main>

        </div>
    );
}

export default Config;