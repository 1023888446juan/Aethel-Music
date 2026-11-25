--
-- PostgreSQL database dump
--

\restrict myHy9jp9abvzWtV2PofCtOgMeLlg0BA2dqh6DGrWARoWgyqlvWxNt1x3QOwWcYJ

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-09-03 13:26:59

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16632)
-- Name: album; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.album (
    id_album integer NOT NULL,
    titulo_album character varying(150) NOT NULL,
    descripcion_album text,
    fecha_lanzamiento date,
    fk_id_artista integer NOT NULL
);


ALTER TABLE public.album OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16631)
-- Name: album_id_album_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.album_id_album_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.album_id_album_seq OWNER TO postgres;

--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 225
-- Name: album_id_album_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.album_id_album_seq OWNED BY public.album.id_album;


--
-- TOC entry 224 (class 1259 OID 16623)
-- Name: artistas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.artistas (
    id_artista integer NOT NULL,
    nombre_artista character varying(100) NOT NULL,
    genero_artista character varying(50)
);


ALTER TABLE public.artistas OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16622)
-- Name: artistas_id_artista_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.artistas_id_artista_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.artistas_id_artista_seq OWNER TO postgres;

--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 223
-- Name: artistas_id_artista_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.artistas_id_artista_seq OWNED BY public.artistas.id_artista;


--
-- TOC entry 222 (class 1259 OID 16606)
-- Name: configuracion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configuracion (
    id_configuracion integer NOT NULL,
    tamano_configuracion character varying(20),
    color_configuracion character varying(30),
    idioma_configuracion character varying(30),
    notificacion_configuracion boolean DEFAULT true,
    fk_id_usuario integer NOT NULL
);


ALTER TABLE public.configuracion OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16605)
-- Name: configuracion_id_configuracion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.configuracion_id_configuracion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.configuracion_id_configuracion_seq OWNER TO postgres;

--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 221
-- Name: configuracion_id_configuracion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.configuracion_id_configuracion_seq OWNED BY public.configuracion.id_configuracion;


--
-- TOC entry 238 (class 1259 OID 16745)
-- Name: dj_seccion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dj_seccion (
    id_secciondj integer NOT NULL,
    descripcion_dj_seccion text,
    fk_id_usuario integer NOT NULL
);


ALTER TABLE public.dj_seccion OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16744)
-- Name: dj_seccion_id_secciondj_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dj_seccion_id_secciondj_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dj_seccion_id_secciondj_seq OWNER TO postgres;

--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 237
-- Name: dj_seccion_id_secciondj_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dj_seccion_id_secciondj_seq OWNED BY public.dj_seccion.id_secciondj;


--
-- TOC entry 242 (class 1259 OID 16770)
-- Name: efecto_djseccion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.efecto_djseccion (
    id_efecto_djseccion integer NOT NULL,
    fk_id_secciondj integer NOT NULL,
    fk_id_efecto integer NOT NULL
);


ALTER TABLE public.efecto_djseccion OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16769)
-- Name: efecto_djseccion_id_efecto_djseccion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.efecto_djseccion_id_efecto_djseccion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.efecto_djseccion_id_efecto_djseccion_seq OWNER TO postgres;

--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 241
-- Name: efecto_djseccion_id_efecto_djseccion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.efecto_djseccion_id_efecto_djseccion_seq OWNED BY public.efecto_djseccion.id_efecto_djseccion;


--
-- TOC entry 240 (class 1259 OID 16761)
-- Name: efectos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.efectos (
    id_efecto integer NOT NULL,
    nombre_efecto character varying(100) NOT NULL,
    duracion_efecto integer,
    formato character varying(20)
);


ALTER TABLE public.efectos OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16760)
-- Name: efectos_id_efecto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.efectos_id_efecto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.efectos_id_efecto_seq OWNER TO postgres;

--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 239
-- Name: efectos_id_efecto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.efectos_id_efecto_seq OWNED BY public.efectos.id_efecto;


