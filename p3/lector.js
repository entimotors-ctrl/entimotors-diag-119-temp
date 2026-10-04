/* ENTIMOTORS · LECTURA DE LOS 3 PENDIENTES QUE SOLO EXISTEN EN EL TELÉFONO — HERRAMIENTA TEMPORAL DE SOLO LECTURA
 * ------------------------------------------------------------------------------------------------------------------
 * Lee de ESTE teléfono (bases entimotors_sync, entimotors_os_demo y entimotors_dispositivo, SIEMPRE en transacciones "readonly"):
 *   · los nombres de los 2 renglones locales de la orden 9 (operaciones rechazadas seq 24 y 25);
 *   · los 4 conceptos y la nota del crédito provisional de L 2,280 (operación rechazada seq 28).
 * Verifica cada texto contra la huella del diagnóstico final y toma una HUELLA del teléfono ANTES y DESPUÉS de leer (versiones,
 * contadores, las 5 operaciones, la orden 9, el crédito, cursores y legado) para demostrar que nada cambió.
 * NO escribe, NO borra, NO crea ni actualiza bases (aborta si el navegador pidiera cambiar el esquema), NO lee ni escribe
 * el almacenamiento local ni el de sesión del navegador, NO toca el Service Worker ni las cachés, NO sincroniza, NO reenvía, NO inicia ni renueva sesión y
 * NO usa la red (CSP connect-src 'none'). El archivo solo sale si la persona pulsa «Descargar» o «Compartir».
 */
