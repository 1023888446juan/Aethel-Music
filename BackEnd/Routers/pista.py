import os
import uuid
from datetime import time

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from db.database import get_db
from Models.pista import Pista
from Models.album import Album
from Models.artista import Artista
from Schemas.pista import PistaCreate, PistaResponse

from mutagen import File as MutagenFile


router = APIRouter(
    prefix="/pistas",
    tags=["Pistas"]
)


# =========================================================
# CONFIGURACIÓN DE ARCHIVOS
# =========================================================

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB

ALLOWED_EXTENSIONS = {
    ".mp3",
    ".wav",
    ".aiff",
    ".m4a",
    ".opus"
}

MEDIA_DIR = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "media"
)

os.makedirs(MEDIA_DIR, exist_ok=True)


# =========================================================
# CREAR PISTA MANUALMENTE
# =========================================================

@router.post(
    "/",
    response_model=PistaResponse,
    status_code=201
)
def crear_pista(
    pista: PistaCreate,
    db: Session = Depends(get_db)
):
    if pista.fk_id_album is not None:

        album = db.query(Album).filter(
            Album.id_album == pista.fk_id_album
        ).first()

        if not album:
            raise HTTPException(
                status_code=404,
                detail="Álbum no encontrado"
            )

    nueva_pista = Pista(
        titulo_pista=pista.titulo_pista,
        duracion_pista=pista.duracion_pista,
        formato_pista=pista.formato_pista,
        ruta_pista=pista.ruta_pista,
        fk_id_album=pista.fk_id_album
    )

    try:
        db.add(nueva_pista)
        db.commit()
        db.refresh(nueva_pista)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="No se pudo crear la pista"
        )

    return nueva_pista


# =========================================================
# SUBIR CANCIÓN
# =========================================================

@router.post(
    "/upload",
    status_code=201
)
async def subir_cancion(
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # 1. COMPROBAR EXTENSIÓN
    # -----------------------------------------------------

    if not archivo.filename:
        raise HTTPException(
            status_code=400,
            detail="El archivo no tiene nombre"
        )

    extension = os.path.splitext(
        archivo.filename
    )[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=(
                "Formato no permitido. "
                "Formatos permitidos: "
                "MP3, WAV, AIFF, M4A y OPUS"
            )
        )


    # -----------------------------------------------------
    # 2. LEER ARCHIVO Y COMPROBAR TAMAÑO
    # -----------------------------------------------------

    contenido = await archivo.read()

    if len(contenido) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="El archivo supera el tamaño máximo de 50 MB"
        )

    if len(contenido) == 0:
        raise HTTPException(
            status_code=400,
            detail="El archivo está vacío"
        )


    # -----------------------------------------------------
    # 3. GUARDAR TEMPORALMENTE EL ARCHIVO
    # -----------------------------------------------------

    nombre_temporal = f"{uuid.uuid4()}{extension}"

    ruta_temporal = os.path.join(
        MEDIA_DIR,
        nombre_temporal
    )

    with open(ruta_temporal, "wb") as archivo_guardado:
        archivo_guardado.write(contenido)


    # -----------------------------------------------------
    # 4. LEER METADATOS
    # -----------------------------------------------------

    try:

        audio = MutagenFile(ruta_temporal)

    except Exception:

        if os.path.exists(ruta_temporal):
            os.remove(ruta_temporal)

        raise HTTPException(
            status_code=400,
            detail="No se pudieron leer los metadatos del archivo"
        )


    if audio is None:

        if os.path.exists(ruta_temporal):
            os.remove(ruta_temporal)

        raise HTTPException(
            status_code=400,
            detail="El archivo no parece ser un archivo de audio válido"
        )


    # -----------------------------------------------------
    # 5. OBTENER TÍTULO
    # -----------------------------------------------------

    titulo = None

    if audio.tags:

        titulo = audio.tags.get("TIT2")
        titulo = titulo[0] if titulo else None

        if not titulo:
            titulo = audio.tags.get("title")
            titulo = titulo[0] if titulo else None


    if not titulo:
        titulo = os.path.splitext(
            archivo.filename
        )[0]


    # -----------------------------------------------------
    # 6. OBTENER ARTISTA
    # -----------------------------------------------------

    artista_nombre = None

    if audio.tags:

        artista = audio.tags.get("TPE1")
        artista_nombre = artista[0] if artista else None

        if not artista_nombre:
            artista = audio.tags.get("artist")
            artista_nombre = artista[0] if artista else None


    # -----------------------------------------------------
    # 7. OBTENER ÁLBUM
    # -----------------------------------------------------

    album_nombre = None

    if audio.tags:

        album = audio.tags.get("TALB")
        album_nombre = album[0] if album else None

        if not album_nombre:
            album = audio.tags.get("album")
            album_nombre = album[0] if album else None


    # -----------------------------------------------------
    # 8. OBTENER DURACIÓN
    # -----------------------------------------------------

    duracion = None

    if hasattr(audio, "info") and audio.info:

        segundos = int(
            audio.info.length
        )

        horas = segundos // 3600
        minutos = (segundos % 3600) // 60
        segundos_restantes = segundos % 60

        duracion = time(
            hour=horas,
            minute=minutos,
            second=segundos_restantes
        )


    # -----------------------------------------------------
    # 9. CREAR / BUSCAR ARTISTA
    # -----------------------------------------------------

    artista_obj = None

    if artista_nombre:

        artista_obj = db.query(Artista).filter(
            Artista.nombre_artista.ilike(
                artista_nombre
            )
        ).first()

        if not artista_obj:

            artista_obj = Artista(
                nombre_artista=artista_nombre
            )

            db.add(artista_obj)
            db.flush()


    # -----------------------------------------------------
    # 10. CREAR / BUSCAR ÁLBUM
    # -----------------------------------------------------

    album_obj = None

    if album_nombre and artista_obj:

        album_obj = db.query(Album).filter(
            Album.titulo_album.ilike(
                album_nombre
            ),
            Album.fk_id_artista == artista_obj.id_artista
        ).first()

        if not album_obj:

            album_obj = Album(
                titulo_album=album_nombre,
                fk_id_artista=artista_obj.id_artista
            )

            db.add(album_obj)
            db.flush()


    # -----------------------------------------------------
    # 11. CREAR PISTA
    # -----------------------------------------------------

    nueva_pista = Pista(
        titulo_pista=titulo,
        duracion_pista=duracion,
        formato_pista=extension.replace(".", "").upper(),
        ruta_pista=f"media/{nombre_temporal}",
        fk_id_album=(
            album_obj.id_album
            if album_obj
            else None
        )
    )

    try:

        db.add(nueva_pista)

        db.commit()

        db.refresh(nueva_pista)

    except Exception:

        db.rollback()

        if os.path.exists(ruta_temporal):
            os.remove(ruta_temporal)

        raise HTTPException(
            status_code=500,
            detail="No se pudo registrar la canción en la base de datos"
        )


    # -----------------------------------------------------
    # 12. RESPUESTA
    # -----------------------------------------------------

    return {
        "mensaje": "Canción subida correctamente",
        "id_pista": nueva_pista.id_pista,
        "titulo": nueva_pista.titulo_pista,
        "artista": (
            artista_obj.nombre_artista
            if artista_obj
            else None
        ),
        "album": (
            album_obj.titulo_album
            if album_obj
            else None
        ),
        "formato": nueva_pista.formato_pista,
        "duracion": (
            str(nueva_pista.duracion_pista)
            if nueva_pista.duracion_pista
            else None
        ),
        "ruta": nueva_pista.ruta_pista
    }


