import favoritasTexture from "../../assets/img/Albumes/Favoritas.png";
import favoritosIcon from "../../assets/img/reproductor_icons/favoritos.png";


// =========================================
// FAVORITOS
// =========================================

function Favoritos({ onOpen }) {

    return (

        <section className="album-section">

            <div className="section-title">

                <div>

                    <span className="section-label">
                        COLECCIÓN ESPECIAL
                    </span>

                    <h2>
                        FAVORITAS
                    </h2>

                </div>

            </div>


            <div className="favorite-card">


                {/* =================================
                    IMAGEN
                    ================================= */}

                <div
                    className="favorite-image"
                    style={{
                        backgroundImage:
                            `url(${favoritasTexture})`
                    }}
                >

                    <div className="favorite-overlay"></div>


        

                </div>


                {/* =================================
                    INFORMACIÓN
                    ================================= */}

                <div className="favorite-info">

                    <span className="card-type">
                        COLECCIÓN
                    </span>

                    <h3>
                        Mis favoritas
                    </h3>

                    <p>
                        Todas las canciones que has marcado
                        como favoritas.
                    </p>

                    <span className="song-count">
                        0 canciones
                    </span>

                </div>


                {/* =================================
                    ABRIR
                    ================================= */}

                <button
                    type="button"
                    className="open-album-button"
                    onClick={onOpen}
                >

                    ABRIR

                </button>


            </div>

        </section>

    );

}


export default Favoritos;