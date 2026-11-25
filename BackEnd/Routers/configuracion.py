from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from db.database import get_db
from Models.configuracion import Configuracion
from Models.usuario import Usuario
from Schemas.configuracion import (
    ConfiguracionCreate,
    ConfiguracionResponse
)


router = APIRouter(
    prefix="/configuraciones",
    tags=["Configuraciones"]
)


@router.post("/", response_model=ConfiguracionResponse, status_code=201)
def crear_configuracion(
    configuracion: ConfiguracionCreate,
    db: Session = Depends(get_db)
):
    usuario = db.query(Usuario).filter(
        Usuario.id_usuario == configuracion.fk_id_usuario
    ).first()

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    configuracion_existente = db.query(Configuracion).filter(
        Configuracion.fk_id_usuario == configuracion.fk_id_usuario
    ).first()

    if configuracion_existente:
        raise HTTPException(
            status_code=400,
            detail="El usuario ya tiene una configuración"
        )

    nueva_configuracion = Configuracion(
        color_configuracion=configuracion.color_configuracion,
        idioma_configuracion=configuracion.idioma_configuracion,
        notificacion_configuracion=(
            configuracion.notificacion_configuracion
        ),
        fk_id_usuario=configuracion.fk_id_usuario
    )

    try:
        db.add(nueva_configuracion)
        db.commit()
        db.refresh(nueva_configuracion)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="No se pudo crear la configuración"
        )

    return nueva_configuracion


@router.get(
    "/",
    response_model=list[ConfiguracionResponse]
)
def obtener_configuraciones(
    db: Session = Depends(get_db)
):
    return db.query(Configuracion).all()


@router.get(
    "/{id_configuracion}",
    response_model=ConfiguracionResponse
)
def obtener_configuracion(
    id_configuracion: int,
    db: Session = Depends(get_db)
):
    configuracion = db.query(Configuracion).filter(
        Configuracion.id_configuracion == id_configuracion
    ).first()

    if not configuracion:
        raise HTTPException(
            status_code=404,
            detail="Configuración no encontrada"
        )

    return configuracion


@router.delete("/{id_configuracion}")
def eliminar_configuracion(
    id_configuracion: int,
    db: Session = Depends(get_db)
):
    configuracion = db.query(Configuracion).filter(
        Configuracion.id_configuracion == id_configuracion
    ).first()

    if not configuracion:
        raise HTTPException(
            status_code=404,
            detail="Configuración no encontrada"
        )

    db.delete(configuracion)
    db.commit()

    return {
        "mensaje": "Configuración eliminada correctamente"
    }