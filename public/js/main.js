// Main.js
// bootstrap traceur

traceur.options.sourceMaps = true;
new traceur.WebPageTranscoder(document.location.href).run();