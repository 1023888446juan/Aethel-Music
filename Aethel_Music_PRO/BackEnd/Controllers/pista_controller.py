from pathlib import Path

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from Services.pista_service import (
    registrar_pista,
    obtener_pistas_usuario,
    obtener_pista_por_id,
    obtener_pista_por_uuid,
    eliminar_pista,
    calcular_hash_archivo,
    buscar_pista_duplicada,
    extraer_metadatos_audio
)

from Schemas.pista import PistaCreate

from Utils.file_manager import (
    guardar_pista,
    eliminar_archivo
)

from Utils.audio_validator import validar_audio


# ============================================================
# CONSULTAR BIBLIOTECA DEL USUARIO
# ============================================================

def obtener_pistas_usuario_controller(
    db: Session,
    id_usuario: int
):

    try:
        return obtener_pistas_usuario(
            db,
            id_usuario
        )

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al consultar la biblioteca musical"
        )


# ============================================================
# CONSULTAR PISTA POR ID
# ============================================================

def obtener_pista_controller(
    db: Session,
    id_pista: int,
    id_usuario: int
):

    pista = obtener_pista_por_id(
        db,
        id_pista,
        id_usuario
    )

    if not pista:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pista no encontrada"
        )

    return pista


# ============================================================
# CONSULTAR PISTA POR UUID
# ============================================================

def obtener_pista_por_uuid_controller(
    db: Session,
    uuid_pista: str,
    id_usuario: int
):

    pista = obtener_pista_por_uuid(
        db,
        uuid_pista,
        id_usuario
    )

    if not pista:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pista no encontrada"
        )

    return pista


# ============================================================
# IMPORTAR PISTA
# ============================================================

def importar_pista_controller(
    db: Session,
    archivo,
    id_usuario: int
):

    ruta_archivo = None

    nombre_archivo = archivo.filename or "archivo_audio"

    try:

        # VALIDAR CONTENIDO REAL DEL ARCHIVO

        validar_audio(archivo)

        # GUARDAR ARCHIVO FISICAMENTE

        ruta_archivo = guardar_pista(archivo)

        # CALCULAR HASH SHA-256

        hash_archivo = calcular_hash_archivo(
            ruta_archivo
        )

        # VERIFICAR DUPLICADO EN LA BIBLIOTECA
        # DEL MISMO USUARIO

        pista_duplicada = buscar_pista_duplicada(
            db,
            id_usuario,
            hash_archivo
        )

        if pista_duplicada:

            eliminar_archivo(ruta_archivo)
            ruta_archivo = None

            return {
                "estado": "duplicado",
                "mensaje": "El archivo ya existe en tu biblioteca",
                "archivo": nombre_archivo
            }

        # EXTRAER METADATOS CENTRALIZADOS

        metadata_audio = extraer_metadatos_audio(
            ruta_archivo,
            nombre_archivo
        )

        # PREPARAR DATOS PARA REGISTRO

        datos_pista = PistaCreate(
            titulo=metadata_audio["titulo"],
            artista=metadata_audio["artista"],
            duracion=metadata_audio["duracion"],
            formato=metadata_audio["formato"]
        )

        # REGISTRAR EN BASE DE DATOS

        pista_registrada = registrar_pista(
            db,
            datos_pista,
            id_usuario,
            ruta_archivo
        )

        return {
            "estado": "importado",
            "mensaje": "Pista importada correctamente",
            "archivo": nombre_archivo,
            "pista": pista_registrada
        }

    except HTTPException:

        if ruta_archivo:

            try:
                eliminar_archivo(ruta_archivo)

            except Exception:
                pass

        raise

    except ValueError as error:

        if ruta_archivo:

            try:
                eliminar_archivo(ruta_archivo)

            except Exception:
                pass

        return {
            "estado": "rechazado",
            "mensaje": str(error),
            "archivo": nombre_archivo
        }

    except Exception:

        if ruta_archivo:

            try:
                eliminar_archivo(ruta_archivo)

            except Exception:
                pass

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al importar la pista"
        )


# ============================================================
# ELIMINAR PISTA
# ============================================================

def eliminar_pista_controller(
    db: Session,
    id_pista: int,
    id_usuario: int
):

    pista = obtener_pista_por_id(
        db,
        id_pista,
        id_usuario
    )

    if not pista:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pista no encontrada"
        )

    ruta_archivo = pista.ruta_archivo
    ruta_portada = pista.ruta_portada

    try:

        eliminar_pista(
            db,
            pista
        )

        # ELIMINAR ARCHIVO FISICO

        if ruta_archivo:

            try:
                eliminar_archivo(ruta_archivo)

            except Exception:
                pass

        # ELIMINAR PORTADA SI EXISTE

        if ruta_portada:

            try:
                eliminar_archivo(ruta_portada)

            except Exception:
                pass

        return {
            "mensaje": "Pista eliminada correctamente"
        }

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar la pista"
        )