--
-- TOC entry 234 (class 1259 OID 16703)
-- Name: favorito; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorito (
    id_favorito integer NOT NULL,
    nombre_favorito character varying(100),
    fecha_agregado_favorito date DEFAULT CURRENT_DATE,
    fk_id_usuario integer NOT NULL,
    fk_id_pista integer NOT NULL
);


ALTER TABLE public.favorito OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16702)
-- Name: favorito_id_favorito_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favorito_id_favorito_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorito_id_favorito_seq OWNER TO postgres;

--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 233
-- Name: favorito_id_favorito_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favorito_id_favorito_seq OWNED BY public.favorito.id_favorito;


--
-- TOC entry 236 (class 1259 OID 16724)
-- Name: historial_reproduccion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_reproduccion (
    id_historial_reproduccion integer NOT NULL,
    tiempo_escuchado_historial_reproduccion integer,
    fecha_historial_reproduccion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fk_id_usuario integer NOT NULL,
    fk_id_pista integer NOT NULL
);


ALTER TABLE public.historial_reproduccion OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16723)
-- Name: historial_reproduccion_id_historial_reproduccion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_reproduccion_id_historial_reproduccion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_reproduccion_id_historial_reproduccion_seq OWNER TO postgres;

--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 235
-- Name: historial_reproduccion_id_historial_reproduccion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_reproduccion_id_historial_reproduccion_seq OWNED BY public.historial_reproduccion.id_historial_reproduccion;


--
-- TOC entry 228 (class 1259 OID 16649)
-- Name: pista; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pista (
    id_pista integer NOT NULL,
    titulo_pista character varying(150) NOT NULL,
    duracion_pista time without time zone,
    formato_pista character varying(20),
    fk_id_album integer
);


ALTER TABLE public.pista OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16648)
-- Name: pista_id_pista_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pista_id_pista_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pista_id_pista_seq OWNER TO postgres;

--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 227
-- Name: pista_id_pista_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pista_id_pista_seq OWNED BY public.pista.id_pista;


--
-- TOC entry 230 (class 1259 OID 16663)
-- Name: playlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.playlist (
    id_playlist integer NOT NULL,
    nombre_playlist character varying(150) NOT NULL,
    descripcion_playlist text,
    fecha_creacion_playlist date DEFAULT CURRENT_DATE,
    fk_id_usuario integer NOT NULL
);


ALTER TABLE public.playlist OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16662)
-- Name: playlist_id_playlist_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.playlist_id_playlist_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.playlist_id_playlist_seq OWNER TO postgres;

--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 229
-- Name: playlist_id_playlist_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.playlist_id_playlist_seq OWNED BY public.playlist.id_playlist;


--
-- TOC entry 232 (class 1259 OID 16681)
-- Name: playlist_pista; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.playlist_pista (
    id_playlist_pista integer NOT NULL,
    fk_id_playlist integer NOT NULL,
    fk_id_pista integer NOT NULL
);


ALTER TABLE public.playlist_pista OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16680)
-- Name: playlist_pista_id_playlist_pista_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.playlist_pista_id_playlist_pista_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.playlist_pista_id_playlist_pista_seq OWNER TO postgres;

--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 231
-- Name: playlist_pista_id_playlist_pista_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.playlist_pista_id_playlist_pista_seq OWNED BY public.playlist_pista.id_playlist_pista;


--
-- TOC entry 220 (class 1259 OID 16591)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    nombre_usuario character varying(100) NOT NULL,
    correo_usuario character varying(150) NOT NULL,
    contrasena_usuario character varying(255) NOT NULL
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16590)
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- TOC entry 4814 (class 2604 OID 16635)
-- Name: album id_album; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.album ALTER COLUMN id_album SET DEFAULT nextval('public.album_id_album_seq'::regclass);


--
-- TOC entry 4813 (class 2604 OID 16626)
-- Name: artistas id_artista; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artistas ALTER COLUMN id_artista SET DEFAULT nextval('public.artistas_id_artista_seq'::regclass);


--
-- TOC entry 4811 (class 2604 OID 16609)
-- Name: configuracion id_configuracion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion ALTER COLUMN id_configuracion SET DEFAULT nextval('public.configuracion_id_configuracion_seq'::regclass);


