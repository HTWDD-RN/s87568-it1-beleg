"use strict";

import Model from "./model.js";
import Presenter from "./presenter.js";
import View from "./view.js";






//let p, v, m;
document.addEventListener('DOMContentLoaded', function () {
    // let m = new Model();
    // let p = new Presenter();
    // let v = new View(p);
    // p.setModelAndView(m, v);
    //p.setTask();
    fetch("./json/tasks-static.json")
        .then(response => response.json()) // Parse JSON
        .then(data => console.log(data)) // Work with JSON data
        .catch(error => console.error('Error fetching JSON:', error));

});


