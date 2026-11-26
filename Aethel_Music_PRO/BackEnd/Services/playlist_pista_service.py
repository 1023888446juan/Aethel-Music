from sqlalchemy.orm import Session
from sqlalchemy import func

from Models.playlist_pista import PlaylistPista
from Models.playlist import Playlist
from Models.pista import Pista
from Schemas.playlist_pista import PlaylistPistaCreate


# =============================================================
# ADD TRACK TO PLAYLIST
# =============================================================

def agregar_pista_playlist(
    db: Session,
    datos: PlaylistPistaCreate,
    id_playlist: int,
    id_usuario: int
) -> PlaylistPista:

    playlist = db.query(Playlist).filter(
        Playlist.id_playlist == id_playlist,
        Playlist.fk_id_usuario == id_usuario
    ).first()

    if playlist is None:
        raise ValueError("Playlist no encontrada")

    pista = db.query(Pista).filter(
        Pista.id_pista == datos.fk_id_pista,
        Pista.fk_id_usuario == id_usuario
    ).first()

    if pista is None:
        raise ValueError("La pista no pertenece al usuario")

    existente = db.query(PlaylistPista).filter(
        PlaylistPista.fk_id_playlist == id_playlist,
        PlaylistPista.fk_id_pista == datos.fk_id_pista,
        PlaylistPista.fk_id_usuario == id_usuario
    ).first()

    if existente:
        raise ValueError(
            "La pista ya se encuentra en esta playlist"
        )

    ultima_posicion = db.query(
        func.max(PlaylistPista.posicion)
    ).filter(
        PlaylistPista.fk_id_playlist == id_playlist,
        PlaylistPista.fk_id_usuario == id_usuario
    ).scalar()

    posicion = (ultima_posicion or 0) + 1

    nueva_asociacion = PlaylistPista(
        fk_id_playlist=id_playlist,
        fk_id_pista=datos.fk_id_pista,
        fk_id_usuario=id_usuario,
        posicion=posicion
    )

    try:

        db.add(nueva_asociacion)
        db.commit()
        db.refresh(nueva_asociacion)

        return nueva_asociacion

    except Exception:

        db.rollback()
        raise


# =============================================================
# GET PLAYLIST TRACKS
# ALPHANUMERIC ORDER
# =============================================================

def obtener_pistas_playlist(
    db: Session,
    id_playlist: int,
    id_usuario: int
) -> list[PlaylistPista]:

    playlist = db.query(Playlist).filter(
        Playlist.id_playlist == id_playlist,
        Playlist.fk_id_usuario == id_usuario
    ).first()

    if playlist is None:
        raise ValueError("Playlist no encontrada")

    return db.query(PlaylistPista).join(
        Pista,
        PlaylistPista.fk_id_pista == Pista.id_pista
    ).filter(
        PlaylistPista.fk_id_playlist == id_playlist,
        PlaylistPista.fk_id_usuario == id_usuario,
        Pista.fk_id_usuario == id_usuario
    ).order_by(
        func.lower(Pista.titulo).asc(),
        Pista.id_pista.asc()
    ).all()


# =============================================================
# REMOVE TRACK FROM PLAYLIST
# =============================================================

def retirar_pista_playlist(
    db: Session,
    id_playlist: int,
    id_pista: int,
    id_usuario: int
) -> None:

    playlist = db.query(Playlist).filter(
        Playlist.id_playlist == id_playlist,
        Playlist.fk_id_usuario == id_usuario
    ).first()

    if playlist is None:
        raise ValueError("Playlist no encontrada")

    asociacion = db.query(PlaylistPista).filter(
        PlaylistPista.fk_id_playlist == id_playlist,
        PlaylistPista.fk_id_pista == id_pista,
        PlaylistPista.fk_id_usuario == id_usuario
    ).first()

    if asociacion is None:
        raise ValueError(
            "La pista no se encuentra en la playlist"
        )

    try:

        db.delete(asociacion)
        db.commit()

    except Exception:

        db.rollback()
        raise


# =============================================================
# REORDER PLAYLIST TRACKS
# MANUAL REORDERING DISABLED
# =============================================================

def reordenar_pistas_playlist(
    db: Session,
    id_playlist: int,
    id_usuario: int,
    nuevo_orden: list[int]
) -> list[PlaylistPista]:

    playlist = db.query(Playlist).filter(
        Playlist.id_playlist == id_playlist,
        Playlist.fk_id_usuario == id_usuario
    ).first()

    if playlist is None:
        raise ValueError("Playlist no encontrada")

    raise ValueError(
        "El orden de las pistas es alfanumerico y no puede modificarse manualmente"
    )
