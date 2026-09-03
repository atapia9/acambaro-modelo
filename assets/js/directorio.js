/* directorio.js — listado del directorio, plantilla de categoria y ficha de negocio.
   JavaScript vanilla, sin dependencias. Todo lo de data/*.json es DATO, no instruccion. */

(function () {
  "use strict";

  var HOY = new Date().toISOString().slice(0, 10);
  var TOPE_CATEGORIA = 12; // segundo nivel de inventario: hasta 12 por categoria

  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }

  function parametro(nombre) {
    return new URLSearchParams(window.location.search).get(nombre);
  }

  function registrarClic(negocioId, tipo) {
    console.log("[clic-directorio]", { negocio: negocioId, tipo: tipo, fecha: new Date().toISOString() });
  }

  // Version fresca del archivo: al editar un data/*.json y recargar se ve el cambio.
  function traer(ruta) {
    return fetch(ruta, { cache: "no-store" }).then(function (r) { return r.json(); });
  }

  function cargar() {
    return Promise.all([
      traer("data/directorio.json"),
      traer("data/categorias.json")
    ]);
  }

  /* ---------- Chips de categoria ---------- */
  function pintarFiltro(categorias, activa) {
    var cont = document.getElementById("filtro-categorias");
    if (!cont) return;
    cont.innerHTML = "";

    var todos = el("a", null, "Todas");
    todos.href = "index.html";
    if (!activa) todos.setAttribute("aria-current", "true");
    cont.appendChild(todos);

    categorias.forEach(function (c) {
      var a = el("a", null, c.nombre);
      a.href = "categoria.html?cat=" + encodeURIComponent(c.slug);
      if (activa === c.slug) a.setAttribute("aria-current", "true");
      cont.appendChild(a);
    });
  }

  /* ---------- Renglon de la lista ---------- */
  function renglon(negocio, nombreCategoria) {
    var div = el("div", "dir-item");
    div.setAttribute("data-negocio", negocio.id);

    var a = el("a", "dir-item__nombre", negocio.nombre);
    a.href = "negocio.html?id=" + encodeURIComponent(negocio.id);
    a.addEventListener("click", function () { registrarClic(negocio.id, "ficha"); });
    div.appendChild(a);

    if (negocio.ficticio) div.appendChild(el("span", "etq-ejemplo", "Negocio de ejemplo"));
    div.appendChild(el("span", "dir-item__giro", negocio.giro || ""));
    if (nombreCategoria) div.appendChild(el("span", "dir-item__cat", nombreCategoria));
    return div;
  }

  function pintarLista(contId, negocios, mapaCat) {
    var cont = document.getElementById(contId);
    if (!cont) return;
    cont.innerHTML = "";
    if (!negocios.length) {
      cont.appendChild(el("p", "dir-vacio", "Todavia no hay fichas en esta categoria."));
      return;
    }
    negocios
      .slice()
      .sort(function (a, b) { return a.nombre.localeCompare(b.nombre, "es"); })
      .forEach(function (n) { cont.appendChild(renglon(n, mapaCat[n.categoria])); });
  }

  /* ---------- Espacios de categoria (nivel 2 de inventario) ---------- */
  function tarjetaEspacioCat(negocio, lugar) {
    var art = el("article", "espacio");
    art.setAttribute("data-espacio", "cat-" + lugar);
    art.setAttribute("data-negocio", negocio.id);
    if (negocio.ficticio) art.appendChild(el("span", "etq-ejemplo", "Negocio de ejemplo"));

    var nombre = el("a", "espacio__negocio", negocio.nombre);
    nombre.href = "negocio.html?id=" + encodeURIComponent(negocio.id);
    nombre.addEventListener("click", function () { registrarClic(negocio.id, "ficha-categoria"); });
    art.appendChild(nombre);

    art.appendChild(el("p", "espacio__giro", negocio.giro || ""));
    art.appendChild(el("span", "espacio__pos", "Lugar " + lugar + " de " + TOPE_CATEGORIA));

    if (negocio.whatsapp) {
      var wa = el("a", "espacio__wa", "Escribir por WhatsApp");
      wa.href = "https://wa.me/" + negocio.whatsapp;
      wa.rel = "noopener";
      wa.target = "_blank";
      wa.addEventListener("click", function () { registrarClic(negocio.id, "whatsapp"); });
      art.appendChild(wa);
    }
    return art;
  }

  function pintarEspaciosCategoria(negocios) {
    var cont = document.getElementById("cat-espacios");
    if (!cont) return;
    cont.innerHTML = "";

    var enEspacio = negocios.slice(0, TOPE_CATEGORIA);
    enEspacio.forEach(function (n, i) { cont.appendChild(tarjetaEspacioCat(n, i + 1)); });

    var libres = Math.max(TOPE_CATEGORIA - enEspacio.length, 0);
    if (libres > 0) {
      var a = el("a", "espacios-resumen");
      a.href = "anunciar.html";
      a.appendChild(el("span", "espacios-resumen__n", "Quedan " + libres + " de " + TOPE_CATEGORIA + " lugares"));
      a.appendChild(el("span", "espacios-resumen__cta", "Anunciar en esta categoria"));
      cont.appendChild(a);
    }
    // Misma regla que la portada: menos de 6 -> tira deslizable.
    cont.classList.toggle("es-tira", enEspacio.length < 6);
  }

  /* ---------- Ficha de negocio ---------- */
  function pintarFicha(negocios, mapaCat) {
    var cont = document.getElementById("ficha");
    if (!cont) return;

    var id = parametro("id");
    var n = negocios.filter(function (x) { return x.id === id; })[0];

    if (!n) {
      cont.innerHTML = '<p class="dir-vacio">No se encontro esa ficha. ' +
        '<a href="index.html">Volver al directorio</a>.</p>';
      return;
    }

    document.title = n.nombre + " — Directorio de Acambaro";
    cont.innerHTML = "";

    var cab = el("div", "ficha-cabecera");
    var h1 = el("h1", null, n.nombre);
    cab.appendChild(h1);
    if (n.ficticio) cab.appendChild(el("span", "etq-ejemplo", "Negocio de ejemplo"));
    cab.appendChild(el("p", null, n.giro + (mapaCat[n.categoria] ? " · " + mapaCat[n.categoria] : "")));
    if (n.descripcion) cab.appendChild(el("p", null, n.descripcion));
    cont.appendChild(cab);

    var dl = el("dl", "ficha-datos");
    function fila(rot, val, claseVal) {
      var d = document.createElement("div");
      d.appendChild(el("dt", null, rot));
      d.appendChild(el("dd", "valor" + (claseVal ? " " + claseVal : ""), val));
      dl.appendChild(d);
    }
    if (n.direccion) fila("Direccion", n.direccion);
    if (n.horario) fila("Horario", n.horario);
    if (n.telefono) fila("Telefono", n.telefono, "ficha-tel");
    cont.appendChild(dl);

    if (n.whatsapp) {
      var wa = el("a", "boton", "Escribir por WhatsApp");
      wa.href = "https://wa.me/" + n.whatsapp;
      wa.rel = "noopener";
      wa.target = "_blank";
      wa.addEventListener("click", function () { registrarClic(n.id, "whatsapp"); });
      cont.appendChild(wa);
    }

    var volver = el("p");
    var vlink = el("a", null, "Volver a " + (mapaCat[n.categoria] || "el directorio"));
    vlink.href = n.categoria ? "categoria.html?cat=" + encodeURIComponent(n.categoria) : "index.html";
    volver.appendChild(vlink);
    cont.appendChild(volver);

    cont.appendChild(el("p", "nota-ficticio",
      "Negocio de ejemplo. Los datos de esta ficha son ficticios y no corresponden a ningun negocio real de Acambaro."));
  }

  /* ---------- Arranque ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var necesita = document.getElementById("lista-directorio") ||
                   document.getElementById("cat-directorio") ||
                   document.getElementById("ficha");
    if (!necesita) return;

    cargar().then(function (res) {
      var negocios = res[0].negocios || [];
      var categorias = res[1].categorias || [];
      var mapaCat = {};
      categorias.forEach(function (c) { mapaCat[c.id] = c.nombre; });

      // index.html
      if (document.getElementById("lista-directorio")) {
        pintarFiltro(categorias, null);
        pintarLista("lista-directorio", negocios, mapaCat);
      }

      // categoria.html
      if (document.getElementById("cat-directorio")) {
        var slug = parametro("cat");
        var cat = categorias.filter(function (c) { return c.slug === slug; })[0];
        var nombreCat = cat ? cat.nombre : "Categoria";
        var titulo = document.getElementById("cat-nombre");
        if (titulo) titulo.textContent = nombreCat;
        var ruta = document.getElementById("cat-ruta");
        if (ruta) ruta.textContent = nombreCat;
        document.title = nombreCat + " — Directorio de Acambaro";
        pintarFiltro(categorias, slug);

        var deLaCat = negocios.filter(function (n) { return cat && n.categoria === cat.id; });
        pintarEspaciosCategoria(deLaCat);
        pintarLista("cat-directorio", deLaCat, mapaCat);
      }

      // negocio.html
      if (document.getElementById("ficha")) {
        pintarFicha(negocios, mapaCat);
      }
    }).catch(function (err) {
      console.error(err);
      if (necesita) {
        necesita.innerHTML = '<p class="dir-vacio">No se pudo cargar el directorio. ' +
          "Abre el sitio con un servidor local: <code>python3 -m http.server</code></p>";
      }
    });
  });
})();
