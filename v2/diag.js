/* ENTIMOTORS · DIAGNÓSTICO DEL REGISTRO 119 · v2 — HERRAMIENTA TEMPORAL DE SOLO LECTURA
 * ------------------------------------------------------------------------------------------------------------
 * Igual que la v1 (lee la base 3.13 «entimotors_os_demo» y la compara contra el respaldo JEIEKQ) y además describe, SIN
 * modificarlos:
 *   · la cola de salida (outbox) de la caché de nube «entimotors_sync*», fila por fila: op_id, uid, RPC y sus parámetros
 *     por LISTA PERMITIDA (uuid, montos, cantidades, fechas, enumerados). Nunca el payload completo;
 *   · las filas de la caché que el servidor nunca confirmó (_rev 0 sin _base) o con cambio pendiente (_pend);
 *   · el mapa uid ↔ id local de la caché y su relación con los uuid deterministas del importador 3.13;
 *   · el crédito legado #25 y sus posibles equivalentes (por uuid de cliente, total y renglones, NUNCA solo por nombre);
 *   · los abonos pendientes (registrar_abono_v2) y si la caché ya los refleja.
 * NO escribe, NO borra, NO crea bases, NO importa, NO sincroniza, NO inicia ni renueva sesión, NO usa la red (CSP
 * connect-src 'none'). De localStorage solo lee metadatos (id de usuario, rol, caducidad): jamás tokens. Nombres: huella
 * corta sin sal (la misma de la v1, para cruzar con el legado). Teléfonos, placas y textos: huella con SAL ALEATORIA de este
 * informe (solo sirve para comparar dentro del propio informe; la sal no se guarda en ningún sitio) o solo su longitud.
 * El archivo solo sale del teléfono si la persona pulsa «Descargar» o «Compartir» y elige a quién enviarlo.
 */
