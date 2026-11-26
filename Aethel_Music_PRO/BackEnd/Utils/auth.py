# =============================================================
# AETHEL MUSIC
# AUTHENTICATION DEPENDENCY
# =============================================================

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from db.database import get_db
from Models.usuario import Usuario

from Core.security import decode_access_token


# =============================================================
# OAUTH2 TOKEN SCHEME
# =============================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/token"
)


# =============================================================
# GET AUTHENTICATED USER
# =============================================================

def obtener_usuario_actual(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Usuario:

    credenciales_invalidas = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o expirado",
        headers={
            "WWW-Authenticate": "Bearer"
        }
    )

    subject = decode_access_token(token)

    if subject is None:
        raise credenciales_invalidas

    try:

        id_usuario = int(subject)

    except (ValueError, TypeError):

        raise credenciales_invalidas

    usuario = db.query(Usuario).filter(
        Usuario.id_usuario == id_usuario
    ).first()

    if usuario is None:
        raise credenciales_invalidas

    if usuario.estado_usuario != "activo":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="La cuenta del usuario no está activa"
        )

    return usuario


# =============================================================
# END AUTHENTICATION DEPENDENCY
# =============================================================
