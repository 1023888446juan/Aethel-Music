import { useState } from "react";

import "../../styles/interfaces_navbar/configAlbum.css";

import albumTexture from "../../assets/img/Albumes/Album.png";


// =========================================
// CREAR PLAYLIST
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
    // CREAR
    // =========================================

    const handleCreate = () => {

        if (!name.trim()) {

            alert(
                "Escribe un nombre para la playlist."
            );

            return;

        }


        onCreate({

            name: name.trim(),

            description:
                "Mi nueva playlist",

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
                            NUEVA PLAYLIST
                        </span>

                        <h2>
                            CREAR PLAYLIST
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


                    {/* =================================
                        PREVISUALIZACIÓN
                        ================================= */}

                    <div
                        className="create-album-preview"
                        style={{
                            backgroundImage:
                                `url(${image})`
                        }}
                    >

                        <div>
                            NUEVA
                        </div>

                    </div>


                    {/* =================================
                        IMAGEN
                        ================================= */}

                    <label className="config-album-upload">

                        SELECCIONAR IMAGEN

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                    </label>


                    {/* =================================
                        NOMBRE
                        ================================= */}

                    <label className="create-album-label">

                        NOMBRE DE LA PLAYLIST

                    </label>

                    <input
                        className="create-album-input"
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        placeholder="Ej: Música para entrenar"
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

                        CREAR PLAYLIST

                    </button>

                </div>


            </div>

        </div>

    );

}


export default CrearAlbum;