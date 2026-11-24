import { useState } from "react";

import albumTexture from "../../assets/img/Albumes/Album.png";
import moreIcon from "../../assets/img/Albumes/more.png";

import ConfiguracionDelAlbum from "./configuraciondelAlbum";


// =========================================
// LISTA DE ÁLBUMES
// =========================================

function ListaDeAlbums({
    albums,
    onCreate,
    onDelete,
    onUpdate,
    onSelectAlbum
}) {

    const [albumSeleccionado, setAlbumSeleccionado] =
        useState(null);


    // =========================================
    // SELECCIONAR ÁLBUM
    // =========================================

    const seleccionarAlbum = (album) => {

        setAlbumSeleccionado(album);

        if (onSelectAlbum) {
            onSelectAlbum(album);
        }

    };


    // =========================================
    // ABRIR CONFIGURACIÓN
    // =========================================

    const abrirConfiguracion = (album) => {

        setAlbumSeleccionado(album);

    };


    // =========================================
    // CERRAR CONFIGURACIÓN
    // =========================================

    const cerrarConfiguracion = () => {

        setAlbumSeleccionado(null);

    };


    return (

        <section className="album-section folders-section">


            {/* =================================
                TÍTULO
                ================================= */}

            <div className="section-title">

                <div>

                    <span className="section-label">
                        TU MÚSICA
                    </span>

                    <h2>
                        ÁLBUMES
                    </h2>

                </div>


                <span className="folder-counter">
                    {albums.length} álbumes
                </span>

            </div>


            {/* =================================
                GRID
                ================================= */}

            <div className="albums-grid">


                {/* =================================
                    ÁLBUMES
                    ================================= */}

                {albums.map((album) => (

                    <article
                        className="album-card"
                        key={album.id}
                    >


                        {/* =================================
                            IMAGEN
                            ================================= */}

                        <div
                            className="album-image"
                            style={{
                                backgroundImage:
                                    `url(${album.texture || albumTexture})`
                            }}
                        >

                            <div className="album-image-overlay"></div>


                            <span className="folder-symbol">
                                ♪
                            </span>


                            {/* =================================
                                BOTÓN ...
                                ================================= */}

                            <button
                                type="button"
                                className="album-more-button"
                                onClick={() =>
                                    abrirConfiguracion(album)
                                }
                                title="Configuración"
                            >

                                <img
                                    src={moreIcon}
                                    alt="Más opciones"
                                />

                            </button>

                        </div>


                        {/* =================================
                            INFORMACIÓN
                            ================================= */}

                        <div className="album-card-info">

                            <span className="album-card-label">
                                ÁLBUM
                            </span>

                            <h3>
                                {album.name}
                            </h3>

                            <p>
                                {album.description}
                            </p>

                            <span className="album-song-count">
                                {album.songs} canciones
                            </span>

                        </div>


                        {/* =================================
                            ABRIR
                            ================================= */}

                        <button
                            type="button"
                            className="album-open-button"
                            onClick={() =>
                                seleccionarAlbum(album)
                            }
                        >

                            ABRIR

                        </button>

                    </article>

                ))}


                {/* =================================
                    NUEVO ÁLBUM
                    ================================= */}

                <button
                    type="button"
                    className="new-album-card"
                    onClick={onCreate}
                >

                    <span className="new-album-plus">
                        +
                    </span>

                    <span className="new-album-title">
                        NUEVO ÁLBUM
                    </span>

                    <span className="new-album-text">
                        Organiza tus canciones
                    </span>

                </button>


            </div>


            {/* =====================================
                CONFIGURACIÓN DE ÁLBUM
                ===================================== */}

            {albumSeleccionado && (

                <ConfiguracionDelAlbum

                    album={albumSeleccionado}

                    onClose={
                        cerrarConfiguracion
                    }


                    onUpdate={(updatedAlbum) => {

                        onUpdate(
                            updatedAlbum
                        );

                        cerrarConfiguracion();

                    }}


                    onDelete={(albumId) => {

                        onDelete(
                            albumId
                        );

                        cerrarConfiguracion();

                    }}

                />

            )}

        </section>

    );

}


export default ListaDeAlbums;