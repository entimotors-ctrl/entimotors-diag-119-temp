/* ENTIMOTORS · LECTURA DEL CRÉDITO LEGADO #25 (RECORD-119) — HERRAMIENTA TEMPORAL DE SOLO LECTURA
 * ------------------------------------------------------------------------------------------------------------
 * Lee SOLO la base 3.13 «entimotors_os_demo» de ESTE teléfono (almacenes `creditos` y `clientes`, en solo lectura) y saca del
 * crédito #25 lo estrictamente necesario para rescatarlo SIN inventar nada: los CONCEPTOS de sus 4 renglones y la forma exacta
 * del registro (orden de claves, importes, fechas). Verifica el registro contra la huella e1f30b46… (diagnósticos v1/v2) y cada
 * concepto contra su huella individual.
 * No exporta el nombre ni el teléfono del cliente, ni el texto del mecánico, ni la nota: dice si son IDÉNTICOS a datos que ya
 * están en el respaldo JEIEKQ (cliente legado 22, mecánico de otros créditos) para reconstruir el registro sin sacarlos del teléfono.
 * NO escribe, NO borra, NO crea bases, NO abre la caché de nube ni la sesión, NO inicia ni renueva sesión, NO usa la red
 * (CSP connect-src 'none'). El archivo solo sale si la persona pulsa «Descargar» o «Compartir».
 */
