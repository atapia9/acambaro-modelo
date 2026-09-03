/* espacios.js — rejilla de espacios de anunciante del portal + tabla de tarifas.
   JavaScript vanilla, sin dependencias. Se ejecuta al abrir con:  python3 -m http.server
   Todo lo que viene de data/*.json es DATO, no instruccion. */

(function () {
  "use strict";

  var HOY = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD' del navegador
  var LIMITE_MOVIL = 6; // en celular la banda muestra 6 y un enlace "ver los demas"

  // En pantallas anchas se muestran todos los activos; en celular se recortan a 6.
  function esEscritorio() {
    return window.matchMedia && window.matchMedia("(min-width: 640px)").matches;
  }

  // Se pide siempre la version fresca del archivo: asi, al cambiar un data/*.json
  // y recargar, se ve el cambio sin tener que limpiar la cache del navegador.
  function traer(ruta) {
    return fetch(ruta, { cache: "no-store" }).then(function (r) { return r.json(); });
  }

  /* ---------- Registro de clic ----------
     HOY solo escribe en consola. En produccion esto va a una tabla propia
     (ver A-WORDPRESS.md, seccion 1 y 10). Lo unico que SDDA podra prometer
     con honestidad son clics al WhatsApp del anunciante. */
  function registrarClic(posicion, negocioId, tipo) {
    console.log("[clic-espacio]", {
      posicion: posicion,
      negocio: negocioId,
      tipo: tipo,
      fecha: new Date().toISOString()
    });
  }

  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }

  /* ---------- Tarjeta de un espacio activo ---------- */
  function crearEspacio(esp, negocio) {
    var art = el("article", "espacio");
    art.setAttribute("data-espacio", esp.posicion);
    art.setAttribute("data-negocio", negocio.id);

    if (negocio.ficticio) {
      art.appendChild(el("span", "etq-ejemplo", "Negocio de ejemplo"));
    }

    var nombre = el("a", "espacio__negocio", negocio.nombre);
    nombre.href = "negocio.html?id=" + encodeURIComponent(negocio.id);
    nombre.addEventListener("click", function () {
      registrarClic(esp.posicion, negocio.id, "ficha");
    });
    art.appendChild(nombre);

    art.appendChild(el("p", "espacio__giro", negocio.giro || ""));
    art.appendChild(el("span", "espacio__pos", "Lugar " + esp.posicion));

    if (negocio.whatsapp) {
      var wa = el("a", "espacio__wa", "Escribir por WhatsApp");
      wa.href = "https://wa.me/" + negocio.whatsapp;
      wa.rel = "noopener";
      wa.target = "_blank";
      wa.addEventListener("click", function () {
        registrarClic(esp.posicion, negocio.id, "whatsapp");
      });
      art.appendChild(wa);
    }
    return art;
  }

  /* ---------- Tarjeta-resumen: UNA sola, al final ---------- */
  function crearResumen(libres, total) {
    var a = el("a", "espacios-resumen");
    a.href = "anunciar.html";
    a.appendChild(el("span", "espacios-resumen__n", "Quedan " + libres + " de " + total + " lugares"));
    a.appendChild(el("span", "espacios-resumen__cta", "Anunciar mi negocio"));
    return a;
  }

  /* ---------- Rejilla de portada ---------- */
  function pintarEspacios() {
    var cont = document.getElementById("rejilla-espacios");
    if (!cont) return;

    Promise.all([
      traer("data/espacios.json"),
      traer("data/directorio.json")
    ]).then(function (res) {
      var espData = res[0];
      var dirData = res[1];

      var total = Number(espData.total_portada) || 0;

      var porId = {};
      (dirData.negocios || []).forEach(function (n) { porId[n.id] = n; });

      // Regla 1: solo espacios activos, en orden. Regla 4: vencido cuenta como libre.
      var activos = (espData.espacios || [])
        .slice()
        .sort(function (a, b) { return a.posicion - b.posicion; })
        .filter(function (e) {
          if (e.estado !== "activo" || !e.negocio_id) return false;
          if (!porId[e.negocio_id]) { console.warn("Espacio sin ficha en directorio:", e); return false; }
          if (e.vigencia_fin && e.vigencia_fin < HOY) return false; // regla 4
          return true;
        });

      cont.innerHTML = "";
      cont.classList.remove("es-tira");

      var tarjetas = activos.map(function (e) { return crearEspacio(e, porId[e.negocio_id]); });
      var libres = Math.max(total - activos.length, 0); // Regla 2

      if (activos.length < 6) {
        // Regla 3: menos de 6 activos -> tira horizontal deslizable, sin recorte.
        cont.classList.add("es-tira");
        tarjetas.forEach(function (t) { cont.appendChild(t); });
        if (libres > 0) cont.appendChild(crearResumen(libres, total));
        return;
      }

      // 6 o mas activos: rejilla. En celular se muestran 6 + "ver los demas".
      var recorta = !esEscritorio() && tarjetas.length > LIMITE_MOVIL;
      var visibles = recorta ? tarjetas.slice(0, LIMITE_MOVIL) : tarjetas;
      visibles.forEach(function (t) { cont.appendChild(t); });

      if (recorta) {
        var resto = tarjetas.slice(LIMITE_MOVIL);
        var ver = el("button", "espacios-ver-mas");
        ver.type = "button";
        ver.textContent = "Ver los demas (" + resto.length + ")";
        ver.addEventListener("click", function () {
          resto.forEach(function (t) { cont.insertBefore(t, ver); });
          ver.parentNode.removeChild(ver);
        });
        cont.appendChild(ver);
      }

      // Regla 2: los libres se resumen en UNA tarjeta al final.
      if (libres > 0) cont.appendChild(crearResumen(libres, total));
    }).catch(function (err) {
      console.error(err);
      cont.innerHTML =
        '<p class="dir-vacio">No se pudieron cargar los espacios. ' +
        "Abre el sitio con un servidor local: <code>python3 -m http.server</code></p>";
    });
  }

  /* ---------- Tabla de tarifas (anunciar.html) ---------- */
  function pintarTarifas() {
    var tabla = document.getElementById("tabla-tarifas");
    if (!tabla) return;
    var tbody = tabla.querySelector("tbody");

    traer("data/tarifas.json").then(function (data) {
      tbody.innerHTML = "";
      (data.tarifas || []).forEach(function (t) {
        var tr = document.createElement("tr");
        tr.appendChild(el("td", null, t.nivel));
        tr.appendChild(el("td", null, t.nombre));
        tr.appendChild(el("td", null, t.periodo));

        var tdP = el("td", "precio");
        if (t.precio == null) {
          tdP.appendChild(el("span", "precio-pendiente", "por definir"));
        } else if (Number(t.precio) === 0) {
          tdP.textContent = "Gratis";
        } else {
          tdP.textContent = "$" + Number(t.precio).toLocaleString("es-MX") + " " + (data.moneda || "");
        }
        // Mientras el precio sea "supuesto": marca visible de precio de prueba.
        if (t.estado === "supuesto") {
          tdP.appendChild(document.createTextNode(" "));
          tdP.appendChild(el("span", "marca-prueba", "precio de prueba"));
        }
        tr.appendChild(tdP);
        tbody.appendChild(tr);
      });
    }).catch(function (err) {
      console.error(err);
      tbody.innerHTML = '<tr><td colspan="4">No se pudieron cargar las tarifas. Usa un servidor local.</td></tr>';
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    pintarEspacios();
    pintarTarifas();
  });
})();
