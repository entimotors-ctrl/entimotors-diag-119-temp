/* ENTIMOTORS · DIAGNÓSTICO DEL REGISTRO 119 — HERRAMIENTA TEMPORAL DE SOLO LECTURA
 * ------------------------------------------------------------------------------------------------------------
 * Lee (sin escribir) la base local de la versión 3.13 (IndexedDB «entimotors_os_demo») y la caché de nube
 * («entimotors_sync*») de ESTE dispositivo, y la compara registro por registro contra el respaldo del teléfono del
 * 25-sep (ENTI-2026-09-25-JEIEKQ) usando id local + huella SHA-256 del registro completo.
 * NO escribe, NO borra, NO crea bases, NO importa, NO sincroniza, NO usa la red (la página lo prohíbe con CSP
 * connect-src 'none'), NO muestra nombres, teléfonos, placas, fotos, tokens ni la sesión: solo huellas cortas.
 * El informe solo sale del teléfono si la persona pulsa «Copiar» o «Compartir» y elige a quién enviarlo.
 */
(function (global) {
  "use strict";
  var MANIFIESTO = {"clientes":{"1":"9472a5012f30da84c5e5360c","2":"b3cd61e81d44c4e49350d802","3":"ec449dbf1fdd076d5cdf9041","4":"456eb066ca34eed26f54c7f4","5":"957b26f6cd81d80ea9153217","6":"76cdcfbaa7fa68b21c96fa35","7":"64533525a9e452efce0b1e6a","8":"30da95e0ea9afccdff64eeea","9":"d2c04a044d896f42446c21be","10":"f19bfa4bdb965d806b5b0612","11":"060956f9a1426331bdea8c35","12":"68690cbc8b5d70b62a445cd0","13":"6379d615d89f229b19bf6493","14":"58bd8b96514533e35a4b9ca4","15":"1a99b2fe2ff9a2b1c1ccc3b1","16":"fa80fdea696ab83c697dc4ea","17":"3111ff9a929a36b4aa1c8c4f","18":"3992a7319cf5db051dd5e81d","19":"19aa9ffa4a7f6128744628e2","20":"092a948a867832029835d9b5","21":"485d7a4def15f3e2f1a5fda4","22":"7b69d134b73d610d8482d216","23":"dcfa659bcde1934ff1ebe439","24":"16da117deb9632b956767cca","25":"1f185f9dd32d276f788897d4","26":"7a7e1f26e8f62a3b662c58a5"},"motos":{"1":"e5c46b61fb88e1f1cf3c55e2","2":"c9746dbbb67509d8aaaa1741","3":"111694740f3a4496111598c2","4":"cc8514c84a88f4ec2df19d1b","5":"3fb888830f29b07cf356604c","6":"f8271205083fd9f235555f10","7":"54d13129030409c85ce7c42a","8":"1300c7ae1b7a746b565dea60"},"ordenes":{"1":"9df37595dfae5d9028ebf556","2":"c52f30e8496d40379c858080","3":"1e5c4096f55c2828d01b936e","4":"4f8c26ee90b19513af02e2e6","5":"1ba09111bfa600720671d77f","6":"e625f30f4d549bc1c203ef77","7":"402452bd715bf00cf3aaf37d","8":"45e126dd3b9263781925e1cf","9":"5b91fb572393246a238c652b","10":"0386001caa42192be5a0cf6e"},"inventario":{"1":"f131e2d5a4454dcdd13696ae","2":"3d974517810c20b793aa346b","3":"b9f7bb02f53275b5a2302f28","4":"2474879696631631f9da35a1","5":"01333c584f5c914af3e999f6","6":"af5d52ab10e4d2db723467ed"},"citas":{"4":"8d6513d3ce20fb27fe1a26a1","10":"0dfe85554a28cc62db88caf8","11":"0bd5da5cd7846e58d9f29229"},"cotizaciones":{"1":"5b51cb2def6c51ccd02243db"},"ventas_rapidas":{"1":"6800c47a925ff6eeba0dd63e","2":"6af15e6ef485b05235255ea6","3":"67152f22b56a46ce4b92ae53","4":"7ffb53a74c4a78db4093b48d","5":"6dddeeded7ce2fc3c2778731"},"caja_movimientos":{"1":"bc16c60e13813a152d01b88f","2":"e60851d1d972bd1640bc877b","3":"cc02b2e1b2a00bd5b15ede33","4":"f7d42e8f72eb165540a17de5","5":"b3df31dc1e3980b9ec997255","6":"de12555a519a12fd5f604976","7":"4a5a552d911b5b19006f1d78","8":"d53d9e4d1f01975876338a00","9":"f4e7298c58ab70b2c9550f41","10":"8add7e89bf9f181e1fe55a17","11":"f2f10146321b6f3920a71638","12":"3d4decf1b78787314df852ae","13":"9e6fea24261e7ff7b89cd64e","14":"35543e38c81b1f814ccc2e2e","15":"077cb0a4d4985d537e91baeb","16":"ccdec9c994c17121acdc1cff","17":"749e045d6cc8e2e393486e33","18":"78a5b2afb6ba43f0d58674ac","19":"24d5e3afd06eed9122286355","20":"9a13d4524154e2e987fd4a55","21":"3c410a0738f0ec81cc36f690","22":"7ea3594238edbdd4a1ed02f2","23":"e4cce32e7f3f8fcc693100f6","24":"71e559b04ce3e1abfe130da7","25":"e9a5e3e7e582f494542d3b6a","26":"1365bbd8dc89bacac2364a8f","27":"90991ff040550283df5cd63a","28":"21ea134d27ae90cb2a7e5a17","29":"9d6e0b9138fa1fa735a059ba","30":"95017a6400cf551f073f001b"},"creditos":{"1":"449f0b4c7056e681e1dc1b14","2":"ede4e5b6adcacf482a6f23cc","3":"833f6c39008f000e93f21f6f","4":"6037d9dff58bf03f261fc769","5":"f914d9e18d0fab071068d2b4","6":"875e47613f22d7f2ecde7b24","7":"cf568c092ed8e00828f71419","8":"73e7b9db7bd6643c7859a643","9":"349336fe60f876318a74c57f","10":"798b3f6fceef002e87897e15","11":"9f4a793349a8311371ac84bb","12":"4c70475bf394842f85ec979d","13":"a3f3c806d31580ff6f6c34af","14":"0fd9dfd04c49f82313ba1e6f","15":"0a5a44fc120512544f878a5a","16":"5aaaf8f02fc076a049c175e9","17":"af3030dca2cf8c984d912260","18":"86dfe855f8cd555179631820","19":"a96ea7bc48551cc04428205d","20":"cdedf0bca29d36c6a5c4f270","21":"3221bfe4e0cc783652cf80a5","22":"b9b4fb93eab706245298ded0","23":"81c7ee4ab88ecf1c3a7d562f","24":"fea68053255d81b1f21d4f3c"},"categorias_inv":{"1":"dd04ce169c716e6658f462f8","2":"42ae4535a0eadc631b9479cd","3":"0679b148a011c321fcddf5d1","4":"db7c65e5bfecd55fdf1e978e","5":"d1f17fae8456d1c8523bf521"}};                       // store → { idLocal: sha256(JSON)[0..24] } del respaldo JEIEKQ
  var SEMILLA = ["b830598facc992df","4c4b443339a6cb60","35d78bb2ee14e273","7c435e5792921931","84dce8dfb37beff6","112376a732049f19","051aeb1b53a2f29e","57059e9082ae8456","64d02fa8eac59050","f51bd360f1f4bfd8","18beb9662617e862","3a644790b41ced08","44a15604af9e869b","588e234c11caa113","a99f05d0981d003f","34aeda13718c1a2e","c8c38cfc269966fd","c9afa92633bbc30a","dec3e364b3adb539","8417a8b8b4eb32fc","dfe2a1bff657322a","532deecd6007fd17","9e78cb7a21b89be3","e78a765214d29cd6","40cb006711350947","26f0976caeccd88b","41cad129c5e9e313","97895227f28f4593","b54f2d5c1cfe195f","4467c880a2f23dee","a55977081f8ece6b"]
;                             // huellas de los nombres de la siembra de ejemplo de la app
  var CORTE = "2026-09-25T22:01:24.298Z";               // exportadoEn del respaldo JEIEKQ
  var RETIRADOS_SAN1 = { clientes: [1, 2, 3], motos: [1, 2, 3], ordenes: [1, 2, 3], inventario: [1, 3], ventas_rapidas: [1],
    caja_movimientos: [1, 2, 3], categorias_inv: [1, 3, 4] };
  var TABLA_NUBE = { clientes: "clientes", motos: "motos", ordenes: "ordenes", inventario: "inventario", citas: "citas",
    cotizaciones: "cotizaciones", ventas_rapidas: "ventas", caja_movimientos: "caja_movimientos", creditos: "creditos", categorias_inv: "categorias_inv" };
  var LS_PUBLICAS = ["enti_modo_datos", "enti_import_313", "enti_ultimo_respaldo", "enti_theme"];
  var VOLATILES = ["id", "creadoEn", "actualizadoEn", "fechaISO", "uid", "_rev", "_base", "_pend"];

  async function generar(env) {
    var idb = env.indexedDB, cripto = env.crypto, ls = env.localStorage;
    var enc = new TextEncoder();
    var hex = async function (t) { var b = new Uint8Array(await cripto.subtle.digest("SHA-256", enc.encode(t))); var s = ""; for (var i = 0; i < b.length; i++) s += (b[i] < 16 ? "0" : "") + b[i].toString(16); return s; };
    var huella = async function (v) { return (await hex(JSON.stringify(v))).slice(0, 24); };
    var corta = async function (t) { return t == null || t === "" ? null : (await hex(String(t).trim().toLowerCase())).slice(0, 16); };
    var digitos = async function (t) { var d = String(t || "").replace(/\D/g, ""); return d ? (await hex(d)).slice(0, 16) : null; };
    var uuidImportado = async function (tabla, id) {
      var b = (await hex("entimotors-313|" + tabla + "|" + id)).slice(0, 32).split("");
      b[12] = "8"; b[16] = ((parseInt(b[16], 16) & 0x3) | 0x8).toString(16); var s = b.join("");
      return s.slice(0, 8) + "-" + s.slice(8, 12) + "-" + s.slice(12, 16) + "-" + s.slice(16, 20) + "-" + s.slice(20, 32);
    };
    var iso = function (ms) { try { return ms ? new Date(ms).toISOString() : null; } catch (e) { return null; } };
    var fechaDe = function (r) { return r.fechaISO || iso(r.creadoEn) || (r.fecha ? r.fecha + (r.hora ? "T" + r.hora : "") : null); };
    var totalItems = function (r) { return (Array.isArray(r.items) ? r.items : []).reduce(function (s, it) { return s + (Number(it && it.cantidad) || 0) * (Number(it && it.precio) || 0); }, 0); };
    var contenido = function (r) { var c = {}; Object.keys(r).forEach(function (k) { if (VOLATILES.indexOf(k) < 0) c[k] = r[k]; }); return c; };

    async function resumen(store, r) {
      var base = { fecha: fechaDe(r), creadoEn: iso(r.creadoEn), actualizadoEn: iso(r.actualizadoEn) };
      var items = function (arr, inv) { return (Array.isArray(arr) ? arr : []).map(function (it) { return { nombre: it && it.nombre, cantidad: it && it.cantidad, precio: it && it.precio, inv: it ? (it[inv] == null ? null : it[inv]) : null }; }); };
      switch (store) {
        case "clientes": return Object.assign(base, { nombreH: await corta(r.nombre), telefonoH: await digitos(r.telefono) });
        case "motos": return Object.assign(base, { clienteId: r.clienteId == null ? null : r.clienteId, marca: r.marca || "", modelo: r.modelo || "", placaH: await corta(r.placa), km: r.km == null ? null : r.km, conFoto: !!r.foto });
        case "ordenes": return Object.assign(base, { clienteId: r.clienteId == null ? null : r.clienteId, motoId: r.motoId == null ? null : r.motoId, estado: r.estado, finalizada: !!r.finalizada,
          tipoCobro: r.tipoCobro || null, items: items(r.items, "origenInventarioId"), total: totalItems(r), mecanico: r.mecanico || null, citaId: r.citaId == null ? null : r.citaId,
          cotizacionId: r.cotizacionId == null ? null : r.cotizacionId, creditoId: r.creditoId == null ? null : r.creditoId, fotos: (r.fotos || []).length });
        case "inventario": return Object.assign(base, { nombre: r.nombre, cantidad: r.cantidad, precio: r.precio == null ? r.precioVenta : r.precio, costo: r.costoCompra == null ? null : r.costoCompra, categoriaId: r.categoriaId == null ? null : r.categoriaId });
        case "citas": return Object.assign(base, { clienteId: r.clienteId == null ? null : r.clienteId, fechaCita: r.fecha, hora: r.hora, estado: r.estado || null, origen: r.origen || null, nombreTmpH: await corta(r.nombreTmp), ordenId: r.ordenId == null ? null : r.ordenId });
        case "cotizaciones": return Object.assign(base, { clienteId: r.clienteId == null ? null : r.clienteId, clienteH: await corta(r.clienteNombre), estado: r.estado, total: totalItems(r), items: (r.items || []).length, ordenId: r.ordenId == null ? null : r.ordenId });
        case "ventas_rapidas": return Object.assign(base, { clienteId: r.clienteId == null ? null : r.clienteId, clienteH: await corta(r.clienteNombre), metodoPago: r.metodoPago, total: r.total, items: items(r.items, "inventarioId") });
        case "caja_movimientos": return Object.assign(base, { tipo: r.tipo, categoria: r.categoria, monto: r.monto, metodoPago: r.metodoPago || null, ventaId: r.ventaId == null ? null : r.ventaId,
          creditoId: r.creditoId == null ? null : r.creditoId, ordenId: r.ordenId == null ? null : r.ordenId, idAbono: r.idAbono == null ? null : r.idAbono, descripcionH: await corta(r.descripcion) });
        case "creditos": return Object.assign(base, { clienteId: r.clienteId == null ? null : r.clienteId, clienteH: await corta(r.clienteNombre), total: r.total, abonado: r.abonado, saldo: r.saldo, estado: r.estado,
          origen: r.origen || null, ordenId: r.ordenId == null ? null : r.ordenId, abonos: (r.historialAbonos || []).map(function (a) { return { monto: a && a.monto, metodo: a && a.metodoPago, fecha: a && a.fechaISO }; }) });
        case "categorias_inv": return Object.assign(base, { nombre: r.nombre });
        default: return base;
      }
    }
    async function pareceEjemplo(store, r) {
      var n = await corta(r.nombre);
      return !!n && ["clientes", "inventario", "categorias_inv"].indexOf(store) >= 0 && SEMILLA.indexOf(n) >= 0;
    }

    // Solo bases que YA existen, abiertas con su versión exacta: nunca se crea ni se actualiza nada.
    var lista = typeof idb.databases === "function" ? await idb.databases() : null;
    var abrir = function (nombre, version) {
      return new Promise(function (ok, mal) {
        var q = idb.open(nombre, version);
        q.onupgradeneeded = function () { try { q.transaction.abort(); } catch (e) { /* nada que abortar */ } mal(new Error("ABORTADO: se pidió cambiar el esquema de " + nombre)); };
        q.onblocked = function () { mal(new Error("BLOQUEADO: " + nombre)); };
        q.onsuccess = function () { ok(q.result); }; q.onerror = function () { mal(q.error); };
      });
    };
    var leerTodo = function (db, store) {
      return new Promise(function (ok) {
        var nombres = Array.prototype.slice.call(db.objectStoreNames);
        if (nombres.indexOf(store) < 0) { ok(null); return; }
        try { var q = db.transaction(store, "readonly").objectStore(store).getAll(); q.onsuccess = function () { ok(q.result); }; q.onerror = function () { ok(null); }; }
        catch (e) { ok(null); }
      });
    };

    var informe = { herramienta: "entimotors-diag-119 v1", generadoEn: new Date().toISOString(), origen: env.origen || null, controladoPorServiceWorker: !!env.controladoPorSW,
      agente: env.agente || null, bases: lista ? lista.map(function (d) { return d.name + " v" + d.version; }) : "el navegador no permite listar bases",
      localStorage: {}, legado313: null, cacheNube: {}, veredicto: null };
    try {
      for (var i = 0; i < ls.length; i++) { var k = ls.key(i); informe.localStorage[k] = LS_PUBLICAS.indexOf(k) >= 0 ? ls.getItem(k) : "(presente, " + String(ls.getItem(k) || "").length + " caracteres, no se muestra)"; }
    } catch (e) { informe.localStorage = "no disponible"; }

    var meta = lista && lista.filter(function (d) { return d.name === "entimotors_os_demo"; })[0];
    if (!lista) informe.legado313 = "NO SE PUDO COMPROBAR (el navegador no lista bases): no se abrió nada para no crear una base vacía";
    else if (!meta) informe.legado313 = "NO EXISTE entimotors_os_demo en este navegador (¿se abrió en otro navegador distinto de Chrome?)";
    else {
      var db = await abrir(meta.name, meta.version);
      var L = { version: db.version, stores: Array.prototype.slice.call(db.objectStoreNames), storesAusentes: [], conteos: {}, operativos: 0,
        nuevos: [], faltantes: [], modificados: [], corruptos: [], sinCambio: 0, ejemploRetiradoPresente: 0 };
      var stores = Object.keys(MANIFIESTO);
      for (var s = 0; s < stores.length; s++) {
        var st = stores[s];
        var filas = await leerTodo(db, st);
        if (filas === null) { L.storesAusentes.push(st); L.conteos[st] = null; continue; }
        L.conteos[st] = filas.length; L.operativos += filas.length;
        var vistos = {}, porContenido = {};
        for (var f = 0; f < filas.length; f++) {
          var r = filas[f];
          if (!r || typeof r !== "object" || r.id === undefined || r.id === null) { L.corruptos.push({ store: st, posicion: f, tipo: r === null ? "null" : typeof r }); continue; }
          var hc; try { hc = await huella(contenido(r)); } catch (e) { L.corruptos.push({ store: st, id: r.id, tipo: "no serializable" }); continue; }
          (porContenido[hc] = porContenido[hc] || []).push(r.id);
        }
        for (var g = 0; g < filas.length; g++) {
          var x = filas[g];
          if (!x || typeof x !== "object" || x.id === undefined || x.id === null) continue;
          var h; try { h = await huella(x); } catch (e) { continue; }
          vistos[String(x.id)] = true;
          var retirado = (RETIRADOS_SAN1[st] || []).indexOf(x.id) >= 0;
          if (retirado) L.ejemploRetiradoPresente++;
          var esperado = MANIFIESTO[st][x.id];
          if (esperado && h === esperado) { L.sinCambio++; continue; }
          var hcx = await huella(contenido(x));
          var dup = (porContenido[hcx] || []).filter(function (id) { return id !== x.id; });
          var fila = Object.assign({ store: st, id: x.id, uuidNube: await uuidImportado(TABLA_NUBE[st], x.id), huella: h, huellaContenido: hcx,
            posibleDuplicadoDe: dup.length ? dup : null, posibleEjemplo: retirado || await pareceEjemplo(st, x), campos: Object.keys(x).sort() }, await resumen(st, x));
          if (!esperado) { fila.posteriorAlRespaldo = (fila.fecha || "") > CORTE; L.nuevos.push(fila); }
          else { fila.huellaRespaldo = esperado; fila.retiradoEnSAN1 = retirado; L.modificados.push(fila); }
        }
        Object.keys(MANIFIESTO[st]).forEach(function (id) { if (!vistos[id]) L.faltantes.push({ store: st, id: Number(id), retiradoEnSAN1: (RETIRADOS_SAN1[st] || []).indexOf(Number(id)) >= 0 }); });
      }
      var aud = (await leerTodo(db, "auditoria")) || [];
      L.auditoriaTotal = aud.length;
      L.auditoriaPosteriorAlRespaldo = aud.filter(function (a) { return a && (a.fechaISO || "") > CORTE; })
        .map(function (a) { return { id: a.id, fecha: a.fechaISO, accion: a.accion, entidad: a.entidad, entidadId: a.entidadId, rol: a.rol }; });
      var cola = (await leerTodo(db, "sync_cola")) || [];
      L.syncColaTotal = cola.length;
      L.syncColaPosterior = cola.filter(function (c) { return c && (c.fechaISO || "") > CORTE; })
        .map(function (c) { return { id: c.id, fecha: c.fechaISO, entidad: c.entidad, entidadId: c.entidadId, operacion: c.operacion, estado: c.estado }; });
      L.webCms = ((await leerTodo(db, "web_cms")) || []).length;
      db.close();
      informe.legado313 = L;
    }

    var nubes = (lista || []).filter(function (d) { return /^entimotors_sync/.test(d.name); });
    for (var n = 0; n < nubes.length; n++) {
      var dbn = await abrir(nubes[n].name, nubes[n].version), rn = { filas: {} };
      var sts = Array.prototype.slice.call(dbn.objectStoreNames);
      for (var t = 0; t < sts.length; t++) {
        var fl = (await leerTodo(dbn, sts[t])) || [];
        rn.filas[sts[t]] = fl.length;
        if (sts[t] === "outbox") rn.cola = fl.map(function (o) { return { seq: o.seq, estado: o.estado, tipo: o.kind, entidad: o.entidad, rpc: o.rpc || null, creado: iso(o.creado_en), error: o.error ? (o.error.mensaje || o.error.codigo || "sí") : null }; });
        if (sts[t] === "blobs") rn.fotosPendientes = fl.length;
      }
      dbn.close();
      informe.cacheNube[nubes[n].name] = rn;
    }

    var Lg = informe.legado313;
    if (Lg && typeof Lg === "object") {
      var pendientes = 0; Object.keys(informe.cacheNube).forEach(function (k) { pendientes += (informe.cacheNube[k].cola || []).filter(function (o) { return o.estado !== "rejected"; }).length; });
      var reales = Lg.nuevos.filter(function (x) { return !x.posibleEjemplo && !x.posibleDuplicadoDe; }).length;
      informe.veredicto = { operativosAhora: Lg.operativos, enRespaldo: 118, diferencia: Lg.operativos - 118, nuevos: Lg.nuevos.length, modificados: Lg.modificados.length,
        faltantes: Lg.faltantes.length, corruptos: Lg.corruptos.length, storesAusentes: Lg.storesAusentes.length, sinCambio: Lg.sinCambio,
        nuevosPosiblementeReales: reales, operacionesDeNubeSinEnviar: pendientes,
        lectura: Lg.nuevos.length + Lg.modificados.length === 0 ? "Sin registros nuevos ni cambiados respecto al respaldo del 25-sep."
          : "Hay " + (Lg.nuevos.length + Lg.modificados.length) + " registro(s) nuevos o cambiados después del respaldo del 25-sep: son los candidatos al «119»." };
    }
    return informe;
  }

  global.DiagnosticoENTI = { generar: generar };

  // ---- página (solo en el navegador) ----
  if (typeof document === "undefined") return;
  var $ = function (id) { return document.getElementById(id); };
  var texto = "";
  function lineas(inf) {
    var v = inf.veredicto;
    if (!v) return [String(inf.legado313)];
    return ["Registros de la versión anterior en este teléfono: " + v.operativosAhora + " (respaldo del 25-sep: 118).",
      "Nuevos: " + v.nuevos + " · cambiados: " + v.modificados + " · que faltan: " + v.faltantes + " · dañados: " + v.corruptos + ".",
      "Operaciones de la nube sin enviar: " + v.operacionesDeNubeSinEnviar + ".", "Nada se modificó en este teléfono."];
  }
  $("btnGenerar").addEventListener("click", async function () {
    $("btnGenerar").disabled = true; $("estado").textContent = "Leyendo… (no se cambia nada)";
    try {
      var inf = await generar({ indexedDB: global.indexedDB, crypto: global.crypto, localStorage: global.localStorage, origen: location.origin + location.pathname,
        controladoPorSW: !!(navigator.serviceWorker && navigator.serviceWorker.controller), agente: navigator.userAgent });
      texto = "ENTIMOTORS · diagnóstico 119\n" + JSON.stringify(inf);
      $("resumen").textContent = lineas(inf).join("\n");
      $("informe").value = texto;
      $("resultado").hidden = false; $("estado").textContent = "Listo. Pulsa «Compartir» y envíalo a soporte por WhatsApp.";
      $("btnCompartir").hidden = !navigator.share;
    } catch (e) {
      $("estado").textContent = "No se pudo leer: " + (e && e.message ? e.message : e) + ". No se modificó nada.";
      $("btnGenerar").disabled = false;
    }
  });
  $("btnCopiar").addEventListener("click", async function () {
    try { await navigator.clipboard.writeText(texto); $("estado").textContent = "Copiado. Pégalo en el chat de soporte."; }
    catch (e) { $("informe").select(); $("estado").textContent = "Mantén pulsado el texto y elige «Copiar»."; }
  });
  $("btnCompartir").addEventListener("click", async function () {
    try { await navigator.share({ title: "Diagnóstico ENTIMOTORS", text: texto }); } catch (e) { /* cancelado por la persona */ }
  });
})(typeof window !== "undefined" ? window : globalThis);
