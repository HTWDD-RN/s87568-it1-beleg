"use strict";

import m from "./model.js";
import p from "./presenter.js";
import View from "./view.js";



if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
  navigator.serviceWorker.register('/scripts/service-worker.js')
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
