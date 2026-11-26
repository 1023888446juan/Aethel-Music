from sqlalchemy.orm import Session

from Models.favorito import Favorito
from Models.pista import Pista
from Schemas.favorito import FavoritoCreate


# =============================================================
# ADD FAVORITE
# =============================================================

def agregar_favorito(
    db: Session,
    datos: FavoritoCreate,
    id_usuario: int
) -> Favorito:

    pista = db.query(Pista).filter(
        Pista.id_pista == datos.fk_id_pista,
        Pista.fk_id_usuario == id_usuario
    ).first()

    if pista is None:
        raise ValueError(
            "La pista no existe o no pertenece al usuario"
        )

    existente = db.query(Favorito).filter(
        Favorito.fk_id_usuario == id_usuario,
        Favorito.fk_id_pista == datos.fk_id_pista
    ).first()

    if existente:
        raise ValueError(
            "La pista ya se encuentra en favoritos"
        )

    favorito = Favorito(
        fk_id_usuario=id_usuario,
        fk_id_pista=datos.fk_id_pista
    )

    try:
        db.add(favorito)
        db.commit()
        db.refresh(favorito)

        return favorito

    except Exception:
        db.rollback()
        raise


# =============================================================
# GET USER FAVORITES
# =============================================================

def obtener_favoritos_usuario(
    db: Session,
    id_usuario: int
) -> list[Favorito]:

    return db.query(Favorito).join(
        Pista,
        Favorito.fk_id_pista == Pista.id_pista
    ).filter(
        Favorito.fk_id_usuario == id_usuario,
        Pista.fk_id_usuario == id_usuario
    ).order_by(
        Pista.titulo.asc(),
        Pista.id_pista.asc()
    ).all()


# =============================================================
# GET FAVORITE BY ID
# =============================================================

def obtener_favorito_por_id(
    db: Session,
    id_favorito: int,
    id_usuario: int
) -> Favorito | None:

    return db.query(Favorito).filter(
        Favorito.id_favorito == id_favorito,
        Favorito.fk_id_usuario == id_usuario
    ).first()


# =============================================================
# REMOVE FAVORITE
# =============================================================

def eliminar_favorito(
    db: Session,
    id_favorito: int,
    id_usuario: int
) -> None:

    favorito = db.query(Favorito).filter(
        Favorito.id_favorito == id_favorito,
        Favorito.fk_id_usuario == id_usuario
    ).first()

    if favorito is None:
        raise ValueError(
            "Favorito no encontrado"
        )

    try:
        db.delete(favorito)
        db.commit()

    except Exception:
        db.rollback()
        raise


# =============================================================
# REMOVE FAVORITE BY TRACK
# =============================================================

def eliminar_favorito_por_pista(
    db: Session,
    id_pista: int,
    id_usuario: int
) -> None:

    favorito = db.query(Favorito).filter(
        Favorito.fk_id_usuario == id_usuario,
        Favorito.fk_id_pista == id_pista
    ).first()

    if favorito is None:
        raise ValueError(
            "La pista no se encuentra en favoritos"
        )

    try:
        db.delete(favorito)
        db.commit()

    except Exception:
        db.rollback()
        raise
