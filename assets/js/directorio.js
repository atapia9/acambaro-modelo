/* directorio.js — portada (categorias, buscador, ultimos), plantilla de categoria y ficha.
   JavaScript vanilla, sin dependencias. Todo lo de data/*.json es DATO, no instruccion. */

(function () {
  "use strict";

  var TOPE_CATEGORIA = 12; // segundo nivel de inventario: hasta 12 destacados por categoria
  var N_ULTIMOS = 5;       // cuantos negocios recientes se muestran en la portada

  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }

  function parametro(nombre) {
    return new URLSearchParams(window.location.search).get(nombre);
  }

  // Acepta ?c=slug (nuevo) y ?cat=slug (compatibilidad con enlaces viejos).
  function slugCategoria() {
    return parametro("c") || parametro("cat");
  }

  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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

  function contarPorCategoria(negocios) {
    var conteo = {};
    negocios.forEach(function (n) {
      conteo[n.categoria] = (conteo[n.categoria] || 0) + 1;
    });
    return conteo;
  }

  // Categorias que SI se pintan: activas y con al menos una ficha. Ordenadas por 'orden'.
  function categoriasVisibles(categorias, conteo) {
    return categorias
      .filter(function (c) { return c.activa !== false && (conteo[c.id] || 0) > 0; })
      .sort(function (a, b) { return (a.orden || 0) - (b.orden || 0); });
  }

  /* ---------- Rejilla de categorias (contenido principal de la portada) ---------- */
  function pintarRejillaCategorias(categorias, conteo) {
    var cont = document.getElementById("rejilla-categorias");
    if (!cont) return;
    cont.innerHTML = "";

    var visibles = categoriasVisibles(categorias, conteo);
    if (!visibles.length) {
      cont.appendChild(el("p", "dir-vacio", "Todavia no hay categorias con negocios."));
      return;
    }

    visibles.forEach(function (c) {
      var n = conteo[c.id] || 0;
      var a = el("a", "cat-card");
      a.href = "categoria.html?c=" + encodeURIComponent(c.slug);
      a.appendChild(el("span", "cat-card__nombre", c.nombre));
      if (c.descripcion_corta) a.appendChild(el("span", "cat-card__desc", c.descripcion_corta));
      a.appendChild(el("span", "cat-card__count", n === 1 ? "1 negocio" : n + " negocios"));
      cont.appendChild(a);
    });
  }

  /* ---------- Buscador simple: por nombre y por categoria ---------- */
  function pintarBuscador(categorias, conteo, negocios) {
    var form = document.getElementById("buscador");
    if (!form) return;

    var input = document.getElementById("q");
    var select = document.getElementById("q-cat");
    var salida = document.getElementById("buscador-resultados");

    // El <select> solo lista categorias con negocios (misma regla: nada de huecos).
    if (select) {
      categoriasVisibles(categorias, conteo).forEach(function (c) {
        var op = el("option", null, c.nombre);
        op.value = c.slug;
        select.appendChild(op);
      });
      select.addEventListener("change", function () {
        if (select.value) window.location.href = "categoria.html?c=" + encodeURIComponent(select.value);
      });
    }

    // No se envia a ningun lado: es busqueda en la misma pagina.
    form.addEventListener("submit", function (e) { e.preventDefault(); });

    if (input && salida) {
      input.addEventListener("input", function () {
        var q = norm(input.value.trim());
        if (q.length < 2) { salida.hidden = true; salida.innerHTML = ""; return; }

        var hits = negocios.filter(function (n) {
          return norm(n.nombre).indexOf(q) !== -1 || norm(n.giro).indexOf(q) !== -1;
        }).slice(0, 8);

        salida.innerHTML = "";
        if (!hits.length) {
          salida.appendChild(el("p", "dir-vacio", "Sin resultados para “" + input.value.trim() + "”."));
        } else {
          hits.forEach(function (n) {
            var a = el("a", "buscador-hit", n.nombre);
            a.href = "negocio.html?id=" + encodeURIComponent(n.id);
            a.appendChild(el("span", "buscador-hit__giro", n.giro || ""));
            a.addEventListener("click", function () { registrarClic(n.id, "busqueda"); });
            salida.appendChild(a);
          });
        }
        salida.hidden = false;
      });
    }
  }

  /* ---------- Ultimos negocios agregados ---------- */
  function pintarUltimos(negocios, mapaCat) {
    var cont = document.getElementById("ultimos-negocios");
    if (!cont) return;
    cont.innerHTML = "";

    var recientes = negocios
      .slice()
      .sort(function (a, b) { return String(b.fecha_alta || "").localeCompare(String(a.fecha_alta || "")); })
      .slice(0, N_ULTIMOS);

    if (!recientes.length) {
      cont.appendChild(el("p", "dir-vacio", "Todavia no hay negocios en el directorio."));
      return;
    }
    recientes.forEach(function (n) { cont.appendChild(renglon(n, mapaCat[n.categoria])); });
  }

  /* ---------- Renglon de lista (categoria y ultimos) ---------- */
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

  /* ---------- Chips para cambiar de categoria (solo en categoria.html) ---------- */
  function pintarFiltro(categorias, conteo, activa) {
    var cont = document.getElementById("filtro-categorias");
    if (!cont) return;
    cont.innerHTML = "";

    var todos = el("a", null, "Todas");
    todos.href = "index.html";
    cont.appendChild(todos);

    categoriasVisibles(categorias, conteo).forEach(function (c) {
      var a = el("a", null, c.nombre);
      a.href = "categoria.html?c=" + encodeURIComponent(c.slug);
      if (activa === c.slug) a.setAttribute("aria-current", "true");
      cont.appendChild(a);
    });
  }

  /* ---------- Destacados de una categoria (nivel 2 de inventario) ---------- */
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
    cont.classList.toggle("es-tira", enEspacio.length < 6);
  }

  /* ---------- Ficha de negocio ---------- */
  function pintarFicha(negocios, categoriasPorId) {
    var cont = document.getElementById("ficha");
    if (!cont) return;

    var id = parametro("id");
    var n = negocios.filter(function (x) { return x.id === id; })[0];

    if (!n) {
      cont.innerHTML = '<p class="dir-vacio">No se encontro esa ficha. ' +
        '<a href="index.html">Volver al directorio</a>.</p>';
      return;
    }

    var cat = categoriasPorId[n.categoria];
    var nombreCat = cat ? cat.nombre : "";
    document.title = n.nombre + " — Directorio de Acambaro";
    cont.innerHTML = "";

    var cab = el("div", "ficha-cabecera");
    cab.appendChild(el("h1", null, n.nombre));
    if (n.ficticio) cab.appendChild(el("span", "etq-ejemplo", "Negocio de ejemplo"));
    cab.appendChild(el("p", null, n.giro + (nombreCat ? " · " + nombreCat : "")));
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
    var vlink = el("a", null, "Volver a " + (nombreCat || "el directorio"));
    vlink.href = cat ? "categoria.html?c=" + encodeURIComponent(cat.slug) : "index.html";
    volver.appendChild(vlink);
    cont.appendChild(volver);

    cont.appendChild(el("p", "nota-ficticio",
      "Negocio de ejemplo. Los datos de esta ficha son ficticios y no corresponden a ningun negocio real de Acambaro."));
  }

  /* ---------- Arranque ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var esPortada = document.getElementById("rejilla-categorias");
    var esCategoria = document.getElementById("cat-directorio");
    var esFicha = document.getElementById("ficha");
    if (!esPortada && !esCategoria && !esFicha) return;

    cargar().then(function (res) {
      var negocios = res[0].negocios || [];
      var categorias = res[1].categorias || [];
      var conteo = contarPorCategoria(negocios);

      var mapaCat = {};        // id -> nombre
      var categoriasPorId = {}; // id -> objeto categoria
      categorias.forEach(function (c) { mapaCat[c.id] = c.nombre; categoriasPorId[c.id] = c; });

      if (esPortada) {
        pintarRejillaCategorias(categorias, conteo);
        pintarBuscador(categorias, conteo, negocios);
        pintarUltimos(negocios, mapaCat);
      }

      if (esCategoria) {
        var slug = slugCategoria();
        var cat = categorias.filter(function (c) { return c.slug === slug; })[0];
        var nombreCat = cat ? cat.nombre : "Categoria";

        var titulo = document.getElementById("cat-nombre");
        if (titulo) titulo.textContent = nombreCat;
        var ruta = document.getElementById("cat-ruta");
        if (ruta) ruta.textContent = nombreCat;
        var desc = document.getElementById("cat-desc");
        if (desc) desc.textContent = cat && cat.descripcion_corta ? cat.descripcion_corta : "";
        document.title = nombreCat + " — Directorio de Acambaro";

        pintarFiltro(categorias, conteo, slug);

        var deLaCat = negocios.filter(function (n) { return cat && n.categoria === cat.id; });
        pintarEspaciosCategoria(deLaCat);
        pintarLista("cat-directorio", deLaCat, mapaCat);
      }

      if (esFicha) {
        pintarFicha(negocios, categoriasPorId);
      }
    }).catch(function (err) {
      console.error(err);
      var destino = document.getElementById("rejilla-categorias") ||
                    document.getElementById("cat-directorio") ||
                    document.getElementById("ficha");
      if (destino) {
        destino.innerHTML = '<p class="dir-vacio">No se pudo cargar el directorio. ' +
          "Abre el sitio con un servidor local: <code>python3 -m http.server</code></p>";
      }
    });
  });
})();
