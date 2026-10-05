/* ENTIMOTORS · PHONE_RESCUE · RESCATE Y RECONCILIACIÓN SEGURA DE LO QUE SOLO EXISTE EN ESTE TELÉFONO — herramienta TEMPORAL
 * ------------------------------------------------------------------------------------------------------------------------------
 * PREFLIGHT → BACKUP → READ → VALIDATE → DRY-RUN → RECONCILE → VERIFY → CLEANUP.   Si una fase falla: ABORT, sin pérdida.
 *
 *  · LEE (siempre en transacciones "readonly") las bases de ENTIMOTORS de este teléfono y el token de la sesión ya iniciada (no inicia
 *    ni renueva sesión, no toca el Service Worker ni las cachés).
 *  · Genera un RESPALDO descargable con todo lo necesario para reconstruir a mano (dos capas: evidencia de rescate + foto actual).
 *  · La reconciliación la hace el SERVIDOR en UNA transacción (phone_rescue_reconciliar): primero en modo dry-run (no escribe), después
 *    commit con las huellas del dry-run. Nunca reenvía las operaciones originales ni «guarda todo»: solo los renglones/crédito del plan.
 *  · ESCRIBE en el teléfono únicamente al final y únicamente esto: borra de la cola local las operaciones YA reconciliadas y verificadas
 *    (comprobando su identidad completa, no su número) y borra los registros de EJEMPLO de la 3.13 cuya huella coincide con la certificada.
 *  · No restaura fotos antiguas, no baja revisiones, no toca nada creado después del release: lo que no reconoce, no lo toca.
 */
