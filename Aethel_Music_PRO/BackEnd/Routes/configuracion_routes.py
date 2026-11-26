# =============================================================
# AETHEL MUSIC
# ROUTES: CONFIGURACION
# =============================================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from Core.dependencies import get_current_user

from Controllers.configuracion_controller import (
    obtener_configuracion_controller,
    actualizar_configuracion_controller,
    restaurar_configuracion_controller
)

from Schemas.configuracion import (
    ConfiguracionUpdate,
    ConfiguracionResponse
)


router = APIRouter(
    prefix="/api/configuracion",
    tags=["Configuracion"]
)


# =============================================================
# GET USER CONFIGURATION
# =============================================================

@router.get(
    "/",
    response_model=ConfiguracionResponse
)
def obtener_configuracion(
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    try:

        return obtener_configuracion_controller(
            db,
            usuario_actual.id_usuario
        )

    except RuntimeError as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# =============================================================
# UPDATE USER CONFIGURATION
# =============================================================

@router.put(
    "/",
    response_model=ConfiguracionResponse
)
def actualizar_configuracion(
    datos: ConfiguracionUpdate,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    try:

        return actualizar_configuracion_controller(
            db=db,
            id_usuario=usuario_actual.id_usuario,
            tema=datos.tema,
            escala_ui=datos.escala_ui
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except RuntimeError as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# =============================================================
# RESET USER CONFIGURATION
# =============================================================

@router.post(
    "/restaurar",
    response_model=ConfiguracionResponse
)
def restaurar_configuracion(
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    try:

        return restaurar_configuracion_controller(
            db,
            usuario_actual.id_usuario
        )

    except RuntimeError as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# =============================================================
# END ROUTES: CONFIGURACION
# =============================================================
