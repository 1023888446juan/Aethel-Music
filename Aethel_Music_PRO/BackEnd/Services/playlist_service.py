from sqlalchemy.orm import Session

from Models.playlist import Playlist
from Schemas.playlist import PlaylistCreate, PlaylistUpdate


# =============================================================
# CREATE PLAYLIST
# =============================================================

def crear_playlist(
    db: Session,
    datos: PlaylistCreate,
    id_usuario: int
) -> Playlist:

    playlist_existente = db.query(Playlist).filter(
        Playlist.fk_id_usuario == id_usuario,
        Playlist.nombre == datos.nombre
    ).first()

    if playlist_existente:
        raise ValueError(
            "Ya existe una playlist con ese nombre"
        )

    nueva_playlist = Playlist(
        fk_id_usuario=id_usuario,
        nombre=datos.nombre
    )

    try:
        db.add(nueva_playlist)
        db.commit()
        db.refresh(nueva_playlist)

        return nueva_playlist

    except Exception:
        db.rollback()
        raise


# =============================================================
# GET USER PLAYLISTS
# =============================================================

def obtener_playlists_usuario(
    db: Session,
    id_usuario: int
) -> list[Playlist]:

    return db.query(Playlist).filter(
        Playlist.fk_id_usuario == id_usuario
    ).order_by(
        Playlist.fecha_creacion.desc()
    ).all()


# =============================================================
# GET PLAYLIST BY ID
# =============================================================

def obtener_playlist_por_id(
    db: Session,
    id_playlist: int,
    id_usuario: int
) -> Playlist | None:

    return db.query(Playlist).filter(
        Playlist.id_playlist == id_playlist,
        Playlist.fk_id_usuario == id_usuario
    ).first()


# =============================================================
# UPDATE PLAYLIST
# =============================================================

def actualizar_playlist(
    db: Session,
    playlist: Playlist,
    datos: PlaylistUpdate
) -> Playlist:

    datos_actualizacion = datos.model_dump(
        exclude_unset=True
    )

    if "nombre" in datos_actualizacion:

        nombre_nuevo = datos_actualizacion["nombre"]

        playlist_existente = db.query(Playlist).filter(
            Playlist.fk_id_usuario == playlist.fk_id_usuario,
            Playlist.nombre == nombre_nuevo,
            Playlist.id_playlist != playlist.id_playlist
        ).first()

        if playlist_existente:
            raise ValueError(
                "Ya existe una playlist con ese nombre"
            )

    for campo, valor in datos_actualizacion.items():
        setattr(playlist, campo, valor)

    try:
        db.commit()
        db.refresh(playlist)

        return playlist

    except Exception:
        db.rollback()
        raise


# =============================================================
# DELETE PLAYLIST
# =============================================================

def eliminar_playlist(
    db: Session,
    playlist: Playlist
) -> None:

    try:
        db.delete(playlist)
        db.commit()

    except Exception:
        db.rollback()
        raise
