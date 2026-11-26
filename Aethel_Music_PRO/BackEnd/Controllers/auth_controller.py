from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from Schemas.usuario import UsuarioLogin
from Services.auth_service import iniciar_sesion


# =============================================================
# LOGIN
# =============================================================

def iniciar_sesion_controller(
    db: Session,
    datos: UsuarioLogin
):

    try:
        resultado = iniciar_sesion(
            db,
            datos.correo,
            datos.password
        )

        return resultado

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno durante la autenticacion"
        )
