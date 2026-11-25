import { useState } from "react";

import "../../styles/interfaces_navbar/configAlbum.css";

import albumTexture from "../../assets/img/Albumes/Album.png";


// =========================================
// CREAR ÁLBUM
// =========================================

function CrearAlbum({
    onClose,
    onCreate
}) {

    const [name, setName] = useState("");

    const [image, setImage] = useState(
        albumTexture
    );


    // =========================================
    // CAMBIAR IMAGEN
    // =========================================

    const handleImageChange = (event) => {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        const imageURL =
            URL.createObjectURL(file);

        setImage(imageURL);

    };


    // =========================================
    // CREAR ÁLBUM
    // =========================================

    const handleCreate = () => {

        if (!name.trim()) {

            alert(
                "Escribe un nombre para el álbum."
            );

            return;
        }


        onCreate({

            titulo_album: name.trim(),

            descripcion_album:
                "Mi nuevo álbum",

            fecha_lanzamiento: null,

            texture: image

        });

    };


    return (

        <div className="config-album-overlay">

            <div className="config-album-window create-album-window">

                {/* =================================
                    HEADER
                    ================================= */}

                <div className="config-album-header">

                    <div>

                        <span className="config-album-label">
                            NUEVO ÁLBUM
                        </span>

                        <h2>
                            CREAR ÁLBUM
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

                <div className="create-album-body">

                    {/* PREVISUALIZACIÓN */}

                    <div
                        className="create-album-preview"
                        style={{
                            backgroundImage:
                                `url(${image})`
                        }}
                    >

                     

                    </div>


                    {/* IMAGEN */}

                    <label className="config-album-upload">

                        SELECCIONAR IMAGEN

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                    </label>


                    {/* NOMBRE */}

                    <label className="create-album-label">

                        NOMBRE DEL ÁLBUM

                    </label>

                    <input
                        className="create-album-input"
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        placeholder="Ej: Mis mejores canciones"
                        maxLength={40}
                    />

                </div>


                {/* =================================
                    FOOTER
                    ================================= */}

                <div className="config-album-footer">

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
                        onClick={handleCreate}
                    >
                        CREAR ÁLBUM
                    </button>

                </div>

            </div>

        </div>

    );
}

export default CrearAlbum;