--
-- TOC entry 4823 (class 2604 OID 16748)
-- Name: dj_seccion id_secciondj; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dj_seccion ALTER COLUMN id_secciondj SET DEFAULT nextval('public.dj_seccion_id_secciondj_seq'::regclass);


--
-- TOC entry 4825 (class 2604 OID 16773)
-- Name: efecto_djseccion id_efecto_djseccion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.efecto_djseccion ALTER COLUMN id_efecto_djseccion SET DEFAULT nextval('public.efecto_djseccion_id_efecto_djseccion_seq'::regclass);


--
-- TOC entry 4824 (class 2604 OID 16764)
-- Name: efectos id_efecto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.efectos ALTER COLUMN id_efecto SET DEFAULT nextval('public.efectos_id_efecto_seq'::regclass);


--
-- TOC entry 4819 (class 2604 OID 16706)
-- Name: favorito id_favorito; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorito ALTER COLUMN id_favorito SET DEFAULT nextval('public.favorito_id_favorito_seq'::regclass);


--
-- TOC entry 4821 (class 2604 OID 16727)
-- Name: historial_reproduccion id_historial_reproduccion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_reproduccion ALTER COLUMN id_historial_reproduccion SET DEFAULT nextval('public.historial_reproduccion_id_historial_reproduccion_seq'::regclass);


--
-- TOC entry 4815 (class 2604 OID 16652)
-- Name: pista id_pista; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pista ALTER COLUMN id_pista SET DEFAULT nextval('public.pista_id_pista_seq'::regclass);


--
-- TOC entry 4816 (class 2604 OID 16666)
-- Name: playlist id_playlist; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.playlist ALTER COLUMN id_playlist SET DEFAULT nextval('public.playlist_id_playlist_seq'::regclass);


--
-- TOC entry 4818 (class 2604 OID 16684)
-- Name: playlist_pista id_playlist_pista; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.playlist_pista ALTER COLUMN id_playlist_pista SET DEFAULT nextval('public.playlist_pista_id_playlist_pista_seq'::regclass);


--
-- TOC entry 4810 (class 2604 OID 16594)
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- TOC entry 5025 (class 0 OID 16632)
-- Dependencies: 226
-- Data for Name: album; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.album (id_album, titulo_album, descripcion_album, fecha_lanzamiento, fk_id_artista) FROM stdin;
1	Album Pop	Primer álbum	2025-01-10	1
2	Album Rock	Álbum de rock	2024-05-20	2
3	Album Electronica	Música electrónica	2025-03-15	3
\.


--
-- TOC entry 5023 (class 0 OID 16623)
-- Dependencies: 224
-- Data for Name: artistas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.artistas (id_artista, nombre_artista, genero_artista) FROM stdin;
1	Artista A	Pop
2	Artista B	Rock
3	Artista C	Electrónica
\.


--
-- TOC entry 5021 (class 0 OID 16606)
-- Dependencies: 222
-- Data for Name: configuracion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.configuracion (id_configuracion, tamano_configuracion, color_configuracion, idioma_configuracion, notificacion_configuracion, fk_id_usuario) FROM stdin;
1	Grande	Azul	Español	t	1
2	Mediano	Rojo	Español	f	2
3	Pequeño	Verde	Inglés	t	3
\.


--
-- TOC entry 5037 (class 0 OID 16745)
-- Dependencies: 238
-- Data for Name: dj_seccion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dj_seccion (id_secciondj, descripcion_dj_seccion, fk_id_usuario) FROM stdin;
1	Mezcla de música electrónica	1
2	Mezcla de música rock	3
\.


--
-- TOC entry 5041 (class 0 OID 16770)
-- Dependencies: 242
-- Data for Name: efecto_djseccion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.efecto_djseccion (id_efecto_djseccion, fk_id_secciondj, fk_id_efecto) FROM stdin;
1	1	1
2	1	2
3	2	2
4	2	3
\.


--
-- TOC entry 5039 (class 0 OID 16761)
-- Dependencies: 240
-- Data for Name: efectos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.efectos (id_efecto, nombre_efecto, duracion_efecto, formato) FROM stdin;
1	Aplausos	10	MP3
2	Transición	5	WAV
3	Eco	8	MP3
\.