(function (global) {
  "use strict";
  var ESPERADO = {"huella":"e1f30b463b96c25eb261bb07","contenido":"6fe307e545001d35a6f79040","renglones":[{"precio":130,"h":"d75fd1a4b446d948"},{"precio":120,"h":"39b78435cc64b310"},{"precio":100,"h":"1001198fee5f0957"},{"precio":180,"h":"e4a1d6c620342842"}]};     // { huella, contenido, renglones: [{precio, h}] } del diagnóstico v2
  var FIN = "FIN-LECTURA-ENTIMOTORS-CREDITO-25";
  var FECHA = /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;
  var ENUM = /^[a-z][a-z0-9_\-]{0,29}$/;
  var UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  async function generar(env) {
    var idb = env.indexedDB, cripto = env.crypto;
    var enc = new TextEncoder();
    var hex = async function (t) { var b = new Uint8Array(await cripto.subtle.digest("SHA-256", enc.encode(t))); var s = ""; for (var i = 0; i < b.length; i++) s += (b[i] < 16 ? "0" : "") + b[i].toString(16); return s; };
    var huella = async function (v) { return (await hex(JSON.stringify(v))).slice(0, 24); };
    var corta = async function (t) { return t == null || t === "" ? null : (await hex(String(t).trim().toLowerCase())).slice(0, 16); };
    var VOLATILES = ["id", "creadoEn", "actualizadoEn", "fechaISO", "uid", "_rev", "_base", "_pend"];
    var contenido = function (r) { var c = {}; Object.keys(r).forEach(function (k) { if (VOLATILES.indexOf(k) < 0) c[k] = r[k]; }); return c; };
    var digitos = function (t) { return String(t == null ? "" : t).replace(/\D/g, ""); };
    var tipo = function (v) { return v === null ? "null" : Array.isArray(v) ? "array" : typeof v; };

    var informe = { herramienta: "entimotors-lector-credito25 v1", generadoEn: new Date().toISOString(), origen: env.origen || null,
      controladoPorServiceWorker: !!env.controladoPorSW, privacidad: "Solo los conceptos de los 4 renglones salen en texto. Nombre/teléfono del cliente, mecánico y nota NO salen: solo si son idénticos a datos ya conocidos.",
      encontrado: false, verificacion: null, registro: null, renglones: null, referencias: null, avisos: [] };

    var lista = typeof idb.databases === "function" ? await idb.databases() : null;
    var meta = lista && lista.filter(function (d) { return d.name === "entimotors_os_demo"; })[0];
    if (!lista) { informe.estado = "NO SE PUDO COMPROBAR (el navegador no lista bases): no se abrió nada"; informe.completo = true; return informe; }
    if (!meta) { informe.estado = "NO EXISTE entimotors_os_demo en este navegador"; informe.completo = true; return informe; }
    var db = await new Promise(function (ok, mal) {
      var q = idb.open(meta.name, meta.version);
      q.onupgradeneeded = function () { try { q.transaction.abort(); } catch (e) { /* nada */ } mal(new Error("ABORTADO: se pidió cambiar el esquema")); };
      q.onblocked = function () { mal(new Error("BLOQUEADO")); };
      q.onsuccess = function () { ok(q.result); }; q.onerror = function () { mal(q.error); };
    });
    var leer = function (store) {
      return new Promise(function (ok) {
        if (Array.prototype.slice.call(db.objectStoreNames).indexOf(store) < 0) { ok(null); return; }
        try { var q = db.transaction(store, "readonly").objectStore(store).getAll(); q.onsuccess = function () { ok(q.result); }; q.onerror = function () { ok(null); }; } catch (e) { ok(null); }
      });
    };
    var creditos = (await leer("creditos")) || [], clientes = (await leer("clientes")) || [];
    db.close();
    var c = creditos.filter(function (x) { return x && x.id === 25; })[0];
    if (!c) { informe.estado = "NO EXISTE el crédito legado #25 en este teléfono"; informe.completo = true; return informe; }
    informe.encontrado = true;

    // 1 · verificación del registro COMPLETO contra los diagnósticos v1/v2
    var hR = await huella(c), hC = await huella(contenido(c));
    informe.verificacion = { huellaRegistro: hR, esperada: ESPERADO.huella, coincide: hR === ESPERADO.huella, huellaContenido: hC, contenidoEsperado: ESPERADO.contenido, contenidoCoincide: hC === ESPERADO.contenido };

    // 2 · forma del registro: orden EXACTO de claves + valores no sensibles (números, fechas, estados); el resto, por referencia
    var cliente22 = clientes.filter(function (x) { return x && x.id === c.clienteId; })[0] || null;
    var nombresClientes = clientes.map(function (x) { return x && typeof x.nombre === "string" ? x.nombre.trim().toLowerCase() : ""; }).filter(function (n) { return n.length >= 4; });
    var reg = { claves: Object.keys(c), valores: {} };
    for (var k of Object.keys(c)) {
      var v = c[k];
      if (k === "items" || k === "historialAbonos") continue;
      if (k === "clienteNombre") { reg.valores[k] = { tipo: tipo(v), longitud: v == null ? 0 : String(v).length, nombreH: await corta(v), igualAlClienteLegado: !!cliente22 && v === cliente22.nombre }; continue; }
      if (k === "clienteTelefono") { reg.valores[k] = { tipo: tipo(v), longitud: v == null ? 0 : String(v).length, vacio: !digitos(v), igualAlClienteLegado: !!cliente22 && v === cliente22.telefono, mismosDigitosQueElClienteLegado: !!cliente22 && digitos(v) === digitos(cliente22.telefono) }; continue; }
      if (k === "mecanico" || k === "nota" || (typeof v === "string" && k !== "fechaISO" && k !== "vencimiento" && k !== "estado" && !UUID.test(v))) {
        var mismos = typeof v === "string" && v !== "" ? creditos.filter(function (x) { return x && x.id !== 25 && x[k] === v; }).map(function (x) { return x.id; }) : [];
        reg.valores[k] = { tipo: tipo(v), longitud: v == null ? 0 : String(v).length, vacio: v === "" || v == null, valor: v === "" ? "" : (v == null ? v : undefined), igualQueEnCreditosLegado: mismos };
        continue;
      }
      if (typeof v === "string") { reg.valores[k] = { tipo: "string", valor: (FECHA.test(v) || ENUM.test(v) || UUID.test(v) || v === "") ? v : undefined, longitud: v.length }; continue; }
      if (v === null || typeof v === "number" || typeof v === "boolean") { reg.valores[k] = { tipo: tipo(v), valor: v }; continue; }
      reg.valores[k] = { tipo: tipo(v), omitido: true };
      informe.avisos.push("campo «" + k + "» de tipo " + tipo(v) + " no previsto: no se exporta");
    }
    reg.historialAbonos = Array.isArray(c.historialAbonos) ? c.historialAbonos.map(function (a) {
      var o = { claves: Object.keys(a || {}) };
      Object.keys(a || {}).forEach(function (q) { var w = a[q]; o[q] = (typeof w === "number" || typeof w === "boolean" || w === null) ? w : (typeof w === "string" && (FECHA.test(w) || ENUM.test(w) || /^[\w:.\-]{1,80}$/.test(w)) ? w : { tipo: tipo(w), longitud: String(w).length }); });
      return o; }) : { tipo: tipo(c.historialAbonos) };
    informe.registro = reg;

    // 3 · los 4 renglones: el CONCEPTO (lo que se busca), verificado contra su huella, con su orden de claves y sus importes
    var R = [];
    var items = Array.isArray(c.items) ? c.items : [];
    for (var i = 0; i < items.length; i++) {
      var it = items[i] || {}, h = await corta(it.nombre), esp = ESPERADO.renglones[i] || {};
      var r = { indice: i, claves: Object.keys(it), cantidad: it.cantidad, precio: it.precio, huellaConcepto: h, huellaEsperada: esp.h || null,
        conceptoCoincide: h !== null && h === esp.h && it.precio === esp.precio, otros: {} };
      Object.keys(it).forEach(function (q) { if (["nombre", "cantidad", "precio"].indexOf(q) < 0) { var w = it[q]; r.otros[q] = (w === null || typeof w === "number" || typeof w === "boolean") ? w : { tipo: tipo(w), longitud: String(w).length }; } });
      // salvaguarda: un concepto que trae un nombre de cliente, un teléfono o un correo NO sale (se avisa)
      var t = typeof it.nombre === "string" ? it.nombre : null, bajo = t ? t.toLowerCase() : "";
      var conNombre = t && nombresClientes.some(function (n) { return new RegExp("(^|[^\\p{L}])" + n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^\\p{L}]|$)", "u").test(bajo); });
      var conTel = t && /\d{7,}/.test(t.replace(/[\s\-]/g, "")), conCorreo = t && /@/.test(t);
      if (t === null) r.concepto = { tipo: tipo(it.nombre) };
      else if (conNombre || conTel || conCorreo) { r.concepto = null; r.conceptoRetenido = conNombre ? "contiene un nombre de cliente" : conTel ? "contiene un número largo" : "contiene un correo"; informe.avisos.push("renglón " + i + ": concepto retenido por privacidad (" + r.conceptoRetenido + ")"); }
      else r.concepto = t;
      R.push(r);
    }
    informe.renglones = R;
    informe.referencias = { clienteLegadoId: c.clienteId, clienteLegadoPresente: !!cliente22, clienteLegadoHuella: cliente22 ? await huella(cliente22) : null };
    var precios = R.map(function (x) { return x.precio; }).slice().sort(function (a, b) { return a - b; }).join(",");
    informe.veredicto = { encontrado: true, registroCoincide: informe.verificacion.coincide, renglones: R.length, importesCoinciden: precios === "100,120,130,180" && R.every(function (x) { return x.cantidad === 1; }),
      conceptosRecuperados: R.filter(function (x) { return typeof x.concepto === "string" && x.conceptoCoincide; }).length,
      clienteReconstruible: !!(reg.valores.clienteNombre && reg.valores.clienteNombre.igualAlClienteLegado && reg.valores.clienteTelefono && (reg.valores.clienteTelefono.igualAlClienteLegado || reg.valores.clienteTelefono.vacio)),
      avisos: informe.avisos.length };
    informe.completo = true;
    return informe;
  }

  async function empaquetar(informe, cripto) {
    var txt = JSON.stringify(informe);
    var b = new Uint8Array(await cripto.subtle.digest("SHA-256", new TextEncoder().encode(txt))), h = "";
    for (var i = 0; i < b.length; i++) h += (b[i] < 16 ? "0" : "") + b[i].toString(16);
    return '{"informe":' + txt + ',"integridad":{"algoritmo":"SHA-256","sobre":"JSON.stringify(informe)","sha256":"' + h + '","completo":true,"fin":"' + FIN + '"}}';
  }
  global.LectorCredito25 = { generar: generar, empaquetar: empaquetar, FIN: FIN };

  if (typeof document === "undefined") return;
  var $ = function (id) { return document.getElementById(id); };
  var texto = "", NOMBRE = "ENTIMOTORS-lectura-credito25.json";
  $("btnGenerar").addEventListener("click", async function () {
    $("btnGenerar").disabled = true; $("estado").textContent = "Leyendo… (no se cambia nada)";
    try {
      var inf = await generar({ indexedDB: global.indexedDB, crypto: global.crypto, origen: location.origin + location.pathname, controladoPorSW: !!(navigator.serviceWorker && navigator.serviceWorker.controller) });
      texto = await empaquetar(inf, global.crypto);
      var v = inf.veredicto;
      $("resumen").textContent = v ? ("Crédito #25 encontrado. Registro verificado: " + (v.registroCoincide ? "SÍ" : "NO") + ". Renglones: " + v.renglones + ". Conceptos recuperados: " + v.conceptosRecuperados + " de 4.\nNada se modificó en este teléfono.") : String(inf.estado);
      $("resultado").hidden = false; $("estado").textContent = "Listo. Pulsa «Compartir archivo» (o «Descargar archivo») y envíalo a soporte.";
      var f = new File([texto], NOMBRE.replace(/\.json$/, ".txt"), { type: "text/plain" });
      $("btnCompartir").hidden = !(navigator.canShare && navigator.canShare({ files: [f] }));
    } catch (e) { $("estado").textContent = "No se pudo leer: " + (e && e.message ? e.message : e) + ". No se modificó nada."; $("btnGenerar").disabled = false; }
  });
  $("btnDescargar").addEventListener("click", function () {
    var url = URL.createObjectURL(new Blob([texto], { type: "application/json" }));
    var a = document.createElement("a"); a.href = url; a.download = NOMBRE; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
    $("estado").textContent = "Descargado en «Descargas» como " + NOMBRE + ". Envíalo a soporte como documento.";
  });
  $("btnCompartir").addEventListener("click", async function () {
    try { await navigator.share({ title: "Lectura del crédito #25", files: [new File([texto], NOMBRE.replace(/\.json$/, ".txt"), { type: "text/plain" })] }); } catch (e) { /* cancelado */ }
  });
})(typeof window !== "undefined" ? window : globalThis);
