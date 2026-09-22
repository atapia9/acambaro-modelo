/* tema.js — interruptor de modo claro/oscuro.
   JavaScript vanilla, sin dependencias. Se carga con "defer" en <head> (no al final
   del <body>, como el resto de los scripts) para fijar el tema antes del primer
   pintado y evitar un parpadeo del tema equivocado. */

(function () {
  "use strict";

  var CLAVE = "sdda-tema"; // valores guardados: "claro" u "oscuro"

  function leerGuardado() {
    try { return localStorage.getItem(CLAVE); } catch (e) { return null; }
  }

  function guardar(tema) {
    try { localStorage.setItem(CLAVE, tema); } catch (e) { /* modo privado, etc. */ }
  }

  function prefiereOscuroElSistema() {
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  // Si el visitante ya eligio un tema a mano, ese manda. Si no, se usa el del sistema.
  function temaEfectivo() {
    var guardado = leerGuardado();
    if (guardado === "claro" || guardado === "oscuro") return guardado;
    return prefiereOscuroElSistema() ? "oscuro" : "claro";
  }

  function actualizarBotones(tema) {
    var botones = document.querySelectorAll(".tema-boton");
    for (var i = 0; i < botones.length; i++) {
      botones[i].textContent = tema === "oscuro" ? "Modo claro" : "Modo oscuro";
      botones[i].setAttribute("aria-pressed", tema === "oscuro" ? "true" : "false");
    }
  }

  function aplicar(tema, persistir) {
    document.documentElement.setAttribute("data-tema", tema);
    if (persistir) guardar(tema);
    actualizarBotones(tema);
  }

  // Se aplica de inmediato: gracias a "defer", el <body> ya esta parseado (aunque no
  // pintado) cuando este script corre, asi que los botones .tema-boton ya existen.
  aplicar(temaEfectivo(), false);

  var botones = document.querySelectorAll(".tema-boton");
  for (var i = 0; i < botones.length; i++) {
    botones[i].addEventListener("click", function () {
      var actual = document.documentElement.getAttribute("data-tema") || temaEfectivo();
      aplicar(actual === "oscuro" ? "claro" : "oscuro", true);
    });
  }

  // Si el visitante no eligio nada a mano y cambia el tema del sistema mientras
  // tiene la pagina abierta, se actualiza el texto del boton (el color ya lo hace
  // solo la hoja de estilo, via prefers-color-scheme).
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      if (!leerGuardado()) actualizarBotones(temaEfectivo());
    });
  }
})();
