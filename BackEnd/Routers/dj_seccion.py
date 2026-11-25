from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from Models.dj_seccion import DjSeccion
from Models.usuario import Usuario
from Schemas.dj_seccion import DjSeccionCreate, DjSeccionResponse


router = APIRouter(
    prefix="/dj-secciones",
    tags=["Secciones DJ"]
)


@router.post("/", response_model=DjSeccionResponse)
def crear_dj_seccion(
    seccion: DjSeccionCreate,
    db: Session = Depends(get_db)
):
    usuario = db.query(Usuario).filter(
        Usuario.id_usuario == seccion.fk_id_usuario
    ).first()

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    nueva_seccion = DjSeccion(
        descripcion_dj_seccion=seccion.descripcion_dj_seccion,
        fk_id_usuario=seccion.fk_id_usuario
    )

    db.add(nueva_seccion)
    db.commit()
    db.refresh(nueva_seccion)

    return nueva_seccion


@router.get("/", response_model=list[DjSeccionResponse])
def obtener_dj_secciones(
    db: Session = Depends(get_db)
):
    return db.query(DjSeccion).all()


@router.get("/{id_secciondj}", response_model=DjSeccionResponse)
def obtener_dj_seccion(
    id_secciondj: int,
    db: Session = Depends(get_db)
):
    seccion = db.query(DjSeccion).filter(
        DjSeccion.id_secciondj == id_secciondj
    ).first()

    if not seccion:
        raise HTTPException(
            status_code=404,
            detail="Sección DJ no encontrada"
        )

    return seccion


@router.delete("/{id_secciondj}")
def eliminar_dj_seccion(
    id_secciondj: int,
    db: Session = Depends(get_db)
):
    seccion = db.query(DjSeccion).filter(
        DjSeccion.id_secciondj == id_secciondj
    ).first()

    if not seccion:
        raise HTTPException(
            status_code=404,
            detail="Sección DJ no encontrada"
        )

    db.delete(seccion)
    db.commit()

    return {
        "mensaje": "Sección DJ eliminada correctamente"
    }