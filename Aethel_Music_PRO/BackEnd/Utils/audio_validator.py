from pathlib import Path


# =============================================================
# SIGNATURE VALIDATION
# =============================================================

def leer_encabezado(archivo, bytes_a_leer: int = 32):

    if archivo is None or not hasattr(archivo, "file"):

        raise ValueError(
            "Archivo inválido"
        )

    try:

        archivo.file.seek(0)

        encabezado = archivo.file.read(
            bytes_a_leer
        )

        return encabezado

    finally:

        archivo.file.seek(0)


# =============================================================
# AUDIO SIGNATURES
# =============================================================

def detectar_formato_audio(encabezado: bytes):

    # AAC - ADTS
    if (
        len(encabezado) >= 2
        and encabezado[0] == 0xFF
        and (encabezado[1] & 0xF6) == 0xF0
    ):
        return "aac"

    # MP3 - ID3
    if encabezado.startswith(b"ID3"):
        return "mp3"

    # MP3 - MPEG frame synchronization
    if (
        len(encabezado) >= 2
        and encabezado[0] == 0xFF
        and (encabezado[1] & 0xE0) == 0xE0
        and (encabezado[1] & 0x06) != 0
    ):
        return "mp3"

    # WAV
    if (
        len(encabezado) >= 12
        and encabezado.startswith(b"RIFF")
        and encabezado[8:12] == b"WAVE"
    ):
        return "wav"

    # FLAC
    if encabezado.startswith(b"fLaC"):
        return "flac"

    # OGG
    if encabezado.startswith(b"OggS"):
        return "ogg"

    # M4A / ISO Base Media
    if (
        len(encabezado) >= 8
        and encabezado[4:8] == b"ftyp"
    ):
        return "m4a"

    return None


# =============================================================
# IMAGE SIGNATURES
# =============================================================

def detectar_formato_imagen(encabezado: bytes):

    # JPEG
    if encabezado.startswith(
        b"\xFF\xD8\xFF"
    ):
        return "jpeg"

    # PNG
    if encabezado.startswith(
        b"\x89PNG\r\n\x1a\n"
    ):
        return "png"

    # WEBP
    if (
        len(encabezado) >= 12
        and encabezado.startswith(b"RIFF")
        and encabezado[8:12] == b"WEBP"
    ):
        return "webp"

    return None


# =============================================================
# AUDIO FILE VALIDATION
# =============================================================

def validar_audio(archivo):

    if archivo is None:

        raise ValueError(
            "No se recibió ningún archivo"
        )

    nombre_archivo = getattr(
        archivo,
        "filename",
        None
    )

    if not nombre_archivo:

        raise ValueError(
            "El archivo no tiene nombre"
        )

    encabezado = leer_encabezado(
        archivo
    )

    formato_detectado = detectar_formato_audio(
        encabezado
    )

    if formato_detectado is None:

        raise ValueError(
            "El archivo no presenta una firma de audio reconocida"
        )

    extension_archivo = Path(
        nombre_archivo
    ).suffix.lower().replace(".", "")

    equivalencias = {
        "mp3": {"mp3"},
        "wav": {"wav"},
        "flac": {"flac"},
        "ogg": {"ogg"},
        "m4a": {"m4a"},
        "aac": {"aac"},
    }

    formatos_compatibles = equivalencias.get(
        extension_archivo,
        set()
    )

    if formato_detectado not in formatos_compatibles:

        raise ValueError(
            "La extensión no coincide con el formato detectado"
        )

    archivo.file.seek(0)

    return formato_detectado


# =============================================================
# IMAGE FILE VALIDATION
# =============================================================

def validar_imagen(archivo):

    if archivo is None:

        raise ValueError(
            "No se recibió ningún archivo"
        )

    nombre_archivo = getattr(
        archivo,
        "filename",
        None
    )

    if not nombre_archivo:

        raise ValueError(
            "El archivo no tiene nombre"
        )

    encabezado = leer_encabezado(
        archivo
    )

    formato_detectado = detectar_formato_imagen(
        encabezado
    )

    if formato_detectado is None:

        raise ValueError(
            "La imagen no presenta una firma reconocida"
        )

    extension_archivo = Path(
        nombre_archivo
    ).suffix.lower().replace(".", "")

    equivalencias = {
        "jpeg": {"jpg", "jpeg"},
        "png": {"png"},
        "webp": {"webp"},
    }

    formatos_compatibles = equivalencias.get(
        formato_detectado,
        set()
    )

    if extension_archivo not in formatos_compatibles:

        raise ValueError(
            "La extensión no coincide con el formato de imagen detectado"
        )

    archivo.file.seek(0)

    return formato_detectado
