import uuid
from pathlib import Path

from Core.config import settings


# =============================================================
# STORAGE CONFIGURATION
# =============================================================

DIRECTORIOS_STORAGE = {
    "music": settings.MUSIC_DIR,
    "effects": settings.EFFECTS_DIR,
    "recordings": settings.RECORDINGS_DIR,
    "covers": settings.COVERS_DIR,
}

EXTENSIONES_AUDIO = {
    ".mp3",
    ".wav",
    ".ogg",
    ".flac",
    ".m4a",
    ".aac",
}

EXTENSIONES_PORTADA = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}

EXTENSIONES_EFECTO = EXTENSIONES_AUDIO
EXTENSIONES_GRABACION = EXTENSIONES_AUDIO


# =============================================================
# DIRECTORY MANAGEMENT
# =============================================================

def crear_directorios_storage():

    directorios = [
        settings.STORAGE_DIR,
        settings.MUSIC_DIR,
        settings.EFFECTS_DIR,
        settings.RECORDINGS_DIR,
        settings.COVERS_DIR,
    ]

    for directorio in directorios:

        Path(directorio).mkdir(
            parents=True,
            exist_ok=True
        )


# =============================================================
# STORAGE DIRECTORY VALIDATION
# =============================================================

def obtener_directorio_storage(tipo: str) -> Path:

    if tipo not in DIRECTORIOS_STORAGE:

        raise ValueError(
            "Tipo de almacenamiento no válido"
        )

    raiz_storage = Path(
        settings.STORAGE_DIR
    ).resolve()

    directorio = Path(
        DIRECTORIOS_STORAGE[tipo]
    ).resolve()

    try:

        directorio.relative_to(
            raiz_storage
        )

    except ValueError:

        raise ValueError(
            "Directorio fuera del almacenamiento autorizado"
        )

    directorio.mkdir(
        parents=True,
        exist_ok=True
    )

    return directorio


# =============================================================
# FILE STORAGE
# =============================================================

def guardar_archivo(
    archivo,
    tipo: str,
    extensiones_permitidas: set,
    max_size_mb: int
):

    if archivo is None:

        raise ValueError(
            "No se recibió ningún archivo"
        )

    if not isinstance(
        max_size_mb,
        (int, float)
    ) or max_size_mb <= 0:

        raise ValueError(
            "El límite de tamaño del archivo no es válido"
        )

    directorio = obtener_directorio_storage(
        tipo
    )

    nombre_original = getattr(
        archivo,
        "filename",
        None
    )

    if not nombre_original:

        raise ValueError(
            "El archivo no tiene nombre"
        )

    extension = Path(
        nombre_original
    ).suffix.lower()

    if extension not in extensiones_permitidas:

        raise ValueError(
            "Extensión de archivo no permitida"
        )

    limite_bytes = int(
        max_size_mb * 1024 * 1024
    )

    nombre_nuevo = (
        f"{uuid.uuid4().hex}{extension}"
    )

    ruta_destino = (
        directorio / nombre_nuevo
    ).resolve()

    try:

        ruta_destino.relative_to(
            directorio
        )

    except ValueError:

        raise ValueError(
            "Ruta de almacenamiento inválida"
        )

    bytes_escritos = 0

    try:

        origen = archivo.file

        origen.seek(0)

        with open(
            ruta_destino,
            "xb"
        ) as destino:

            while True:

                bloque = origen.read(
                    1024 * 1024
                )

                if not bloque:
                    break

                bytes_escritos += len(
                    bloque
                )

                if bytes_escritos > limite_bytes:

                    raise ValueError(
                        "El archivo supera el tamaño máximo permitido"
                    )

                destino.write(
                    bloque
                )

        if bytes_escritos == 0:

            raise ValueError(
                "El archivo está vacío"
            )

        return str(
            ruta_destino
        )

    except Exception:

        try:

            if ruta_destino.exists():

                ruta_destino.unlink()

        except OSError:

            pass

        raise

    finally:

        if hasattr(
            archivo,
            "file"
        ):

            try:

                archivo.file.seek(0)

            except Exception:

                pass


# =============================================================
# STORE MUSIC TRACK
# =============================================================

def guardar_pista(archivo):

    return guardar_archivo(
        archivo=archivo,
        tipo="music",
        extensiones_permitidas=EXTENSIONES_AUDIO,
        max_size_mb=settings.MAX_AUDIO_SIZE_MB
    )


# =============================================================
# STORE COVER
# =============================================================

def guardar_portada(archivo):

    return guardar_archivo(
        archivo=archivo,
        tipo="covers",
        extensiones_permitidas=EXTENSIONES_PORTADA,
        max_size_mb=10
    )


# =============================================================
# STORE EFFECT
# =============================================================

def guardar_efecto(archivo):

    return guardar_archivo(
        archivo=archivo,
        tipo="effects",
        extensiones_permitidas=EXTENSIONES_EFECTO,
        max_size_mb=settings.MAX_EFFECT_SIZE_MB
    )


# =============================================================
# STORE RECORDING
# =============================================================

def guardar_grabacion(archivo):

    return guardar_archivo(
        archivo=archivo,
        tipo="recordings",
        extensiones_permitidas=EXTENSIONES_GRABACION,
        max_size_mb=settings.MAX_RECORDING_SIZE_MB
    )


# =============================================================
# FILE DELETION
# =============================================================

def eliminar_archivo(ruta_archivo: str):

    if not ruta_archivo:

        return False

    ruta = Path(
        ruta_archivo
    ).resolve()

    raiz_storage = Path(
        settings.STORAGE_DIR
    ).resolve()

    try:

        ruta.relative_to(
            raiz_storage
        )

    except ValueError:

        raise ValueError(
            "No se permite eliminar archivos fuera del Storage"
        )

    if not ruta.exists():

        return False

    if not ruta.is_file():

        raise ValueError(
            "La ruta no corresponde a un archivo"
        )

    ruta.unlink()

    return True


# =============================================================
# MULTIPLE FILE DELETION
# =============================================================

def eliminar_archivos(rutas: list[str]):

    resultados = []

    for ruta in rutas:

        try:

            resultado = eliminar_archivo(
                ruta
            )

            resultados.append(
                resultado
            )

        except Exception as error:

            resultados.append({
                "ruta": ruta,
                "error": str(error)
            })

    return resultados
