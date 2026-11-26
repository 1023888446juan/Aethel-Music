-- ============================================================
-- AETHEL MUSIC
-- RECONSTRUCCION INTEGRAL Y OPTIMIZADA DE BASE DE DATOS
-- PostgreSQL
-- ============================================================
-- IMPORTANTE:
-- RECONSTRUCCION DESTRUCTIVA.
-- ELIMINA LAS TABLAS EXISTENTES Y SUS DATOS.
-- ============================================================

BEGIN;

-- ============================================================
-- 1. EXTENSIONES
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================================
-- 2. ELIMINACION DE TABLAS
-- ============================================================

DROP TABLE IF EXISTS pad CASCADE;
DROP TABLE IF EXISTS favorito CASCADE;
DROP TABLE IF EXISTS playlist_pista CASCADE;
DROP TABLE IF EXISTS grabacion CASCADE;
DROP TABLE IF EXISTS efecto CASCADE;
DROP TABLE IF EXISTS pista CASCADE;
DROP TABLE IF EXISTS playlist CASCADE;
DROP TABLE IF EXISTS configuracion CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;


-- ============================================================
-- 3. USUARIO
-- ============================================================

CREATE TABLE usuario (

    id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,

    correo VARCHAR(254) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    ruta_foto_perfil TEXT,

    estado_usuario VARCHAR(20)
        NOT NULL DEFAULT 'activo',

    rol_usuario VARCHAR(20)
        NOT NULL DEFAULT 'usuario',

    fecha_registro TIMESTAMPTZ
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_usuario_nombre
        CHECK (TRIM(nombre) <> ''),

    CONSTRAINT chk_usuario_correo
        CHECK (TRIM(correo) <> ''),

    CONSTRAINT chk_usuario_password
        CHECK (TRIM(password_hash) <> ''),

    CONSTRAINT chk_usuario_estado
        CHECK (estado_usuario IN ('activo', 'inactivo')),

    CONSTRAINT chk_usuario_rol
        CHECK (rol_usuario IN ('usuario', 'administrador'))
);


-- ============================================================
-- 4. CONFIGURACION
-- ============================================================