--
-- TOC entry 5033 (class 0 OID 16703)
-- Dependencies: 234
-- Data for Name: favorito; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorito (id_favorito, nombre_favorito, fecha_agregado_favorito, fk_id_usuario, fk_id_pista) FROM stdin;
1	Favorito 1	2026-01-20	1	1
2	Favorito 2	2026-01-21	1	3
3	Favorito 3	2026-02-10	2	2
4	Favorito 4	2026-03-05	3	5
\.


--
-- TOC entry 5035 (class 0 OID 16724)
-- Dependencies: 236
-- Data for Name: historial_reproduccion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_reproduccion (id_historial_reproduccion, tiempo_escuchado_historial_reproduccion, fecha_historial_reproduccion, fk_id_usuario, fk_id_pista) FROM stdin;
1	180	2026-03-01 10:30:00	1	1
2	240	2026-03-01 11:00:00	1	2
3	300	2026-03-02 15:30:00	2	3
4	200	2026-03-03 18:00:00	3	5
\.


--
-- TOC entry 5027 (class 0 OID 16649)
-- Dependencies: 228
-- Data for Name: pista; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pista (id_pista, titulo_pista, duracion_pista, formato_pista, fk_id_album) FROM stdin;
1	Cancion 1	00:03:30	MP3	1
2	Cancion 2	00:04:10	MP3	1
3	Cancion 3	00:05:00	WAV	2
4	Cancion 4	00:03:45	MP3	3
5	Cancion 5	00:04:20	WAV	3
\.


--
-- TOC entry 5029 (class 0 OID 16663)
-- Dependencies: 230
-- Data for Name: playlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.playlist (id_playlist, nombre_playlist, descripcion_playlist, fecha_creacion_playlist, fk_id_usuario) FROM stdin;
1	Mis favoritas	Mis canciones favoritas	2026-01-10	1
2	Para estudiar	Música para estudiar	2026-02-15	2
3	Musica DJ	Canciones para mezclar	2026-03-01	3
\.


--
-- TOC entry 5031 (class 0 OID 16681)
-- Dependencies: 232
-- Data for Name: playlist_pista; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.playlist_pista (id_playlist_pista, fk_id_playlist, fk_id_pista) FROM stdin;
1	1	1
2	1	2
3	1	3
4	2	2
5	2	4
6	3	3
7	3	4
8	3	5
\.


--
-- TOC entry 5019 (class 0 OID 16591)
-- Dependencies: 220
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id_usuario, nombre_usuario, correo_usuario, contrasena_usuario) FROM stdin;
1	Juan	juan@gmail.com	1234
2	Maria	maria@gmail.com	1234
3	Carlos	carlos@gmail.com	1234
\.


--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 225
-- Name: album_id_album_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.album_id_album_seq', 3, true);


--
-- TOC entry 5060 (class 0 OID 0)
-- Dependencies: 223
-- Name: artistas_id_artista_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.artistas_id_artista_seq', 3, true);


--
-- TOC entry 5061 (class 0 OID 0)
-- Dependencies: 221
-- Name: configuracion_id_configuracion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configuracion_id_configuracion_seq', 3, true);


--
-- TOC entry 5062 (class 0 OID 0)
-- Dependencies: 237
-- Name: dj_seccion_id_secciondj_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dj_seccion_id_secciondj_seq', 2, true);


--
-- TOC entry 5063 (class 0 OID 0)
-- Dependencies: 241
-- Name: efecto_djseccion_id_efecto_djseccion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.efecto_djseccion_id_efecto_djseccion_seq', 4, true);


--
-- TOC entry 5064 (class 0 OID 0)
-- Dependencies: 239
-- Name: efectos_id_efecto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.efectos_id_efecto_seq', 3, true);


--
-- TOC entry 5065 (class 0 OID 0)
-- Dependencies: 233
-- Name: favorito_id_favorito_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favorito_id_favorito_seq', 4, true);


--
-- TOC entry 5066 (class 0 OID 0)
-- Dependencies: 235
-- Name: historial_reproduccion_id_historial_reproduccion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_reproduccion_id_historial_reproduccion_seq', 4, true);


