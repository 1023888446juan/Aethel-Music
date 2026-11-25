from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from Models.historial import HistorialReproduccion
from Models.usuario import Usuario
from Models.pista import Pista
from Schemas.historial import (
    HistorialReproduccionCreate,
    HistorialReproduccionResponse
)


router = APIRouter(
    prefix="/historial",
    tags=["Historial"]
)


@router.post("/", response_model=HistorialReproduccionResponse)
def crear_historial(
    historial: HistorialReproduccionCreate,
    db: Session = Depends(get_db)
):
    usuario = db.query(Usuario).filter(
        Usuario.id_usuario == historial.fk_id_usuario
    ).first()

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    pista = db.query(Pista).filter(
        Pista.id_pista == historial.fk_id_pista
    ).first()

    if not pista:
        raise HTTPException(
            status_code=404,
            detail="Pista no encontrada"
        )

    nuevo_historial = HistorialReproduccion(
        tiempo_escuchado_historial_reproduccion=(
            historial.tiempo_escuchado_historial_reproduccion
        ),
        fk_id_usuario=historial.fk_id_usuario,
        fk_id_pista=historial.fk_id_pista
    )

    db.add(nuevo_historial)
    db.commit()
    db.refresh(nuevo_historial)

    return nuevo_historial


@router.get("/", response_model=list[HistorialReproduccionResponse])
def obtener_historial(
    db: Session = Depends(get_db)
):
    return db.query(HistorialReproduccion).all()


@router.get(
    "/{id_historial_reproduccion}",
    response_model=HistorialReproduccionResponse
)
def obtener_registro_historial(
    id_historial_reproduccion: int,
    db: Session = Depends(get_db)
):
    historial = db.query(HistorialReproduccion).filter(
        HistorialReproduccion.id_historial_reproduccion
        == id_historial_reproduccion
    ).first()

    if not historial:
        raise HTTPException(
            status_code=404,
            detail="Registro de historial no encontrado"
        )

    return historial


@router.delete("/{id_historial_reproduccion}")
def eliminar_registro_historial(
    id_historial_reproduccion: int,
    db: Session = Depends(get_db)
):
    historial = db.query(HistorialReproduccion).filter(
        HistorialReproduccion.id_historial_reproduccion
        == id_historial_reproduccion
    ).first()

    if not historial:
        raise HTTPException(
            status_code=404,
            detail="Registro de historial no encontrado"
        )

    db.delete(historial)
    db.commit()

    return {
        "mensaje": "Registro de historial eliminado correctamente"
    }