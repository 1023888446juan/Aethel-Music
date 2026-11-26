from sqlalchemy.orm import Session

from Models.pad import Pad
from Models.efecto import Efecto
from Schemas.pad import PadUpdate


# =============================================================
# GET USER PADS
# =============================================================

def obtener_pads_usuario(
    db: Session,
    id_usuario: int
) -> list[Pad]:

    return db.query(Pad).filter(
        Pad.fk_id_usuario == id_usuario
    ).order_by(
        Pad.numero_pad.asc()
    ).all()


# =============================================================
# GET PAD BY ID
# =============================================================

def obtener_pad_por_id(
    db: Session,
    id_pad: int,
    id_usuario: int
) -> Pad | None:

    return db.query(Pad).filter(
        Pad.id_pad == id_pad,
        Pad.fk_id_usuario == id_usuario
    ).first()


# =============================================================
# GET PAD BY NUMBER
# =============================================================

def obtener_pad_por_numero(
    db: Session,
    numero_pad: int,
    id_usuario: int
) -> Pad | None:

    return db.query(Pad).filter(
        Pad.numero_pad == numero_pad,
        Pad.fk_id_usuario == id_usuario
    ).first()


# =============================================================
# ASSIGN OR REMOVE EFFECT FROM PAD
# =============================================================

def actualizar_pad(
    db: Session,
    pad: Pad,
    datos: PadUpdate,
    id_usuario: int
) -> Pad:

    if pad.fk_id_usuario != id_usuario:
        raise ValueError(
            "El pad no pertenece al usuario"
        )

    datos_actualizados = datos.model_dump(
        exclude_unset=True
    )

    if "fk_id_efecto" in datos_actualizados:

        id_efecto = datos_actualizados["fk_id_efecto"]

        if id_efecto is not None:

            efecto = db.query(Efecto).filter(
                Efecto.id_efecto == id_efecto,
                Efecto.fk_id_usuario == id_usuario
            ).first()

            if efecto is None:
                raise ValueError(
                    "El efecto no existe o no pertenece al usuario"
                )

        pad.fk_id_efecto = id_efecto

    try:
        db.commit()
        db.refresh(pad)

        return pad

    except Exception:
        db.rollback()
        raise


# =============================================================
# ASSIGN EFFECT BY PAD NUMBER
# =============================================================

def asignar_efecto_pad(
    db: Session,
    numero_pad: int,
    id_efecto: int,
    id_usuario: int
) -> Pad:

    pad = obtener_pad_por_numero(
        db,
        numero_pad,
        id_usuario
    )

    if pad is None:
        raise ValueError(
            "Pad no encontrado"
        )

    datos = PadUpdate(
        fk_id_efecto=id_efecto
    )

    return actualizar_pad(
        db,
        pad,
        datos,
        id_usuario
    )


# =============================================================
# CLEAR PAD
# =============================================================

def vaciar_pad(
    db: Session,
    numero_pad: int,
    id_usuario: int
) -> Pad:

    pad = obtener_pad_por_numero(
        db,
        numero_pad,
        id_usuario
    )

    if pad is None:
        raise ValueError(
            "Pad no encontrado"
        )

    datos = PadUpdate(
        fk_id_efecto=None
    )

    return actualizar_pad(
        db,
        pad,
        datos,
        id_usuario
    )
