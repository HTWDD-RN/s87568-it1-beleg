// ############ Presenter ########################################################################

let boundClick = {}; // for stable reference to bound method to button event-listeners for simple removal

const { Factory, EasyScore, System } = Vex.Flow;


class Presenter {
    constructor() {
        this.activeCategory = null;
        this.currCategoryTasks = [];
        this.categoryProgress = 0;
        this.activeTask = {};
        this.nextActiveTaskIndex = 0;
        this.answers = new Set();
        this.finished = 0;
        this.finishedHalf = 0;
        this.total = 0;

    }

    setModelAndView(m, v) {
        this.m = m;
        this.v = v;

    }

    getCategoryListHTML() {
        const categories = this.m.getCategories();
        let listHtml = ``;
        for (let category of categories) {
            listHtml += ` <li class="clickable" id="category-${category}"><span class="category">${category}</span></li>`;
        }
        return listHtml;
    }

    async setCategory(category) {

        // clear the article element for new tasks based on chosen category
        this.v.clearArticleContent();

        // reset active-category state for setting a new category
        this.activeCategory = null;
        this.currCategoryTasks = [];
        this.activeTask = {};
        this.activeTaskIndex = 0;
        this.categoryProgress = 0;
        this.finished = 0;
        this.finishedHalf = 0;
        this.total = 0;


        this.updateProgressBar();

        // remove active-category class from all category-list Items
        for (let categorySpan of document.querySelectorAll(".category")) {
            categorySpan.parentElement.classList.remove("active-category");
        }
        // add active category class to new active category nav-list-Item
        document
            .getElementById(`category-${category}`)
            .classList.add("active-category");
        this.activeCategory = category;

        // TODO: maybe get n amount of tasks, then use them
        // except "allgemein" category as that always gives only max. 10
        this.currCategoryTasks = await this.m.getTasksForCategory(category);
        // randomize task order
        this.shuffleArray(this.currCategoryTasks);
        // TEST: console.log(this.currCategoryTasks);

        this.currCategoryTasks.forEach(task => {
            task.progress = 0;
        });


        // save total amount of tasks for progress tracking 
        this.total = this.currCategoryTasks.length;


        // take first task of this randomized task array as first to show
        this.activeTask = this.currCategoryTasks[this.activeTaskIndex];
        this.nextActiveTaskIndex =
            (this.nextActiveTaskIndex + 1) % this.currCategoryTasks.length;

        this.renderActiveTask();
    }


    renderActiveTask() {

        // build question and answer block with first task
        let firstTaskHtml = `<div id="question"><span>${this.activeTask.a}</span></div>`;

        // handle special categories (noten, allgemein)
        switch (this.activeCategory) {
            case "allgemein":
                this.renderAllgemeinTask();
                return;
            case "noten":
                this.renderMusicTask();
                firstTaskHtml = "";
            default:
                // first build each button with corresponding solution value
                firstTaskHtml += `<div id="answers"><div id="button-wrapper">`;
                let buttonAnswerArr = [];
                this.activeTask.l.forEach((answer, index) => {
                    buttonAnswerArr.push(
                        `<button data-correct=${index === 0 ? "true" : "false"
                        }>${answer}</button>`
                    );
                });

                // use Fisher-Yates shuffle algorithm to randomize answers array so
                // not the first answer is always correct
                this.shuffleArray(buttonAnswerArr);

                for (let answerButton of buttonAnswerArr) {
                    firstTaskHtml += `${answerButton}`;
                }
                firstTaskHtml += `</div></div>`;

                this.v.renderCategoryTask(firstTaskHtml);
                this.v.parseKatex();

                // bind button EventListeners
                document.querySelectorAll("#button-wrapper > button").forEach(
                    function(answerButton, buttonKey) {
                        boundClick[buttonKey] = this.checkAnswer.bind(
                            this,
                            answerButton
                        );
                        answerButton.addEventListener(
                            "click",
                            boundClick[buttonKey]
                        );
                    }.bind(this)
                );
        }
    }

    renderAllgemeinTask() {

        // data structure a little different here
        let firstTaskHtml = `<div id="question"><span>${this.activeTask.text}</span></div>`;

        // first build each button with corresponding id 
        firstTaskHtml += `<div id="answers"><div id="button-wrapper">`;
        let buttonAnswerArr = [];
        this.activeTask.options.forEach((answer, index) => {
            buttonAnswerArr.push(
                `<button data-id="${index}">${answer}</button>`
            );
        });

        // use Fisher-Yates shuffle algorithm to randomize answers array so
        // not the first answer is always correct
        this.shuffleArray(buttonAnswerArr);

        for (let answerButton of buttonAnswerArr) {
            firstTaskHtml += `${answerButton}`;
        }
        firstTaskHtml += `</div></div>`;

        firstTaskHtml += `<button id="submit-btn" >Submit</button>`

        this.v.renderCategoryTask(firstTaskHtml);
        this.v.parseKatex();

        // bind button EventListeners
        document.getElementById("submit-btn").addEventListener("click", this.submitAnswers.bind(this));
        document.querySelectorAll("#button-wrapper > button").forEach(
            function(answerButton, buttonKey) {
                boundClick[buttonKey] = this.selectAnswer.bind(
                    this,
                    answerButton
                );
                answerButton.addEventListener(
                    "click",
                    boundClick[buttonKey]
                );
            }.bind(this)
        );
    }


