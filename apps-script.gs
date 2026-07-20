/**
 * INVITACIÓN DE BODA — Hernán & Nancy
 * Backend en Google Sheets (Google Apps Script)
 *
 * Guarda: Confirmaciones (RSVP), Libro de Firmas, Velas y Canciones.
 * Instrucciones de instalación en INSTRUCCIONES.md
 */

// Crea las hojas automáticamente la primera vez
function hoja(nombre, encabezados) {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let h = libro.getSheetByName(nombre);
  if (!h) {
    h = libro.insertSheet(nombre);
    h.appendRow(encabezados);
    h.getRange(1, 1, 1, encabezados.length)
      .setFontWeight('bold')
      .setBackground('#C48B86')
      .setFontColor('#FFFFFF');
    h.setFrozenRows(1);
  }
  return h;
}

const HOJAS = {
  rsvp:    () => hoja('Confirmaciones', ['Fecha', 'Invitado (link)', 'Nombre', '¿Asiste?', 'Cupos confirmados', 'Cupos asignados', 'Mensaje']),
  firma:   () => hoja('Libro de Firmas', ['Fecha', 'Nombre', 'Dedicatoria']),
  vela:    () => hoja('Velas',           ['Fecha', 'Invitado']),
  cancion: () => hoja('Canciones',       ['Fecha', 'Canción', 'Artista', 'Sugerida por'])
};

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Lectura: velas totales + dedicatorias publicadas */
function doGet(e) {
  try {
    const velas = HOJAS.vela().getLastRow() - 1;

    const hf = HOJAS.firma();
    let firmas = [];
    if (hf.getLastRow() > 1) {
      firmas = hf.getRange(2, 2, hf.getLastRow() - 1, 2)
        .getValues()
        .filter(f => f[0] && f[1])
        .map(f => ({ nombre: String(f[0]), mensaje: String(f[1]) }));
    }

    return json({ ok: true, velas: Math.max(0, velas), firmas: firmas });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/** Escritura */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    const ahora = new Date();

    switch (d.accion) {

      case 'rsvp': {
        const h = HOJAS.rsvp();
        // Si el invitado ya respondió, actualiza su fila en lugar de duplicar
        const clave = String(d.invitado || d.nombre || '').toLowerCase().trim();
        let fila = 0;
        if (clave && h.getLastRow() > 1) {
          const vals = h.getRange(2, 2, h.getLastRow() - 1, 2).getValues();
          for (let i = 0; i < vals.length; i++) {
            const a = String(vals[i][0] || '').toLowerCase().trim();
            const b = String(vals[i][1] || '').toLowerCase().trim();
            if (a === clave || b === clave) { fila = i + 2; break; }
          }
        }
        const datos = [
          ahora,
          d.invitado || '',
          d.nombre || '',
          d.asiste === 'si' ? 'SÍ' : 'NO',
          d.pases || 0,
          d.cuposAsignados || '',
          d.mensaje || ''
        ];
        if (fila) h.getRange(fila, 1, 1, datos.length).setValues([datos]);
        else h.appendRow(datos);
        return json({ ok: true });
      }

      case 'firma': {
        HOJAS.firma().appendRow([ahora, d.nombre || '', d.mensaje || '']);
        return json({ ok: true });
      }

      case 'vela': {
        const h = HOJAS.vela();
        h.appendRow([ahora, d.invitado || 'Anónimo']);
        return json({ ok: true, total: Math.max(0, h.getLastRow() - 1) });
      }

      case 'cancion': {
        HOJAS.cancion().appendRow([ahora, d.cancion || '', d.artista || '', d.quien || '']);
        return json({ ok: true });
      }

      default:
        return json({ ok: false, error: 'Acción desconocida: ' + d.accion });
    }
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
