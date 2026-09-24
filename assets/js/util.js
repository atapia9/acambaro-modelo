/* util.js — helpers compartidos por directorio.js, espacios.js y levantamiento.js:
   crear elementos, pedir un JSON siempre fresco y armar el boton de WhatsApp.
   JavaScript vanilla, sin dependencias. Se carga antes que esos scripts y expone
   su API en `window.Util` (variable global unica de todo el sitio). */

(function () {
  "use strict";

  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }

  // Version fresca del archivo: al editar un data/*.json y recargar se ve el cambio.
  function traer(ruta) {
    return fetch(ruta, { cache: "no-store" }).then(function (r) { return r.json(); });
  }

  // Enlace de WhatsApp identico en la banda de destacados, los espacios de
  // categoria y la ficha de negocio; solo cambia la clase que trae el estilo.
  function botonWhatsApp(numero, clase) {
    var a = el("a", clase, "Escribir por WhatsApp");
    a.href = "https://wa.me/" + numero;
    a.rel = "noopener";
    a.target = "_blank";
    return a;
  }

  window.Util = { el: el, traer: traer, botonWhatsApp: botonWhatsApp };
})();
