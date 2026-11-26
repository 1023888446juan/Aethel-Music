from sqlalchemy.orm import Session

from Models.usuario import Usuario

from Core.security import (
    verify_password,
    create_access_token
)


# =============================================================
# USER AUTHENTICATION
# =============================================================

def autenticar_usuario(
    db: Session,
    correo: str,
    password: str
) -> Usuario | None:

    usuario = db.query(Usuario).filter(
        Usuario.correo == correo
    ).first()

    if usuario is None:
        return None

    if usuario.estado_usuario != "activo":
        return None

    if not verify_password(
        password,
        usuario.password_hash
    ):
        return None

    return usuario


# =============================================================
# LOGIN TOKEN GENERATION
# =============================================================

def generar_token_usuario(
    usuario: Usuario
) -> str:

    return create_access_token(
        subject=str(usuario.id_usuario)
    )


# =============================================================
# LOGIN PROCESS
# =============================================================

def iniciar_sesion(
    db: Session,
    correo: str,
    password: str
) -> dict | None:

    usuario = autenticar_usuario(
        db,
        correo,
        password
    )

    if usuario is None:
        return None

    token = generar_token_usuario(usuario)

    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": usuario
    }
