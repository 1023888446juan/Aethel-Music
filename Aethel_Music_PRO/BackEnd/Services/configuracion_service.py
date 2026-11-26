# =============================================================
# AETHEL MUSIC
# SERVICE: CONFIGURACION
# =============================================================

from sqlalchemy.orm import Session

from Models.configuracion import Configuracion


# =============================================================
# VALIDATION
# =============================================================

def validar_configuracion(tema: str, escala_ui: int):

    if tema not in ("oscuro", "claro"):
        raise ValueError(
            "El tema seleccionado no es válido"
        )

    if not isinstance(escala_ui, int) or isinstance(escala_ui, bool):
        raise ValueError(
            "La escala de interfaz debe ser un número entero"
        )

    if not 50 <= escala_ui <= 200:
        raise ValueError(
            "La escala de interfaz debe estar entre 50 y 200"
        )


# =============================================================
# GET OR CREATE USER CONFIGURATION
# =============================================================

def obtener_o_crear_configuracion(
    db: Session,
    id_usuario: int
):

    configuracion = db.query(Configuracion).filter(
        Configuracion.fk_id_usuario == id_usuario
    ).first()

    if configuracion is not None:
        return configuracion

    configuracion = Configuracion(
        fk_id_usuario=id_usuario,
        tema="oscuro",
        escala_ui=100
    )

    try:

        db.add(configuracion)
        db.commit()
        db.refresh(configuracion)

        return configuracion

    except Exception:

        db.rollback()
        raise


# =============================================================
# GET USER CONFIGURATION
# =============================================================

def obtener_configuracion_usuario(
    db: Session,
    id_usuario: int
):

    return obtener_o_crear_configuracion(
        db,
        id_usuario
    )


# =============================================================
# UPDATE USER CONFIGURATION
# =============================================================

def actualizar_configuracion_usuario(
    db: Session,
    id_usuario: int,
    tema: str,
    escala_ui: int
):

    validar_configuracion(
        tema,
        escala_ui
    )

    configuracion = obtener_o_crear_configuracion(
        db,
        id_usuario
    )

    configuracion.tema = tema
    configuracion.escala_ui = escala_ui

    try:

        db.commit()
        db.refresh(configuracion)

        return configuracion

    except Exception:

        db.rollback()
        raise


# =============================================================
# RESET USER CONFIGURATION
# =============================================================

def restaurar_configuracion_usuario(
    db: Session,
    id_usuario: int
):

    configuracion = obtener_o_crear_configuracion(
        db,
        id_usuario
    )

    configuracion.tema = "oscuro"
    configuracion.escala_ui = 100

    try:

        db.commit()
        db.refresh(configuracion)

        return configuracion

    except Exception:

        db.rollback()
        raise


# =============================================================
# END SERVICE: CONFIGURACION
# =============================================================
