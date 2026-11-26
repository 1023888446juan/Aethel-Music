from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from db.database import get_db
from Models.usuario import Usuario
from Core.security import decode_access_token


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/token"
)


# ============================================================
# AUTHENTICATION: CURRENT USER
# ============================================================

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Usuario:

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales de autenticacion invalidas",
        headers={"WWW-Authenticate": "Bearer"}
    )

    subject = decode_access_token(token)

    if subject is None:
        raise credentials_exception

    try:
        user_id = int(subject)
    except (TypeError, ValueError):
        raise credentials_exception

    user = db.query(Usuario).filter(
        Usuario.id_usuario == user_id
    ).first()

    if user is None:
        raise credentials_exception

    if user.estado_usuario != "activo":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="La cuenta de usuario no se encuentra activa"
        )

    return user


# ============================================================
# AUTHORIZATION: ADMINISTRATOR
# ============================================================

def get_current_admin(
    current_user: Usuario = Depends(get_current_user)
) -> Usuario:

    if current_user.rol_usuario != "administrador":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para acceder a esta operacion"
        )

    return current_user


# ============================================================
# END DEPENDENCIES
# ============================================================
