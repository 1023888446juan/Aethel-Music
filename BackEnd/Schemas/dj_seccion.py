from pydantic import BaseModel, ConfigDict


class DjSeccionBase(BaseModel):
    descripcion_dj_seccion: str | None = None
    fk_id_usuario: int


class DjSeccionCreate(DjSeccionBase):
    pass


class DjSeccionResponse(DjSeccionBase):
    id_secciondj: int

    model_config = ConfigDict(from_attributes=True)