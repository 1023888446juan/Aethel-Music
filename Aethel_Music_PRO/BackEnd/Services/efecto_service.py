from sqlalchemy.orm import Session

from Models.efecto import Efecto


# =============================================================
# REGISTER EFFECT
# =============================================================

def registrar_efecto(
    db: Session,
    id_usuario: int,
    ruta_archivo: str
) -> Efecto:

    efecto = Efecto(
        fk_id_usuario=id_usuario,
        ruta_archivo=ruta_archivo
    )

    try:
        db.add(efecto)
        db.commit()
        db.refresh(efecto)

        return efecto

    except Exception:
        db.rollback()
        raise


# =============================================================
# GET USER EFFECTS
# =============================================================

def obtener_efectos_usuario(
    db: Session,
    id_usuario: int
) -> list[Efecto]:

    return db.query(Efecto).filter(
        Efecto.fk_id_usuario == id_usuario
    ).order_by(
        Efecto.fecha_carga.desc()
    ).all()


# =============================================================
# GET EFFECT BY ID
# =============================================================

def obtener_efecto_por_id(
    db: Session,
    id_efecto: int,
    id_usuario: int
) -> Efecto | None:

    return db.query(Efecto).filter(
        Efecto.id_efecto == id_efecto,
        Efecto.fk_id_usuario == id_usuario
    ).first()


# =============================================================
# DELETE EFFECT
# =============================================================

def eliminar_efecto(
    db: Session,
    efecto: Efecto
) -> None:

    try:
        db.delete(efecto)
        db.commit()

    except Exception:
        db.rollback()
        raise


# =============================================================
# DELETE EFFECT BY ID
# =============================================================

def eliminar_efecto_por_id(
    db: Session,
    id_efecto: int,
    id_usuario: int
) -> None:

    efecto = db.query(Efecto).filter(
        Efecto.id_efecto == id_efecto,
        Efecto.fk_id_usuario == id_usuario
    ).first()

    if efecto is None:
        raise ValueError(
            "Efecto no encontrado"
        )

    eliminar_efecto(db, efecto)
