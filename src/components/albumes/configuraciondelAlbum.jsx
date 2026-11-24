import { useState } from "react";

import "../../styles/interfaces_navbar/configAlbum.css";

import albumTexture from "../../assets/img/Albumes/Album.png";


// =========================================
// CONFIGURACIÓN DE PLAYLIST
// =========================================

function ConfiguracionDelAlbum({
    album,
    onClose,
    onUpdate,
    onDelete
}) {

    const [name, setName] = useState(
        album.name
    );

    const [image, setImage] = useState(
        album.texture || albumTexture
    );


    // =========================================
    // CAMBIAR IMAGEN
    // =========================================

    const handleImageChange = (event) => {

        const file = event.target.files[0];

        if (!file) {
            return;
        }


        const imageURL = URL.createObjectURL(file);

        setImage(imageURL);

    };


    // =========================================
    // GUARDAR CAMBIOS
    // =========================================

    const handleSave = () => {

        if (!name.trim()) {

            alert(
                "La playlist necesita un nombre."
            );

            return;

        }


        onUpdate({

            ...album,

            name: name.trim(),

            texture: image

        });

    };


    // =========================================
    // ELIMINAR
    // =========================================

    const handleDelete = () => {

        const confirmar = window.confirm(
            `¿Seguro que quieres eliminar "${album.name}"?`
        );


        if (!confirmar) {
            return;
        }


        onDelete(album.id);

    };


    return (

        <div className="config-album-overlay">


            <div className="config-album-window">


                {/* =================================
                    HEADER
                    ================================= */}

                <div className="config-album-header">

                    <div>

                        <span className="config-album-label">
                            PLAYLIST
                        </span>

                        <h2>
                            CONFIGURACIÓN
                        </h2>

                    </div>


                    <button
                        type="button"
                        className="config-album-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                {/* =================================
                    CUERPO
                    ================================= */}

                <div className="config-album-body">


                    {/* =================================
                        IMAGEN
                        ================================= */}

                    <div className="config-album-image-section">

                        <div
                            className="config-album-preview"
                            style={{
                                backgroundImage:
                                    `url(${image})`
                            }}
                        >

                            <div className="config-album-preview-overlay">

                                <span>
                                    CAMBIAR IMAGEN
                                </span>

                            </div>

                        </div>


                        <label className="config-album-upload">

                            SELECCIONAR IMAGEN

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />

                        </label>

                    </div>


                    {/* =================================
                        INFORMACIÓN
                        ================================= */}

                    <div className="config-album-fields">


                        <label>
                            NOMBRE DE LA PLAYLIST
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Nombre de la playlist"
                        />


                        <div className="config-album-info-box">

                            <span>
                                CANCIONES
                            </span>

                            <strong>
                                {album.songs}
                            </strong>

                        </div>


                    </div>

                </div>


                {/* =================================
                    FOOTER
                    ================================= */}

                <div className="config-album-footer">


                    <button
                        type="button"
                        className="config-album-delete"
                        onClick={handleDelete}
                    >

                        ELIMINAR PLAYLIST

                    </button>


                    <div className="config-album-actions">

                        <button
                            type="button"
                            className="config-album-cancel"
                            onClick={onClose}
                        >

                            CANCELAR

                        </button>


                        <button
                            type="button"
                            className="config-album-save"
                            onClick={handleSave}
                        >

                            GUARDAR CAMBIOS

                        </button>

                    </div>


                </div>

            </div>

        </div>

    );

}


export default ConfiguracionDelAlbum;