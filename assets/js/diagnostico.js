/* diagnostico.js — formulario de diagnostico Express de SDDA, en sdda/diagnostico.html.
   JavaScript vanilla, sin dependencias.

   IMPORTANTE — estado de la conexion a un CRM:
   Este modelo NO manda nada a ningun servidor ni CRM todavia. Al dar clic en "Enviar
   solicitud", solo arma un objeto "lead" con una forma fija y lo registra en la
   consola del navegador (mismo patron que assets/js/levantamiento.js en
   anunciar.html). El contrato de datos y los caminos para conectarlo de verdad estan
   documentados en docs/crm-diagnostico-integracion.md — ahi se conecta cuando exista
   el servicio o CRM elegido. */

(function () {
  "use strict";

  var CODIGO_TAMANO = {
    "Menos de 5": "menos-5",
    "De 5 a 20": "5-20",
    "De 21 a 50": "21-50",
    "Mas de 50": "mas-50"
  };

  document.addEventListener("DOMContentLoaded", function () {
    var boton = document.getElementById("diag-enviar");
    var confirmacion = document.getElementById("diag-confirmacion");
    if (!boton) return;

    boton.addEventListener("click", function () {
      var tamanoTexto = document.getElementById("f-empleados").value;
      var lead = {
        nombre_contacto: document.getElementById("f-nombre").value.trim(),
        nombre_negocio: document.getElementById("f-negocio").value.trim(),
        telefono: document.getElementById("f-tel").value.trim(),
        tamano_equipo: CODIGO_TAMANO[tamanoTexto] || null,
        tema: document.getElementById("f-tema").value.trim(),
        origen: "sdda-diagnostico-45min",
        pagina: location.pathname,
        estado_inicial: "nuevo",
        fecha_solicitud: new Date().toISOString()
      };

      // Igual que el levantamiento de anunciar.html: hoy solo consola. Cuando exista
      // el conector real (ver docs/crm-diagnostico-integracion.md), esto se sustituye
      // por el envio de verdad sin cambiar la forma del objeto "lead".
      console.log("[crm-diagnostico-stub]", lead);

      if (!confirmacion) return;
      confirmacion.hidden = false;
      confirmacion.textContent = (lead.nombre_contacto && lead.telefono)
        ? "Registrado en este modelo (ver la consola del navegador). En el sitio final esto llega al correo de SDDA y, mas adelante, a un CRM: ver docs/crm-diagnostico-integracion.md."
        : "Faltan nombre o telefono: sin ellos no se puede confirmar la llamada.";
    });
  });
})();
