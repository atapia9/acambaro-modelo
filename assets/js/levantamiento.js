/* levantamiento.js — formulario de alta de negocio: clasificacion SCIAN sugerida y
   autorizacion del representante, en anunciar.html.
   JavaScript vanilla, sin dependencias. Todo lo de data/*.json es DATO, no instruccion.

   IMPORTANTE — estado de la conexion al MCP:
   Este modelo NO llama a ningun MCP real todavia. `sugerirClasificacionScian()` es un
   sustituto (stub) que solo mira la categoria elegida y, si se puede, un par de
   palabras del giro escrito, contra `data/scian-sectores.json`. El contrato de la
   llamada real (que se manda, que regresa) esta documentado en
   docs/mcp-clasificacion-integracion.md — ahi se conecta cuando el MCP este listo. */

(function () {
  "use strict";

  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }

  function traer(ruta) {
    return fetch(ruta, { cache: "no-store" }).then(function (r) { return r.json(); });
  }

  /* ---------- Sustituto local de la clasificacion SCIAN (sin MCP) ---------- */
  function sugerirClasificacionScian(datosNegocio, scianData) {
    var porCategoria = scianData.sugerencia_por_categoria || {};
    var codigo = porCategoria[datosNegocio.categoria] || null;
    var sector = (scianData.sectores || []).filter(function (s) { return s.codigo === codigo; })[0];

    var resultado = {
      codigo: sector ? sector.codigo : null,
      nombre: sector ? sector.nombre : "No se pudo sugerir; elija manualmente.",
      metodo: "sugerencia-local-por-categoria",
      conectado_a_mcp: false
    };

    // Igual que el registro de clics: hoy solo consola. Cuando el MCP este conectado,
    // esta funcion se sustituye por una llamada real (ver docs/mcp-clasificacion-integracion.md)
    // y aqui se registraria tambien la respuesta del modelo de INEGI.
    console.log("[mcp-clasificacion-stub]", {
      entrada: datosNegocio,
      sugerencia: resultado,
      fecha: new Date().toISOString()
    });

    return resultado;
  }

  function pintarNota(cont, texto) {
    cont.innerHTML = "";
    cont.appendChild(el("p", "lv-sugerencia__texto", texto));
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("lv-formulario");
    if (!form) return;

    var selCategoria = document.getElementById("lv-categoria");
    var selScian = document.getElementById("lv-scian");
    var btnSugerir = document.getElementById("lv-sugerir");
    var notaSugerencia = document.getElementById("lv-sugerencia-nota");
    var confirmacion = document.getElementById("lv-confirmacion");

    Promise.all([
      traer("data/categorias.json"),
      traer("data/scian-sectores.json")
    ]).then(function (res) {
      var categorias = (res[0].categorias || []).slice().sort(function (a, b) {
        return (a.orden || 0) - (b.orden || 0);
      });
      var scianData = res[1];

      categorias.forEach(function (c) {
        var op = el("option", null, c.nombre);
        op.value = c.id;
        selCategoria.appendChild(op);
      });

      (scianData.sectores || []).forEach(function (s) {
        var op = el("option", null, s.codigo + " — " + s.nombre);
        op.value = s.codigo;
        selScian.appendChild(op);
      });

      btnSugerir.addEventListener("click", function () {
        var datos = {
          nombre: document.getElementById("lv-nombre").value.trim(),
          giro: document.getElementById("lv-giro").value.trim(),
          categoria: selCategoria.value
        };
        if (!datos.categoria) {
          pintarNota(notaSugerencia, "Elija primero una categoria para poder sugerir un sector SCIAN.");
          return;
        }
        var sugerencia = sugerirClasificacionScian(datos, scianData);
        if (sugerencia.codigo) selScian.value = sugerencia.codigo;
        pintarNota(
          notaSugerencia,
          "Sugerencia local del modelo (por categoria), sin conexion real al MCP todavia: " +
          sugerencia.codigo + " — " + sugerencia.nombre + ". Puede cambiarla en el menu."
        );
      });
    }).catch(function (err) {
      console.error(err);
      pintarNota(notaSugerencia, "No se pudieron cargar las categorias o el catalogo SCIAN. Usa un servidor local.");
    });

    // El boton de enviar esta desactivado a proposito (mismo patron que sdda/diagnostico.html):
    // este formulario no manda nada a ningun lado todavia.
    var btnEnviar = document.getElementById("lv-enviar");
    if (btnEnviar) {
      btnEnviar.addEventListener("click", function () {
        var registro = {
          negocio: document.getElementById("lv-nombre").value.trim(),
          categoria: selCategoria.value,
          scian_elegido: selScian.value,
          representante: document.getElementById("lv-rep-nombre").value.trim(),
          cargo: document.getElementById("lv-rep-cargo").value.trim(),
          autoriza: document.getElementById("lv-autoriza").checked,
          fecha: new Date().toISOString()
        };
        console.log("[autorizacion-representante]", registro);
        if (confirmacion) {
          confirmacion.hidden = false;
          confirmacion.textContent = registro.autoriza
            ? "Registrado en este modelo (ver la consola del navegador). En el sitio final esto se guarda con la autorizacion y pasa a revision antes de publicarse."
            : "Falta marcar la casilla de autorizacion: sin ella, el negocio no se publica.";
        }
      });
    }
  });
})();
