# =============================================================
# AETHEL MUSIC
# MAIN APPLICATION
# =============================================================

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from Core.config import settings
from Utils.file_manager import crear_directorios_storage

from Routes.auth_routes import router as auth_router
from Routes.usuario_routes import router as usuario_router
from Routes.pista_routes import router as pista_router
from Routes.playlist_routes import router as playlist_router
from Routes.playlist_pista_routes import router as playlist_pista_router
from Routes.favorito_routes import router as favorito_router
from Routes.grabacion_routes import router as grabacion_router
from Routes.efecto_routes import router as efecto_router
from Routes.pad_routes import router as pad_router
from Routes.admin_usuario_routes import router as admin_usuario_router
from Routes.configuracion_routes import router as configuracion_router


# =============================================================
# APPLICATION LIFESPAN
# =============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    # Inicialización del almacenamiento al arrancar
    crear_directorios_storage()

    yield


# =============================================================
# FASTAPI APPLICATION
# =============================================================

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Backend de Aethel Music. "
        "Sistema de gestión musical, playlists, "
        "favoritos, efectos, grabaciones, "
        "configuración y administración de usuarios."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)


# =============================================================
# CORS CONFIGURATION
# =============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================
# ROUTE REGISTRATION
# =============================================================

app.include_router(auth_router)
app.include_router(usuario_router)
app.include_router(pista_router)
app.include_router(playlist_router)
app.include_router(playlist_pista_router)
app.include_router(favorito_router)
app.include_router(grabacion_router)
app.include_router(efecto_router)
app.include_router(pad_router)
app.include_router(admin_usuario_router)
app.include_router(configuracion_router)


# =============================================================
# ROOT ENDPOINT
# =============================================================

@app.get("/", tags=["Sistema"])
def inicio():

    return {
        "aplicacion": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "mensaje": "Backend de Aethel Music",
        "documentacion": "/docs",
        "estado": "disponible"
    }


# =============================================================
# HEALTH ENDPOINT
# =============================================================

@app.get("/health", tags=["Sistema"])
def health_check():

    return {
        "aplicacion": settings.APP_NAME,
        "estado": "disponible",
        "version": settings.APP_VERSION
    }


# =============================================================
# END MAIN APPLICATION
# =============================================================
