# =============================================================
# AETHEL MUSIC
# CONTROLLER: CONFIGURACION
# =============================================================

from sqlalchemy.orm import Session

from Services.configuracion_service import (
    obtener_configuracion_usuario,
    actualizar_configuracion_usuario,
    restaurar_configuracion_usuario
)


# =============================================================
# GET USER CONFIGURATION
# =============================================================

def obtener_configuracion_controller(
    db: Session,
    id_usuario: int
):

    try:

        return obtener_configuracion_usuario(
            db,
            id_usuario
        )

    except Exception as error:

        raise RuntimeError(
            f"Error al obtener la configuración del usuario: {error}"
        ) from error


# =============================================================
# UPDATE USER CONFIGURATION
# =============================================================

def actualizar_configuracion_controller(
    db: Session,
    id_usuario: int,
    tema: str,
    escala_ui: int
):

    try:

        return actualizar_configuracion_usuario(
            db=db,
            id_usuario=id_usuario,
            tema=tema,
            escala_ui=escala_ui
        )

    except ValueError:
        raise

    except Exception as error:

        raise RuntimeError(
            f"Error al actualizar la configuración del usuario: {error}"
        ) from error


# =============================================================
# RESET USER CONFIGURATION
# =============================================================

def restaurar_configuracion_controller(
    db: Session,
    id_usuario: int
):

    try:

        return restaurar_configuracion_usuario(
            db,
            id_usuario
        )

    except Exception as error:

        raise RuntimeError(
            f"Error al restaurar la configuración del usuario: {error}"
        ) from error


# =============================================================
# END CONTROLLER: CONFIGURACION
# =============================================================