(function (global) {
  "use strict";
  var ESPERADO = {"bases":{"entimotors_dispositivo":1,"entimotors_os_demo":6,"entimotors_sync":1},"filas":{"auditoria":0,"blobs":0,"caja_movimientos":30,"categorias_inv":2,"citas":3,"clientes":26,"conflictos":0,"cotizaciones":1,"creditos":27,"cursores":10,"inventario":4,"mapa":112,"meta":2,"motos":7,"ordenes":8,"outbox":5,"ventas_rapidas":4,"web_cms":0},"ops":[{"seq":20,"op_id":"15bcb63c-939b-4b92-ae55-1badfe0a8a93","estado":"rejected","intentos":1,"codigo":"23505"},{"seq":21,"op_id":"84d5572d-2979-4321-8dbe-992a4ae53441","estado":"rejected","intentos":1,"codigo":"23505"},{"seq":24,"op_id":"e67e156d-81f0-4a94-9cdb-d92ad474064f","estado":"rejected","intentos":1,"codigo":"23505"},{"seq":25,"op_id":"8b1689b0-86fe-435f-9743-5ff904d1f912","estado":"rejected","intentos":1,"codigo":"23505"},{"seq":28,"op_id":"fee38b14-b43f-44b3-be36-8b476371148b","estado":"rejected","intentos":1,"codigo":"23505"}],"renglones":[{"seq":24,"op_id":"e67e156d-81f0-4a94-9cdb-d92ad474064f","item_id":"73393f6b-315b-4c62-906c-dbc80f6a1e59","cantidad":4,"precio":70,"h":"2b6177420782925a"},{"seq":25,"op_id":"8b1689b0-86fe-435f-9743-5ff904d1f912","item_id":"b085b714-cbb5-479c-8771-a88a065d5ba9","cantidad":1,"precio":1200,"h":"114405e51733ffa2"}],"credito":{"seq":28,"op_id":"fee38b14-b43f-44b3-be36-8b476371148b","uid":"65ed9ecd-3e67-46d5-b2fa-dd2fac6883cb","total":2280,"notaLongitud":29,"huellaContenido":"d3b2ad380e481bd690630674","items":[{"item_id":"3c1a807d-0932-4f48-af43-7b94d4492b5f","precio":1400,"h":"61b86cf4e1aab045"},{"item_id":"64788624-b6ff-48ec-862e-3947fa6a2a34","precio":480,"h":"9932c2aac5bbade2"},{"item_id":"9a7c400f-fd51-4aa1-8910-ce9173e6f20d","precio":220,"h":"8f606a4d88ec314a"},{"item_id":"2a539216-e1c8-4a35-aa71-5ada48b98521","precio":180,"h":"a38cad24fc8ab5a7"}]},"orden":{"uid":"c818c5ce-1ce4-843f-a833-36c4abf371a1","huellaContenido":"2b683db786f2cbf0bb3f1e98","rev":2,"renglones":10},"cursores":["caja_movimientos@2026-10-03T17:36:56.339697Z#9859dd76-88ab-4af9-9155-c80f37e5f73c","categorias_inv@2026-09-26T00:47:24.947743Z#d785eee0-53eb-85ee-95c4-18315d8282ac","citas@2026-09-26T00:47:25.062658Z#2ea0eae1-bff6-809f-9b59-78918aba5c64","clientes@2026-10-03T17:36:57.693172Z#ae3702f7-1b9e-4f02-b001-51c1aff0b5ee","cotizaciones@2026-09-26T00:47:25.053573Z#ab4277b6-cd88-8783-ab67-b954377fed1f","creditos@2026-10-03T17:36:57.919421Z#34fa650d-d3c2-4482-9f8d-d6950b91d131","inventario@2026-09-28T21:58:23.245115Z#950d5f25-d2a2-8cfc-b246-de729223e04f","motos@2026-10-03T17:36:57.234562Z#63a12023-6ab5-4d50-b559-3b218d831bfd","ordenes@2026-09-28T21:59:10.324498Z#196a9ea9-f185-8c0d-8cd7-61cd1a106df7","ventas_rapidas@2026-09-26T00:47:25.069232Z#bceeac5d-bf97-8a31-8b9c-d38dbfc6f7f5"],"legado":{"operativos":119,"conteos":{"clientes":26,"motos":8,"ordenes":10,"inventario":6,"citas":3,"cotizaciones":1,"ventas_rapidas":5,"caja_movimientos":30,"creditos":25,"categorias_inv":5},"credito25":"e1f30b463b96c25eb261bb07"}};
  var FIN = "FIN-LECTURA-ENTIMOTORS-PENDIENTES-3";
  var BASES = ["entimotors_dispositivo", "entimotors_os_demo", "entimotors_sync"];
  var OPERATIVOS = ["clientes", "motos", "ordenes", "inventario", "citas", "cotizaciones", "ventas_rapidas", "caja_movimientos", "creditos", "categorias_inv"];
  var VOLATILES = ["id", "creadoEn", "actualizadoEn", "fechaISO", "uid", "_rev", "_base", "_pend"];

  async function generar(env) {
    var idb = env.indexedDB, cripto = env.crypto, enc = new TextEncoder();
    var hex = async function (t) { var b = new Uint8Array(await cripto.subtle.digest("SHA-256", enc.encode(t))); var s = ""; for (var i = 0; i < b.length; i++) s += (b[i] < 16 ? "0" : "") + b[i].toString(16); return s; };
    var huella = async function (v) { return (await hex(JSON.stringify(v))).slice(0, 24); };
    var corta = async function (t) { return t == null || t === "" ? null : (await hex(String(t).trim().toLowerCase())).slice(0, 16); };
    var contenido = function (r) { var c = {}; Object.keys(r).forEach(function (k) { if (VOLATILES.indexOf(k) < 0) c[k] = r[k]; }); return c; };
    var informe = { herramienta: "entimotors-lector-pendientes v1", generadoEn: new Date().toISOString(), origen: env.origen || null, controladoPorServiceWorker: !!env.controladoPorSW,
      privacidad: "Salen en texto SOLO los nombres de los 6 conceptos y la nota del crédito provisional. Nada de clientes, teléfonos, placas, fotos ni sesión.",
      completo: false, avisos: [] };

    var lista = typeof idb.databases === "function" ? await idb.databases() : null;
    if (!lista) { informe.estado = "NO SE PUDO COMPROBAR (el navegador no lista bases): no se abrió nada"; informe.completo = true; return informe; }
    var versiones = {}; lista.forEach(function (d) { if (BASES.indexOf(d.name) >= 0) versiones[d.name] = d.version; });
    if (!versiones.entimotors_sync) { informe.estado = "NO EXISTE entimotors_sync en este navegador: no se abrió nada"; informe.completo = true; return informe; }

    var abrir = function (nombre) {
      return new Promise(function (ok, mal) {
        var q = idb.open(nombre, versiones[nombre]);
        q.onupgradeneeded = function () { try { q.transaction.abort(); } catch (e) { /* nada */ } mal(new Error("ABORTADO: se pidió cambiar el esquema de " + nombre)); };
        q.onblocked = function () { mal(new Error("BLOQUEADO: " + nombre)); };
        q.onsuccess = function () { ok(q.result); }; q.onerror = function () { mal(q.error); };
      });
    };
    var todo = function (db, store) { return new Promise(function (ok, mal) { var q = db.transaction(store, "readonly").objectStore(store).getAll(); q.onsuccess = function () { ok(q.result); }; q.onerror = function () { mal(q.error); }; }); };

    // UNA pasada de lectura: huella de todo lo relevante (+ las filas que se necesitan para los textos)
    async function pasada() {
      var h = { bases: {}, conteos: {}, almacenes: {} }, filas = {};
      for (var b = 0; b < BASES.length; b++) {
        var nombre = BASES[b]; if (!versiones[nombre]) continue;
        var db = await abrir(nombre);
        try {
          h.bases[nombre] = db.version; h.conteos[nombre] = {}; h.almacenes[nombre] = {};
          var stores = Array.prototype.slice.call(db.objectStoreNames).sort();
          for (var s = 0; s < stores.length; s++) {
            var f = await todo(db, stores[s]);
            h.conteos[nombre][stores[s]] = f.length; h.almacenes[nombre][stores[s]] = await huella(f);
            if (nombre === "entimotors_sync" && ["outbox", "ordenes", "creditos", "cursores", "mapa"].indexOf(stores[s]) >= 0) filas[stores[s]] = f;
            if (nombre === "entimotors_os_demo" && stores[s] === "creditos") filas.legadoCreditos = f;
          }
        } finally { db.close(); }
      }
      var ob = (filas.outbox || []).slice().sort(function (a, b2) { return a.seq - b2.seq; });
      h.outbox = [];
      for (var i = 0; i < ob.length; i++) h.outbox.push({ seq: ob[i].seq, op_id: ob[i].op_id, estado: ob[i].estado, intentos: ob[i].intentos, rpc: ob[i].rpc || null, codigo: ob[i].error && ob[i].error.codigo || null, huella: await huella(ob[i]), huellaParams: await huella(ob[i].params || null) });
      var o9 = (filas.ordenes || []).filter(function (x) { return x && x.uid === ESPERADO.orden.uid; })[0] || null;
      h.orden9 = o9 ? { id: o9.id, rev: o9._rev, pend: !!o9._pend, renglones: (o9.items || []).length, total: (o9.items || []).reduce(function (a, it) { return a + it.cantidad * it.precio; }, 0), huella: await huella(o9), huellaContenido: await huella(contenido(o9)) } : null;
      var cr = (filas.creditos || []).filter(function (x) { return x && x.uid === ESPERADO.credito.uid; })[0] || null;
      h.credito = cr ? { id: cr.id, rev: cr._rev, total: cr.total, saldo: cr.saldo, estado: cr.estado, renglones: (cr.items || []).length, huella: await huella(cr), huellaContenido: await huella(contenido(cr)) } : null;
      h.cursores = (filas.cursores || []).slice().sort(function (a, b2) { return a.entidad < b2.entidad ? -1 : 1; }).map(function (c) { return c.entidad + "@" + String(c.t).replace(/\+00:00$/, "Z") + "#" + c.id; });   // misma hora, misma escritura que el diagnóstico
      var lg = h.conteos.entimotors_os_demo || {};
      var c25 = (filas.legadoCreditos || []).filter(function (x) { return x && x.id === 25; })[0];
      h.legado = versiones.entimotors_os_demo ? { operativos: OPERATIVOS.reduce(function (a, st) { return a + (lg[st] || 0); }, 0), huella: await huella(OPERATIVOS.map(function (st) { return (h.almacenes.entimotors_os_demo || {})[st] || "-"; })), credito25: c25 ? await huella(c25) : null } : null;
      return { h: h, ob: ob, o9: o9, cr: cr };
    }

    var p1 = await pasada();
    informe.huellaAntes = p1.h;

    // los textos (de las filas ya leídas en la primera pasada)
    var op = function (seq) { return p1.ob.filter(function (x) { return x.seq === seq; })[0] || null; };
    var pend = [];
    for (var k = 0; k < ESPERADO.renglones.length; k++) {
      var e = ESPERADO.renglones[k], o = op(e.seq), p = o && o.params || {}, enOrden = p1.o9 ? (p1.o9.items || []).filter(function (it) { return it.uid === e.item_id; })[0] : null;
      var hN = await corta(p.p_nombre);
      pend.push({ seq: e.seq, que: "renglon-orden-9", op_id: o ? o.op_id : null, item_id: p.p_item_id || null, cantidad: p.p_cantidad, precio: p.p_precio, nombre: typeof p.p_nombre === "string" ? p.p_nombre : null,
        verificado: !!o && o.op_id === e.op_id && p.p_item_id === e.item_id && p.p_cantidad === e.cantidad && p.p_precio === e.precio && hN === e.h,
        enLaOrdenLocal: !!enOrden, mismoNombreEnLaOrdenLocal: !!enOrden && enOrden.nombre === p.p_nombre });
    }
    var e28 = ESPERADO.credito, o28 = op(e28.seq), p28 = o28 && o28.params || {}, its = Array.isArray(p28.p_items) ? p28.p_items : [], conceptos = [];
    for (var j = 0; j < its.length; j++) {
      var esp = e28.items[j] || {}, hc = await corta(its[j].nombre), enCache = p1.cr && (p1.cr.items || [])[j];
      conceptos.push({ indice: j, item_id: its[j].item_id || null, cantidad: its[j].cantidad, precio: its[j].precio, nombre: typeof its[j].nombre === "string" ? its[j].nombre : null,
        verificado: hc === esp.h && its[j].precio === esp.precio && its[j].item_id === esp.item_id, mismoNombreEnElCreditoLocal: !!enCache && enCache.nombre === its[j].nombre });
    }
    var nota = typeof p28.p_nota === "string" ? p28.p_nota : null;
    pend.push({ seq: e28.seq, que: "credito-provisional", op_id: o28 ? o28.op_id : null, credito_uuid: p28.p_credito_id || null, total: its.reduce(function (a, it) { return a + it.cantidad * it.precio; }, 0),
      conceptos: conceptos, nota: nota, notaLongitud: nota == null ? 0 : nota.length, notaLongitudEsperada: e28.notaLongitud,
      notaIgualEnElCreditoLocal: !!p1.cr && (p1.cr.nota == null ? "" : p1.cr.nota) === (nota == null ? "" : nota),
      verificado: !!o28 && o28.op_id === e28.op_id && p28.p_credito_id === e28.uid && conceptos.length === e28.items.length && conceptos.every(function (c) { return c.verificado; }) && (nota == null ? 0 : nota.length) === e28.notaLongitud });
    informe.pendientes = pend;

    var p2 = await pasada();
    informe.huellaDespues = p2.h;
    var iguales = JSON.stringify(p1.h) === JSON.stringify(p2.h);

    // comparación con el diagnóstico final del teléfono (3-oct 17:44Z)
    var h = p1.h, cmp = {};
    cmp.versiones = JSON.stringify(h.bases) === JSON.stringify(ESPERADO.bases);
    cmp.conteosCache = Object.keys(ESPERADO.filas).every(function (s) { return (h.conteos.entimotors_sync || {})[s] === ESPERADO.filas[s]; });
    cmp.operaciones = h.outbox.length === ESPERADO.ops.length && ESPERADO.ops.every(function (x, i) { var y = h.outbox[i]; return y && y.seq === x.seq && y.op_id === x.op_id && y.estado === x.estado && y.intentos === x.intentos && y.codigo === x.codigo; });
    cmp.orden9 = !!h.orden9 && h.orden9.huellaContenido === ESPERADO.orden.huellaContenido && h.orden9.rev === ESPERADO.orden.rev && h.orden9.renglones === ESPERADO.orden.renglones;
    cmp.credito = !!h.credito && h.credito.huellaContenido === ESPERADO.credito.huellaContenido && h.credito.total === ESPERADO.credito.total;
    cmp.cursores = JSON.stringify(h.cursores) === JSON.stringify(ESPERADO.cursores);
    cmp.legado = !!h.legado && h.legado.operativos === ESPERADO.legado.operativos && h.legado.credito25 === ESPERADO.legado.credito25 && Object.keys(ESPERADO.legado.conteos).every(function (s) { return (h.conteos.entimotors_os_demo || {})[s] === ESPERADO.legado.conteos[s]; });
    informe.comparacionConDiagnosticoFinal = cmp;
    Object.keys(cmp).forEach(function (q) { if (!cmp[q]) informe.avisos.push("«" + q + "» ya no coincide con el diagnóstico final del 3-oct"); });
    var textos = pend.reduce(function (a, x) { return a + (x.conceptos ? x.conceptos.filter(function (c) { return c.nombre !== null && c.verificado; }).length : (x.nombre !== null && x.verificado ? 1 : 0)); }, 0);
    informe.veredicto = { telefonoIdenticoAntesYDespues: iguales, igualAlDiagnosticoFinal: Object.keys(cmp).every(function (q) { return cmp[q]; }), conceptosRecuperados: textos, conceptosEsperados: ESPERADO.renglones.length + e28.items.length,
      notaRecuperada: nota !== null && nota.length === e28.notaLongitud, pendientesVerificados: pend.filter(function (x) { return x.verificado; }).length, avisos: informe.avisos.length };
    if (!iguales) informe.avisos.push("LA HUELLA CAMBIÓ durante la lectura (¿la app estaba abierta?)");
    informe.completo = true;
    return informe;
  }

  async function empaquetar(informe, cripto) {
    var txt = JSON.stringify(informe);
    var b = new Uint8Array(await cripto.subtle.digest("SHA-256", new TextEncoder().encode(txt))), h = "";
    for (var i = 0; i < b.length; i++) h += (b[i] < 16 ? "0" : "") + b[i].toString(16);
    return '{"informe":' + txt + ',"integridad":{"algoritmo":"SHA-256","sobre":"JSON.stringify(informe)","sha256":"' + h + '","completo":true,"fin":"' + FIN + '"}}';
  }
  global.LectorPendientes = { generar: generar, empaquetar: empaquetar, FIN: FIN };

  if (typeof document === "undefined") return;
  var $ = function (id) { return document.getElementById(id); };
  var texto = "", NOMBRE = "ENTIMOTORS-lectura-pendientes.json";
  $("btnGenerar").addEventListener("click", async function () {
    $("btnGenerar").disabled = true; $("estado").textContent = "Leyendo… (no se cambia nada)";
    try {
      var inf = await generar({ indexedDB: global.indexedDB, crypto: global.crypto, origen: location.origin + location.pathname, controladoPorSW: !!(navigator.serviceWorker && navigator.serviceWorker.controller) });
      texto = await empaquetar(inf, global.crypto);
      var v = inf.veredicto;
      $("resumen").textContent = v ? ("Conceptos recuperados: " + v.conceptosRecuperados + " de " + v.conceptosEsperados + ". Nota recuperada: " + (v.notaRecuperada ? "SÍ" : "NO") + ".\nTeléfono idéntico antes y después de leer: " + (v.telefonoIdenticoAntesYDespues ? "SÍ" : "NO") + ".\nIgual al diagnóstico del 3 de octubre: " + (v.igualAlDiagnosticoFinal ? "SÍ" : "NO") + ".\nNada se modificó en este teléfono.") : String(inf.estado);
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
    try { await navigator.share({ title: "Lectura de los 3 pendientes", files: [new File([texto], NOMBRE.replace(/\.json$/, ".txt"), { type: "text/plain" })] }); } catch (e) { /* cancelado */ }
  });
})(typeof window !== "undefined" ? window : globalThis);
