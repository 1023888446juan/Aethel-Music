from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from Models.efecto import Efecto
from Models.efecto_djseccion import EfectoDjseccion
from Models.dj_seccion import DjSeccion
from Schemas.efecto import (
    EfectoCreate,
    EfectoResponse,
    EfectoDjseccionCreate,
    EfectoDjseccionResponse
)


router = APIRouter(
    prefix="/efectos",
    tags=["Efectos"]
)


@router.post("/", response_model=EfectoResponse)
def crear_efecto(
    efecto: EfectoCreate,
    db: Session = Depends(get_db)
):
    nuevo_efecto = Efecto(
        nombre_efecto=efecto.nombre_efecto,
        duracion_efecto=efecto.duracion_efecto,
        formato=efecto.formato
    )

    db.add(nuevo_efecto)
    db.commit()
    db.refresh(nuevo_efecto)

    return nuevo_efecto


@router.get("/", response_model=list[EfectoResponse])
def obtener_efectos(
    db: Session = Depends(get_db)
):
    return db.query(Efecto).all()


@router.get("/{id_efecto}", response_model=EfectoResponse)
def obtener_efecto(
    id_efecto: int,
    db: Session = Depends(get_db)
):
    efecto = db.query(Efecto).filter(
        Efecto.id_efecto == id_efecto
    ).first()

    if not efecto:
        raise HTTPException(
            status_code=404,
            detail="Efecto no encontrado"
        )

    return efecto


@router.delete("/{id_efecto}")
def eliminar_efecto(
    id_efecto: int,
    db: Session = Depends(get_db)
):
    efecto = db.query(Efecto).filter(
        Efecto.id_efecto == id_efecto
    ).first()

    if not efecto:
        raise HTTPException(
            status_code=404,
            detail="Efecto no encontrado"
        )

    db.delete(efecto)
    db.commit()

    return {
        "mensaje": "Efecto eliminado correctamente"
    }


@router.post(
    "/asignaciones/",
    response_model=EfectoDjseccionResponse
)
def asignar_efecto_pad(
    asignacion: EfectoDjseccionCreate,
    db: Session = Depends(get_db)
):
    seccion = db.query(DjSeccion).filter(
        DjSeccion.id_secciondj == asignacion.fk_id_secciondj
    ).first()

    if not seccion:
        raise HTTPException(
            status_code=404,
            detail="Sección DJ no encontrada"
        )

    efecto = db.query(Efecto).filter(
        Efecto.id_efecto == asignacion.fk_id_efecto
    ).first()

    if not efecto:
        raise HTTPException(
            status_code=404,
            detail="Efecto no encontrado"
        )

    pad_existente = db.query(EfectoDjseccion).filter(
        EfectoDjseccion.fk_id_secciondj
        == asignacion.fk_id_secciondj,
        EfectoDjseccion.pad
        == asignacion.pad
    ).first()

    if pad_existente:
        raise HTTPException(
            status_code=400,
            detail="El Pad ya tiene un efecto asignado"
        )

    efecto_existente = db.query(EfectoDjseccion).filter(
        EfectoDjseccion.fk_id_secciondj
        == asignacion.fk_id_secciondj,
        EfectoDjseccion.fk_id_efecto
        == asignacion.fk_id_efecto
    ).first()

    if efecto_existente:
        raise HTTPException(
            status_code=400,
            detail="El efecto ya está asignado a esta sección DJ"
        )

    nueva_asignacion = EfectoDjseccion(
        fk_id_secciondj=asignacion.fk_id_secciondj,
        fk_id_efecto=asignacion.fk_id_efecto,
        pad=asignacion.pad
    )

    db.add(nueva_asignacion)
    db.commit()
    db.refresh(nueva_asignacion)

    return nueva_asignacion


@router.get(
    "/asignaciones/",
    response_model=list[EfectoDjseccionResponse]
)
def obtener_asignaciones(
    db: Session = Depends(get_db)
):
    return db.query(EfectoDjseccion).all()


@router.get(
    "/asignaciones/{id_efecto_djseccion}",
    response_model=EfectoDjseccionResponse
)
def obtener_asignacion(
    id_efecto_djseccion: int,
    db: Session = Depends(get_db)
):
    asignacion = db.query(EfectoDjseccion).filter(
        EfectoDjseccion.id_efecto_djseccion
        == id_efecto_djseccion
    ).first()

    if not asignacion:
        raise HTTPException(
            status_code=404,
            detail="Asignación de efecto no encontrada"
        )

    return asignacion


@router.delete(
    "/asignaciones/{id_efecto_djseccion}"
)
def eliminar_asignacion(
    id_efecto_djseccion: int,
    db: Session = Depends(get_db)
):
    asignacion = db.query(EfectoDjseccion).filter(
        EfectoDjseccion.id_efecto_djseccion
        == id_efecto_djseccion
    ).first()

    if not asignacion:
        raise HTTPException(
            status_code=404,
            detail="Asignación de efecto no encontrada"
        )

    db.delete(asignacion)
    db.commit()

    return {
        "mensaje": "Asignación de efecto eliminada correctamente"
    }