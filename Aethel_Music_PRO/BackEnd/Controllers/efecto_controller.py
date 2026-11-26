from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from Services.efecto_service import (
    registrar_efecto,
    obtener_efectos_usuario,
    obtener_efecto_por_id,
    eliminar_efecto
)

from Utils.file_manager import (
    guardar_efecto,
    eliminar_archivo
)

from Utils.audio_validator import (
    validar_audio
)


# =============================================================
# REGISTER EFFECT
# =============================================================

def registrar_efecto_controller(
    db: Session,
    archivo,
    id_usuario: int
):

    ruta_archivo = None

    try:

        validar_audio(
            archivo
        )

        ruta_archivo = guardar_efecto(
            archivo
        )

        efecto = registrar_efecto(
            db=db,
            id_usuario=id_usuario,
            ruta_archivo=ruta_archivo
        )

        return {
            "mensaje": "Efecto registrado correctamente",
            "efecto": efecto
        }

    except ValueError as error:

        if ruta_archivo:

            try:
                eliminar_archivo(
                    ruta_archivo
                )

            except Exception:
                pass

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

    except Exception:

        if ruta_archivo:

            try:
                eliminar_archivo(
                    ruta_archivo
                )

            except Exception:
                pass

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al registrar el efecto"
        )


# =============================================================
# GET USER EFFECTS
# =============================================================

def obtener_efectos_usuario_controller(
    db: Session,
    id_usuario: int
):

    try:

        return obtener_efectos_usuario(
            db,
            id_usuario
        )

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al consultar los efectos"
        )


# =============================================================
# GET EFFECT BY ID
# =============================================================

def obtener_efecto_controller(
    db: Session,
    id_efecto: int,
    id_usuario: int
):

    efecto = obtener_efecto_por_id(
        db,
        id_efecto,
        id_usuario
    )

    if efecto is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Efecto no encontrado"
        )

    return efecto


# =============================================================
# DELETE EFFECT
# =============================================================

def eliminar_efecto_controller(
    db: Session,
    id_efecto: int,
    id_usuario: int
):

    efecto = obtener_efecto_por_id(
        db,
        id_efecto,
        id_usuario
    )

    if efecto is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Efecto no encontrado"
        )

    ruta_archivo = efecto.ruta_archivo

    try:

        eliminar_efecto(
            db,
            efecto
        )

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar el efecto de la base de datos"
        )

    archivo_eliminado = False

    try:

        archivo_eliminado = eliminar_archivo(
            ruta_archivo
        )

    except Exception:

        archivo_eliminado = False

    if not archivo_eliminado:

        return {
            "mensaje": "Efecto eliminado de la base de datos",
            "advertencia": (
                "No fue posible eliminar el archivo físico "
                "del almacenamiento"
            )
        }

    return {
        "mensaje": "Efecto eliminado correctamente"
    }