(function (global) {
  "use strict";
  var ESPERADO = {"modo":"real","decision28":"REGISTRAR_COMO_CREDITO","dispositivo":"b63706fd-9a94-46b6-9de4-1fcec06a5ffa","ops":[{"seq":24,"op_id":"e67e156d-81f0-4a94-9cdb-d92ad474064f","rpc":"agregar_item_orden","orden":"c818c5ce-1ce4-843f-a833-36c4abf371a1","item_id":"73393f6b-315b-4c62-906c-dbc80f6a1e59","cantidad":4,"precio":70,"nombreH":"2b6177420782925a"},{"seq":25,"op_id":"8b1689b0-86fe-435f-9743-5ff904d1f912","rpc":"agregar_item_orden","orden":"c818c5ce-1ce4-843f-a833-36c4abf371a1","item_id":"b085b714-cbb5-479c-8771-a88a065d5ba9","cantidad":1,"precio":1200,"nombreH":"114405e51733ffa2"},{"seq":28,"op_id":"fee38b14-b43f-44b3-be36-8b476371148b","rpc":"registrar_credito","credito":"65ed9ecd-3e67-46d5-b2fa-dd2fac6883cb","cliente":"eb6bbca7-679f-4b95-8515-467150b44847","total":2280,"notaLongitud":29,"items":[{"item_id":"3c1a807d-0932-4f48-af43-7b94d4492b5f","cantidad":1,"precio":1400,"nombreH":"61b86cf4e1aab045"},{"item_id":"64788624-b6ff-48ec-862e-3947fa6a2a34","cantidad":1,"precio":480,"nombreH":"9932c2aac5bbade2"},{"item_id":"9a7c400f-fd51-4aa1-8910-ce9173e6f20d","cantidad":1,"precio":220,"nombreH":"8f606a4d88ec314a"},{"item_id":"2a539216-e1c8-4a35-aa71-5ada48b98521","cantidad":1,"precio":180,"nombreH":"a38cad24fc8ab5a7"}]}],"record119":{"credito":"c4c1a0e8-70f0-8aa3-91d0-f4cb3d1e5c0b","cliente":"78811e29-46dd-8262-9ef4-6d49019ab27b"},"filasCache":{"auditoria":0,"blobs":0,"caja_movimientos":30,"categorias_inv":2,"citas":3,"clientes":26,"conflictos":0,"cotizaciones":1,"creditos":27,"cursores":10,"inventario":4,"mapa":112,"meta":2,"motos":7,"ordenes":8,"outbox":5,"ventas_rapidas":4,"web_cms":0},"legadoEjemplo":{"clientes":{"1":"9472a5012f30da84c5e5360c63bfdd1325b3852281f560158041d91063e03be3","2":"b3cd61e81d44c4e49350d802c8c14eb2f94da5c793e1abaa6ddb1f17ba637080","3":"ec449dbf1fdd076d5cdf9041c2f94d5e395094d5a4ce326ab03978e096336bb9"},"motos":{"1":"e5c46b61fb88e1f1cf3c55e224b5082b64dd10c7e93798f8cb140b7fd5ccbaae","2":"c9746dbbb67509d8aaaa1741108460269664f3bf28e37c4f617d33e9aa84ef23","3":"111694740f3a4496111598c2b23134e20e7688779232fe29f9b10479c37f3dc9"},"ordenes":{"1":"9df37595dfae5d9028ebf5563dc4a08c3337c5e49fd862c309c569e5aa56b9d1","2":"c52f30e8496d40379c858080d3ba9e7bf093526fb43a1810fe45f479b409e889","3":"1e5c4096f55c2828d01b936e4c17f0010a4c5376af05bc81a95e9766db8f7b91"},"inventario":{"1":"f131e2d5a4454dcdd13696aee4ab5a5a40c42c7be9e1a95eca2f222c642498f8","3":"b9f7bb02f53275b5a2302f283d394831ebefdde50823258ea082cd3c3aaee292"},"categorias_inv":{"1":"dd04ce169c716e6658f462f871cc53ef39f18b6a031beb1ae3f19495f9adbdbd","3":"0679b148a011c321fcddf5d18f5effeea2e2617785b1fb881e754a4c427f0ce8","4":"db7c65e5bfecd55fdf1e978e608d67a4e5a7f2bee4fcdc591b5fdb7df27be35d"},"ventas_rapidas":{"1":"6800c47a925ff6eeba0dd63e76dd122e399d7a3f8c49a31f7caeaea0a74fb6b4"},"caja_movimientos":{"1":"bc16c60e13813a152d01b88fbd5a8d4bfad3090daa1bc0095207d18831fe4b9d","2":"e60851d1d972bd1640bc877b8cfcfdea19374e7f9ec00660b967a2b389feb785","3":"cc02b2e1b2a00bd5b15ede3371f69011e1c818a96fdcd1f80da3ee7939883b74"}}};
  var VERSION = "entimotors-phone-rescue v1";
  var FIN = "FIN-RESPALDO-ENTIMOTORS-PHONE-RESCUE-1";
  var LEGADO_OPERATIVOS = ["clientes", "motos", "ordenes", "inventario", "citas", "cotizaciones", "ventas_rapidas", "caja_movimientos", "creditos", "categorias_inv"];
  var TABLA_NUBE = { clientes: "clientes", motos: "motos", ordenes: "ordenes", inventario: "inventario", citas: "citas", cotizaciones: "cotizaciones",
    ventas_rapidas: "ventas", caja_movimientos: "caja_movimientos", creditos: "creditos", categorias_inv: "categorias_inv" };
  var CLAVE_SESION = "entimotors_sb_sesion";

  function Abortar(fase, codigo, mensaje, extra) { var e = new Error(mensaje || codigo); e.abortar = true; e.fase = fase; e.codigo = codigo; e.extra = extra || null; return e; }
  function canon(v) {
    if (v === undefined) return "null";
    if (v === null || typeof v !== "object") return JSON.stringify(v);
    if (Array.isArray(v)) return "[" + v.map(canon).join(",") + "]";
    return "{" + Object.keys(v).sort().map(function (k) { return JSON.stringify(k) + ":" + canon(v[k]); }).join(",") + "}";
  }

  function crear(env) {
    var idb = env.indexedDB, cripto = env.crypto, enc = new TextEncoder();
    var ahora = env.ahora || function () { return new Date(); };
    var pedirRed = env.fetch;
    var hex = async function (t) { var b = new Uint8Array(await cripto.subtle.digest("SHA-256", typeof t === "string" ? enc.encode(t) : t)); var s = ""; for (var i = 0; i < b.length; i++) s += (b[i] < 16 ? "0" : "") + b[i].toString(16); return s; };
    var corta = async function (t) { return t == null || t === "" ? null : (await hex(String(t).trim().toLowerCase())).slice(0, 16); };
    var uuidDeTexto = async function (t) { var h = await hex(t); return h.slice(0, 8) + "-" + h.slice(8, 12) + "-4" + h.slice(13, 16) + "-8" + h.slice(17, 20) + "-" + h.slice(20, 32); };
    var bitacora = [];
    var anotar = function (fase, texto, datos) { var l = { t: ahora().toISOString(), fase: fase, texto: texto }; if (datos !== undefined) l.datos = datos; bitacora.push(l); if (env.onPaso) { try { env.onPaso(l); } catch (e) { /* la pantalla no rompe el proceso */ } } };

    /* ───────────── lectura local (solo lectura) ───────────── */
    var abrir = function (nombre, version) {
      return new Promise(function (ok, mal) {
        var q = idb.open(nombre, version);
        q.onupgradeneeded = function () { try { q.transaction.abort(); } catch (e) { /* nada */ } mal(Abortar("READ", "ESQUEMA", "Se pidió cambiar el esquema de " + nombre + ": no se abrió")); };
        q.onblocked = function () { mal(Abortar("READ", "BLOQUEADA", "La base " + nombre + " está bloqueada")); };
        q.onsuccess = function () { ok(q.result); }; q.onerror = function () { mal(q.error); };
      });
    };
    var pedir = function (q) { return new Promise(function (ok, mal) { q.onsuccess = function () { ok(q.result); }; q.onerror = function () { mal(q.error); }; }); };
    async function serializar(v) {
      if (v === null || v === undefined || typeof v !== "object") return v === undefined ? null : v;
      if (typeof Blob !== "undefined" && v instanceof Blob) { var u = new Uint8Array(await v.arrayBuffer()), s = ""; for (var i = 0; i < u.length; i++) s += String.fromCharCode(u[i]); return { __blob: true, tipo: v.type, bytes: u.length, sha256: await hex(u), b64: btoa(s) }; }
      if (v instanceof Date) return { __fecha: v.toISOString() };
      if (Array.isArray(v)) { var a = []; for (var j = 0; j < v.length; j++) a.push(await serializar(v[j])); return a; }
      var o = {}; var ks = Object.keys(v); for (var k = 0; k < ks.length; k++) o[ks[k]] = await serializar(v[ks[k]]); return o;
    }
    /** Lee TODO (bases de ENTIMOTORS) → { volcado, huella, crudo:{legado, sync} }. No escribe. */
    async function leerLocal() {
      if (typeof idb.databases !== "function") throw Abortar("PREFLIGHT", "NAVEGADOR", "Este navegador no permite listar las bases: no se abrió nada");
      var lista = await idb.databases(), versiones = {};
      // todas las bases de ENTIMOTORS de este navegador entran en el respaldo y en la huella (también la caché de un mecánico, si la hubiera)
      lista.forEach(function (d) { if (/^entimotors/.test(String(d.name))) versiones[d.name] = d.version; });
      if (!versiones.entimotors_sync) throw Abortar("PREFLIGHT", "SIN_APP", "En este navegador no está ENTIMOTORS (no existe entimotors_sync): no se abrió nada");
      var volcado = { bases: {} }, crudo = {};
      var nombres = Object.keys(versiones).sort();
      for (var b = 0; b < nombres.length; b++) {
        var nombre = nombres[b];
        var db = await abrir(nombre, versiones[nombre]);
        try {
          var B = volcado.bases[nombre] = { version: db.version, stores: {} }; crudo[nombre] = {};
          var stores = Array.prototype.slice.call(db.objectStoreNames).sort();
          for (var s = 0; s < stores.length; s++) {
            var os = db.transaction(stores[s], "readonly").objectStore(stores[s]);
            var filas = await pedir(os.getAll()), llaves = await pedir(os.getAllKeys());
            crudo[nombre][stores[s]] = filas;
            B.stores[stores[s]] = { llave: os.keyPath, filas: await serializar(filas), llaves: llaves };
          }
        } finally { db.close(); }
      }
      return { volcado: volcado, huella: await hex(canon(volcado)), crudo: crudo };
    }

    /* ───────────── sesión y red ───────────── */
    function sesion() {
      var crudo = null; try { crudo = env.localStorage.getItem(CLAVE_SESION); } catch (e) { /* sin almacenamiento */ }
      var s = null; try { s = crudo ? JSON.parse(crudo) : null; } catch (e) { s = null; }
      if (!s || !s.access_token) throw Abortar("PREFLIGHT", "SIN_SESION", "No hay una sesión iniciada en ENTIMOTORS en este teléfono. Abre la app, entra como administrador, espera «En línea», ciérrala y vuelve aquí.");
      if (s.expires_at && s.expires_at * 1000 < ahora().getTime() + 120000) throw Abortar("PREFLIGHT", "SESION_CADUCADA", "La sesión está por caducar. Abre la app, espera «En línea», ciérrala y vuelve aquí. (Esta página no renueva la sesión.)");
      var sub = null; try { sub = JSON.parse(atob(s.access_token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).sub || null; } catch (e) { sub = null; }
      return { token: s.access_token, uid: sub };
    }
    async function rpc(nombre, params, ms) {
      var s = sesion(), corta2 = typeof AbortController !== "undefined" ? new AbortController() : null, tm = corta2 ? setTimeout(function () { corta2.abort(); }, ms || 30000) : null;
      try {
        var r = await pedirRed(env.config.url + "/rest/v1/rpc/" + nombre, { method: "POST", signal: corta2 ? corta2.signal : undefined,
          headers: { "Content-Type": "application/json", apikey: env.config.anonKey, Authorization: "Bearer " + s.token }, body: JSON.stringify(params) });
        var txt = await r.text(), datos = null; try { datos = txt ? JSON.parse(txt) : null; } catch (e) { datos = null; }
        if (r.ok) return { ok: true, status: r.status, datos: datos };
        var clase = r.status === 401 ? "auth" : r.status === 403 ? "permiso" : r.status === 409 ? "conflicto" : r.status >= 500 ? "servidor" : "rechazo";
        return { ok: false, status: r.status, clase: clase, codigo: datos && datos.code || String(r.status), mensaje: String(datos && datos.message || txt || "").slice(0, 400) };
      } catch (e) { return { ok: false, status: 0, clase: "red", codigo: "RED", mensaje: String(e && e.message || e).slice(0, 200) }; }
      finally { if (tm) clearTimeout(tm); }
    }

    /* ───────────── análisis: qué hay, qué es y qué se haría ───────────── */
    function porUid(sync, uid, store) {
      var m = (sync.mapa || []).filter(function (x) { return x.uid === uid; })[0];
      if (!m) return null;
      return (sync[store] || []).filter(function (x) { return x.id === m.local_id; })[0] || null;
    }
    /** Plan «de consulta»: las operaciones conocidas, solo con identificadores (para preguntar al servidor por su estado). */
    function planDeConsulta(device) {
      return { version: 1, device: device, lote: null, acciones: ESPERADO.ops.map(function (e) {
        return e.rpc === "agregar_item_orden" ? { tipo: e.rpc, op_original: e.op_id, params: { p_orden_id: e.orden, p_item_id: e.item_id } }
          : { tipo: e.rpc, op_original: e.op_id, params: { p_credito_id: e.credito, p_cliente_id: e.cliente } }; }) };
    }
    async function analizar(local, servidor, presentesLegado, opciones) {
      var sync = local.crudo.entimotors_sync || {}, legado = local.crudo.entimotors_os_demo || null;
      var metaDev = (sync.meta || []).filter(function (m) { return m.k === "device_id"; })[0];
      var device = metaDev ? metaDev.v : null;
      var outbox = (sync.outbox || []).slice().sort(function (a, b) { return a.seq - b.seq; });
      var R = { dispositivo: device, operaciones: [], otrasOperaciones: [], grupos: {}, legado: null, clasificacion: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 }, detalle: [] };
      var conocidas = {};
      for (var i = 0; i < ESPERADO.ops.length; i++) {
        var e = ESPERADO.ops[i], op = outbox.filter(function (x) { return x.op_id === e.op_id; })[0] || null, p = op && op.params || {};
        conocidas[e.op_id] = true;
        var x = { op_id: e.op_id, rpc: e.rpc, seq: op ? op.seq : null, grupo: e.rpc === "agregar_item_orden" ? "orden:" + e.orden : "credito:" + e.credito, enCola: !!op, accion: null, motivo: null, clase: null, params: null, huellaFila: op ? await hex(canon(await serializar(op))) : null };
        var srvRet = servidor.retenidas && servidor.retenidas[e.op_id], srvDer = !!(servidor.derivadas && servidor.derivadas[e.op_id]);
        var malo = function (clase, motivo) { x.accion = "ABORT"; x.clase = clase; x.motivo = motivo; };
        if (!op) {
          // ya no está en la cola de este teléfono
          var enNube = e.rpc === "agregar_item_orden" ? !!(servidor.ordenes[e.orden] && servidor.ordenes[e.orden].items.some(function (it) { return it.id === e.item_id; })) : !!servidor.creditos[e.credito];
          x.accion = enNube ? "YA_RECONCILIADA" : "AUSENTE"; x.clase = "D"; x.motivo = enNube ? "su información ya está en la nube y ya no está en la cola" : "no está en la cola de este teléfono y tampoco en la nube";
        } else if (op.estado !== "rejected" || op.kind !== "rpc" || op.rpc !== e.rpc) malo("E", "la operación ya no está rechazada o cambió de tipo (" + op.estado + "/" + op.rpc + ")");
        else if (device !== ESPERADO.dispositivo || op.device_id !== ESPERADO.dispositivo) malo("E", "este no es el dispositivo de la operación");
        else if (!srvRet || srvRet.kind !== "record119_retenida" || srvRet.device_id !== device) malo("E", "el servidor no la tiene retenida para este dispositivo");
        else if (e.rpc === "agregar_item_orden") {
          var ord = porUid(sync, e.orden, "ordenes"), itLocal = ord ? (ord.items || []).filter(function (it) { return it.uid === e.item_id; })[0] : null, so = servidor.ordenes[e.orden];
          var yaNube = so ? so.items.filter(function (it) { return it.id === e.item_id; })[0] : null;
          if (p.p_orden_id !== e.orden || p.p_item_id !== e.item_id || Number(p.p_cantidad) !== e.cantidad || Number(p.p_precio) !== e.precio || (p.p_inventario_id || null) !== null) malo("E", "los datos de la operación no coinciden con la evidencia conocida");
          else if (typeof p.p_nombre !== "string" || (await corta(p.p_nombre)) !== e.nombreH) malo("E", "el texto del renglón no coincide con su huella conocida");
          else if (!ord) malo("E", "la orden no está en este teléfono");
          else if (!itLocal || itLocal.nombre !== p.p_nombre || Number(itLocal.cantidad) !== e.cantidad || Number(itLocal.precio) !== e.precio) malo("E", "el renglón de la orden local no coincide con la operación (¿se editó?)");
          else if (!so || so.borrada) malo("E", "la orden ya no existe en la nube");
          else if (so.finalizada || so.anulada) malo("E", "la orden está cerrada en la nube: no admite renglones");
          else if (yaNube) { if (yaNube.nombre === p.p_nombre.trim() && Number(yaNube.cantidad) === e.cantidad && Number(yaNube.precio) === e.precio) { x.accion = "RECONCILIAR"; x.clase = "D"; x.motivo = "el renglón ya está en la nube con el mismo contenido: solo falta limpiar aquí"; x.yaEnNube = true; } else malo("E", "el renglón ya existe en la nube con OTRO contenido"); }
          else if (so.presupuesto_estado !== "pendiente") malo("E", "el presupuesto de la orden ya no está pendiente (" + so.presupuesto_estado + "): agregarle renglones necesita decisión");
          else if (so.items.some(function (it) { return String(it.nombre).trim().toLowerCase() === p.p_nombre.trim().toLowerCase() && Number(it.cantidad) === e.cantidad && Number(it.precio) === e.precio; })) malo("E", "la orden ya tiene en la nube un renglón igual con otro identificador (posible duplicado)");
          else { x.accion = "RECONCILIAR"; x.clase = "B"; x.motivo = "renglón que solo existe aquí → se agrega a la orden en la nube con su mismo identificador"; }
          if (x.accion === "RECONCILIAR") x.params = { p_orden_id: e.orden, p_inventario_id: null, p_nombre: p.p_nombre, p_cantidad: e.cantidad, p_precio: e.precio, p_item_id: e.item_id, p_offline: !!p.p_offline, p_occurred_at: p.p_occurred_at || null, p_tipo: p.p_tipo || null };
          x.resumen = { orden: e.orden, item: e.item_id, cantidad: e.cantidad, precio: e.precio, importe: e.cantidad * e.precio, ordenLocal: ord ? { id: ord.id, renglones: (ord.items || []).length, total: (ord.items || []).reduce(function (a, it) { return a + it.cantidad * it.precio; }, 0) } : null,
            ordenNube: so ? { rev: so.rev, estado: so.estado, presupuesto: so.presupuesto_estado, renglones: so.items.length, total: so.items.reduce(function (a, it) { return a + Number(it.cantidad) * Number(it.precio); }, 0) } : null };
        } else {
          var cr = porUid(sync, e.credito, "creditos"), its = Array.isArray(p.p_items) ? p.p_items : [], sc = servidor.creditos[e.credito], scl = servidor.clientes[e.cliente];
          var total = its.reduce(function (a, it) { return a + Number(it.cantidad) * Number(it.precio); }, 0), okItems = its.length === e.items.length;
          for (var j = 0; okItems && j < its.length; j++) okItems = its[j].item_id === e.items[j].item_id && Number(its[j].precio) === e.items[j].precio && Number(its[j].cantidad) === e.items[j].cantidad && (its[j].inventario_id || null) === null && typeof its[j].nombre === "string" && (await corta(its[j].nombre)) === e.items[j].nombreH;
          var nota = typeof p.p_nota === "string" ? p.p_nota : "";
          if (p.p_credito_id !== e.credito || p.p_cliente_id !== e.cliente || total !== e.total || Number(p.p_abono_inicial || 0) !== 0 || (p.p_orden_id || null) !== null) malo("E", "los datos de la operación no coinciden con la evidencia conocida");
          else if (e.credito === ESPERADO.record119.credito || e.cliente === ESPERADO.record119.cliente) malo("E", "coincide con RECORD_119: no se toca");
          else if (!okItems) malo("E", "los conceptos no coinciden con sus huellas conocidas");
          else if (nota.length !== e.notaLongitud) malo("E", "la nota no coincide con la evidencia conocida");
          else if (!cr) malo("E", "el crédito no está en este teléfono");
          else if (Number(cr.total) !== e.total || (cr.items || []).length !== its.length || (cr.items || []).some(function (it, k) { return it.nombre !== its[k].nombre || Number(it.precio) !== Number(its[k].precio); }) || (cr.nota || "") !== nota) malo("E", "el crédito local no coincide con la operación (¿se editó?)");
          else if (sc) { if (Number(sc.total) === e.total && sc.cliente_id === e.cliente && !sc.anulado && sc.items.length === its.length && sc.items.every(function (it) { return its.some(function (o2) { return o2.item_id === it.id && o2.nombre.trim() === it.nombre && Number(o2.precio) === Number(it.precio); }); })) { x.accion = "RECONCILIAR"; x.clase = "D"; x.motivo = "el crédito ya está en la nube con el mismo contenido: solo falta limpiar aquí"; x.yaEnNube = true; } else malo("E", "el crédito ya existe en la nube con OTRO contenido"); }
          else if (!scl || scl.borrado) malo("E", "el cliente del crédito no existe en la nube");
          else if ((servidor.creditos_del_cliente || []).some(function (c) { return !c.anulado && Number(c.total) === e.total; })) malo("E", "ese cliente ya tiene en la nube otro crédito por el mismo importe (posible duplicado registrado a mano)");
          else if (opciones.decision28 === "REGISTRAR_COMO_CREDITO") { x.accion = "RECONCILIAR"; x.clase = "B"; x.motivo = "crédito que solo existe aquí → se registra en la nube con su mismo identificador (decisión del propietario: registrar como crédito por cobrar)"; }
          else if (opciones.decision28 === "MANTENER_EN_ESPERA") { x.accion = "MANTENER"; x.clase = "B"; x.motivo = "decisión del propietario: sigue en espera (queda respaldado y protegido en este teléfono)"; }
          else malo("F", "DECISION_REQUERIDA: falta la decisión expresa del propietario sobre el crédito (registrar como crédito por cobrar, o mantener en espera)");
          if (x.accion === "RECONCILIAR") x.params = { p_cliente_id: e.cliente, p_cliente_nombre: p.p_cliente_nombre, p_cliente_telefono: p.p_cliente_telefono == null ? null : p.p_cliente_telefono,
            p_items: its.map(function (it) { return { item_id: it.item_id, inventario_id: null, nombre: it.nombre, cantidad: Number(it.cantidad), precio: Number(it.precio) }; }),
            p_vencimiento: p.p_vencimiento || null, p_nota: p.p_nota == null ? null : p.p_nota, p_abono_inicial: 0, p_abono_metodo: null, p_occurred_at: p.p_occurred_at || null, p_offline: !!p.p_offline, p_credito_id: e.credito, p_origen: p.p_origen || null, p_orden_id: null };
          x.resumen = { credito: e.credito, cliente: e.cliente, total: total, conceptos: its.length, notaLongitud: nota.length, creditoLocal: cr ? { id: cr.id, total: cr.total, saldo: cr.saldo, estado: cr.estado, rev: cr._rev } : null, enNube: !!sc };
        }
        R.operaciones.push(x); R.clasificacion[x.clase] = (R.clasificacion[x.clase] || 0) + 1;
        (R.grupos[x.grupo] = R.grupos[x.grupo] || []).push(x);
      }
      // un grupo (los renglones de UNA orden) se reconcilia entero o no se toca
      Object.keys(R.grupos).forEach(function (g) {
        var ops = R.grupos[g], hayAbort = ops.some(function (o) { return o.accion === "ABORT"; });
        if (hayAbort) ops.forEach(function (o) { if (o.accion === "RECONCILIAR") { o.accion = "ABORT"; o.motivo = "otra operación del mismo registro no se puede reconciliar: no se hace a medias (" + o.motivo + ")"; o.params = null; } });
      });
      // el resto de la cola: nada de esto se toca
      outbox.forEach(function (op) {
        if (conocidas[op.op_id]) return;
        var pend = op.estado === "pending" || op.estado === "syncing" || op.estado === "conflict";
        var clase = pend ? "A" : "F";
        R.otrasOperaciones.push({ seq: op.seq, op_id: op.op_id, estado: op.estado, rpc: op.rpc || null, kind: op.kind, entidad: op.entidad, clase: clase,
          nota: pend ? "actividad del taller todavía sin subir: no se toca" : "no pertenece a este rescate: se deja como está" });
        R.clasificacion[clase]++;
      });
      R.pendientesSinSubir = R.otrasOperaciones.filter(function (o) { return o.clase === "A"; }).length;
      // filas locales sin confirmar por la nube
      var entidades = ["clientes", "motos", "ordenes", "inventario", "citas", "cotizaciones", "ventas_rapidas", "creditos", "categorias_inv"];
      var conocidasUid = {}; ESPERADO.ops.forEach(function (e2) { conocidasUid[e2.orden || e2.credito] = true; });
      entidades.forEach(function (st) { (sync[st] || []).forEach(function (f) {
        if (!f || !(f._pend || !(f._rev > 0))) return;
        var clase = conocidasUid[f.uid] ? "B" : outbox.some(function (o) { return o.uid === f.uid && (o.estado === "pending" || o.estado === "syncing"); }) ? "A" : "F";
        R.detalle.push({ que: "fila local sin confirmar", store: st, id: f.id, uid: f.uid || null, clase: clase }); if (!conocidasUid[f.uid]) R.clasificacion[clase]++;
      }); });
      // diferencias con la foto antigua (solo CLASIFICA; la foto antigua es evidencia, no un estado a restaurar)
      var antes = ESPERADO.filasCache || {}, dif = {};
      Object.keys(antes).forEach(function (st) { var n = (sync[st] || []).length; if (n !== antes[st]) dif[st] = { antes: antes[st], ahora: n }; });
      R.diferenciasConFotoAntigua = { cache: dif, nota: "Filas de más/menos respecto al diagnóstico del 3-oct = actividad posterior del taller (clase A): no se tocan." };
      // legado 3.13
      if (legado) {
        var L = { total: 0, A: [], B: [], C: [], D: [], conteos: {} };
        for (var s = 0; s < LEGADO_OPERATIVOS.length; s++) {
          var st2 = LEGADO_OPERATIVOS[s], filas = legado[st2] || []; L.conteos[st2] = filas.length;
          for (var f2 = 0; f2 < filas.length; f2++) {
            var fila = filas[f2]; if (!fila || fila.id === undefined || fila.id === null) continue; L.total++;
            var uuid = await env.Import313.uuidDe(TABLA_NUBE[st2], fila.id), enNube2 = !!(presentesLegado && presentesLegado[uuid]);
            var huella = await hex(JSON.stringify(fila)), cert = ESPERADO.legadoEjemplo[st2] && ESPERADO.legadoEjemplo[st2][String(fila.id)];
            var reg = { store: st2, id: fila.id, uuid: uuid, huella: huella };
            if (enNube2) L.B.push(reg);
            else if (cert && cert === huella) L.A.push(reg);
            else { reg.motivo = cert ? "era un dato de ejemplo certificado pero su contenido CAMBIÓ" : "no está en la nube y no es un dato de ejemplo certificado"; L.D.push(reg); }
          }
        }
        R.legado = L; R.clasificacion.C += 0;
      }
      return R;
    }
    async function construirPlan(analisis) {
      var acciones = analisis.operaciones.filter(function (o) { return o.accion === "RECONCILIAR"; });
      if (!acciones.length) return null;
      var lote = await uuidDeTexto("phone-rescue:v1:" + analisis.dispositivo + ":" + acciones.map(function (o) { return o.op_id; }).sort().join(","));
      return { version: 1, lote: lote, device: analisis.dispositivo, acciones: acciones.map(function (o) {
        var a = { tipo: o.rpc, op_original: o.op_id, params: o.params }; if (o.rpc === "registrar_credito") a.decision = "REGISTRAR_COMO_CREDITO"; return a; }) };
    }

    /* ───────────── respaldo ───────────── */
    async function construirRespaldo(local, servidor, analisis, plan) {
      var sync = local.crudo.entimotors_sync || {}, legado = local.crudo.entimotors_os_demo || {};
      var ops = [], filas = [];
      for (var i = 0; i < analisis.operaciones.length; i++) {
        var o = analisis.operaciones[i]; if (!o.enCola) continue;
        var fila = (sync.outbox || []).filter(function (x) { return x.op_id === o.op_id; })[0];
        ops.push({ op_id: o.op_id, seq: o.seq, huellaFila: o.huellaFila, accion: o.accion, motivo: o.motivo, fila: await serializar(fila) });
        var e = ESPERADO.ops.filter(function (x) { return x.op_id === o.op_id; })[0], st = e.rpc === "agregar_item_orden" ? "ordenes" : "creditos", uid = e.orden || e.credito;
        if (!filas.some(function (x) { return x.uid === uid; })) { var loc = porUid(sync, uid, st); filas.push({ store: st, uid: uid, fila: await serializar(loc) }); }
      }
      var ejemplos = [];
      if (analisis.legado) for (var k = 0; k < analisis.legado.A.length; k++) { var r = analisis.legado.A[k]; ejemplos.push({ store: r.store, id: r.id, uuid: r.uuid, huella: r.huella, fila: (legado[r.store] || []).filter(function (x) { return x.id === r.id; })[0] }); }
      var respaldo = {
        herramienta: VERSION, generadoEn: ahora().toISOString(), dispositivo: analisis.dispositivo,
        aviso: "PRIVADO. Contiene datos del taller. Sirve para reconstruir a mano lo que esta herramienta reconcilia o limpia. Es EVIDENCIA: no es un estado para restaurar encima de la app.",
        LOCAL_HASH_BEFORE: local.huella,
        RESCUE_EVIDENCE_BACKUP: { operaciones: ops, registrosLocales: filas, legadoEjemplo: ejemplos,
          legadoResumen: analisis.legado ? { total: analisis.legado.total, enNube: analisis.legado.B.length, ejemploCertificado: analisis.legado.A.length, ambiguos: analisis.legado.D } : null },
        CURRENT_PRE_RECONCILIATION_BACKUP: { telefono: local.volcado, servidor: servidor, analisis: { operaciones: analisis.operaciones.map(function (o2) { return { op_id: o2.op_id, seq: o2.seq, accion: o2.accion, clase: o2.clase, motivo: o2.motivo, resumen: o2.resumen }; }),
          otrasOperaciones: analisis.otrasOperaciones, clasificacion: analisis.clasificacion, detalle: analisis.detalle, diferenciasConFotoAntigua: analisis.diferenciasConFotoAntigua }, plan: plan },
      };
      var txt = JSON.stringify(respaldo), h = await hex(txt);
      var archivo = '{"respaldo":' + txt + ',"integridad":{"algoritmo":"SHA-256","sobre":"JSON.stringify(respaldo)","sha256":"' + h + '","completo":true,"fin":"' + FIN + '"}}';
      // relectura del propio archivo: completo y con la misma huella
      var re = JSON.parse(archivo), completo = re.integridad.fin === FIN && re.integridad.completo === true && (await hex(JSON.stringify(re.respaldo))) === h;
      return { archivo: archivo, huella: h, completo: completo, evidencia: { herramienta: VERSION, generadoEn: respaldo.generadoEn, dispositivo: respaldo.dispositivo, LOCAL_HASH_BEFORE: local.huella, BACKUP_HASH: h, RESCUE_EVIDENCE_BACKUP: respaldo.RESCUE_EVIDENCE_BACKUP } };
    }

    /* ───────────── verificación en la nube ───────────── */
    function verificarNube(servidor, analisis) {
      var faltan = [];
      analisis.operaciones.forEach(function (o) {
        if (o.accion !== "RECONCILIAR") return;
        var e = ESPERADO.ops.filter(function (x) { return x.op_id === o.op_id; })[0];
        if (e.rpc === "agregar_item_orden") {
          var so = servidor.ordenes[e.orden], it = so && so.items.filter(function (x) { return x.id === e.item_id; })[0];
          if (!it || it.nombre !== o.params.p_nombre.trim() || Number(it.cantidad) !== e.cantidad || Number(it.precio) !== e.precio || it.inventario_id) faltan.push(o.op_id + ": el renglón no está en la nube con su contenido");
          if (so && so.items.filter(function (x) { return x.id === e.item_id; }).length !== 1) faltan.push(o.op_id + ": renglón duplicado");
        } else {
          var sc = servidor.creditos[e.credito];
          if (!sc || Number(sc.total) !== e.total || sc.cliente_id !== e.cliente || sc.anulado || sc.items.length !== o.params.p_items.length || (sc.nota || "") !== (o.params.p_nota || "")
              || !o.params.p_items.every(function (p) { return sc.items.some(function (x) { return x.id === p.item_id && x.nombre === p.nombre.trim() && Number(x.precio) === p.precio && Number(x.cantidad) === p.cantidad; }); })) faltan.push(o.op_id + ": el crédito no está en la nube con su contenido");
        }
      });
      if (JSON.stringify(servidor.invariantes.stock) !== "[]" || JSON.stringify(servidor.invariantes.dinero) !== "[]") faltan.push("invariantes no vacías");
      return faltan;
    }

    /* ───────────── limpieza local (lo ÚNICO que se escribe en el teléfono) ───────────── */
    function transaccion(db, stores, fn) {
      return new Promise(function (ok, mal) {
        var t = db.transaction(stores, "readwrite"), res;
        t.oncomplete = function () { ok(res); }; t.onerror = function () { mal(t.error); }; t.onabort = function () { mal(t.error || Abortar("CLEANUP", "TRANSACCION", "la transacción local se deshizo")); };
        Promise.resolve().then(function () { return fn(t); }).then(function (r) { res = r; }, function (e) { try { t.abort(); } catch (x) { /* ya */ } mal(e); });
      });
    }
    /** Borra de la cola SOLO las operaciones dadas, comprobando la huella completa de cada fila. Todas o ninguna. */
    async function limpiarCola(local, ops) {
      if (!ops.length) return [];
      var db = await abrir("entimotors_sync", local.volcado.bases.entimotors_sync.version);
      try {
        // la identidad completa se comprueba ANTES de abrir la transacción de escritura (el digest es asíncrono y la soltaría);
        // dentro de la transacción se vuelve a comparar cada fila, byte a byte, con lo que se acaba de comprobar
        var pre = {}, os0 = db.transaction("outbox", "readonly").objectStore("outbox");
        var actuales = await Promise.all(ops.map(function (o) { return pedir(os0.get(o.seq)); }));
        for (var i = 0; i < ops.length; i++) {
          var fila = actuales[i];
          if (!fila || fila.op_id !== ops[i].op_id || fila.estado !== "rejected" || (await hex(canon(await serializar(fila)))) !== ops[i].huellaFila) throw Abortar("CLEANUP", "IDENTIDAD", "la operación " + ops[i].op_id + " ya no es la que se respaldó: no se borró ninguna");
          pre[ops[i].seq] = canon(fila);
        }
        return await transaccion(db, ["outbox"], async function (t) {
          var os = t.objectStore("outbox"), hechas = [];
          for (var j = 0; j < ops.length; j++) { var f2 = await pedir(os.get(ops[j].seq)); if (!f2 || canon(f2) !== pre[ops[j].seq]) throw Abortar("CLEANUP", "IDENTIDAD", "la cola cambió durante la limpieza: no se borró ninguna"); await pedir(os.delete(ops[j].seq)); hechas.push(ops[j].seq); }
          return hechas;
        });
      } finally { db.close(); }
    }
    /** Borra del legado 3.13 SOLO los registros de ejemplo certificados (huella exacta). Todos o ninguno. */
    async function limpiarLegado(local, regs) {
      if (!regs.length) return 0;
      var db = await abrir("entimotors_os_demo", local.volcado.bases.entimotors_os_demo.version);
      try {
        var stores = regs.map(function (r) { return r.store; }).filter(function (s, i, a) { return a.indexOf(s) === i; });
        // las huellas se calculan ANTES de abrir la transacción de escritura (el digest es asíncrono y la soltaría)
        var pre = {};
        for (var i = 0; i < stores.length; i++) { var filas = await pedir(db.transaction(stores[i], "readonly").objectStore(stores[i]).getAll()); for (var k = 0; k < filas.length; k++) pre[stores[i] + ":" + filas[k].id] = JSON.stringify(filas[k]); }
        for (var r0 = 0; r0 < regs.length; r0++) { var c = pre[regs[r0].store + ":" + regs[r0].id]; if (c === undefined || (await hex(c)) !== regs[r0].huella) throw Abortar("CLEANUP", "IDENTIDAD_LEGADO", "el registro de ejemplo " + regs[r0].store + " #" + regs[r0].id + " cambió: no se borró ninguno"); }
        return await transaccion(db, stores, async function (t) {
          for (var j = 0; j < regs.length; j++) { var os = t.objectStore(regs[j].store), f = await pedir(os.get(regs[j].id)); if (!f || JSON.stringify(f) !== pre[regs[j].store + ":" + regs[j].id]) throw Abortar("CLEANUP", "IDENTIDAD_LEGADO", "el legado cambió durante la limpieza"); await pedir(os.delete(regs[j].id)); }
          return regs.length;
        });
      } finally { db.close(); }
    }
    /** Diferencia fila a fila entre dos volcados → { quitadas, agregadas, cambiadas } (listas "base/almacén/llave"). */
    function diffLocal(a, d) {
      var out = { quitadas: [], agregadas: [], cambiadas: [] };
      var idx = function (v) { var m = {}; Object.keys(v.bases).forEach(function (b) { Object.keys(v.bases[b].stores).forEach(function (s) { var S = v.bases[b].stores[s]; S.filas.forEach(function (f, i) { m[b + "/" + s + "/" + JSON.stringify(S.llaves[i])] = canon(f); }); }); }); return m; };
      var A = idx(a), D = idx(d);
      Object.keys(A).forEach(function (k) { if (!(k in D)) out.quitadas.push(k); else if (A[k] !== D[k]) out.cambiadas.push(k); });
      Object.keys(D).forEach(function (k) { if (!(k in A)) out.agregadas.push(k); });
      out.quitadas.sort(); out.agregadas.sort(); out.cambiadas.sort(); return out;
    }

    /* ───────────── el procedimiento completo ───────────── */
    async function estadoServidor(device) {
      var r = await rpc("phone_rescue_estado", { p_plan: planDeConsulta(device) });
      if (!r.ok) throw Abortar("PREFLIGHT", r.clase === "red" ? "SIN_RED" : r.clase === "auth" ? "SESION_RECHAZADA" : "SERVIDOR", "No se pudo leer el estado de la nube (" + r.status + " " + r.mensaje + "). No se cambió nada.", r);
      return r.datos;
    }
    async function presentesEnNube(local) {
      var legado = local.crudo.entimotors_os_demo; if (!legado) return null;
      var porTabla = {};
      for (var s = 0; s < LEGADO_OPERATIVOS.length; s++) { var st = LEGADO_OPERATIVOS[s], filas = legado[st] || []; for (var i = 0; i < filas.length; i++) { if (!filas[i] || filas[i].id == null) continue; (porTabla[TABLA_NUBE[st]] = porTabla[TABLA_NUBE[st]] || []).push(await env.Import313.uuidDe(TABLA_NUBE[st], filas[i].id)); } }
      if (!Object.keys(porTabla).length) return {};
      var r = await rpc("migracion_313_presentes", { p_ids: porTabla });
      if (!r.ok) throw Abortar("PREFLIGHT", "SERVIDOR", "No se pudo comprobar el legado 3.13 contra la nube (" + r.status + "). No se cambió nada.", r);
      var m = {}; Object.keys(r.datos || {}).forEach(function (t) { (r.datos[t] || []).forEach(function (u) { m[u] = true; }); }); return m;
    }
    /**
     * opciones: { decision28: "REGISTRAR_COMO_CREDITO" | "MANTENER_EN_ESPERA" | undefined,
     *             entregarRespaldo(archivo, huella) → Promise<boolean>  (la persona lo guardó),
     *             confirmarPlan(dryRun, analisis) → Promise<boolean>, soloSimular: boolean, pausaMs }
     */
    async function ejecutar(opciones) {
      opciones = opciones || {};
      var I = { herramienta: VERSION, inicio: ahora().toISOString(), fases: {}, resultado: null, escriturasNube: 0, escriturasTelefono: 0, bitacora: bitacora };
      var fase = "PREFLIGHT";
      try {
        /* PREFLIGHT + READ */
        var s = sesion();
        // los datos REALES del teléfono mandan: una variante de laboratorio (textos sintéticos) jamás corre contra una nube que no sea la local, ni al revés
        var local0 = /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(String(env.config && env.config.url));
        if ((ESPERADO.modo === "real") === local0) throw Abortar(fase, "VARIANTE", "Esta copia de la herramienta (" + ESPERADO.modo + ") no corresponde a esta nube. No se hizo nada.");
        var L1 = await leerLocal(); await new Promise(function (r) { setTimeout(r, opciones.pausaMs === undefined ? 1500 : opciones.pausaMs); });
        var L = await leerLocal();
        if (L.huella !== L1.huella) throw Abortar(fase, "TELEFONO_EN_USO", "El contenido del teléfono está cambiando (¿la app está abierta?). Ciérrala y vuelve a intentarlo. No se cambió nada.");
        I.LOCAL_HASH_BEFORE = L.huella;
        var metaDev = ((L.crudo.entimotors_sync || {}).meta || []).filter(function (m) { return m.k === "device_id"; })[0];
        if (!metaDev) throw Abortar(fase, "SIN_DISPOSITIVO", "Este navegador no tiene el identificador del dispositivo");
        var S = await estadoServidor(metaDev.v), presentes = await presentesEnNube(L);
        I.SERVER_CURRENT_STATE = { base_sha: S.base_sha, totales: S.totales, invariantes: S.invariantes, ahora: S.ahora };
        var A = await analizar(L, S, presentes, opciones), plan = await construirPlan(A);
        I.CURRENT_BASELINE = { telefono: L.huella, servidor_base_sha: S.base_sha, totales: S.totales };
        I.clasificacion = A.clasificacion; I.operaciones = A.operaciones.map(function (o) { return { op_id: o.op_id, seq: o.seq, rpc: o.rpc, accion: o.accion, clase: o.clase, motivo: o.motivo, resumen: o.resumen || null }; });
        I.otrasOperaciones = A.otrasOperaciones; I.diferenciasConFotoAntigua = A.diferenciasConFotoAntigua;
        I.legado = A.legado ? { total: A.legado.total, A_ejemploCertificado: A.legado.A.length, B_yaEnLaNube: A.legado.B.length, C_realSoloLocal: 0, D_ambiguos: A.legado.D } : null;
        I.fases.PREFLIGHT = "OK"; anotar(fase, "teléfono y nube leídos", { ops: I.operaciones.map(function (o) { return o.seq + ":" + o.accion; }) });
        if (JSON.stringify(S.invariantes.stock) !== "[]" || JSON.stringify(S.invariantes.dinero) !== "[]") throw Abortar(fase, "INVARIANTES", "La nube reporta invariantes no vacías: no se reconcilia nada hasta revisarlo");
        if (A.pendientesSinSubir) throw Abortar(fase, "PENDIENTES_SIN_SUBIR", "Este teléfono tiene " + A.pendientesSinSubir + " cambio(s) del taller sin subir. Abre la app con conexión, espera «En línea · sincronizado», ciérrala y vuelve aquí. No se cambió nada.");

        var aReconciliar = A.operaciones.filter(function (o) { return o.accion === "RECONCILIAR"; });
        var legadoA = A.legado ? A.legado.A : [];
        // los 18 de ejemplo se retiran SOLO si los 18 siguen coincidiendo con su huella certificada (18/18); si uno cambió o falta: ninguno
        var N_CERT = Object.keys(ESPERADO.legadoEjemplo).reduce(function (n, st) { return n + Object.keys(ESPERADO.legadoEjemplo[st]).length; }, 0);
        var legadoListo = !A.legado || (A.legado.D.length === 0 && (legadoA.length === 0 || legadoA.length === N_CERT));
        I.LEGACY = !A.legado ? "SIN_LEGADO" : !legadoListo ? "LEGACY_CHANGED" : legadoA.length ? N_CERT + "/" + N_CERT + " MATCH" : "YA_RETIRADO";
        ESPERADO.ops.forEach(function (e) { var o = I.operaciones.filter(function (x) { return x.op_id === e.op_id; })[0]; I[e.seq + "_ACTION"] = o ? o.accion + (o.accion === "ABORT" || o.accion === "MANTENER" ? ": " + o.motivo : "") : null; });
        if (!aReconciliar.length && !(legadoA.length && legadoListo)) {
          var pendientes = A.operaciones.filter(function (o) { return o.accion === "ABORT" || o.accion === "MANTENER" || o.accion === "AUSENTE"; });
          I.resultado = pendientes.length || !legadoListo ? "NADA_QUE_HACER_CON_PENDIENTES" : "NO_OP / ALREADY_RECONCILED";
          I.fases.BACKUP = I.fases["DRY-RUN"] = I.fases.RECONCILE = I.fases.CLEANUP = "NO_NECESARIA";
          I.LOCAL_HASH_FINAL = (await leerLocal()).huella; I.telefonoSinCambios = I.LOCAL_HASH_FINAL === L.huella;
          return I;
        }

        /* BACKUP */
        fase = "BACKUP";
        var Rb = await construirRespaldo(L, S, A, plan);
        I.BACKUP_HASH = Rb.huella; I.BACKUP_COMPLETE = Rb.completo; I.BACKUP_BYTES = Rb.archivo.length;
        if (!Rb.completo) throw Abortar(fase, "RESPALDO_INCOMPLETO", "El respaldo no se pudo verificar: no se cambió nada");
        var guardado = opciones.entregarRespaldo ? await opciones.entregarRespaldo(Rb.archivo, Rb.huella) : false;
        if (guardado !== true) throw Abortar(fase, "RESPALDO_NO_GUARDADO", "Sin el respaldo guardado no se continúa. No se cambió nada.");
        var L2 = await leerLocal(); I.LOCAL_HASH_AFTER_BACKUP = L2.huella;
        if (L2.huella !== L.huella) throw Abortar(fase, "HUELLA_CAMBIO", "LOCAL_HASH_AFTER_BACKUP ≠ LOCAL_HASH_BEFORE: algo cambió en el teléfono durante el respaldo. No se cambió nada desde aquí.");
        I.fases.BACKUP = "OK"; anotar(fase, "respaldo creado y verificado", { BACKUP_HASH: Rb.huella });

        /* VALIDATE + DRY-RUN */
        fase = "DRY-RUN";
        var dry = null, yaAplicado = false;
        if (plan) {
          var conBase = Object.assign({}, plan, { base_sha: null });
          // la huella de lo afectado se pide para ESTE plan (no para el de consulta)
          var eb = await rpc("phone_rescue_estado", { p_plan: plan });
          if (!eb.ok) throw Abortar(fase, eb.clase === "red" ? "SIN_RED" : "SERVIDOR", "No se pudo preparar el dry-run (" + eb.status + " " + eb.mensaje + "). No se cambió nada.", eb);
          conBase.base_sha = eb.datos.base_sha;
          var d = await rpc("phone_rescue_reconciliar", { p_plan: conBase, p_evidencia: Rb.evidencia, p_modo: "dry-run" }, 60000);
          if (!d.ok) throw Abortar(fase, d.clase === "red" ? "SIN_RED" : d.clase === "auth" ? "SESION_RECHAZADA" : d.clase === "servidor" ? "SERVIDOR" : "DRY_RUN_RECHAZADO", "El dry-run no pasó (" + d.status + " " + d.mensaje + "). No se cambió nada.", d);
          dry = d.datos;
          if (dry.estado === "ALREADY_RECONCILED") yaAplicado = true;
          else if (dry.estado === "STALE_PREFLIGHT") throw Abortar(fase, "STALE_PREFLIGHT", "CONCURRENT_CHANGE: lo afectado cambió en la nube mientras se preparaba. Vuelve a empezar (se recalcula). No se cambió nada.", dry);
          else if (dry.estado !== "DRY_RUN_OK") throw Abortar(fase, "DRY_RUN_INESPERADO", "Respuesta inesperada del dry-run: " + dry.estado, dry);
          plan = Object.assign({}, conBase, { esperado_sha: dry.esperado_sha || null });
          // lo que el servidor haría debe ser EXACTAMENTE lo que este teléfono espera
          if (!yaAplicado) {
            var nuevas = aReconciliar.filter(function (o) { return !o.yaEnNube; });
            var espItems = nuevas.filter(function (o) { return o.rpc === "agregar_item_orden"; }).map(function (o) { return o.params.p_item_id; }).sort();
            var espCred = nuevas.filter(function (o) { return o.rpc === "registrar_credito"; }).map(function (o) { return o.params.p_credito_id; }).sort();
            var dItems = (dry.diff.agregadas.orden_items || []).slice().sort(), dCred = (dry.diff.agregadas.creditos || []).slice().sort();
            var t = dry.diff.totales || {}, claves = Object.keys(t), permitidas = ["orden_items_n", "orden_items_suma", "creditos_n", "creditos_total", "creditos_saldo", "credito_items_n"];
            if (JSON.stringify(espItems) !== JSON.stringify(dItems) || JSON.stringify(espCred) !== JSON.stringify(dCred) || claves.some(function (k) { return permitidas.indexOf(k) < 0; }) || JSON.stringify(dry.diff.quitadas) !== "{}")
              throw Abortar(fase, "DRY_RUN_DISTINTO", "El dry-run haría algo distinto de lo esperado: no se continúa", dry);
          }
          I.DRY_RUN = { estado: dry.estado, EXPECTED_SERVER_DIFF: dry.diff ? { agregadas: dry.diff.agregadas, cambiadas: dry.diff.cambiadas, quitadas: dry.diff.quitadas, auditoria: dry.diff.auditoria } : null,
            EXPECTED_MONEY_DIFF: dry.diff ? { creditos_total: (dry.diff.totales || {}).creditos_total || 0, por_cobrar: (dry.diff.totales || {}).creditos_saldo || 0, caja: 0, abonos: 0, ventas: 0, orden_items_suma: (dry.diff.totales || {}).orden_items_suma || 0 } : null,
            EXPECTED_STOCK_DIFF: 0, esperado_sha: dry.esperado_sha || null, base_sha: plan.base_sha };
        }
        I.EXPECTED_LOCAL_DIFF = { colaQuitadas: aReconciliar.map(function (o) { return o.seq; }), legadoEjemploQuitados: legadoListo ? legadoA.length : 0, otrasEscrituras: 0 };
        I.fases["DRY-RUN"] = "OK"; anotar(fase, "dry-run correcto", I.DRY_RUN);
        if (opciones.soloSimular) { I.resultado = "DRY_RUN_ONLY"; I.LOCAL_HASH_FINAL = (await leerLocal()).huella; I.telefonoSinCambios = I.LOCAL_HASH_FINAL === L.huella; return I; }
        if (opciones.confirmarPlan && (await opciones.confirmarPlan(I.DRY_RUN, I)) !== true) throw Abortar(fase, "NO_CONFIRMADO", "La persona no confirmó el plan. No se cambió nada.");

        /* RECONCILE (una transacción en el servidor) */
        fase = "RECONCILE";
        if (plan && !yaAplicado) {
          var c = await rpc("phone_rescue_reconciliar", { p_plan: plan, p_evidencia: Rb.evidencia, p_modo: "commit" }, 60000);
          if (!c.ok && (c.clase === "red" || c.clase === "servidor")) {
            // respuesta perdida: el servidor decide (todo o nada). Se pregunta hasta 3 veces.
            anotar(fase, "respuesta perdida (" + c.status + "): se consulta si la nube lo aplicó");
            var visto = null;
            for (var n = 0; n < 3 && !visto; n++) { var q = await rpc("phone_rescue_estado", { p_plan: plan }); if (q.ok) visto = q.datos; else await new Promise(function (r) { setTimeout(r, opciones.reintentoMs === undefined ? 1500 : opciones.reintentoMs); }); }
            if (!visto) throw Abortar(fase, "SIN_CONFIRMAR", "Se cortó la conexión y no se pudo comprobar la nube. El teléfono NO se tocó. Vuelve a abrir esta página con conexión: continuará donde quedó, sin duplicar.", c);
            if (!visto.lote) throw Abortar(fase, "NO_APLICADO", "La nube no aplicó la reconciliación (no quedó nada a medias). El teléfono NO se tocó. Vuelve a intentarlo.", c);
            I.RECONCILE = { estado: "RECONCILED", confirmadoTrasRespuestaPerdida: true };
          } else if (!c.ok) throw Abortar(fase, c.clase === "auth" ? "SESION_RECHAZADA" : c.clase === "conflicto" ? "CONFLICTO" : "RECHAZADO", "La nube no aceptó la reconciliación (" + c.status + " " + c.mensaje + "). No quedó nada a medias y el teléfono NO se tocó.", c);
          else if (c.datos.estado === "STALE_PREFLIGHT") throw Abortar(fase, "STALE_PREFLIGHT", "CONCURRENT_CHANGE: alguien cambió lo afectado entre el dry-run y la escritura. No se escribió nada. Vuelve a empezar (se recalcula).", c.datos);
          else if (c.datos.estado !== "RECONCILED" && c.datos.estado !== "ALREADY_RECONCILED") throw Abortar(fase, "RESPUESTA_INESPERADA", "Respuesta inesperada: " + c.datos.estado, c.datos);
          else I.RECONCILE = { estado: c.datos.estado, cambios: c.datos.cambios, lote: c.datos.lote };
          if (I.RECONCILE.estado === "RECONCILED") I.escriturasNube = 1;
        } else I.RECONCILE = { estado: plan ? "ALREADY_RECONCILED" : "SIN_ACCIONES_EN_LA_NUBE" };
        I.fases.RECONCILE = "OK"; anotar(fase, "reconciliación en la nube", I.RECONCILE);

        /* VERIFY */
        fase = "VERIFY";
        var S2 = await estadoServidor(metaDev.v);
        var faltan = verificarNube(S2, A);
        if (plan) { var ql = await rpc("phone_rescue_estado", { p_plan: plan }); if (!ql.ok || !ql.datos.lote) faltan.push("el lote de reconciliación no consta en la nube"); else I.LOTE = { id: plan.lote, aplicado_en: ql.datos.lote.creado_en, evidencia_sha256: ql.datos.lote.evidencia_sha256 }; }
        I.RECONCILIATION_VERIFIED = faltan.length === 0;
        if (!I.RECONCILIATION_VERIFIED) throw Abortar(fase, "NO_VERIFICADO", "La nube no quedó como se esperaba: NO se limpia nada en el teléfono (" + faltan.join("; ") + ")", { faltan: faltan });
        I.SERVER_AFTER = { totales: S2.totales, invariantes: S2.invariantes };
        I.fases.VERIFY = "OK"; anotar(fase, "RECONCILIATION_VERIFIED = TRUE");

        /* CLEANUP (solo ahora, y solo lo verificado) */
        fase = "CLEANUP";
        var L3 = await leerLocal();
        if (L3.huella !== L.huella) throw Abortar(fase, "HUELLA_CAMBIO", "El teléfono cambió desde el respaldo: no se limpia nada. La nube ya está reconciliada; vuelve a abrir esta página (con la app cerrada) para terminar.");
        var quitadas = await limpiarCola(L, aReconciliar.map(function (o) { return { seq: o.seq, op_id: o.op_id, huellaFila: o.huellaFila }; }));
        var quitadosLegado = legadoListo ? await limpiarLegado(L, legadoA) : 0;
        I.escriturasTelefono = quitadas.length + quitadosLegado;
        var L4 = await leerLocal(), dl = diffLocal(L.volcado, L4.volcado);
        var espQuitadas = aReconciliar.map(function (o) { return "entimotors_sync/outbox/" + JSON.stringify(o.seq); }).concat((legadoListo ? legadoA : []).map(function (r) { return "entimotors_os_demo/" + r.store + "/" + JSON.stringify(r.id); })).sort();
        I.LOCAL_DIFF = dl; I.LOCAL_HASH_FINAL = L4.huella;
        I.UNEXPECTED_LOCAL_DIFF = !(JSON.stringify(dl.quitadas) === JSON.stringify(espQuitadas) && dl.agregadas.length === 0 && dl.cambiadas.length === 0);
        if (I.UNEXPECTED_LOCAL_DIFF) throw Abortar(fase, "UNEXPECTED_DIFF", "El teléfono quedó distinto de lo esperado: revisar con el respaldo", dl);
        I.CLEANUP = { colaQuitadas: quitadas, legadoEjemploQuitados: quitadosLegado, legadoAmbiguos: A.legado ? A.legado.D.length : 0 };
        I.fases.CLEANUP = "OK"; anotar(fase, "limpieza local verificada", I.CLEANUP);
        var quedan = A.operaciones.filter(function (o) { return o.accion === "ABORT" || o.accion === "MANTENER"; });
        I.resultado = quedan.length || !legadoListo ? "RECONCILED_WITH_PENDING" : "RECONCILED";
        return I;
      } catch (e) {
        I.resultado = "ABORT"; I.abort = { fase: e.fase || fase, codigo: e.codigo || "ERROR", mensaje: String(e && e.message || e), extra: e.extra || null };
        I.fases[e.fase || fase] = "ABORT"; anotar(e.fase || fase, "ABORT: " + I.abort.codigo + " — " + I.abort.mensaje);
        try { I.LOCAL_HASH_FINAL = (await leerLocal()).huella; } catch (x) { I.LOCAL_HASH_FINAL = null; }
        return I;
      } finally { I.fin = ahora().toISOString(); }
    }

    return { leerLocal: leerLocal, analizar: analizar, construirPlan: construirPlan, construirRespaldo: construirRespaldo, ejecutar: ejecutar, rpc: rpc, sesion: sesion, diffLocal: diffLocal, estadoServidor: estadoServidor, presentesEnNube: presentesEnNube };
  }

  global.PhoneRescue = { crear: crear, VERSION: VERSION, FIN: FIN, ESPERADO: ESPERADO, canon: canon };

  /* ───────────── pantalla ───────────── */
  if (typeof document === "undefined" || !document.getElementById("btnRevisar")) return;
  var $ = function (id) { return document.getElementById(id); };
  var NOMBRE = "ENTIMOTORS-respaldo-rescate.json", archivoActual = "", confirmar = null;
  var escribir = function (id, t) { $(id).textContent = t; };
  var nuevo = function () { return crear({ indexedDB: global.indexedDB, crypto: global.crypto, fetch: global.fetch.bind(global), localStorage: global.localStorage, config: global.ENTIMOTORS_SUPABASE, Import313: global.Import313,
    onPaso: function (l) { $("bitacora").textContent += l.t.slice(11, 19) + " · " + l.fase + " · " + l.texto + "\n"; } }); };
  // DECISIÓN DEL PROPIETARIO (2026-10-05): el crédito de L 2,280 es información REAL y se registra como crédito por cobrar. Las guardas no cambian.
  var decision = function () { return ESPERADO.decision28; };
  var pintar = function (I) {
    var l = [];
    l.push("RESULTADO: " + I.resultado + (I.abort ? "  (" + I.abort.fase + " · " + I.abort.codigo + ")" : ""));
    if (I.abort) l.push(I.abort.mensaje);
    (I.operaciones || []).forEach(function (o) { l.push("· operación " + (o.seq == null ? "—" : o.seq) + " (" + (o.rpc === "agregar_item_orden" ? "renglón de orden" : "crédito") + "): " + o.accion + " — " + o.motivo); });
    if (I.legado) l.push("· registros 3.13: " + I.legado.total + " en total · " + I.legado.B_yaEnLaNube + " ya en la nube · " + I.legado.A_ejemploCertificado + " de ejemplo (certificados) · " + I.legado.D_ambiguos.length + " ambiguos");
    if (I.otrasOperaciones && I.otrasOperaciones.length) l.push("· otras " + I.otrasOperaciones.length + " operación(es) de la cola: no se tocan");
    if (I.DRY_RUN && I.DRY_RUN.EXPECTED_MONEY_DIFF) l.push("· efecto en la nube: por cobrar +" + I.DRY_RUN.EXPECTED_MONEY_DIFF.por_cobrar + " · renglones de órdenes +" + I.DRY_RUN.EXPECTED_MONEY_DIFF.orden_items_suma + " · caja 0 · stock 0");
    if (I.BACKUP_HASH) l.push("· respaldo: " + I.BACKUP_HASH.slice(0, 16) + "… (" + I.BACKUP_BYTES + " bytes)");
    if (I.CLEANUP) l.push("· limpieza: " + I.CLEANUP.colaQuitadas.length + " aviso(s) resueltos · " + I.CLEANUP.legadoEjemploQuitados + " registro(s) de ejemplo retirados");
    escribir("resumen", l.join("\n")); $("resultado").hidden = false;
  };
  var correr = async function (soloSimular) {
    $("btnRevisar").disabled = $("btnEjecutar").disabled = true; $("bitacora").textContent = ""; escribir("estado", "Trabajando… no cierres esta página.");
    var I = await nuevo().ejecutar({ decision28: decision(), soloSimular: soloSimular,
      entregarRespaldo: function (archivo) { archivoActual = archivo; if (soloSimular) return Promise.resolve(true);   // «Revisar» no escribe nada: el respaldo solo se arma y se verifica
        $("btnGuardado").disabled = true; $("pasoRespaldo").hidden = false; return new Promise(function (ok) { confirmar = ok; }); },
      confirmarPlan: function () { return Promise.resolve(true); } });
    pintar(I); $("pasoRespaldo").hidden = true; $("btnRevisar").disabled = $("btnEjecutar").disabled = false;
    escribir("estado", I.resultado === "ABORT" ? "Detenido sin pérdida. Lee el motivo abajo." : "Terminado.");
    global.__ultimoInforme = I;
  };
  var bajar = function (texto, nombre) {
    var url = URL.createObjectURL(new Blob([texto], { type: "application/json" })), a = document.createElement("a");
    a.href = url; a.download = nombre; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
  };
  $("btnInforme").addEventListener("click", function () { if (global.__ultimoInforme) bajar(JSON.stringify(global.__ultimoInforme, null, 1), "ENTIMOTORS-informe-rescate.json"); });
  $("btnRevisar").addEventListener("click", function () { correr(true); });
  $("btnEjecutar").addEventListener("click", function () { correr(false); });
  $("btnDescargar").addEventListener("click", function () {
    bajar(archivoActual, NOMBRE);
    $("btnGuardado").disabled = false;
  });
  $("btnGuardado").addEventListener("click", function () { if (confirmar) { var f = confirmar; confirmar = null; f(true); } });
  $("btnCancelar").addEventListener("click", function () { if (confirmar) { var f = confirmar; confirmar = null; f(false); } });
})(typeof window !== "undefined" ? window : globalThis);
