# Despliegue

Guía rápida para publicar cambios del proyecto en GitHub y en Vercel producción.

## Requisitos

- Node.js instalado.
- Dependencias instaladas con `npm install`.
- Acceso al repositorio de GitHub.
- Sesión iniciada en Vercel CLI con `npx vercel login`.

## Validar Antes De Publicar

Ejecuta:

```bash
npm run lint
npm run build
```

Ambos comandos deben terminar sin errores antes de publicar.

## Publicar En Git/GitHub

1. Revisa cambios:

```bash
git status
git diff
```

2. Agrega los archivos:

```bash
git add .
```

3. Crea el commit:

```bash
git commit -m "Describe el cambio"
```

4. Sube a GitHub:

```bash
git push origin main
```

## Publicar En Vercel Producción

Si el proyecto no está vinculado todavía:

```bash
npx vercel link
```

Después despliega a producción:

```bash
npx vercel --prod
```

Para despliegues no interactivos, cuando el proyecto ya está vinculado:

```bash
npx vercel --prod --yes
```

## Assets Reemplazables

- Foto principal: `public/images/foto-pareja.png`
- Preview de WhatsApp/Open Graph: `public/preview-boda-v2.png`
- Música de fondo: `public/audio/musica-fondo.wav`
- Sello: `public/images/sello-lt.png`

Puedes reemplazar esos archivos manteniendo el mismo nombre para no tocar código.

WhatsApp puede guardar cache del preview. Para probar cambios puedes compartir la URL con `?preview=2` o cambiar el nombre de la imagen a una nueva versión, por ejemplo `preview-boda-v3.png`.
