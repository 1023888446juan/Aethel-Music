from pydantic import BaseModel, ConfigDict


class EfectoBase(BaseModel):
    nombre_efecto: str
    duracion_efecto: int | None = None
    formato: str | None = None


class EfectoCreate(EfectoBase):
    pass


class EfectoResponse(EfectoBase):
    id_efecto: int

    model_config = ConfigDict(from_attributes=True)


class EfectoDjseccionBase(BaseModel):
    fk_id_secciondj: int
    fk_id_efecto: int
    pad: int


class EfectoDjseccionCreate(EfectoDjseccionBase):
    pass


class EfectoDjseccionResponse(EfectoDjseccionBase):
    id_efecto_djseccion: int

    model_config = ConfigDict(from_attributes=True)