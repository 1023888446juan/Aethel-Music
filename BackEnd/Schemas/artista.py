from pydantic import BaseModel, ConfigDict


class ArtistaBase(BaseModel):
    nombre_artista: str
    genero_artista: str | None = None


class ArtistaCreate(ArtistaBase):
    pass


class ArtistaResponse(ArtistaBase):
    id_artista: int

    model_config = ConfigDict(from_attributes=True)