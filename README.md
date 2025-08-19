# Galería minimalista (GitHub Pages)

Esta es una plantilla mínima para publicar tus fotografías como sitio estático.

## Cómo usar

1. Sube todo el contenido de este zip a un repositorio de GitHub.
2. Activa **GitHub Pages** en *Settings → Pages* seleccionando la rama `main` y directorio `/ (root)`.
3. Abre tu página pública.

## Añadir fotos

- Copia tus imágenes (JPG/PNG/WEBP/SVG) dentro de `photos/`.
- Edita `photos/photos.json` y añade objetos con este formato:

```json
[
  { "file": "mi-foto-1.jpg", "title": "Título opcional", "alt": "Descripción alternativa" }
]
```

Guarda y publica los cambios. La galería se actualiza sola.
