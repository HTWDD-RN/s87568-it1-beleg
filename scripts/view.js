// ##################### View #####################################################################
class View {
    constructor(p) {
        this.p = p;  // Presenter
        this.setHandler();
    }

    setHandler() {
        // use capture false -> bubbling (von unten nach oben aufsteigend)
        // this soll auf Objekt zeigen -> bind (this)
        document.getElementById("answer").addEventListener("click", this.checkEvent.bind(this), false);
        document.getElementById("start").addEventListener("click", this.start.bind(this), false);
    }

    start() {
        this.p.setTask();
    }

    static inscribeButtons(i, text, pos) {
        document.querySelectorAll("#answer > *")[i].textContent = text;
        document.querySelectorAll("#answer > *")[i].setAttribute("number", pos);
    }

    checkEvent(event) {
        console.log(event.type);
        if (event.target.nodeName === "BUTTON") {
            this.p.checkAnswer(Number(event.target.attributes.getNamedItem("number").value));
        }
    }

    static renderText(text) {
        //this.clearElement("boo");
        let div = document.getElementById("boo");
        let p = document.createElement("p");
        p.innerHTML = text;
        div.appendChild(p);
    }
}


export default View;