CREATE TABLE configuracion (

    id_configuracion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    fk_id_usuario INTEGER NOT NULL UNIQUE,

    tema VARCHAR(10)
        NOT NULL DEFAULT 'oscuro',

    escala_ui INTEGER
        NOT NULL DEFAULT 100,

    fecha_actualizacion TIMESTAMPTZ
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_configuracion_usuario
        FOREIGN KEY (fk_id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT chk_configuracion_tema
        CHECK (tema IN ('oscuro', 'claro')),

    CONSTRAINT chk_configuracion_escala
        CHECK (escala_ui BETWEEN 50 AND 200)
);


-- ============================================================
-- 5. PISTA
-- ============================================================

CREATE TABLE pista (

    id_pista INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    uuid_pista UUID
        NOT NULL UNIQUE
        DEFAULT gen_random_uuid(),

    fk_id_usuario INTEGER NOT NULL,

    titulo VARCHAR(255) NOT NULL,

    artista VARCHAR(255),

    duracion NUMERIC(12,3) NOT NULL,

    ruta_archivo TEXT NOT NULL,

    ruta_portada TEXT,

    formato VARCHAR(20) NOT NULL,

    fecha_carga TIMESTAMPTZ
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pista_usuario
        FOREIGN KEY (fk_id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT uq_pista_id_usuario
        UNIQUE (id_pista, fk_id_usuario),

    CONSTRAINT chk_pista_titulo
        CHECK (TRIM(titulo) <> ''),

    CONSTRAINT chk_pista_duracion
        CHECK (duracion > 0),

    CONSTRAINT chk_pista_ruta
        CHECK (TRIM(ruta_archivo) <> ''),

    CONSTRAINT chk_pista_formato
        CHECK (TRIM(formato) <> '')
);


-- ============================================================
-- 6. PLAYLIST
-- ============================================================

CREATE TABLE playlist (

    id_playlist INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    fk_id_usuario INTEGER NOT NULL,

    nombre VARCHAR(150) NOT NULL,

    fecha_creacion TIMESTAMPTZ
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_playlist_usuario
        FOREIGN KEY (fk_id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT uq_playlist_usuario_nombre
        UNIQUE (fk_id_usuario, nombre),

    CONSTRAINT uq_playlist_id_usuario
        UNIQUE (id_playlist, fk_id_usuario),

    CONSTRAINT chk_playlist_nombre
        CHECK (TRIM(nombre) <> '')
);


-- ============================================================
-- 7. PLAYLIST_PISTA
-- ============================================================

CREATE TABLE playlist_pista (

    id_playlist_pista INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    fk_id_playlist INTEGER NOT NULL,

    fk_id_pista INTEGER NOT NULL,

    fk_id_usuario INTEGER NOT NULL,

    posicion INTEGER NOT NULL,

    fecha_agregado TIMESTAMPTZ
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_playlist_pista_playlist
        FOREIGN KEY (fk_id_playlist, fk_id_usuario)
        REFERENCES playlist(id_playlist, fk_id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_playlist_pista_pista
        FOREIGN KEY (fk_id_pista, fk_id_usuario)
        REFERENCES pista(id_pista, fk_id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT uq_playlist_pista
        UNIQUE (fk_id_playlist, fk_id_pista),

    CONSTRAINT uq_playlist_posicion
        UNIQUE (fk_id_playlist, posicion),

    CONSTRAINT chk_playlist_pista_posicion
        CHECK (posicion > 0)
);


-- ============================================================
-- 8. FAVORITO
-- ============================================================

CREATE TABLE favorito (

    id_favorito INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    fk_id_usuario INTEGER NOT NULL,

    fk_id_pista INTEGER NOT NULL,

    fecha_agregado TIMESTAMPTZ
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_favorito_pista_usuario
        FOREIGN KEY (fk_id_pista, fk_id_usuario)
        REFERENCES pista(id_pista, fk_id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT uq_favorito_usuario_pista
        UNIQUE (fk_id_usuario, fk_id_pista)
);


-- ============================================================
-- 9. GRABACION
-- ============================================================

CREATE TABLE grabacion (

    id_grabacion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    fk_id_usuario INTEGER NOT NULL,

    titulo VARCHAR(255) NOT NULL,

    artista VARCHAR(255) NOT NULL,

    duracion NUMERIC(12,3) NOT NULL,

    ruta_archivo TEXT NOT NULL,

    fecha_creacion TIMESTAMPTZ
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_grabacion_usuario
        FOREIGN KEY (fk_id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT chk_grabacion_titulo
        CHECK (TRIM(titulo) <> ''),

    CONSTRAINT chk_grabacion_artista
        CHECK (TRIM(artista) <> ''),

    CONSTRAINT chk_grabacion_duracion
        CHECK (duracion > 0),

    CONSTRAINT chk_grabacion_ruta
        CHECK (TRIM(ruta_archivo) <> '')
);


-- ============================================================
-- 10. EFECTO
-- ============================================================

CREATE TABLE efecto (

    id_efecto INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    fk_id_usuario INTEGER NOT NULL,

    ruta_archivo TEXT NOT NULL,

    fecha_carga TIMESTAMPTZ
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_efecto_usuario
        FOREIGN KEY (fk_id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT uq_efecto_id_usuario
        UNIQUE (id_efecto, fk_id_usuario),

    CONSTRAINT chk_efecto_ruta
        CHECK (TRIM(ruta_archivo) <> '')
);


-- ============================================================
-- 11. PAD
-- ============================================================

CREATE TABLE pad (

    id_pad INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    fk_id_usuario INTEGER NOT NULL,

    numero_pad INTEGER NOT NULL,

    fk_id_efecto INTEGER,

    fecha_actualizacion TIMESTAMPTZ
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pad_usuario
        FOREIGN KEY (fk_id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_pad_efecto_usuario
        FOREIGN KEY (fk_id_efecto, fk_id_usuario)
        REFERENCES efecto(id_efecto, fk_id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT uq_pad_usuario_numero
        UNIQUE (fk_id_usuario, numero_pad),

    CONSTRAINT chk_pad_numero
        CHECK (numero_pad BETWEEN 1 AND 6)
);


-- ============================================================
-- 12. INDICES OPTIMIZADOS
-- ============================================================


-- ------------------------------------------------------------
-- USUARIO
-- ------------------------------------------------------------

CREATE INDEX idx_usuario_rol
    ON usuario(rol_usuario);


-- ------------------------------------------------------------
-- PISTA
-- ------------------------------------------------------------

-- Consulta de pistas pertenecientes a un usuario,
-- ordenadas por título e identificador.

CREATE INDEX idx_pista_usuario_titulo_id
    ON pista(fk_id_usuario, titulo, id_pista);


-- Consulta de pistas por usuario y fecha de carga.

CREATE INDEX idx_pista_usuario_fecha
    ON pista(fk_id_usuario, fecha_carga DESC);


-- ------------------------------------------------------------
-- PLAYLIST
-- ------------------------------------------------------------

-- Consulta de playlists de un usuario.
-- La restricción UNIQUE (fk_id_usuario, nombre)
-- ya dispone de un índice compatible con fk_id_usuario.


-- ------------------------------------------------------------
-- PLAYLIST_PISTA
-- ------------------------------------------------------------

-- Consultas de pistas asociadas a una pista específica.
-- Facilita búsquedas inversas y validaciones de FK.

CREATE INDEX idx_playlist_pista_pista_usuario
    ON playlist_pista(fk_id_pista, fk_id_usuario);


-- ------------------------------------------------------------
-- FAVORITO
-- ------------------------------------------------------------

-- La restricción UNIQUE (fk_id_usuario, fk_id_pista)
-- ya crea un índice para las consultas de favoritos
-- por usuario y pista.


-- ------------------------------------------------------------
-- GRABACION
-- ------------------------------------------------------------

CREATE INDEX idx_grabacion_usuario_fecha
    ON grabacion(fk_id_usuario, fecha_creacion DESC);


-- ------------------------------------------------------------
-- EFECTO
-- ------------------------------------------------------------

CREATE INDEX idx_efecto_usuario_fecha
    ON efecto(fk_id_usuario, fecha_carga DESC);


-- ------------------------------------------------------------
-- PAD
-- ------------------------------------------------------------

-- La restricción UNIQUE (fk_id_usuario, numero_pad)
-- ya crea un índice para los pads de cada usuario.

CREATE INDEX idx_pad_efecto_usuario
    ON pad(fk_id_efecto, fk_id_usuario);


-- ============================================================
-- 13. FINALIZACION
-- ============================================================

COMMIT;


-- ============================================================
-- END: AETHEL MUSIC
-- ============================================================
