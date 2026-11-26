from sqlalchemy.orm import Session

from Models.grabacion import Grabacion
from Models.usuario import Usuario
from Schemas.grabacion import GrabacionCreate


# =============================================================
# REGISTER RECORDING
# =============================================================

def registrar_grabacion(
    db: Session,
    datos: GrabacionCreate,
    id_usuario: int,
    ruta_archivo: str
) -> Grabacion:

    usuario = db.query(Usuario).filter(
        Usuario.id_usuario == id_usuario
    ).first()

    if usuario is None:
        raise ValueError("Usuario no encontrado")

    grabacion = Grabacion(
        fk_id_usuario=id_usuario,
        titulo=datos.titulo,
        artista=usuario.nombre,
        duracion=datos.duracion,
        ruta_archivo=ruta_archivo
    )

    try:
        db.add(grabacion)
        db.commit()
        db.refresh(grabacion)

        return grabacion

    except Exception:
        db.rollback()
        raise


# =============================================================
# GET USER RECORDINGS
# =============================================================

def obtener_grabaciones_usuario(
    db: Session,
    id_usuario: int
) -> list[Grabacion]:

    return db.query(Grabacion).filter(
        Grabacion.fk_id_usuario == id_usuario
    ).order_by(
        Grabacion.fecha_creacion.desc()
    ).all()


# =============================================================
# GET RECORDING BY ID
# =============================================================

def obtener_grabacion_por_id(
    db: Session,
    id_grabacion: int,
    id_usuario: int
) -> Grabacion | None:

    return db.query(Grabacion).filter(
        Grabacion.id_grabacion == id_grabacion,
        Grabacion.fk_id_usuario == id_usuario
    ).first()


# =============================================================
# UPDATE RECORDING METADATA
# =============================================================

def actualizar_grabacion(
    db: Session,
    grabacion: Grabacion,
    titulo: str | None = None
) -> Grabacion:

    if titulo is not None:
        grabacion.titulo = titulo

    try:
        db.commit()
        db.refresh(grabacion)

        return grabacion

    except Exception:
        db.rollback()
        raise


# =============================================================
# DELETE RECORDING
# =============================================================

def eliminar_grabacion(
    db: Session,
    grabacion: Grabacion
) -> None:

    try:
        db.delete(grabacion)
        db.commit()

    except Exception:
        db.rollback()
        raise


# =============================================================
# DELETE RECORDING BY ID
# =============================================================

def eliminar_grabacion_por_id(
    db: Session,
    id_grabacion: int,
    id_usuario: int
) -> None:

    grabacion = db.query(Grabacion).filter(
        Grabacion.id_grabacion == id_grabacion,
        Grabacion.fk_id_usuario == id_usuario
    ).first()

    if grabacion is None:
        raise ValueError(
            "Grabacion no encontrada"
        )

    eliminar_grabacion(db, grabacion)
