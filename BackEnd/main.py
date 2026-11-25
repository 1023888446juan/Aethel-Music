from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from Routers import usuario
from Routers import configuracion
from Routers import artista
from Routers import album
from Routers import pista
from Routers import playlist
from Routers import playlist_pista
from Routers import favorito
from Routers import historial
from Routers import dj_seccion
from Routers import efecto


app = FastAPI(
    title="Aethel Music API",
    description="API para la gestión de música de Aethel Music",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(usuario.router)
app.include_router(configuracion.router)
app.include_router(artista.router)
app.include_router(album.router)
app.include_router(pista.router)
app.include_router(playlist.router)
app.include_router(playlist_pista.router)
app.include_router(favorito.router)
app.include_router(historial.router)
app.include_router(dj_seccion.router)
app.include_router(efecto.router)


@app.get("/")
def inicio():
    return {
        "mensaje": "Aethel Music API funcionando correctamente"
    }