"use strict";

import Model from "./model.js";
import Presenter from "./presenter.js";
import View from "./view.js";

document.addEventListener("DOMContentLoaded", function () {
    let m = new Model();
    let p = new Presenter();
    let v = new View(p);

    // model loads some data async, so wait for it to finish loading
    m.ready.then(() => {
        p.setModelAndView(m, v);
        v.renderWelcome();
    });
});
