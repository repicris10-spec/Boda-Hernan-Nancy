# Invitación de boda — Hernán & Nancy

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La invitación. Todo el contenido se edita en el bloque `CONFIG` al inicio del archivo. |
| `generador-links.html` | Genera el link único de cada invitado y el mensaje de WhatsApp listo para enviar. |
| `apps-script.gs` | Código para Google Sheets (confirmaciones, firmas, velas y canciones). |

Para verla ahora mismo: abre `index.html` en el navegador. En computador se muestra dentro de un marco tipo celular.

---

## 1. Conectar Google Sheets (15 minutos)

1. Entra a [sheets.new](https://sheets.new) y crea una hoja nueva. Ponle "Boda Hernán y Nancy".
2. Menú **Extensiones → Apps Script**.
3. Borra todo lo que aparezca y pega el contenido completo de `apps-script.gs`.
4. Guarda (icono del disquete).
5. Botón azul **Implementar → Nueva implementación**.
   - Engranaje ⚙️ junto a "Seleccionar tipo" → **Aplicación web**
   - *Ejecutar como:* **Yo**
   - *Quién tiene acceso:* **Cualquier usuario** ← importante
   - **Implementar**
6. Google pedirá permisos: **Revisar permisos → tu cuenta → Configuración avanzada → Ir a (nombre del proyecto) → Permitir**.
7. Copia la **URL de la aplicación web** (termina en `/exec`).
8. Abre `index.html`, busca `sheetsUrl: ""` y pega la URL entre las comillas:

```js
sheetsUrl: "https://script.google.com/macros/s/AKfy..../exec"
```

Las hojas *Confirmaciones*, *Libro de Firmas*, *Velas* y *Canciones* se crean solas con la primera respuesta.

> Si no configuras esto, la invitación funciona igual, pero cada respuesta se guarda solo en el celular de quien la escribió, y la confirmación llega únicamente por el botón de WhatsApp.

---

## 2. Agregar las imágenes

Sube las fotos a la misma carpeta que `index.html` y escribe el nombre del archivo en `CONFIG.img`:

```js
img: {
  logoPortada:  "logo.png",
  logoTarjeta:  "logo-pequeno.png",
  fotoPortada:  "portada.jpg",
  fotoPromesa:  "foto1.jpg",
  fotoArgollas: "argollas.png",
  fotoHistoria: "foto2.jpg",
  galeria:      ["g1.jpg", "g2.jpg", "g3.jpg", "g4.jpg"]
}
```

Mientras estén vacías se ven marcadores rayados en su lugar, así que puedes mostrarla ya y agregar las fotos después.

**Tamaños recomendados:** portada y fotos verticales 1080×1350 px · galería cuadradas 800×800 px · logos PNG con fondo transparente.

---

## 3. La música

Consigue el MP3 de *A Blanco y Negro* — Silvestre Dangond, renómbralo `musica.mp3` y ponlo junto a `index.html`. Ya está configurado para sonar apenas se abre la invitación, con un botón para silenciarla.

Nota: el link de YouTube no sirve para esto; los navegadores no permiten reproducir YouTube en segundo plano dentro de una página.

---

## 4. Links de cada invitado

Abre `generador-links.html`, escribe arriba la dirección donde subiste la invitación (ej. `https://tudominio.com/boda/`) y todos los links se actualizan solos.

Cada fila trae tres botones: **Copiar** el link, abrir **WhatsApp** con el mensaje de invitación ya escrito, y **Ver** cómo le llega al invitado.

Los nombres y los cupos se editan haciendo clic directamente sobre ellos en la tabla. También puedes descargar todo en Excel/CSV.

**Formato del link:** `...?n=Nombre&p=cupos` — por ejemplo `?n=Fanny&p=4` muestra "Esta invitación es para Fanny · Tienes 4 cupos reservados" y limita la confirmación a máximo 4 personas.

---

## 5. Publicarla en internet

La opción más simple y gratuita: entra a [app.netlify.com/drop](https://app.netlify.com/drop) y arrastra la carpeta completa. En segundos te da un link público. Desde ahí puedes conectarle un dominio propio si quieres.

También funciona subiendo la carpeta por FTP a cualquier hosting.

---

## Pendientes por confirmar

- **Año 2027** — asumido a partir de la fecha límite de confirmación (31 de octubre). Si es 2026 u otro, cámbialo en `fechaISO`, `fechaFinISO` y `fechaTexto`.
- **Dirección exacta** del Centro Recreacional San Fernando. Por ahora el botón "Cómo llegar" abre una búsqueda en Google Maps. Lo ideal es que busques el sitio en Maps, uses "Compartir → Copiar vínculo" y pegues ese link en `CONFIG.lugares[0].maps`.
- **Hora de cierre 3:00 a.m.** — el evento se configuró terminando a las 3 a.m. del día 13.
- **Carpeta de Drive:** verifica que esté compartida como *"Cualquier persona con el enlace"* con permiso de **Editor**, o los invitados no podrán subir fotos.
- **Nombres del listado** — algunos estaban sin número de cupos y les puse 1: *Mamá, Andrés Esc., Lili, Angy*. Y estos no se leían con claridad en la foto: **Adolfo**, **Papá Tomás**, **Salanghe**, **Yaque**, **Ovelis**, **Albenis**. Corrígelos en `generador-links.html`.
- **"Amigos — 8 cupos"** quedó como una sola invitación de 8 cupos. Si son varias personas distintas, sepáralas.
- **Fotos y textos de "Nuestra Historia"** — dejé un texto genérico que puedes reemplazar.