--
-- TOC entry 5067 (class 0 OID 0)
-- Dependencies: 227
-- Name: pista_id_pista_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pista_id_pista_seq', 5, true);


--
-- TOC entry 5068 (class 0 OID 0)
-- Dependencies: 229
-- Name: playlist_id_playlist_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.playlist_id_playlist_seq', 3, true);


--
-- TOC entry 5069 (class 0 OID 0)
-- Dependencies: 231
-- Name: playlist_pista_id_playlist_pista_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.playlist_pista_id_playlist_pista_seq', 8, true);


--
-- TOC entry 5070 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 3, true);


--
-- TOC entry 4837 (class 2606 OID 16642)
-- Name: album album_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.album
    ADD CONSTRAINT album_pkey PRIMARY KEY (id_album);


--
-- TOC entry 4835 (class 2606 OID 16630)
-- Name: artistas artistas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artistas
    ADD CONSTRAINT artistas_pkey PRIMARY KEY (id_artista);


--
-- TOC entry 4831 (class 2606 OID 16616)
-- Name: configuracion configuracion_fk_id_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion
    ADD CONSTRAINT configuracion_fk_id_usuario_key UNIQUE (fk_id_usuario);


--
-- TOC entry 4833 (class 2606 OID 16614)
-- Name: configuracion configuracion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion
    ADD CONSTRAINT configuracion_pkey PRIMARY KEY (id_configuracion);


--
-- TOC entry 4851 (class 2606 OID 16754)
-- Name: dj_seccion dj_seccion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dj_seccion
    ADD CONSTRAINT dj_seccion_pkey PRIMARY KEY (id_secciondj);


--
-- TOC entry 4855 (class 2606 OID 16778)
-- Name: efecto_djseccion efecto_djseccion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.efecto_djseccion
    ADD CONSTRAINT efecto_djseccion_pkey PRIMARY KEY (id_efecto_djseccion);


--
-- TOC entry 4853 (class 2606 OID 16768)
-- Name: efectos efectos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.efectos
    ADD CONSTRAINT efectos_pkey PRIMARY KEY (id_efecto);


--
-- TOC entry 4847 (class 2606 OID 16712)
-- Name: favorito favorito_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorito
    ADD CONSTRAINT favorito_pkey PRIMARY KEY (id_favorito);


--
-- TOC entry 4849 (class 2606 OID 16733)
-- Name: historial_reproduccion historial_reproduccion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_reproduccion
    ADD CONSTRAINT historial_reproduccion_pkey PRIMARY KEY (id_historial_reproduccion);


--
-- TOC entry 4839 (class 2606 OID 16656)
-- Name: pista pista_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pista
    ADD CONSTRAINT pista_pkey PRIMARY KEY (id_pista);


--
-- TOC entry 4843 (class 2606 OID 16689)
-- Name: playlist_pista playlist_pista_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.playlist_pista
    ADD CONSTRAINT playlist_pista_pkey PRIMARY KEY (id_playlist_pista);


--
-- TOC entry 4841 (class 2606 OID 16674)
-- Name: playlist playlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.playlist
    ADD CONSTRAINT playlist_pkey PRIMARY KEY (id_playlist);


--
-- TOC entry 4857 (class 2606 OID 16780)
-- Name: efecto_djseccion uq_efecto_seccion; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.efecto_djseccion
    ADD CONSTRAINT uq_efecto_seccion UNIQUE (fk_id_secciondj, fk_id_efecto);


--
-- TOC entry 4845 (class 2606 OID 16691)
-- Name: playlist_pista uq_playlist_pista; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.playlist_pista
    ADD CONSTRAINT uq_playlist_pista UNIQUE (fk_id_playlist, fk_id_pista);


--
-- TOC entry 4827 (class 2606 OID 16604)
-- Name: usuario usuario_correo_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_usuario_key UNIQUE (correo_usuario);


