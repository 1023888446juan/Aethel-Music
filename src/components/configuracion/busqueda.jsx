function Busqueda() {

    /* =========================================
       BÚSQUEDA
    ========================================= */

    const handleSearch = () => {

        /*
            Preparado para backend.

            Futuro ejemplo:

            GET /api/canciones/dispositivo
        */

        console.log(
            "Buscando canciones del dispositivo..."
        );
    };


    /* =========================================
       FILTRO
    ========================================= */

    const handleFilter = () => {

        /*
            Preparado para backend.

            Futuro ejemplo:

            GET /api/canciones/dispositivo?filter=...
        */

        console.log(
            "Abriendo filtros..."
        );
    };


    return (

        <section className="config-page search-page">

            <div className="search-panel">

                {/* =================================
                    DECORACIÓN
                ================================= */}

                <div className="search-orbit orbit-one"></div>

                <div className="search-orbit orbit-two"></div>


                {/* =================================
                    ICONO
                ================================= */}

                <div className="search-icon">

                    <span></span>

                </div>


                <span className="search-label">
                    BIBLIOTECA LOCAL
                </span>


                <h2>
                    Busca tu música
                </h2>


                <p>
                    Explora las canciones disponibles en tu
                    dispositivo y agrégalas a tu biblioteca
                    de Aethel Music.
                </p>


                {/* =================================
                    BOTONES
                ================================= */}

                <div className="search-buttons">

                    <button
                        type="button"
                        className="btn-search"
                        onClick={handleSearch}
                    >

                        <span className="button-icon">
                            +
                        </span>

                        BUSCAR MÚSICA

                    </button>


                    <button
                        type="button"
                        className="btn-filter"
                        onClick={handleFilter}
                    >

                        FILTRO

                    </button>

                </div>


                {/* =================================
                    ESTADO
                ================================= */}

                <div className="search-status">

                    <span className="status-dot"></span>

                    <span>
                        LISTO PARA ESCANEAR
                    </span>

                </div>

            </div>

        </section>

    );
}

export default Busqueda;