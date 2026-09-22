/* clima.js — gadget de clima en la esquina superior de cada pagina.
   JavaScript vanilla. Esta es la UNICA llamada a un dominio ajeno de todo el sitio:
   pide el clima actual de Acambaro a Open-Meteo (api.open-meteo.com), un servicio
   publico y gratuito, sin llave ni registro. NO manda ningun dato de quien visita el
   sitio: las coordenadas son fijas, no se pide la ubicacion del visitante. Declarado
   en aviso-de-privacidad.html y en la CSP (connect-src) de cada pagina. */

(function () {
  "use strict";

  var LAT = 20.0339, LON = -100.7344; // Acambaro, Guanajuato
  var URL = "https://api.open-meteo.com/v1/forecast?latitude=" + LAT + "&longitude=" + LON +
    "&current=temperature_2m,weather_code&timezone=America%2FMexico_City";
  var REFRESCO_MS = 30 * 60 * 1000; // 30 minutos

  // Codigos WMO que usa Open-Meteo (open-meteo.com/en/docs, tabla "WMO Weather code").
  var DESCRIPCIONES = {
    0: "despejado", 1: "poco nublado", 2: "parcialmente nublado", 3: "nublado",
    45: "niebla", 48: "niebla con escarcha",
    51: "llovizna ligera", 53: "llovizna moderada", 55: "llovizna intensa",
    56: "llovizna helada", 57: "llovizna helada intensa",
    61: "lluvia ligera", 63: "lluvia moderada", 65: "lluvia intensa",
    66: "lluvia helada", 67: "lluvia helada intensa",
    71: "nieve ligera", 73: "nieve moderada", 75: "nieve intensa", 77: "nieve granulada",
    80: "chubascos ligeros", 81: "chubascos moderados", 82: "chubascos fuertes",
    85: "chubascos de nieve", 86: "chubascos de nieve fuertes",
    95: "tormenta", 96: "tormenta con granizo", 99: "tormenta con granizo fuerte"
  };

  function actualizar() {
    var el = document.getElementById("clima-texto");
    if (!el) return;
    fetch(URL, { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("http " + r.status);
        return r.json();
      })
      .then(function (datos) {
        var actual = datos.current || {};
        var temp = Math.round(actual.temperature_2m);
        var desc = DESCRIPCIONES[actual.weather_code] || "sin dato";
        el.textContent = "Acambaro: " + temp + "°C, " + desc;
      })
      .catch(function (err) {
        console.error("[clima]", err);
        el.textContent = "Clima no disponible";
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("clima-texto")) return;
    actualizar();
    setInterval(actualizar, REFRESCO_MS);
  });
})();