--
-- TOC entry 4829 (class 2606 OID 16602)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4859 (class 2606 OID 16643)
-- Name: album fk_album_artista; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.album
    ADD CONSTRAINT fk_album_artista FOREIGN KEY (fk_id_artista) REFERENCES public.artistas(id_artista) ON DELETE CASCADE;


--
-- TOC entry 4858 (class 2606 OID 16617)
-- Name: configuracion fk_config_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion
    ADD CONSTRAINT fk_config_usuario FOREIGN KEY (fk_id_usuario) REFERENCES public.usuario(id_usuario) ON DELETE CASCADE;


--
-- TOC entry 4868 (class 2606 OID 16755)
-- Name: dj_seccion fk_dj_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dj_seccion
    ADD CONSTRAINT fk_dj_usuario FOREIGN KEY (fk_id_usuario) REFERENCES public.usuario(id_usuario) ON DELETE CASCADE;


--
-- TOC entry 4869 (class 2606 OID 16786)
-- Name: efecto_djseccion fk_eds_efecto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.efecto_djseccion
    ADD CONSTRAINT fk_eds_efecto FOREIGN KEY (fk_id_efecto) REFERENCES public.efectos(id_efecto) ON DELETE CASCADE;


--
-- TOC entry 4870 (class 2606 OID 16781)
-- Name: efecto_djseccion fk_eds_seccion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.efecto_djseccion
    ADD CONSTRAINT fk_eds_seccion FOREIGN KEY (fk_id_secciondj) REFERENCES public.dj_seccion(id_secciondj) ON DELETE CASCADE;


--
-- TOC entry 4864 (class 2606 OID 16718)
-- Name: favorito fk_favorito_pista; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorito
    ADD CONSTRAINT fk_favorito_pista FOREIGN KEY (fk_id_pista) REFERENCES public.pista(id_pista) ON DELETE CASCADE;


--
-- TOC entry 4865 (class 2606 OID 16713)
-- Name: favorito fk_favorito_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorito
    ADD CONSTRAINT fk_favorito_usuario FOREIGN KEY (fk_id_usuario) REFERENCES public.usuario(id_usuario) ON DELETE CASCADE;


--
-- TOC entry 4866 (class 2606 OID 16739)
-- Name: historial_reproduccion fk_historial_pista; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_reproduccion
    ADD CONSTRAINT fk_historial_pista FOREIGN KEY (fk_id_pista) REFERENCES public.pista(id_pista) ON DELETE CASCADE;


--
-- TOC entry 4867 (class 2606 OID 16734)
-- Name: historial_reproduccion fk_historial_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_reproduccion
    ADD CONSTRAINT fk_historial_usuario FOREIGN KEY (fk_id_usuario) REFERENCES public.usuario(id_usuario) ON DELETE CASCADE;


--
-- TOC entry 4860 (class 2606 OID 16657)
-- Name: pista fk_pista_album; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pista
    ADD CONSTRAINT fk_pista_album FOREIGN KEY (fk_id_album) REFERENCES public.album(id_album) ON DELETE SET NULL;


--
-- TOC entry 4861 (class 2606 OID 16675)
-- Name: playlist fk_playlist_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.playlist
    ADD CONSTRAINT fk_playlist_usuario FOREIGN KEY (fk_id_usuario) REFERENCES public.usuario(id_usuario) ON DELETE CASCADE;


--
-- TOC entry 4862 (class 2606 OID 16697)
-- Name: playlist_pista fk_pp_pista; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.playlist_pista
    ADD CONSTRAINT fk_pp_pista FOREIGN KEY (fk_id_pista) REFERENCES public.pista(id_pista) ON DELETE CASCADE;


--
-- TOC entry 4863 (class 2606 OID 16692)
-- Name: playlist_pista fk_pp_playlist; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.playlist_pista
    ADD CONSTRAINT fk_pp_playlist FOREIGN KEY (fk_id_playlist) REFERENCES public.playlist(id_playlist) ON DELETE CASCADE;


-- Completed on 2026-09-03 13:26:59

--
-- PostgreSQL database dump complete
--

\unrestrict myHy9jp9abvzWtV2PofCtOgMeLlg0BA2dqh6DGrWARoWgyqlvWxNt1x3QOwWcYJ