(function (global) {
  "use strict";
  var MANIFIESTO = {"clientes":{"1":"9472a5012f30da84c5e5360c","2":"b3cd61e81d44c4e49350d802","3":"ec449dbf1fdd076d5cdf9041","4":"456eb066ca34eed26f54c7f4","5":"957b26f6cd81d80ea9153217","6":"76cdcfbaa7fa68b21c96fa35","7":"64533525a9e452efce0b1e6a","8":"30da95e0ea9afccdff64eeea","9":"d2c04a044d896f42446c21be","10":"f19bfa4bdb965d806b5b0612","11":"060956f9a1426331bdea8c35","12":"68690cbc8b5d70b62a445cd0","13":"6379d615d89f229b19bf6493","14":"58bd8b96514533e35a4b9ca4","15":"1a99b2fe2ff9a2b1c1ccc3b1","16":"fa80fdea696ab83c697dc4ea","17":"3111ff9a929a36b4aa1c8c4f","18":"3992a7319cf5db051dd5e81d","19":"19aa9ffa4a7f6128744628e2","20":"092a948a867832029835d9b5","21":"485d7a4def15f3e2f1a5fda4","22":"7b69d134b73d610d8482d216","23":"dcfa659bcde1934ff1ebe439","24":"16da117deb9632b956767cca","25":"1f185f9dd32d276f788897d4","26":"7a7e1f26e8f62a3b662c58a5"},"motos":{"1":"e5c46b61fb88e1f1cf3c55e2","2":"c9746dbbb67509d8aaaa1741","3":"111694740f3a4496111598c2","4":"cc8514c84a88f4ec2df19d1b","5":"3fb888830f29b07cf356604c","6":"f8271205083fd9f235555f10","7":"54d13129030409c85ce7c42a","8":"1300c7ae1b7a746b565dea60"},"ordenes":{"1":"9df37595dfae5d9028ebf556","2":"c52f30e8496d40379c858080","3":"1e5c4096f55c2828d01b936e","4":"4f8c26ee90b19513af02e2e6","5":"1ba09111bfa600720671d77f","6":"e625f30f4d549bc1c203ef77","7":"402452bd715bf00cf3aaf37d","8":"45e126dd3b9263781925e1cf","9":"5b91fb572393246a238c652b","10":"0386001caa42192be5a0cf6e"},"inventario":{"1":"f131e2d5a4454dcdd13696ae","2":"3d974517810c20b793aa346b","3":"b9f7bb02f53275b5a2302f28","4":"2474879696631631f9da35a1","5":"01333c584f5c914af3e999f6","6":"af5d52ab10e4d2db723467ed"},"citas":{"4":"8d6513d3ce20fb27fe1a26a1","10":"0dfe85554a28cc62db88caf8","11":"0bd5da5cd7846e58d9f29229"},"cotizaciones":{"1":"5b51cb2def6c51ccd02243db"},"ventas_rapidas":{"1":"6800c47a925ff6eeba0dd63e","2":"6af15e6ef485b05235255ea6","3":"67152f22b56a46ce4b92ae53","4":"7ffb53a74c4a78db4093b48d","5":"6dddeeded7ce2fc3c2778731"},"caja_movimientos":{"1":"bc16c60e13813a152d01b88f","2":"e60851d1d972bd1640bc877b","3":"cc02b2e1b2a00bd5b15ede33","4":"f7d42e8f72eb165540a17de5","5":"b3df31dc1e3980b9ec997255","6":"de12555a519a12fd5f604976","7":"4a5a552d911b5b19006f1d78","8":"d53d9e4d1f01975876338a00","9":"f4e7298c58ab70b2c9550f41","10":"8add7e89bf9f181e1fe55a17","11":"f2f10146321b6f3920a71638","12":"3d4decf1b78787314df852ae","13":"9e6fea24261e7ff7b89cd64e","14":"35543e38c81b1f814ccc2e2e","15":"077cb0a4d4985d537e91baeb","16":"ccdec9c994c17121acdc1cff","17":"749e045d6cc8e2e393486e33","18":"78a5b2afb6ba43f0d58674ac","19":"24d5e3afd06eed9122286355","20":"9a13d4524154e2e987fd4a55","21":"3c410a0738f0ec81cc36f690","22":"7ea3594238edbdd4a1ed02f2","23":"e4cce32e7f3f8fcc693100f6","24":"71e559b04ce3e1abfe130da7","25":"e9a5e3e7e582f494542d3b6a","26":"1365bbd8dc89bacac2364a8f","27":"90991ff040550283df5cd63a","28":"21ea134d27ae90cb2a7e5a17","29":"9d6e0b9138fa1fa735a059ba","30":"95017a6400cf551f073f001b"},"creditos":{"1":"449f0b4c7056e681e1dc1b14","2":"ede4e5b6adcacf482a6f23cc","3":"833f6c39008f000e93f21f6f","4":"6037d9dff58bf03f261fc769","5":"f914d9e18d0fab071068d2b4","6":"875e47613f22d7f2ecde7b24","7":"cf568c092ed8e00828f71419","8":"73e7b9db7bd6643c7859a643","9":"349336fe60f876318a74c57f","10":"798b3f6fceef002e87897e15","11":"9f4a793349a8311371ac84bb","12":"4c70475bf394842f85ec979d","13":"a3f3c806d31580ff6f6c34af","14":"0fd9dfd04c49f82313ba1e6f","15":"0a5a44fc120512544f878a5a","16":"5aaaf8f02fc076a049c175e9","17":"af3030dca2cf8c984d912260","18":"86dfe855f8cd555179631820","19":"a96ea7bc48551cc04428205d","20":"cdedf0bca29d36c6a5c4f270","21":"3221bfe4e0cc783652cf80a5","22":"b9b4fb93eab706245298ded0","23":"81c7ee4ab88ecf1c3a7d562f","24":"fea68053255d81b1f21d4f3c"},"categorias_inv":{"1":"dd04ce169c716e6658f462f8","2":"42ae4535a0eadc631b9479cd","3":"0679b148a011c321fcddf5d1","4":"db7c65e5bfecd55fdf1e978e","5":"d1f17fae8456d1c8523bf521"}};                       // store → { idLocal: sha256(JSON)[0..24] } del respaldo JEIEKQ
  var SEMILLA = ["b830598facc992df","4c4b443339a6cb60","35d78bb2ee14e273","7c435e5792921931","84dce8dfb37beff6","112376a732049f19","051aeb1b53a2f29e","57059e9082ae8456","64d02fa8eac59050","f51bd360f1f4bfd8","18beb9662617e862","3a644790b41ced08","44a15604af9e869b","588e234c11caa113","a99f05d0981d003f","34aeda13718c1a2e","c8c38cfc269966fd","c9afa92633bbc30a","dec3e364b3adb539","8417a8b8b4eb32fc","dfe2a1bff657322a","532deecd6007fd17","9e78cb7a21b89be3","e78a765214d29cd6","40cb006711350947","26f0976caeccd88b","41cad129c5e9e313","97895227f28f4593","b54f2d5c1cfe195f","4467c880a2f23dee","a55977081f8ece6b"];                             // huellas de los nombres de la siembra de ejemplo de la app
  var CORTE = "2026-09-25T22:01:24.298Z";                // exportadoEn del respaldo JEIEKQ
  var IMPORT_CONFIRMADO = "2026-09-26T00:53:40.304Z";    // confirmación del lote SAN1 en la nube
  var RETIRADOS_SAN1 = { clientes: [1, 2, 3], motos: [1, 2, 3], ordenes: [1, 2, 3], inventario: [1, 3], ventas_rapidas: [1],
    caja_movimientos: [1, 2, 3], categorias_inv: [1, 3, 4] };
  var TABLA_NUBE = { clientes: "clientes", motos: "motos", ordenes: "ordenes", inventario: "inventario", citas: "citas",
    cotizaciones: "cotizaciones", ventas_rapidas: "ventas", caja_movimientos: "caja_movimientos", creditos: "creditos", categorias_inv: "categorias_inv" };
  var ENTIDADES_CACHE = ["clientes", "motos", "citas", "categorias_inv", "inventario", "cotizaciones", "ordenes", "ventas_rapidas", "creditos", "caja_movimientos"];
  var LS_PUBLICAS = ["enti_modo_datos", "enti_ultimo_respaldo", "enti_theme"];
  var VOLATILES = ["id", "creadoEn", "actualizadoEn", "fechaISO", "uid", "_rev", "_base", "_pend"];
  // id local (caché o legado) → entidad a la que apunta
  var FK_LOCAL = { clienteId: "clientes", motoId: "motos", ordenId: "ordenes", inventarioId: "inventario", origenInventarioId: "inventario",
    citaId: "citas", cotizacionId: "cotizaciones", creditoId: "creditos", ventaId: "ventas_rapidas", categoriaId: "categorias_inv" };
  var LEGADO_CLAVE = [["ordenes", 4], ["ordenes", 6], ["ordenes", 8], ["clientes", 22], ["creditos", 25]];
  var FIN = "FIN-DIAGNOSTICO-ENTIMOTORS-119-V2";

  var UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  var ENUM = /^[a-z][a-z0-9_\-]{0,29}$/;
  var FECHA = /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;
  var CODIGO = /^[A-Za-z0-9_.\-]{1,40}$/;

  async function generar(env) {
    var idb = env.indexedDB, cripto = env.crypto, ls = env.localStorage;
    var enc = new TextEncoder();
    var hex = async function (t) { var b = new Uint8Array(await cripto.subtle.digest("SHA-256", enc.encode(t))); var s = ""; for (var i = 0; i < b.length; i++) s += (b[i] < 16 ? "0" : "") + b[i].toString(16); return s; };
    var huella = async function (v) { return (await hex(JSON.stringify(v))).slice(0, 24); };
    // huella de NOMBRE sin sal = la de la v1 (cruza con clienteH del legado). Solo para nombres.
    var corta = async function (t) { return t == null || t === "" ? null : (await hex(String(t).trim().toLowerCase())).slice(0, 16); };
    // huella CON SAL de este informe: teléfonos, placas, textos libres. No se puede revertir fuera del informe.
    var salB = new Uint8Array(16); cripto.getRandomValues(salB);
    var sal = Array.prototype.map.call(salB, function (x) { return (x < 16 ? "0" : "") + x.toString(16); }).join("");
    var hs = async function (t) { if (t == null || t === "") return null; var n = String(t).trim().toLowerCase().replace(/\s+/g, " "); return "s:" + (await hex(sal + "|" + n)).slice(0, 12); };
    var hsDigitos = async function (t) { var d = String(t == null ? "" : t).replace(/\D/g, ""); return d ? "s:" + (await hex(sal + "|tel|" + d)).slice(0, 12) : null; };
    var uuidImportado = async function (tabla, id) {
      var b = (await hex("entimotors-313|" + tabla + "|" + id)).slice(0, 32).split("");
      b[12] = "8"; b[16] = ((parseInt(b[16], 16) & 0x3) | 0x8).toString(16); var s = b.join("");
      return s.slice(0, 8) + "-" + s.slice(8, 12) + "-" + s.slice(12, 16) + "-" + s.slice(16, 20) + "-" + s.slice(20, 32);
    };
    var iso = function (ms) { try { return typeof ms === "number" && isFinite(ms) && ms > 0 ? new Date(ms).toISOString() : (typeof ms === "string" && FECHA.test(ms) ? ms : null); } catch (e) { return null; } };
    var fechaDe = function (r) { return r.fechaISO || iso(r.creadoEn) || (r.fecha ? r.fecha + (r.hora ? "T" + r.hora : "") : null); };
    var num = function (v) { var n = Number(v); return v === null || v === undefined || v === "" || !isFinite(n) ? null : n; };
    var r2 = function (n) { return Math.round(n * 100) / 100; };
    var totalItems = function (r) { return (Array.isArray(r.items) ? r.items : []).reduce(function (s, it) { return s + (Number(it && it.cantidad) || 0) * (Number(it && it.precio) || 0); }, 0); };
    var contenido = function (r) { var c = {}; Object.keys(r).forEach(function (k) { if (VOLATILES.indexOf(k) < 0) c[k] = r[k]; }); return c; };
    var enumSeguro = async function (v) { return v == null ? null : (typeof v === "string" && ENUM.test(v) ? v : await hs(v)); };
    var fechaSegura = function (v) { return v == null ? null : (typeof v === "string" && FECHA.test(v) ? v : (typeof v === "number" ? iso(v) : "(no es fecha)")); };
    var uuidSeguro = function (v) { return v == null ? null : (typeof v === "string" && UUID.test(v) ? v.toLowerCase() : "(no es uuid)"); };

    /* ---------- abrir SOLO bases que ya existen, con su versión exacta: nunca se crea ni se actualiza nada ---------- */
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
    var meta = function (nombre) { return lista ? lista.filter(function (d) { return d.name === nombre; })[0] || null : null; };

    var informe = { herramienta: "entimotors-diag-119 v2", generadoEn: new Date().toISOString(), origen: env.origen || null, controladoPorServiceWorker: !!env.controladoPorSW,
      agente: env.agente || null, bases: lista ? lista.map(function (d) { return d.name + " v" + d.version; }) : "el navegador no permite listar bases",
      privacidad: "Sin nombres, teléfonos, placas, notas, fotos ni tokens. Nombres = huella sin sal (v1). Teléfonos/placas/textos = huella «s:» con sal aleatoria de ESTE informe.",
      localStorage: null, dispositivo: null, legado313: null, cacheNube: {}, mapaLegado: null, credito25: null, abonosPendientes: null, veredicto: null };

    /* ---------- localStorage: claves (con su longitud), públicas y METADATOS de sesión (nunca tokens) ---------- */
    var LSI = { claves: {}, publicas: {}, import313: null, sesionGuardada: null, perfilGuardado: null, sesionApp: null };
    var leerJson = function (k) { try { var v = ls.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return undefined; } };
    try {
      for (var i = 0; i < ls.length; i++) { var k = ls.key(i); LSI.claves[k] = String(ls.getItem(k) || "").length; }
      LS_PUBLICAS.forEach(function (c) { var v = ls.getItem(c); if (v !== null) LSI.publicas[c] = String(v).length <= 40 && /^[\w:.\-T ]*$/.test(v) ? v : "(" + String(v).length + " caracteres)"; });
      var im = leerJson("enti_import_313");
      if (im) LSI.import313 = { estado: typeof im.estado === "string" && ENUM.test(im.estado) ? im.estado : null, lote: uuidSeguro(im.lote), idRespaldo: typeof im.idRespaldo === "string" && /^[A-Z0-9\-]{1,40}$/.test(im.idRespaldo) ? im.idRespaldo : null, claves: Object.keys(im).sort() };
      var sb = leerJson("entimotors_sb_sesion");
      if (sb === undefined) LSI.sesionGuardada = "ilegible";
      else if (sb) {
        var exp = num(sb.expires_at);
        LSI.sesionGuardada = { userId: uuidSeguro(sb.user && sb.user.id), expiraEn: exp ? iso(exp * 1000) : null, caducadaAlGenerar: exp ? exp * 1000 < Date.now() : null,
          tieneAccessToken: !!sb.access_token, tieneRefreshToken: !!sb.refresh_token, nota: "solo metadatos: los tokens no se leen ni se usan" };
      }
      sb = null;
      var pf = leerJson("enti_perfil_supabase");
      if (pf) LSI.perfilGuardado = { id: uuidSeguro(pf.id), rol: await enumSeguro(pf.rol), activo: typeof pf.activo === "boolean" ? pf.activo : null };
      var sa = leerJson("enti_session");
      if (sa) LSI.sesionApp = { rol: await enumSeguro(sa.rol), perfilId: uuidSeguro(sa.perfilId), origen: await enumSeguro(sa.origen) };
    } catch (e) { LSI = "no disponible"; }
    informe.localStorage = LSI;
    var usuarioGuardado = LSI && LSI.sesionGuardada && LSI.sesionGuardada.userId || (LSI && LSI.perfilGuardado && LSI.perfilGuardado.id) || null;

    /* ---------- entimotors_dispositivo: solo el device_id ---------- */
    var md = meta("entimotors_dispositivo");
    if (md) {
      try { var dd = await abrir(md.name, md.version); var fm = (await leerTodo(dd, "meta")) || []; dd.close();
        var di = fm.filter(function (x) { return x && x.k === "device_id"; })[0];
        informe.dispositivo = { deviceId: uuidSeguro(di && di.v), claves: fm.map(function (x) { return x && x.k; }).filter(function (x) { return typeof x === "string" && ENUM.test(x); }) };
      } catch (e) { informe.dispositivo = "no se pudo leer: " + (e && e.message); }
    } else informe.dispositivo = lista ? "no existe" : "no comprobable";

    /* ---------- legado 3.13 (igual que v1) + detalle del crédito #25 ---------- */
    async function resumen(store, r) {
      var base = { fecha: fechaDe(r), creadoEn: iso(r.creadoEn), actualizadoEn: iso(r.actualizadoEn) };
      var items = async function (arr, inv) { var o = []; for (var x of (Array.isArray(arr) ? arr : [])) o.push({ nombreH: await corta(x && x.nombre), cantidad: num(x && x.cantidad), precio: num(x && x.precio), inv: x ? (x[inv] == null ? null : x[inv]) : null }); return o; };
      switch (store) {
        case "clientes": return Object.assign(base, { nombreH: await corta(r.nombre), telefonoS: await hsDigitos(r.telefono) });
        case "motos": return Object.assign(base, { clienteId: r.clienteId == null ? null : r.clienteId, marcaS: await hs(r.marca), modeloS: await hs(r.modelo), placaS: await hs(r.placa), km: num(r.km), conFoto: !!r.foto });
        case "ordenes": return Object.assign(base, { clienteId: r.clienteId == null ? null : r.clienteId, motoId: r.motoId == null ? null : r.motoId, estado: await enumSeguro(r.estado), finalizada: !!r.finalizada,
          tipoCobro: await enumSeguro(r.tipoCobro), items: await items(r.items, "origenInventarioId"), total: totalItems(r), citaId: r.citaId == null ? null : r.citaId,
          cotizacionId: r.cotizacionId == null ? null : r.cotizacionId, creditoId: r.creditoId == null ? null : r.creditoId, fotos: (r.fotos || []).length });
        case "inventario": return Object.assign(base, { nombreH: await corta(r.nombre), cantidad: num(r.cantidad), precio: num(r.precio == null ? r.precioVenta : r.precio), costo: num(r.costoCompra), categoriaId: r.categoriaId == null ? null : r.categoriaId });
        case "citas": return Object.assign(base, { clienteId: r.clienteId == null ? null : r.clienteId, fechaCita: fechaSegura(r.fecha), estado: await enumSeguro(r.estado), origen: await enumSeguro(r.origen), ordenId: r.ordenId == null ? null : r.ordenId });
        case "cotizaciones": return Object.assign(base, { clienteId: r.clienteId == null ? null : r.clienteId, clienteH: await corta(r.clienteNombre), estado: await enumSeguro(r.estado), total: totalItems(r), items: (r.items || []).length, ordenId: r.ordenId == null ? null : r.ordenId });
        case "ventas_rapidas": return Object.assign(base, { clienteId: r.clienteId == null ? null : r.clienteId, clienteH: await corta(r.clienteNombre), metodoPago: await enumSeguro(r.metodoPago), total: num(r.total), items: await items(r.items, "inventarioId") });
        case "caja_movimientos": return Object.assign(base, { tipo: await enumSeguro(r.tipo), categoriaS: await hs(r.categoria), monto: num(r.monto), metodoPago: await enumSeguro(r.metodoPago), ventaId: r.ventaId == null ? null : r.ventaId,
          creditoId: r.creditoId == null ? null : r.creditoId, ordenId: r.ordenId == null ? null : r.ordenId, idAbono: typeof r.idAbono === "string" && /^[\w:.\-]{1,80}$/.test(r.idAbono) ? r.idAbono : (r.idAbono == null ? null : "(omitido)") });
        case "creditos": return Object.assign(base, { clienteId: r.clienteId == null ? null : r.clienteId, clienteH: await corta(r.clienteNombre), total: num(r.total), abonado: num(r.abonado), saldo: num(r.saldo), estado: await enumSeguro(r.estado),
          origen: await enumSeguro(r.origen), ordenId: r.ordenId == null ? null : r.ordenId, vencimiento: fechaSegura(r.vencimiento), notaLongitud: r.nota ? String(r.nota).length : 0,
          items: await items(r.items, "inventarioId"), totalRenglones: totalItems(r),
          abonos: (r.historialAbonos || []).map(function (a) { return { monto: num(a && a.monto), metodo: a && typeof a.metodoPago === "string" && ENUM.test(a.metodoPago) ? a.metodoPago : null, fecha: a && fechaSegura(a.fechaISO) }; }) });
        case "categorias_inv": return Object.assign(base, { nombreH: await corta(r.nombre) });
        default: return base;
      }
    }
    async function pareceEjemplo(store, r) {
      var n = await corta(r.nombre);
      return !!n && ["clientes", "inventario", "categorias_inv"].indexOf(store) >= 0 && SEMILLA.indexOf(n) >= 0;
    }

    var origenDeUuid = {};   // uuid determinista del importador → "tabla/id" del legado (para reconocer lo importado)
    var legadoFilas = {};    // store → { id: fila } (solo en memoria)
    var mo = meta("entimotors_os_demo");
    if (!lista) informe.legado313 = "NO SE PUDO COMPROBAR (el navegador no lista bases): no se abrió nada para no crear una base vacía";
    else if (!mo) informe.legado313 = "NO EXISTE entimotors_os_demo en este navegador (¿se abrió en otro navegador distinto de Chrome?)";
    else {
      var db = await abrir(mo.name, mo.version);
      var L = { version: db.version, stores: Array.prototype.slice.call(db.objectStoreNames), storesAusentes: [], conteos: {}, operativos: 0,
        nuevos: [], faltantes: [], modificados: [], corruptos: [], sinCambio: 0, ejemploRetiradoPresente: 0 };
      var stores = Object.keys(MANIFIESTO);
      for (var s = 0; s < stores.length; s++) {
        var st = stores[s];
        var filas = await leerTodo(db, st);
        if (filas === null) { L.storesAusentes.push(st); L.conteos[st] = null; continue; }
        L.conteos[st] = filas.length; L.operativos += filas.length; legadoFilas[st] = {};
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
          legadoFilas[st][String(x.id)] = x;
          var ux = await uuidImportado(TABLA_NUBE[st], x.id); origenDeUuid[ux] = st + "/" + x.id;
          var h; try { h = await huella(x); } catch (e) { continue; }
          vistos[String(x.id)] = true;
          var retirado = (RETIRADOS_SAN1[st] || []).indexOf(x.id) >= 0;
          if (retirado) L.ejemploRetiradoPresente++;
          var esperado = MANIFIESTO[st][x.id];
          if (esperado && h === esperado) { L.sinCambio++; continue; }
          var hcx = await huella(contenido(x));
          var dup = (porContenido[hcx] || []).filter(function (id) { return id !== x.id; });
          var fila = Object.assign({ store: st, id: x.id, uuidNube: ux, huella: h, huellaContenido: hcx,
            posibleDuplicadoDe: dup.length ? dup : null, posibleEjemplo: retirado || await pareceEjemplo(st, x), campos: Object.keys(x).sort() }, await resumen(st, x));
          if (!esperado) { fila.posteriorAlRespaldo = (fila.fecha || "") > CORTE; L.nuevos.push(fila); }
          else { fila.huellaRespaldo = esperado; fila.retiradoEnSAN1 = retirado; L.modificados.push(fila); }
        }
        for (var idm in MANIFIESTO[st]) { if (!vistos[idm]) L.faltantes.push({ store: st, id: Number(idm), retiradoEnSAN1: (RETIRADOS_SAN1[st] || []).indexOf(Number(idm)) >= 0 }); var um = await uuidImportado(TABLA_NUBE[st], idm); if (!origenDeUuid[um]) origenDeUuid[um] = st + "/" + idm + " (en JEIEKQ)"; }
      }
      var aud = (await leerTodo(db, "auditoria")) || [];
      L.auditoriaTotal = aud.length;
      L.auditoriaPosteriorAlRespaldo = aud.filter(function (a) { return a && (a.fechaISO || "") > CORTE; })
        .map(function (a) { return { id: a.id, fecha: fechaSegura(a.fechaISO), accion: typeof a.accion === "string" && ENUM.test(a.accion) ? a.accion : "(otra)", entidad: typeof a.entidad === "string" && ENUM.test(a.entidad) ? a.entidad : null,
          entidadId: typeof a.entidadId === "number" ? a.entidadId : (a.entidadId == null ? null : "(no numérico)"), rol: typeof a.rol === "string" && ENUM.test(a.rol) ? a.rol : null }; });
      var cola = (await leerTodo(db, "sync_cola")) || [];
      L.syncColaTotal = cola.length;
      L.syncColaPosterior = cola.filter(function (c) { return c && (c.fechaISO || "") > CORTE; })
        .map(function (c) { return { id: c.id, fecha: fechaSegura(c.fechaISO), entidad: typeof c.entidad === "string" && ENUM.test(c.entidad) ? c.entidad : null, entidadId: typeof c.entidadId === "number" ? c.entidadId : null,
          operacion: typeof c.operacion === "string" && ENUM.test(c.operacion) ? c.operacion : "(otra)", estado: typeof c.estado === "string" && ENUM.test(c.estado) ? c.estado : null, conDatos: c.datos != null }; });
      L.webCms = ((await leerTodo(db, "web_cms")) || []).length;
      db.close();
      informe.legado313 = L;
    }

    /* ---------- caché de nube: outbox, filas no confirmadas, mapa ---------- */
    var SENSIBLES_LOCAL = ["nombre", "telefono", "placa", "clienteNombre", "clienteTelefono", "direccion", "nota", "notas", "falla", "diagnostico", "reparacionNotas",
      "descripcion", "detalle", "correo", "email", "foto", "marca", "modelo", "color", "vin", "motor", "chasis", "observaciones", "nombreTmp", "mecanico"];
    var SENSIBLES_NUBE = ["nombre", "telefono", "placa", "cliente_nombre", "cliente_telefono", "direccion", "nota", "notas", "falla", "diagnostico", "reparacion_notas",
      "descripcion", "detalle", "correo", "email", "foto", "foto_url", "foto_path", "marca", "modelo", "color", "vin", "observaciones", "nombre_tmp", "mecanico", "calidad_checklist", "aprobacion"];
    var ENUMS = ["estado", "tipo", "metodoPago", "metodo_pago", "tipoCobro", "tipo_cobro", "origen", "origen_trabajo", "rol", "abono_metodo", "metodo"];

    // Saneado genérico de un objeto plano (fila local o columnas de nube): solo uuid, números, booleanos, fechas y enumerados.
    async function sanear(o, sensibles, mapaLocal) {
      var out = {}, omitidos = [];
      for (var k of Object.keys(o || {}).sort()) {
        var v = o[k];
        if (k === "_base" || k === "_rev" || k === "_pend" || k === "uid") continue;
        if (sensibles.indexOf(k) >= 0) {
          if (v == null || v === "") { out[k] = null; continue; }
          if (/^(nombre|cliente_nombre|clienteNombre|nombreTmp|nombre_tmp)$/.test(k)) out[k + "H"] = await corta(v);
          else if (/telefono|Telefono/.test(k)) out[k + "S"] = await hsDigitos(v);
          else if (typeof v === "string") { out[k + "S"] = await hs(v); }
          else out[k] = "(omitido)";
          continue;
        }
        if (k === "items" && Array.isArray(v)) { out.items = []; for (var it of v) out.items.push(await saneaItem(it)); out.totalRenglones = r2(totalItems(o)); continue; }
        if (k === "historialAbonos" && Array.isArray(v)) { out.historialAbonos = v.map(function (a) { return { monto: num(a && a.monto), metodo: a && typeof a.metodoPago === "string" && ENUM.test(a.metodoPago) ? a.metodoPago : null, fecha: a && fechaSegura(a.fechaISO), idAbono: a && typeof a.idAbono === "string" && /^[\w:.\-]{1,80}$/.test(a.idAbono) ? a.idAbono : null }; }); continue; }
        if (v === null || v === undefined) { out[k] = null; continue; }
        if (typeof v === "boolean") { out[k] = v; continue; }
        if (typeof v === "number") {
          out[k] = v;
          if (mapaLocal && FK_LOCAL[k]) { var u = mapaLocal(FK_LOCAL[k], v); out[k + "Uid"] = u; if (u && origenDeUuid[u]) out[k + "OrigenLegado"] = origenDeUuid[u]; }
          continue;
        }
        if (typeof v === "string") {
          if (UUID.test(v)) { out[k] = v.toLowerCase(); if (origenDeUuid[v.toLowerCase()]) out[k + "OrigenLegado"] = origenDeUuid[v.toLowerCase()]; continue; }
          if (FECHA.test(v)) { out[k] = v; continue; }
          if (ENUMS.indexOf(k) >= 0 && ENUM.test(v)) { out[k] = v; continue; }
          out[k + "S"] = await hs(v); omitidos.push(k); continue;
        }
        if (Array.isArray(v)) { out[k] = "(lista de " + v.length + ", omitida)"; continue; }
        out[k] = "(objeto omitido: " + Object.keys(v).length + " campos)";
      }
      if (omitidos.length) out._textosConHuella = omitidos;
      return out;
    }
    async function saneaItem(it) {
      it = it || {};
      return { item_id: uuidSeguro(it.item_id || it.itemUid || it.uid || null), inventario_id: uuidSeguro(it.inventario_id || it.inventarioUid || null),
        inventarioIdLocal: typeof it.inventarioId === "number" ? it.inventarioId : (typeof it.origenInventarioId === "number" ? it.origenInventarioId : null),
        cantidad: num(it.cantidad), precio: num(it.precio), nombreH: await corta(it.nombre) };
    }
    // Parámetros de RPC: LISTA PERMITIDA explícita. Lo que no está en la lista se omite (se nombra la clave, no el valor).
    var P_UUID = ["p_op", "p_credito_id", "p_cliente_id", "p_venta_id", "p_orden_id", "p_item_id", "p_inventario_id", "p_cotizacion_id", "p_abono_id", "p_caja_id", "p_device", "p_moto_id", "p_cita_id"];
    var P_NUM = ["p_monto", "p_cantidad", "p_precio", "p_abono_inicial", "p_abono", "p_efectivo", "p_delta", "p_conteo", "p_total"];
    var P_ENUM = ["p_metodo", "p_metodo_pago", "p_abono_metodo", "p_tipo_cobro", "p_tipo", "p_origen", "p_estado"];
    var P_FECHA = ["p_occurred_at", "p_vencimiento", "p_fecha"];
    var P_BOOL = ["p_offline"];
    async function saneaParams(p) {
      var out = {}, omitidos = [];
      for (var k of Object.keys(p || {}).sort()) {
        var v = p[k];
        if (P_UUID.indexOf(k) >= 0) { out[k] = uuidSeguro(v); if (v && origenDeUuid[String(v).toLowerCase()]) out[k + "_origenLegado"] = origenDeUuid[String(v).toLowerCase()]; }
        else if (P_NUM.indexOf(k) >= 0) out[k] = num(v);
        else if (P_ENUM.indexOf(k) >= 0) out[k] = await enumSeguro(v);
        else if (P_FECHA.indexOf(k) >= 0) out[k] = fechaSegura(v);
        else if (P_BOOL.indexOf(k) >= 0) out[k] = v == null ? null : !!v;
        else if (k === "p_cliente_nombre" || k === "p_nombre") out[k + "H"] = await corta(v);
        else if (k === "p_cliente_telefono") { out.p_cliente_telefono_presente = !!(v && String(v).replace(/\D/g, "")); out.p_cliente_telefonoS = await hsDigitos(v); }
        else if (k === "p_categoria" || k === "p_descripcion" || k === "p_nota" || k === "p_motivo") out[k + "Longitud"] = v == null ? 0 : String(v).length;
        else if (k === "p_items" && Array.isArray(v)) { out.p_items = []; for (var it of v) out.p_items.push(await saneaItem(it)); out.p_items_total = r2(v.reduce(function (s, x) { return s + (Number(x && x.cantidad) || 0) * (Number(x && x.precio) || 0); }, 0)); }
        else if (k === "p_campos" && v && typeof v === "object") out.p_campos_claves = Object.keys(v).sort();
        else omitidos.push(k);
      }
      if (omitidos.length) out._clavesOmitidas = omitidos;
      return out;
    }
    function errorSeguro(e) {
      if (!e) return null;
      if (typeof e !== "object") return { tipo: "texto", longitud: String(e).length };
      var m = String(e.mensaje || e.message || "");
      var tipo = /jwt|token|expir|sesi[oó]n|session|auth|401|refresh/i.test(m) ? "sesion" : /fetch|network|red\b|conexi|offline|internet/i.test(m) ? "red" :
        /tiempo|timeout/i.test(m) ? "tiempo" : /permis|42501|403|forbidden/i.test(m) ? "permiso" : m ? "otro" : "vacío";
      return { clase: typeof e.clase === "string" && ENUM.test(e.clase) ? e.clase : null, codigo: typeof e.codigo === "string" && CODIGO.test(e.codigo) ? e.codigo : (e.codigo ? "(omitido)" : null),
        http: typeof e.http === "number" ? e.http : null, mensajeTipo: tipo, mensajeLongitud: m.length };
    }

    var nubes = (lista || []).filter(function (d) { return /^entimotors_sync/.test(d.name); });
    var cacheTaller = null;   // la caché del Taller (entimotors_sync), para el mapa legado y el crédito #25
    for (var n = 0; n < nubes.length; n++) {
      var rn = { version: nubes[n].version, filas: {}, meta: null, cursores: [], resumenPorEntidad: {}, outbox: [], noConfirmadas: [], conflictos: [], mapaInconsistente: [] };
      var dbn = await abrir(nubes[n].name, nubes[n].version);
      var sts = Array.prototype.slice.call(dbn.objectStoreNames), datos = {};
      for (var t = 0; t < sts.length; t++) { datos[sts[t]] = (await leerTodo(dbn, sts[t])) || []; rn.filas[sts[t]] = datos[sts[t]].length; }
      dbn.close();
      // mapa uid ↔ id local
      var mapaUid = {}, mapaLoc = {};
      (datos.mapa || []).forEach(function (m) { if (m && m.uid) { mapaUid[String(m.uid).toLowerCase()] = { entidad: m.entidad, local_id: m.local_id }; mapaLoc[m.entidad + "|" + m.local_id] = String(m.uid).toLowerCase(); } });
      var uidDeLocal = function (entidad, id) { return mapaLoc[entidad + "|" + id] || null; };
      // meta (solo claves y valores no sensibles) y cursores
      rn.meta = (datos.meta || []).map(function (x) {
        var v = x && x.v, d = { k: x && typeof x.k === "string" && ENUM.test(x.k) ? x.k : "(otra)" };
        if (d.k === "device_id") d.v = uuidSeguro(v);
        else if (d.k === "bootstrap" && v && typeof v === "object") d.v = { completo: !!v.completo, en: iso(v.en) };
        else if (d.k === "fk_pendientes" && v && typeof v === "object") d.v = Object.keys(v).reduce(function (a, e) { a[e] = Array.isArray(v[e]) ? v[e].length : 0; return a; }, {});
        else if (d.k === "lease" && v && typeof v === "object") d.v = { hasta: iso(v.until) };
        else d.v = "(omitido)";
        return d;
      });
      rn.cursores = (datos.cursores || []).map(function (c) { return { entidad: c && typeof c.entidad === "string" && ENUM.test(c.entidad) ? c.entidad : null, t: c && fechaSegura(typeof c.t === "string" ? c.t.replace(" ", "T").replace(/\+00(:?00)?$/, "Z") : c.t), id: c && uuidSeguro(c.id) }; });
      // filas por entidad: confirmadas / nunca confirmadas / con cambio pendiente; y coherencia con el mapa
      var filaPorUid = {};
      for (var e of ENTIDADES_CACHE) {
        var fe = datos[e]; if (!fe) continue;
        var res = { total: fe.length, confirmadas: 0, nuncaConfirmadas: 0, conCambioPendiente: 0, sinUid: 0 };
        for (var row of fe) {
          if (!row || typeof row !== "object") continue;
          var u = row.uid ? String(row.uid).toLowerCase() : null;
          if (!u) res.sinUid++; else filaPorUid[u] = { entidad: e, row: row };
          var confirmada = (row._rev || 0) > 0 || !!row._base;
          if (confirmada) res.confirmadas++; else res.nuncaConfirmadas++;
          if (confirmada && row._pend) res.conCambioPendiente++;
          if (u && (!mapaUid[u] || mapaUid[u].local_id !== row.id || mapaUid[u].entidad !== e)) rn.mapaInconsistente.push({ entidad: e, id: row.id, uid: u, mapa: mapaUid[u] || null });
          if (!confirmada || row._pend) {
            var ops = (datos.outbox || []).filter(function (o) { return o && u && (String(o.uid || "").toLowerCase() === u || JSON.stringify(o.params || o.cambios || {}).toLowerCase().indexOf(u) >= 0); }).map(function (o) { return { seq: o.seq, op_id: uuidSeguro(o.op_id), kind: o.kind, rpc: o.rpc || null, estado: o.estado }; });
            rn.noConfirmadas.push(Object.assign({ entidad: e, id: row.id, uid: u, estadoSync: confirmada ? "cambio-pendiente" : "nunca-confirmada-por-el-servidor",
              rev: row._rev || 0, tieneBase: !!row._base, pend: !!row._pend, fecha: fechaDe(row), creadoEn: iso(row.creadoEn), origenLegado: u ? origenDeUuid[u] || null : null,
              huellaContenido: await huella(contenido(row)), operaciones: ops }, { datos: await sanear(row, SENSIBLES_LOCAL, uidDeLocal) }));
          }
        }
        rn.resumenPorEntidad[e] = res;
      }
      // outbox: cada fila con su allowlist
      var outbox = (datos.outbox || []).slice().sort(function (a, b) { return (a.seq || 0) - (b.seq || 0); });
      for (var op of outbox) {
        if (!op || typeof op !== "object") { rn.outbox.push({ corrupta: true }); continue; }
        var uo = op.uid ? String(op.uid).toLowerCase() : null;
        var enMapa = uo ? mapaUid[uo] || null : null;
        var reg = uo ? filaPorUid[uo] || null : null;
        var o = { seq: op.seq, estado: typeof op.estado === "string" && ENUM.test(op.estado) ? op.estado : "(otro)", tipo: typeof op.kind === "string" && ENUM.test(op.kind) ? op.kind : "(otro)",
          entidad: typeof op.entidad === "string" && ENUM.test(op.entidad) ? op.entidad : null, tabla: typeof op.tabla === "string" && ENUM.test(op.tabla) ? op.tabla : null,
          rpc: typeof op.rpc === "string" && ENUM.test(op.rpc) ? op.rpc : (op.rpc ? "(otro)" : null), crea: !!op.crea, op_id: uuidSeguro(op.op_id), uid: uuidSeguro(op.uid),
          uidOrigenLegado: uo ? origenDeUuid[uo] || null : null, uidEnMapa: enMapa ? { entidad: enMapa.entidad, idLocalCache: enMapa.local_id } : null,
          registroEnCache: reg ? { entidad: reg.entidad, id: reg.row.id, rev: reg.row._rev || 0, confirmado: (reg.row._rev || 0) > 0 || !!reg.row._base, pend: !!reg.row._pend } : null,
          actor_uid: uuidSeguro(op.actor_uid), actorEsUsuarioGuardado: usuarioGuardado ? uuidSeguro(op.actor_uid) === usuarioGuardado : null, device_id: uuidSeguro(op.device_id),
          creado: iso(op.creado_en), intentos: num(op.intentos), siguienteEn: iso(op.siguiente_en), enviandoEn: iso(op.enviando_en), recuperada: num(op.recuperada), padre: op.padre == null ? null : (typeof op.padre === "number" ? op.padre : uuidSeguro(op.padre)),
          base_rev: num(op.base_rev), error: errorSeguro(op.error) };
        if (op.kind === "rpc") o.params = await saneaParams(op.params);
        else if (op.cambios && typeof op.cambios === "object") o.cambios = await sanear(op.cambios, SENSIBLES_NUBE, null);
        o.clavesDeLaFila = Object.keys(op).sort();
        rn.outbox.push(o);
      }
      rn.outboxPorEstado = outbox.reduce(function (a, x) { var k = x && x.estado || "?"; a[k] = (a[k] || 0) + 1; return a; }, {});
      rn.conflictos = (datos.conflictos || []).map(function (c) { return { id: c && c.id, op_seq: c && c.op_seq, op_id: c && uuidSeguro(c.op_id), entidad: c && typeof c.entidad === "string" && ENUM.test(c.entidad) ? c.entidad : null, uid: c && uuidSeguro(c.uid), tipo: c && typeof c.tipo === "string" && ENUM.test(c.tipo) ? c.tipo : null, campos: c && Array.isArray(c.campos) ? c.campos.filter(function (x) { return typeof x === "string" && ENUM.test(x); }) : [] }; });
      rn.fotosPendientes = (datos.blobs || []).length;
      rn._mapaUid = mapaUid; rn._uidDeLocal = uidDeLocal; rn._datos = datos; rn._filaPorUid = filaPorUid;
      informe.cacheNube[nubes[n].name] = rn;
      if (nubes[n].name === "entimotors_sync") cacheTaller = rn;
    }

    /* ---------- C · mapa legado → nube ---------- */
    var M = [];
    for (var lc of LEGADO_CLAVE) {
      var ul = await uuidImportado(TABLA_NUBE[lc[0]], lc[1]);
      var enMp = cacheTaller && cacheTaller._mapaUid[ul];
      var fr = cacheTaller && cacheTaller._filaPorUid[ul];
      M.push({ entidad: lc[0], LOCAL_ID: lc[1], CLOUD_UUID: ul, fuenteUuid: "uuid determinista del importador 3.13 (sha256 'entimotors-313|tabla|id')",
        enLegadoDelTelefono: !!(legadoFilas[lc[0]] && legadoFilas[lc[0]][String(lc[1])]), enJEIEKQ: !!(MANIFIESTO[lc[0]] && MANIFIESTO[lc[0]][lc[1]]),
        MAP_STATUS: !cacheTaller ? "SIN_CACHE" : enMp ? "EN_MAPA_DE_LA_CACHE" : "NO_ESTA_EN_LA_CACHE",
        idLocalEnCache: enMp ? enMp.local_id : null, filaEnCache: fr ? { rev: fr.row._rev || 0, confirmada: (fr.row._rev || 0) > 0 || !!fr.row._base, pend: !!fr.row._pend } : null, fuenteMapa: enMp ? "entimotors_sync.mapa" : null });
    }
    // y al revés: los ids de la CACHÉ 4, 6 y 8 de órdenes (la bitácora en modo nube anota ids de la caché)
    var inversa = [];
    if (cacheTaller) for (var ci of [4, 6, 8]) {
      var uc = cacheTaller._uidDeLocal("ordenes", ci);
      inversa.push({ entidad: "ordenes", idLocalCache: ci, uid: uc, origenLegado: uc ? origenDeUuid[uc] || "creada en la nube (no es importada)" : null, fuente: "entimotors_sync.mapa (by_local)" });
    }
    // bitácora y sync_cola legado posteriores: las dos lecturas posibles del id (legado o caché)
    var Lg = informe.legado313, interpretar = async function (ent, id) {
      if (typeof id !== "number" || !TABLA_NUBE[ent]) return null;
      var uL = await uuidImportado(TABLA_NUBE[ent], id), uC = cacheTaller ? cacheTaller._uidDeLocal(ent, id) : null;
      return { comoIdLegado: uL, comoIdCache: uC, cacheEsImportada: uC ? origenDeUuid[uC] || "creada en la nube" : null, coinciden: uC === uL };
    };
    var bitacora = [];
    if (Lg && typeof Lg === "object") {
      for (var a of Lg.auditoriaPosteriorAlRespaldo) bitacora.push(Object.assign({ fuente: "auditoria", id: a.id, fecha: a.fecha, accion: a.accion, entidad: a.entidad, entidadId: a.entidadId, rol: a.rol,
        momento: (a.fecha || "") < IMPORT_CONFIRMADO ? "antes de confirmar el lote SAN1 (modo local probable)" : "después del lote SAN1 (modo nube probable: el id es de la caché)" }, { lecturas: await interpretar(a.entidad, a.entidadId) }));
      for (var c of Lg.syncColaPosterior) bitacora.push(Object.assign({ fuente: "sync_cola", id: c.id, fecha: c.fecha, operacion: c.operacion, entidad: c.entidad, entidadId: c.entidadId, estado: c.estado }, { lecturas: await interpretar(c.entidad, c.entidadId) }));
    }
    informe.mapaLegado = { legado: M, cacheOrdenes: inversa, bitacoraPosterior: bitacora };

    /* ---------- D · crédito legado #25 y sus posibles equivalentes ---------- */
    var c25 = legadoFilas.creditos && legadoFilas.creditos["25"];
    if (c25) {
      var u25 = await uuidImportado("creditos", 25), uCli = c25.clienteId != null ? await uuidImportado("clientes", c25.clienteId) : null;
      var r25 = await resumen("creditos", c25), firmaItems = function (arr) { return JSON.stringify((arr || []).map(function (x) { return [num(x.cantidad), num(x.precio)]; }).sort()); };
      var firma25 = firmaItems(c25.items);
      var cand = [];
      if (cacheTaller) {
        for (var cr of (cacheTaller._datos.creditos || [])) {
          if (!cr) continue;
          var ucr = cr.uid ? String(cr.uid).toLowerCase() : null, cliU = cr.clienteId != null ? cacheTaller._uidDeLocal("clientes", cr.clienteId) : null;
          var f = { mismoUuid: ucr === u25, mismoClienteUuid: !!uCli && cliU === uCli, mismoTotal: num(cr.total) === num(c25.total), mismosRenglones: firmaItems(cr.items) === firma25 && (c25.items || []).length > 0,
            mismaHuellaNombreCliente: (await corta(cr.clienteNombre)) === r25.clienteH };
          if (f.mismoUuid || f.mismoClienteUuid || f.mismoTotal || f.mismaHuellaNombreCliente) cand.push({ fuente: "cache.creditos", id: cr.id, uid: ucr, origenLegado: ucr ? origenDeUuid[ucr] || null : null,
            confirmado: (cr._rev || 0) > 0 || !!cr._base, pend: !!cr._pend, total: num(cr.total), saldo: num(cr.saldo), fecha: fechaDe(cr), clienteUid: cliU, criterios: f });
        }
        for (var ob of (cacheTaller._datos.outbox || [])) {
          if (!ob || ob.kind !== "rpc" || !ob.params) continue;
          var pc = ob.params, pt = Array.isArray(pc.p_items) ? r2(pc.p_items.reduce(function (s, x) { return s + (Number(x.cantidad) || 0) * (Number(x.precio) || 0); }, 0)) : null;
          var fo = { mismoUuid: String(pc.p_credito_id || "").toLowerCase() === u25, mismoClienteUuid: !!uCli && String(pc.p_cliente_id || "").toLowerCase() === uCli,
            mismoTotal: pt !== null && pt === num(c25.total), mismosRenglones: Array.isArray(pc.p_items) && firmaItems(pc.p_items) === firma25 && (c25.items || []).length > 0,
            mismaHuellaNombreCliente: pc.p_cliente_nombre ? (await corta(pc.p_cliente_nombre)) === r25.clienteH : false };
          if (fo.mismoUuid || fo.mismoClienteUuid || fo.mismoTotal || fo.mismaHuellaNombreCliente) cand.push({ fuente: "outbox", seq: ob.seq, op_id: uuidSeguro(ob.op_id), rpc: ob.rpc, estado: ob.estado, creado: iso(ob.creado_en), total: pt, criterios: fo });
        }
      }
      cand.forEach(function (x) { var k = x.criterios; x.lectura = k.mismoUuid ? "MISMO_REGISTRO (uuid)" : (k.mismoClienteUuid && k.mismoTotal && (k.mismosRenglones || !(c25.items || []).length)) ? "PROBABLE_MISMA_DEUDA (mismo cliente por uuid + mismo total" + (k.mismosRenglones ? " + mismos renglones" : "") + ")"
        : k.mismoClienteUuid ? "MISMO_CLIENTE, DISTINTA_DEUDA_PROBABLE" : k.mismaHuellaNombreCliente && k.mismoTotal ? "SOLO_NOMBRE+TOTAL (no concluyente: puede ser otro cliente o un cliente duplicado)" : "SOLO_COINCIDENCIA_PARCIAL (no concluyente)"; });
      informe.credito25 = Object.assign({ legacyId: 25, uuidNube: u25, clienteIdLocal: c25.clienteId == null ? null : c25.clienteId, clienteUuid: uCli,
        clienteEnCache: uCli && cacheTaller ? (cacheTaller._mapaUid[uCli] ? { idLocalCache: cacheTaller._mapaUid[uCli].local_id } : "no") : null,
        huella: await huella(c25), huellaContenido: await huella(contenido(c25)), campos: Object.keys(c25).sort(),
        enCacheMismoUuid: !!(cacheTaller && cacheTaller._mapaUid[u25]) }, r25, { candidatosEquivalentes: cand });
    } else informe.credito25 = Lg && typeof Lg === "object" ? "NO EXISTE el crédito legado 25 en este teléfono" : "sin base legado";

    /* ---------- E · abonos pendientes (registrar_abono_v2) ---------- */
    var AB = [];
    if (cacheTaller) {
      var abs = (cacheTaller._datos.outbox || []).filter(function (o) { return o && o.kind === "rpc" && o.rpc === "registrar_abono_v2"; });
      for (var ab of abs) {
        var p = ab.params || {}, uc2 = p.p_credito_id ? String(p.p_credito_id).toLowerCase() : null, fc = uc2 ? cacheTaller._filaPorUid[uc2] : null, crf = fc ? fc.row : null;
        var cliU2 = crf && crf.clienteId != null ? cacheTaller._uidDeLocal("clientes", crf.clienteId) : null;
        var reflejado = !!(crf && (crf.historialAbonos || []).some(function (h) { return h && num(h.monto) === num(p.p_monto) && (h.fechaISO === p.p_occurred_at || (typeof h.idAbono === "string" && h.idAbono.indexOf(String(ab.op_id)) >= 0)); }));
        var gemelos = abs.filter(function (o2) { return o2 !== ab && o2.params && String(o2.params.p_credito_id || "").toLowerCase() === uc2 && num(o2.params.p_monto) === num(p.p_monto); }).map(function (o2) { return o2.seq; });
        AB.push({ seq: ab.seq, op_id: uuidSeguro(ab.op_id), p_op: uuidSeguro(p.p_op), estado: ab.estado, creado: iso(ab.creado_en), ocurrio: fechaSegura(p.p_occurred_at), intentos: num(ab.intentos), error: errorSeguro(ab.error),
          creditoUuid: uuidSeguro(p.p_credito_id), creditoOrigenLegado: uc2 ? origenDeUuid[uc2] || null : null, monto: num(p.p_monto), metodo: await enumSeguro(p.p_metodo), device: uuidSeguro(p.p_device),
          creditoEnCache: crf ? { id: crf.id, confirmado: (crf._rev || 0) > 0 || !!crf._base, pend: !!crf._pend, total: num(crf.total), abonado: num(crf.abonado), saldo: num(crf.saldo), estado: await enumSeguro(crf.estado), fecha: fechaDe(crf),
            clienteUid: cliU2, clienteOrigenLegado: cliU2 ? origenDeUuid[cliU2] || null : null, clienteH: await corta(crf.clienteNombre), abonosEnCache: (crf.historialAbonos || []).length } : "el crédito NO está en la caché",
          esElCreditoLegado25: uc2 === (await uuidImportado("creditos", 25)), reflejadoEnCache: reflejado,
          mismoCreditoYMontoQue: gemelos.length ? gemelos : null });
      }
    }
    informe.abonosPendientes = AB;

    /* ---------- veredicto ---------- */
    var vered = {};
    if (Lg && typeof Lg === "object") Object.assign(vered, { operativosAhora: Lg.operativos, enRespaldo: 118, diferencia: Lg.operativos - 118, nuevos: Lg.nuevos.length, modificados: Lg.modificados.length,
      faltantes: Lg.faltantes.length, corruptos: Lg.corruptos.length, storesAusentes: Lg.storesAusentes.length, sinCambio: Lg.sinCambio,
      nuevosPosiblementeReales: Lg.nuevos.filter(function (x) { return !x.posibleEjemplo && !x.posibleDuplicadoDe; }).length });
    Object.keys(informe.cacheNube).forEach(function (k) {
      var rn2 = informe.cacheNube[k];
      vered[k] = { outboxTotal: rn2.outbox.length, outboxPorEstado: rn2.outboxPorEstado, noConfirmadas: rn2.noConfirmadas.length,
        noConfirmadasPorEntidad: rn2.noConfirmadas.reduce(function (a, x) { a[x.entidad] = (a[x.entidad] || 0) + 1; return a; }, {}), conflictos: rn2.conflictos.length, mapaInconsistente: rn2.mapaInconsistente.length,
        outboxDeOtroUsuario: usuarioGuardado ? rn2.outbox.filter(function (x) { return x.actorEsUsuarioGuardado === false; }).length : "sin usuario guardado" };
      delete rn2._mapaUid; delete rn2._uidDeLocal; delete rn2._datos; delete rn2._filaPorUid;
    });
    vered.credito25Candidatos = informe.credito25 && informe.credito25.candidatosEquivalentes ? informe.credito25.candidatosEquivalentes.map(function (x) { return (x.fuente === "outbox" ? "outbox seq " + x.seq : "caché crédito id " + x.id) + ": " + x.lectura; }) : [];
    vered.abonosPendientes = AB.length; vered.abonosReflejadosEnCache = AB.filter(function (x) { return x.reflejadoEnCache; }).length;
    vered.abonosPosiblementeRepetidos = AB.filter(function (x) { return x.mismoCreditoYMontoQue; }).map(function (x) { return x.seq; });
    informe.veredicto = vered;
    informe.completo = true;
    return informe;
  }

  /* El archivo: {informe, integridad}. integridad.sha256 = SHA-256 de JSON.stringify(informe), recalculable por quien lo reciba. */
  async function empaquetar(informe, cripto) {
    var txt = JSON.stringify(informe);
    var b = new Uint8Array(await cripto.subtle.digest("SHA-256", new TextEncoder().encode(txt))), h = "";
    for (var i = 0; i < b.length; i++) h += (b[i] < 16 ? "0" : "") + b[i].toString(16);
    return '{"informe":' + txt + ',"integridad":{"algoritmo":"SHA-256","sobre":"JSON.stringify(informe)","sha256":"' + h + '","completo":true,"fin":"' + FIN + '"}}';
  }

  global.DiagnosticoENTI = { generar: generar, empaquetar: empaquetar, FIN: FIN };

  // ---- página (solo en el navegador) ----
  if (typeof document === "undefined") return;
  var $ = function (id) { return document.getElementById(id); };
  var texto = "", NOMBRE = "ENTIMOTORS-diagnostico-119-v2.json";
  function lineas(inf) {
    var v = inf.veredicto || {}, out = [];
    if (typeof inf.legado313 === "string") out.push(inf.legado313);
    else out.push("Versión anterior: " + v.operativosAhora + " registros (respaldo del 25-sep: 118). Nuevos: " + v.nuevos + " · cambiados: " + v.modificados + " · faltan: " + v.faltantes + ".");
    var cn = v.entimotors_sync;
    if (cn) out.push("Nube en este teléfono: " + cn.outboxTotal + " operaciones sin enviar · " + cn.noConfirmadas + " registros sin confirmar.");
    out.push("Nada se modificó en este teléfono.");
    return out;
  }
  $("btnGenerar").addEventListener("click", async function () {
    $("btnGenerar").disabled = true; $("estado").textContent = "Leyendo… (no se cambia nada)";
    try {
      var inf = await generar({ indexedDB: global.indexedDB, crypto: global.crypto, localStorage: global.localStorage, origen: location.origin + location.pathname,
        controladoPorSW: !!(navigator.serviceWorker && navigator.serviceWorker.controller), agente: navigator.userAgent });
      texto = await empaquetar(inf, global.crypto);
      $("resumen").textContent = lineas(inf).join("\n");
      $("tamano").textContent = "Archivo listo: " + NOMBRE + " (" + Math.ceil(texto.length / 1024) + " KB).";
      $("resultado").hidden = false; $("estado").textContent = "Listo. Pulsa «Compartir archivo» (o «Descargar archivo») y envíalo a soporte.";
      var f = new File([texto], NOMBRE.replace(/\.json$/, ".txt"), { type: "text/plain" });
      $("btnCompartir").hidden = !(navigator.canShare && navigator.canShare({ files: [f] }));
    } catch (e) {
      $("estado").textContent = "No se pudo leer: " + (e && e.message ? e.message : e) + ". No se modificó nada.";
      $("btnGenerar").disabled = false;
    }
  });
  $("btnDescargar").addEventListener("click", function () {
    var url = URL.createObjectURL(new Blob([texto], { type: "application/json" }));
    var a = document.createElement("a"); a.href = url; a.download = NOMBRE; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
    $("estado").textContent = "Descargado en «Descargas» como " + NOMBRE + ". Envíalo a soporte como documento.";
  });
  $("btnCompartir").addEventListener("click", async function () {
    try { await navigator.share({ title: "Diagnóstico ENTIMOTORS v2", files: [new File([texto], NOMBRE.replace(/\.json$/, ".txt"), { type: "text/plain" })] }); }
    catch (e) { /* cancelado por la persona */ }
  });
  $("btnCopiar").addEventListener("click", async function () {
    try { await navigator.clipboard.writeText(texto); $("estado").textContent = "Copiado (" + texto.length + " caracteres). Mejor usa «Descargar archivo»: los mensajes largos se cortan."; }
    catch (e) { $("estado").textContent = "No se pudo copiar: usa «Descargar archivo»."; }
  });
})(typeof window !== "undefined" ? window : globalThis);
