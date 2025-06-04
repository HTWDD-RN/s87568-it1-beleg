/**
 * Filie main.js
 * Description: This is the main entry point for the application. It initializes the model, presenter, and view, and sets up the service worker.
 * Author: Joshua Heninger
 */

"use strict";

import m from "./model.js";
import p from "./presenter.js";
import View from "./view.js";

// Regitering a very simple service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.error('Service Worker registration failed:', err));
  });
}

document.addEventListener("DOMContentLoaded", function() {
  let v = new View(p);

  // model loads some data async, so wait for it to finish loading
  m.ready.then(() => {
    console.log("Loading App");
    console.log(m.getCategories());
    p.setModelAndView(m, v);
    v.renderWelcome();
  });
});