    async submitAnswers() {
        // TEST: console.log(this.answers, this.activeTask.id, Array.from(this.answers));

        let currTaskIndex = this.nextActiveTaskIndex === 0 ? this.currCategoryTasks.length - 1 : this.nextActiveTaskIndex - 1;

        let ret = await this.m.checkAnswerAllgemein(this.activeTask.id, Array.from(this.answers));
        // console.log(ret);
        //
        let bgcol;
        if (ret) {
            bgcol = "green";
            this.currCategoryTasks[currTaskIndex].progress += 1;
        }
        else {
            bgcol = "red";
            if (this.currCategoryTasks[currTaskIndex].progress == 1)
                this.finishedHalf -= 1;
            this.currCategoryTasks[currTaskIndex].progress = 0
        }


        if (this.currCategoryTasks[currTaskIndex].progress == 2) {
            this.currCategoryTasks.splice(currTaskIndex, 1);
            this.finished += 1;
        } else if (this.currCategoryTasks[currTaskIndex].progress == 1) {
            this.finishedHalf += 1;
        }

        this.updateProgressBar();





        Array.from(this.answers).forEach((answer) => {
            // console.log(answer)
            let button = document.querySelector(`[data-id="${answer}"]`);
            button.classList.remove("selected");
            button.style.backgroundColor = bgcol;
        })


        this.answers.clear();

        document.getElementById("submit-btn").remove();

        this.v.displayNextTaskButton();
        // add the eventlistener for the nextTask button
        document
            .getElementById("next-task-btn")
            .addEventListener(
                "click",
                this.loadNextTaskFromCategory.bind(this)
            );



    }


    selectAnswer(answerButton) {
        if (answerButton.classList.contains("selected")) {
            answerButton.classList.remove("selected");
            this.answers.delete(answerButton.dataset.id);
        } else {
            answerButton.classList.add("selected");
            this.answers.add(answerButton.dataset.id);
        }

        // console.log(answerButton.dataset.id);
        // console.log(this.answers);
    }




    renderMusicTask() {

        // div id output for rendering question
        const out = document.getElementById("output");
        out.classList.remove("hidden");
        out.innerHTML = "";

        const vf = new Factory({
            renderer: { elementId: 'output', width: 500, height: 200 },
        });

        const score = vf.EasyScore();
        const system = vf.System();





        // // Create a stave of width 400 at position 10, 40.
        // const stave = new Stave(10, 40, 400);
        //
        // // Add a clef and time signature.
        // stave.addClef('treble').addTimeSignature('4/4');
        //
        // // Connect it to the rendering context and draw!
        // stave.setContext(context).draw();
        //
        //
        system
            .addStave({
                voices: [
                    // score.voice(score.notes('C#5/q, B4, A4, G#4', { stem: 'up' })),
                    // score.voice(score.notes('C#4/h, C#4', { stem: 'down' })),
                    score.voice(score.notes(this.activeTask.a + "/w"))
                ],
            })
            .addClef('treble')
        // .addTimeSignature('1/2');

        vf.draw();
    }



    // checkNoteEvent(note) {
    //     `this method gets called, when a piano key is pressed during a notes-category question;
    //     this note is then compared to the solution in the task obj. `;
    //     console.log(note === this.activeTask.l[0]);
    //     return note === this.activeTask.l[0];
    // }

    checkAnswer(answerButton) {
        // when the user presses a button for an answer,
        // the button will change it's color to green if true else red.
        // After this, this Eventlistener is unbound and the next Task button
        // appears.
        //
        let currTaskIndex = this.nextActiveTaskIndex === 0 ? this.currCategoryTasks.length - 1 : this.nextActiveTaskIndex - 1;

        console.log("index ", currTaskIndex);


        if (answerButton.dataset.correct === "true") {
            answerButton.style.backgroundColor = "green";
            this.currCategoryTasks[currTaskIndex].progress += 1;
        }
        else {
            answerButton.style.backgroundColor = "red";
            if (this.currCategoryTasks[currTaskIndex].progress == 1)
                this.finishedHalf -= 1;
            this.currCategoryTasks[currTaskIndex].progress = 0
        }


        if (this.currCategoryTasks[currTaskIndex].progress == 2) {
            this.currCategoryTasks.splice(currTaskIndex, 1);
            this.finished += 1;
        } else if (this.currCategoryTasks[currTaskIndex].progress == 1) {
            this.finishedHalf += 1;
        }

        this.updateProgressBar();

        document
            .querySelectorAll("#button-wrapper > button")
            .forEach((button, buttonKey) => {
                // console.log(button);
                button.removeEventListener("click", boundClick[buttonKey]);
            });

        this.v.displayNextTaskButton();
        // add the eventlistener for the nextTask button
        document
            .getElementById("next-task-btn")
            .addEventListener(
                "click",
                this.loadNextTaskFromCategory.bind(this)
            );

        return answerButton.dataset.correct === "true";
    }

    updateProgressBar() {
        console.log(this.finished, this.currCategoryTasks);
        const pbarYellow = document.getElementById("yellow");
        const pbarGreen = document.getElementById("green");

        let yellow = (this.finishedHalf * 100) / this.total;
        console.log(yellow);

        let green = (100 * this.finished) / this.total;
        console.log(green);


        pbarYellow.style.width = `${yellow}%`;
        pbarGreen.style.width = `${green}%`;
    }

    loadNextTaskFromCategory() {
        this.v.clearArticleContent();
        this.activeTask = this.currCategoryTasks[this.nextActiveTaskIndex % this.currCategoryTasks.length];
        this.renderActiveTask();
        this.nextActiveTaskIndex =
            (this.nextActiveTaskIndex + 1) % this.currCategoryTasks.length;
        if (this.currCategoryTasks.length === 0) {
            this.v.renderWelcome();
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

export default new Presenter();
