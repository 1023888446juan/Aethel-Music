
from sqlalchemy.orm import Session
from uuid import UUID
from pathlib import Path
import hashlib

from mutagen import File as MutagenFile

from Models.pista import Pista
from Schemas.pista import PistaCreate


# =============================================================
# FILE HASHING
# =============================================================

def calcular_hash_archivo(ruta_archivo: str) -> str:

    sha256 = hashlib.sha256()

    with open(ruta_archivo, "rb") as archivo:

        while True:

            bloque = archivo.read(1024 * 1024)

            if not bloque:
                break

            sha256.update(bloque)

    return sha256.hexdigest()


# =============================================================
# AUDIO METADATA EXTRACTION
# =============================================================

def extraer_metadatos_audio(
    ruta_archivo: str,
    nombre_original: str
) -> dict:

    archivo_audio = MutagenFile(ruta_archivo)

    if archivo_audio is None:
        raise ValueError(
            "No fue posible interpretar los metadatos del archivo de audio"
        )

    duracion = getattr(
        archivo_audio.info,
        "length",
        None
    )

    if duracion is None or duracion <= 0:
        raise ValueError(
            "No fue posible determinar la duración del audio"
        )

    etiquetas = getattr(
        archivo_audio,
        "tags",
        None
    )

    titulo = None
    artista = None

    if etiquetas:

        titulo = (
            etiquetas.get("title")
            or etiquetas.get("TITLE")
        )

        artista = (
            etiquetas.get("artist")
            or etiquetas.get("ARTIST")
        )

        if isinstance(titulo, list):
            titulo = titulo[0] if titulo else None

        if isinstance(artista, list):
            artista = artista[0] if artista else None

    nombre_base = Path(
        nombre_original
    ).stem

    titulo = str(titulo).strip() if titulo else nombre_base

    artista = str(artista).strip() if artista else None

    formato = Path(
        nombre_original
    ).suffix.lower().replace(".", "")

    return {
        "titulo": titulo,
        "artista": artista,
        "duracion": duracion,
        "formato": formato
    }


# =============================================================
# DUPLICATE TRACK DETECTION
# =============================================================

def buscar_pista_duplicada(
    db: Session,
    id_usuario: int,
    hash_archivo: str
) -> Pista | None:

    pistas_usuario = db.query(Pista).filter(
        Pista.fk_id_usuario == id_usuario
    ).all()

    for pista in pistas_usuario:

        ruta = Path(
            pista.ruta_archivo
        )

        if not ruta.exists():
            continue

        if not ruta.is_file():
            continue

        try:

            hash_existente = calcular_hash_archivo(
                str(ruta)
            )

            if hash_existente == hash_archivo:
                return pista

        except OSError:
            continue

    return None


# =============================================================
# TRACK REGISTRATION
# =============================================================

def registrar_pista(
    db: Session,
    datos: PistaCreate,
    id_usuario: int,
    ruta_archivo: str,
    ruta_portada: str | None = None
) -> Pista:

    nueva_pista = Pista(
        fk_id_usuario=id_usuario,
        titulo=datos.titulo,
        artista=datos.artista,
        duracion=datos.duracion,
        formato=datos.formato,
        ruta_archivo=ruta_archivo,
        ruta_portada=ruta_portada
    )

    try:

        db.add(nueva_pista)
        db.commit()
        db.refresh(nueva_pista)

        return nueva_pista

    except Exception:

        db.rollback()
        raise


# =============================================================
# GET USER TRACKS
# =============================================================

def obtener_pistas_usuario(
    db: Session,
    id_usuario: int
) -> list[Pista]:

    return db.query(Pista).filter(
        Pista.fk_id_usuario == id_usuario
    ).order_by(
        Pista.fecha_carga.desc()
    ).all()


# =============================================================
# GET TRACK BY ID
# =============================================================

def obtener_pista_por_id(
    db: Session,
    id_pista: int,
    id_usuario: int
) -> Pista | None:

    return db.query(Pista).filter(
        Pista.id_pista == id_pista,
        Pista.fk_id_usuario == id_usuario
    ).first()


# =============================================================
# GET TRACK BY UUID
# =============================================================

def obtener_pista_por_uuid(
    db: Session,
    uuid_pista: UUID,
    id_usuario: int
) -> Pista | None:

    return db.query(Pista).filter(
        Pista.uuid_pista == uuid_pista,
        Pista.fk_id_usuario == id_usuario
    ).first()


# =============================================================
# DELETE TRACK
# =============================================================

def eliminar_pista(
    db: Session,
    pista: Pista
) -> None:

    try:

        db.delete(pista)
        db.commit()

    except Exception:

        db.rollback()
        raise
