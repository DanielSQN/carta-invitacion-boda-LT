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

## Dominio Propio (boda-tattan-lu.info)

El dominio se conecta una sola vez; después todo despliegue queda publicado ahí automáticamente.

1. **Agregar el dominio en Vercel**: proyecto → Settings → Domains → Add → `boda-tattan-lu.info`. Agrega también `www.boda-tattan-lu.info` y márcalo para que redirija al dominio principal.

2. **Configurar el DNS en DonDominio** (registrador del dominio): entra a
   dondominio.com → Área de cliente → Dominios → `boda-tattan-lu.info` →
   pestaña **Zona DNS** (el dominio debe usar los nameservers de DonDominio,
   que es lo predeterminado). Ahí:
   - Si existe un registro `A` de parking para `@`, elimínalo.
   - Crea un registro `A` con host `@` (o vacío) → `76.76.21.21`
   - Crea un registro `CNAME` con host `www` → `cname.vercel-dns.com`
   - TTL: el valor por defecto está bien.

   Usa los valores exactos que Vercel muestre al agregar el dominio (si
   difieren de los de arriba, mandan los de Vercel). La propagación puede
   tardar de minutos a unas horas. Vercel emite el certificado HTTPS solo
   (no hay que hacer nada).

3. **Variable de entorno**: en Vercel → Settings → Environment Variables, define para Production:

   ```
   NEXT_PUBLIC_SITE_URL=https://boda-tattan-lu.info
   ```

   y vuelve a desplegar. (El código ya usa este dominio como valor por defecto, pero la variable manda.) Esto hace que los previews de WhatsApp apunten al dominio nuevo.

4. **Links de los invitados**: desde ese momento compárte los links como `https://boda-tattan-lu.info/?para=Nombre`. El botón "Copiar link" del panel usa automáticamente el dominio desde el que abras el panel, así que ábrelo en `https://boda-tattan-lu.info/invitados` para copiar links con el dominio nuevo. Los links viejos (`*.vercel.app`) siguen funcionando.

Nota: las mayúsculas en el dominio no importan (`Boda-Tattan-Lu.info` y `boda-tattan-lu.info` son el mismo).
