from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from db.database import get_db
from Schemas.usuario import UsuarioLogin
from Controllers.auth_controller import iniciar_sesion_controller
from Services.auth_service import iniciar_sesion


router = APIRouter(
    prefix="/api/auth",
    tags=["Autenticación"]
)


# =============================================================
# LOGIN PARA FRONTEND - JSON
# =============================================================

@router.post("/login")
def login(
    datos: UsuarioLogin,
    db: Session = Depends(get_db)
):

    return iniciar_sesion_controller(
        db,
        datos
    )


# =============================================================
# LOGIN OAUTH2 - SWAGGER
# =============================================================

@router.post("/token")
def login_oauth2(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    resultado = iniciar_sesion(
        db,
        form_data.username,
        form_data.password
    )

    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    return {
        "access_token": resultado["access_token"],
        "token_type": resultado["token_type"]
    }