# =========================================================
# OBTENER TODAS LAS PISTAS
# =========================================================

@router.get(
    "/",
    response_model=list[PistaResponse]
)
def obtener_pistas(
    db: Session = Depends(get_db)
):
    pistas = db.query(Pista).all()

    resultado = []

    for pista in pistas:

        album = None
        artista = None

        if pista.fk_id_album:

            album = db.query(Album).filter(
                Album.id_album == pista.fk_id_album
            ).first()

            if album:

                artista = db.query(Artista).filter(
                    Artista.id_artista == album.fk_id_artista
                ).first()

        resultado.append({
            "id_pista": pista.id_pista,
            "titulo_pista": pista.titulo_pista,
            "duracion_pista": pista.duracion_pista,
            "formato_pista": pista.formato_pista,
            "ruta_pista": pista.ruta_pista,
            "fk_id_album": pista.fk_id_album,
            "artista": (
                artista.nombre_artista
                if artista
                else None
            ),
            "album": (
                album.titulo_album
                if album
                else None
            )
        })

    return resultado


# =========================================================
# OBTENER UNA PISTA
# =========================================================

@router.get(
    "/{id_pista}",
    response_model=PistaResponse
)
def obtener_pista(
    id_pista: int,
    db: Session = Depends(get_db)
):

    pista = db.query(Pista).filter(
        Pista.id_pista == id_pista
    ).first()

    if not pista:

        raise HTTPException(
            status_code=404,
            detail="Pista no encontrada"
        )

    return pista


# =========================================================
# ELIMINAR PISTA
# =========================================================

@router.delete("/{id_pista}")
def eliminar_pista(
    id_pista: int,
    db: Session = Depends(get_db)
):

    pista = db.query(Pista).filter(
        Pista.id_pista == id_pista
    ).first()

    if not pista:

        raise HTTPException(
            status_code=404,
            detail="Pista no encontrada"
        )

    # -----------------------------------------------------
    # ELIMINAR ARCHIVO FÍSICO
    # -----------------------------------------------------

    if pista.ruta_pista:

        ruta_archivo = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            pista.ruta_pista.replace("/", os.sep)
        )

        if os.path.exists(ruta_archivo):
            os.remove(ruta_archivo)


    db.delete(pista)
    db.commit()

    return {
        "mensaje": "Pista eliminada correctamente"
    }