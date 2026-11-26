from sqlalchemy.orm import Session

from Models.usuario import Usuario


# --------------------------------------------------
# CONSULTAR TODOS LOS USUARIOS
# --------------------------------------------------

def listar_usuarios(
    db: Session,
    offset: int = 0,
    limit: int = 100
) -> list[Usuario]:

    return (
        db.query(Usuario)
        .order_by(Usuario.id_usuario.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )


# --------------------------------------------------
# CONSULTAR USUARIO POR ID
# --------------------------------------------------

def obtener_usuario_admin(
    db: Session,
    id_usuario: int
) -> Usuario | None:

    return (
        db.query(Usuario)
        .filter(Usuario.id_usuario == id_usuario)
        .first()
    )


# --------------------------------------------------
# VALIDAR CORREO DUPLICADO
# --------------------------------------------------

def validar_correo_admin(
    db: Session,
    correo: str,
    id_usuario: int
) -> None:

    usuario_existente = (
        db.query(Usuario)
        .filter(
            Usuario.correo == correo,
            Usuario.id_usuario != id_usuario
        )
        .first()
    )

    if usuario_existente:
        raise ValueError(
            "El correo ya se encuentra registrado por otro usuario"
        )


# --------------------------------------------------
# PROTEGER EL ÚLTIMO ADMINISTRADOR ACTIVO
# --------------------------------------------------

def validar_ultimo_administrador(
    db: Session,
    usuario: Usuario,
    datos_actualizacion: dict
) -> None:

    perdera_privilegios = (
        datos_actualizacion.get("rol_usuario") == "usuario"
        or datos_actualizacion.get("estado_usuario") == "inactivo"
    )

    if not perdera_privilegios:
        return

    es_admin_activo = (
        usuario.rol_usuario == "administrador"
        and usuario.estado_usuario == "activo"
    )

    if not es_admin_activo:
        return

    administradores_activos = (
        db.query(Usuario)
        .filter(
            Usuario.rol_usuario == "administrador",
            Usuario.estado_usuario == "activo"
        )
        .count()
    )

    if administradores_activos <= 1:
        raise ValueError(
            "No se puede desactivar o quitar el rol "
            "al último administrador activo"
        )


# --------------------------------------------------
# ACTUALIZAR USUARIO ADMINISTRATIVAMENTE
# --------------------------------------------------

def actualizar_usuario_admin(
    db: Session,
    usuario: Usuario,
    datos
) -> Usuario:

    datos_actualizacion = datos.model_dump(exclude_unset=True)

    if not datos_actualizacion:
        return usuario

    if "correo" in datos_actualizacion:
        validar_correo_admin(
            db,
            datos_actualizacion["correo"],
            usuario.id_usuario
        )

    validar_ultimo_administrador(
        db,
        usuario,
        datos_actualizacion
    )

    try:
        for campo, valor in datos_actualizacion.items():
            setattr(usuario, campo, valor)

        db.commit()
        db.refresh(usuario)

        return usuario

    except Exception:
        db.rollback()
        raise


# --------------------------------------------------
# ELIMINAR USUARIO ADMINISTRATIVAMENTE
# --------------------------------------------------

def eliminar_usuario_admin(
    db: Session,
    usuario: Usuario,
    id_admin_autenticado: int
) -> None:

    if usuario.id_usuario == id_admin_autenticado:
        raise ValueError(
            "No puedes eliminar tu propia cuenta desde el módulo administrativo"
        )

    es_admin_activo = (
        usuario.rol_usuario == "administrador"
        and usuario.estado_usuario == "activo"
    )

    if es_admin_activo:

        administradores_activos = (
            db.query(Usuario)
            .filter(
                Usuario.rol_usuario == "administrador",
                Usuario.estado_usuario == "activo"
            )
            .count()
        )

        if administradores_activos <= 1:
            raise ValueError(
                "No se puede eliminar al último administrador activo"
            )

    try:
        db.delete(usuario)
        db.commit()

    except Exception:
        db.rollback()
        raise