from pydantic import BaseModel, ConfigDict


class PlaylistPistaBase(BaseModel):
    fk_id_playlist: int
    fk_id_pista: int


class PlaylistPistaCreate(PlaylistPistaBase):
    pass


class PlaylistPistaResponse(PlaylistPistaBase):
    id_playlist_pista: int

    model_config = ConfigDict(from_attributes=True)