import mimetypes
from pathlib import Path

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from db.database import get_db
from Core.dependencies import get_current_user
from Core.config import settings

from Controllers.pista_controller import (
    obtener_pistas_usuario_controller,
    obtener_pista_controller,
    obtener_pista_por_uuid_controller,
    eliminar_pista_controller,
    importar_pista_controller
)


router = APIRouter(
    prefix="/api/pistas",
    tags=["Pistas"]
)


@router.get("/{id_pista}/audio")
def reproducir_pista(
    id_pista: int,
    db: Session = Depends(get_db),
    usuario_actual=Depends(get_current_user)
):
    """Entrega el audio de una pista propia sin exponer Storage como carpeta pública."""
    pista = obtener_pista_controller(
        db,
        id_pista,
        usuario_actual.id_usuario
    )
    ruta = Path(pista.ruta_archivo).resolve()
    try:
        ruta.relative_to(Path(settings.MUSIC_DIR).resolve())
    except ValueError:
        raise HTTPException(status_code=404, detail="El archivo de audio no está disponible")
    if not ruta.is_file():
        raise HTTPException(status_code=404, detail="El archivo de audio no está disponible")

    media_type = mimetypes.guess_type(ruta.name)[0] or "application/octet-stream"
    return FileResponse(ruta, media_type=media_type)


# ============================================================
# LISTAR PISTAS DEL USUARIO
# ============================================================

@router.get("/")
def listar_pistas(
    db: Session = Depends(get_db),
    usuario_actual=Depends(get_current_user)
):

    return obtener_pistas_usuario_controller(
        db,
        usuario_actual.id_usuario
    )


# ============================================================
# IMPORTAR PISTA INDIVIDUAL
# ============================================================

@router.post("/importar")
def importar_pista(
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db),
    usuario_actual=Depends(get_current_user)
):

    return importar_pista_controller(
        db,
        archivo,
        usuario_actual.id_usuario
    )


# ============================================================
# IMPORTAR MULTIPLES PISTAS
# ============================================================

@router.post("/importar-multiple")
def importar_pistas_multiple(
    archivos: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    usuario_actual=Depends(get_current_user)
):

    resultados = []

    for archivo in archivos:

        resultado = importar_pista_controller(
            db,
            archivo,
            usuario_actual.id_usuario
        )

        resultados.append(resultado)

    total = len(resultados)

    importados = sum(
        1 for resultado in resultados
        if resultado.get("estado") == "importado"
    )

    duplicados = sum(
        1 for resultado in resultados
        if resultado.get("estado") == "duplicado"
    )

    rechazados = sum(
        1 for resultado in resultados
        if resultado.get("estado") == "rechazado"
    )

    return {
        "mensaje": "Proceso de importación finalizado",
        "total_archivos": total,
        "importados": importados,
        "duplicados": duplicados,
        "rechazados": rechazados,
        "resultados": resultados
    }


# ============================================================
# CONSULTAR PISTA POR UUID
# ============================================================

@router.get("/uuid/{uuid_pista}")
def obtener_pista_uuid(
    uuid_pista: str,
    db: Session = Depends(get_db),
    usuario_actual=Depends(get_current_user)
):

    return obtener_pista_por_uuid_controller(
        db,
        uuid_pista,
        usuario_actual.id_usuario
    )


# ============================================================
# CONSULTAR PISTA POR ID
# ============================================================

@router.get("/{id_pista}")
def obtener_pista(
    id_pista: int,
    db: Session = Depends(get_db),
    usuario_actual=Depends(get_current_user)
):

    return obtener_pista_controller(
        db,
        id_pista,
        usuario_actual.id_usuario
    )


# ============================================================
# ELIMINAR PISTA
# ============================================================

@router.delete("/{id_pista}")
def eliminar_pista(
    id_pista: int,
    db: Session = Depends(get_db),
    usuario_actual=Depends(get_current_user)
):

    return eliminar_pista_controller(
        db,
        id_pista,
        usuario_actual.id_usuario
    )
