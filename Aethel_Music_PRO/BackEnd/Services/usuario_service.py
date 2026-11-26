from sqlalchemy.orm import Session

from Models.usuario import Usuario
from Models.configuracion import Configuracion

from Schemas.usuario import UsuarioCreate, UsuarioUpdate

from Core.security import hash_password


# =============================================================
# USER REGISTRATION
# =============================================================

def registrar_usuario(
    db: Session,
    datos: UsuarioCreate
) -> Usuario:

    usuario_existente = db.query(Usuario).filter(
        Usuario.correo == datos.correo
    ).first()

    if usuario_existente:
        raise ValueError("El correo ya se encuentra registrado")

    nuevo_usuario = Usuario(
        nombre=datos.nombre,
        correo=datos.correo,
        password_hash=hash_password(datos.password),
        estado_usuario="activo"
    )

    try:
        db.add(nuevo_usuario)
        db.flush()

        nueva_configuracion = Configuracion(
            fk_id_usuario=nuevo_usuario.id_usuario
        )

        db.add(nueva_configuracion)
        db.commit()
        db.refresh(nuevo_usuario)

        return nuevo_usuario

    except Exception:
        db.rollback()
        raise


# =============================================================
# GET USER BY ID
# =============================================================

def obtener_usuario_por_id(
    db: Session,
    id_usuario: int
) -> Usuario | None:

    return db.query(Usuario).filter(
        Usuario.id_usuario == id_usuario
    ).first()


# =============================================================
# GET USER BY EMAIL
# =============================================================

def obtener_usuario_por_correo(
    db: Session,
    correo: str
) -> Usuario | None:

    return db.query(Usuario).filter(
        Usuario.correo == correo
    ).first()


# =============================================================
# UPDATE USER PROFILE
# =============================================================

def actualizar_usuario(
    db: Session,
    usuario: Usuario,
    datos: UsuarioUpdate
) -> Usuario:

    datos_actualizacion = datos.model_dump(
        exclude_unset=True
    )

    try:

        for campo, valor in datos_actualizacion.items():

            if campo == "nombre":
                usuario.nombre = valor

        db.commit()
        db.refresh(usuario)

        return usuario

    except Exception:
        db.rollback()
        raise


# =============================================================
# UPDATE PROFILE PHOTO PATH
# =============================================================

def actualizar_ruta_foto_perfil(
    db: Session,
    usuario: Usuario,
    nueva_ruta: str
) -> str | None:

    ruta_foto_anterior = usuario.ruta_foto_perfil

    try:

        usuario.ruta_foto_perfil = nueva_ruta

        db.commit()
        db.refresh(usuario)

        return ruta_foto_anterior

    except Exception:
        db.rollback()
        raise


# =============================================================
# REMOVE PROFILE PHOTO REFERENCE
# =============================================================

def eliminar_ruta_foto_perfil(
    db: Session,
    usuario: Usuario
) -> str | None:

    ruta_foto_anterior = usuario.ruta_foto_perfil

    if ruta_foto_anterior is None:
        return None

    try:

        usuario.ruta_foto_perfil = None

        db.commit()
        db.refresh(usuario)

        return ruta_foto_anterior

    except Exception:
        db.rollback()
        raise


# =============================================================
# DELETE USER
# =============================================================

def eliminar_usuario(
    db: Session,
    usuario: Usuario
) -> None:

    try:
        db.delete(usuario)
        db.commit()

    except Exception:
        db.rollback()
        raise
