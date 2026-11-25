CREATE TABLE USUARIO (
    id_usuario SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL,
    correo_usuario VARCHAR(150) UNIQUE NOT NULL,
    contrasena_usuario VARCHAR(255) NOT NULL
);

CREATE TABLE CONFIGURACION (
    id_configuracion SERIAL PRIMARY KEY,
    color_configuracion VARCHAR(30),
    idioma_configuracion VARCHAR(30),
    notificacion_configuracion BOOLEAN DEFAULT TRUE,
    fk_id_usuario INT UNIQUE NOT NULL,

    CONSTRAINT fk_config_usuario
        FOREIGN KEY (fk_id_usuario)
        REFERENCES USUARIO(id_usuario)
        ON DELETE CASCADE
);

CREATE TABLE ARTISTAS (
    id_artista SERIAL PRIMARY KEY,
    nombre_artista VARCHAR(100) NOT NULL,
    genero_artista VARCHAR(50)
);

CREATE TABLE ALBUM (
    id_album SERIAL PRIMARY KEY,
    titulo_album VARCHAR(150) NOT NULL,
    descripcion_album TEXT,
    fecha_lanzamiento DATE,
    fk_id_artista INT NOT NULL,

    CONSTRAINT fk_album_artista
        FOREIGN KEY (fk_id_artista)
        REFERENCES ARTISTAS(id_artista)
        ON DELETE CASCADE
);

CREATE TABLE PISTA (
    id_pista SERIAL PRIMARY KEY,
    titulo_pista VARCHAR(150) NOT NULL,
    duracion_pista TIME,
    formato_pista VARCHAR(20),
    ruta_pista TEXT,
    fk_id_album INT,

    CONSTRAINT fk_pista_album
        FOREIGN KEY (fk_id_album)
        REFERENCES ALBUM(id_album)
        ON DELETE SET NULL
);

CREATE TABLE PLAYLIST (
    id_playlist SERIAL PRIMARY KEY,
    nombre_playlist VARCHAR(150) NOT NULL,
    descripcion_playlist TEXT,
    fecha_creacion_playlist DATE DEFAULT CURRENT_DATE,
    fk_id_usuario INT NOT NULL,

    CONSTRAINT fk_playlist_usuario
        FOREIGN KEY (fk_id_usuario)
        REFERENCES USUARIO(id_usuario)
        ON DELETE CASCADE
);

CREATE TABLE PLAYLIST_PISTA (
    id_playlist_pista SERIAL PRIMARY KEY,
    fk_id_playlist INT NOT NULL,
    fk_id_pista INT NOT NULL,

    CONSTRAINT fk_pp_playlist
        FOREIGN KEY (fk_id_playlist)
        REFERENCES PLAYLIST(id_playlist)
        ON DELETE CASCADE,

    CONSTRAINT fk_pp_pista
        FOREIGN KEY (fk_id_pista)
        REFERENCES PISTA(id_pista)
        ON DELETE CASCADE,

    CONSTRAINT uq_playlist_pista
        UNIQUE (fk_id_playlist, fk_id_pista)
);

CREATE TABLE FAVORITO (
    id_favorito SERIAL PRIMARY KEY,
    nombre_favorito VARCHAR(100),
    fecha_agregado_favorito DATE DEFAULT CURRENT_DATE,
    fk_id_usuario INT NOT NULL,
    fk_id_pista INT NOT NULL,

    CONSTRAINT fk_favorito_usuario
        FOREIGN KEY (fk_id_usuario)
        REFERENCES USUARIO(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_favorito_pista
        FOREIGN KEY (fk_id_pista)
        REFERENCES PISTA(id_pista)
        ON DELETE CASCADE
);

CREATE TABLE HISTORIAL_REPRODUCCION (
    id_historial_reproduccion SERIAL PRIMARY KEY,
    tiempo_escuchado_historial_reproduccion INT,
    fecha_historial_reproduccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fk_id_usuario INT NOT NULL,
    fk_id_pista INT NOT NULL,

    CONSTRAINT fk_historial_usuario
        FOREIGN KEY (fk_id_usuario)
        REFERENCES USUARIO(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_historial_pista
        FOREIGN KEY (fk_id_pista)
        REFERENCES PISTA(id_pista)
        ON DELETE CASCADE
);

CREATE TABLE DJ_SECCION (
    id_secciondj SERIAL PRIMARY KEY,
    descripcion_dj_seccion TEXT,
    fk_id_usuario INT NOT NULL,

    CONSTRAINT fk_dj_usuario
        FOREIGN KEY (fk_id_usuario)
        REFERENCES USUARIO(id_usuario)
        ON DELETE CASCADE
);

CREATE TABLE EFECTOS (
    id_efecto SERIAL PRIMARY KEY,
    nombre_efecto VARCHAR(100) NOT NULL,
    duracion_efecto INT,
    formato VARCHAR(20)
);

CREATE TABLE EFECTO_DJSECCION (
    id_efecto_djseccion SERIAL PRIMARY KEY,
    fk_id_secciondj INT NOT NULL,
    fk_id_efecto INT NOT NULL,

    CONSTRAINT fk_eds_seccion
        FOREIGN KEY (fk_id_secciondj)
        REFERENCES DJ_SECCION(id_secciondj)
        ON DELETE CASCADE,

    CONSTRAINT fk_eds_efecto
        FOREIGN KEY (fk_id_efecto)
        REFERENCES EFECTOS(id_efecto)
        ON DELETE CASCADE,

    CONSTRAINT uq_efecto_seccion
        UNIQUE (fk_id_secciondj, fk_id_efecto)
);