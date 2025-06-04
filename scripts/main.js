"use strict";

import m from "./model.js";
import p from "./presenter.js";
import View from "./view.js";


// var keyboard = new QwertyHancock({
//   id: 'keyboard',
//   width: 600,
//   height: 150,
//   octaves: 2,
//   startNote: 'A3',
//   whiteNotesColour: 'white',
//   blackNotesColour: 'black',
//   hoverColour: '#f3e939'
// });




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
