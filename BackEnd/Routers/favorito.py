from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from db.database import get_db
from Models.favorito import Favorito
from Models.usuario import Usuario
from Models.pista import Pista
from Schemas.favorito import FavoritoCreate, FavoritoResponse


router = APIRouter(
    prefix="/favoritos",
    tags=["Favoritos"]
)


@router.post("/", response_model=FavoritoResponse, status_code=201)
def crear_favorito(
    favorito: FavoritoCreate,
    db: Session = Depends(get_db)
):
    usuario = db.query(Usuario).filter(
        Usuario.id_usuario == favorito.fk_id_usuario
    ).first()

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    pista = db.query(Pista).filter(
        Pista.id_pista == favorito.fk_id_pista
    ).first()

    if not pista:
        raise HTTPException(
            status_code=404,
            detail="Pista no encontrada"
        )

    favorito_existente = db.query(Favorito).filter(
        Favorito.fk_id_usuario == favorito.fk_id_usuario,
        Favorito.fk_id_pista == favorito.fk_id_pista
    ).first()

    if favorito_existente:
        raise HTTPException(
            status_code=400,
            detail="La pista ya está en favoritos"
        )

    nuevo_favorito = Favorito(
        nombre_favorito=favorito.nombre_favorito,
        fk_id_usuario=favorito.fk_id_usuario,
        fk_id_pista=favorito.fk_id_pista
    )

    try:
        db.add(nuevo_favorito)
        db.commit()
        db.refresh(nuevo_favorito)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="No se pudo agregar la pista a favoritos"
        )

    return nuevo_favorito


@router.get("/", response_model=list[FavoritoResponse])
def obtener_favoritos(
    db: Session = Depends(get_db)
):
    return db.query(Favorito).all()


@router.get("/{id_favorito}", response_model=FavoritoResponse)
def obtener_favorito(
    id_favorito: int,
    db: Session = Depends(get_db)
):
    favorito = db.query(Favorito).filter(
        Favorito.id_favorito == id_favorito
    ).first()

    if not favorito:
        raise HTTPException(
            status_code=404,
            detail="Favorito no encontrado"
        )

    return favorito


@router.delete("/{id_favorito}")
def eliminar_favorito(
    id_favorito: int,
    db: Session = Depends(get_db)
):
    favorito = db.query(Favorito).filter(
        Favorito.id_favorito == id_favorito
    ).first()

    if not favorito:
        raise HTTPException(
            status_code=404,
            detail="Favorito no encontrado"
        )

    db.delete(favorito)
    db.commit()

    return {
        "mensaje": "Favorito eliminado correctamente"
    }