/**
 * File presenter.js
 * Description: This module handles the App's state and logic
 * Author: Joshua Heninger
 */
"use strict";

// for rendering music notes
const { Factory, EasyScore, System } = Vex.Flow;
// for stable reference to bound method to button event-listeners for simple removal
let boundClick = {}; 
// watcher variable to prevent user clicks on pressing piano keys from being evaluated as answers after the first answer
var blockCheckKeyboard = false; 

// for the piano keyboard rendering and sound
// copied from the QwertyHancock source code: https://stuartmemo.com/qwerty-hancock/
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext()
var settings = {
    id: 'keyboard',
    width: 600,
    height: 150,
    startNote: 'C4',
    whiteNotesColour: '#fff',
    blackNotesColour: '#000',
    borderColour: '#000',
    activeColour: 'yellow',
    octaves: 1
}
var keyboard = new QwertyHancock(settings);

var masterGain = context.createGain();
var nodes = [];
masterGain.gain.value = 0.3;
masterGain.connect(context.destination);



/**
* This class handles the App's state and logic. It handles communication between model and view. It knows all about the current active category, the user progress for one category and Events from user input.
*/
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
    /** 
    * Returns the HTML for the category list.
    * @return {String} HTML category list String
    */    
    getCategoryListHTML() {
        const categories = this.m.getCategories();
        let listHtml = ``;
        for (let category of categories) {
            listHtml += ` <li class="clickable" id="category-${category}"><span class="category">${category}</span></li>`;
        }
        return listHtml;
    }
    /** 
    * The user selects a category from the category list.
    * This method sets the active category and loads the tasks for this category. Thereby resetting progress.
    * @param {String} category - The category to set as active.
    */
    async setCategory(category) {
        // clear the article element for new tasks based on chosen category
        this.v.clearArticleContent();

        // reset active-category state for setting a new category
        this.activeCategory = null;
        this.currCategoryTasks = [];
        this.activeTask = {};
        this.activeTaskIndex = 0;

        // reset progress tracking
        this.categoryProgress = 0;
        this.finished = 0;
        this.finishedHalf = 0;
        this.total = 0;
        this.updateProgressBar();

        // remove active-category class from all category-list Items (styling purposes)
        for (let categorySpan of document.querySelectorAll(".category")) {
            categorySpan.parentElement.classList.remove("active-category");
        }
        // add active category class to new active category nav-list-Item
        document
            .getElementById(`category-${category}`)
            .classList.add("active-category");
        this.activeCategory = category;

        this.currCategoryTasks = await this.m.getTasksForCategory(category);

        // randomize task order
        this.shuffleArray(this.currCategoryTasks);

        this.currCategoryTasks.forEach(task => {
            task.progress = 0;
        });

        // save total amount of tasks for progress tracking 
        this.total = this.currCategoryTasks.length;

        // take first task of this randomized task array as first to show
        this.activeTask = this.currCategoryTasks[this.activeTaskIndex];
        this.nextActiveTaskIndex = (this.nextActiveTaskIndex + 1) % this.currCategoryTasks.length;

        this.renderActiveTask();
    }

    /** 
    * Renders the active task based on the current active category.
    */    
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

                // randomize answers array so not the first answer is always correct
                this.shuffleArray(buttonAnswerArr);

                // add each button to the html string
                for (let answerButton of buttonAnswerArr) {
                    firstTaskHtml += `${answerButton}`;
                }
                firstTaskHtml += `</div></div>`;

                this.v.renderCategoryTask(firstTaskHtml);

                // parse katex for rendering math formulas
                this.v.parseKatex();

                // bind button EventListeners
                // this uses global variable boundClick to store the bound click methods for later removal
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

    /** 
    * Renders the task for the "allgemein" category.
    */
    renderAllgemeinTask() {
        // data structure a little different here (not a and l but text and options)
        let firstTaskHtml = `<div id="question"><span>${this.activeTask.text}</span></div>`;

        // first build each button with corresponding id 
        firstTaskHtml += `<div id="answers"><div id="button-wrapper">`;
        let buttonAnswerArr = [];
        this.activeTask.options.forEach((answer, index) => {
            buttonAnswerArr.push(
                `<button data-id="${index}">${answer}</button>`
            );
        });

        // randomize answers array so not the first answer is always correct
        this.shuffleArray(buttonAnswerArr);

        for (let answerButton of buttonAnswerArr) {
            firstTaskHtml += `${answerButton}`;
        }
        firstTaskHtml += `</div></div>`;
        firstTaskHtml += `<button id="submit-btn">Submit</button>`
        this.v.renderCategoryTask(firstTaskHtml);

        // parse katex for rendering LaTeX formulas
        this.v.parseKatex();

        // bind button EventListeners use global variable boundClick to store the bound click methods for later removal
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

    /** 
    * Uses the Model to check the answers for the current task of the "allgemein" category.
    */
    async submitAnswers() {
        // NOTE: ugly workaround to get the current task index
        let currTaskIndex = this.nextActiveTaskIndex === 0 ? this.currCategoryTasks.length - 1 : this.nextActiveTaskIndex - 1;

        // based on response from the server, change the background color of the buttons
        // and handle the progress of the current task
        let ret = await this.m.checkAnswerAllgemein(this.activeTask.id, Array.from(this.answers));
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

    /** 
    * This method gets called when the user selects and answer button for a task from the"allgemein" category.
    * @param {HTMLElement} answerButton - The button that was clicked.
    */
    selectAnswer(answerButton) {
        if (answerButton.classList.contains("selected")) {
            answerButton.classList.remove("selected");
            this.answers.delete(answerButton.dataset.id);
        } else {
            answerButton.classList.add("selected");
            this.answers.add(answerButton.dataset.id);
        }
    }


    /** 
    * Handles renderung for a music task.
    */
    renderMusicTask() {
        document.getElementById("keyboard").style.margin = "auto";
        document.getElementById("keyboard-wrapper").style.display = "block";
        // div id output for rendering Music Notes
        const out = document.getElementById("output");
        out.classList.remove("hidden");
        out.innerHTML = "";

        const vf = new Factory({
            renderer: { elementId: 'output', width: 500, height: 200 },
        });

        const score = vf.EasyScore();
        const system = vf.System();
        system.addStave({
            voices: [score.voice(score.notes(this.activeTask.a + "/w"))],
        }).addClef('treble')

        vf.draw();
    }

    /** 
    * Method to check whether the user answered correctly by clicking the correct button. For all Categories except "allgemein"
    * @summary Gets called when user presses an answer button or the keyboard. The button will change it's color to green if true else red. After this, this Eventlistener is unbound and the next Task button appears. With the keyboard, its border-color is changed based on correctness
    * @param {HTMLElement} answerButton - button that was clicked, ignored when keyboard is used
    * @param {Event} event - always ignored
    * @param {String} note - the note that was pressed on the keyboard, ignored, when the keyboard is not used
    * @return {Boolean} Whether the answer was correct: true else false
    */
    checkAnswer(answerButton, event = null, note = null) {
        let correct;
        // NOTE: ugly workaround for getting the current Tasks index
        let currTaskIndex = this.nextActiveTaskIndex === 0 ? this.currCategoryTasks.length - 1 : this.nextActiveTaskIndex - 1;

        // because the Keyboard press gets processed here as well, separate here
        if (note !== null) {
            let key;
            if (note[0] == "B") key = "H";
            else key = note[0];
            console.log(key == this.activeTask.l[0]);

            blockCheckKeyboard = true;

            correct = key == this.activeTask.l[0];
            if (correct) {
                document.getElementById("keyboard-wrapper").style.border = "8px solid green";
                this.currCategoryTasks[currTaskIndex].progress += 1;
            }
            else {
                document.getElementById("keyboard-wrapper").style.border = "8px solid red";
                if (this.currCategoryTasks[currTaskIndex].progress == 1)
                    this.finishedHalf -= 1;
                this.currCategoryTasks[currTaskIndex].progress = 0
            }

        } else {
            correct = answerButton.dataset.correct === "true";
            if (correct) {
                answerButton.style.backgroundColor = "green";
                this.currCategoryTasks[currTaskIndex].progress += 1;
            }
            else {
                answerButton.style.backgroundColor = "red";
                if (this.currCategoryTasks[currTaskIndex].progress == 1)
                    this.finishedHalf -= 1;
                this.currCategoryTasks[currTaskIndex].progress = 0
            }
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

        return correct;
    }

    /** 
    * Renders the progress bar based on the active category progress.
    */
    updateProgressBar() {
        console.log(this.finished, this.currCategoryTasks);
        const pbarYellow = document.getElementById("yellow");
        const pbarGreen = document.getElementById("green");

        // yellow part grows for each correct task
        let yellow = (this.finishedHalf * 100) / this.total;
        console.log(yellow);

        // green part grows for answering same task correctly twice in a row
        let green = (100 * this.finished) / this.total;
        console.log(green);

        pbarYellow.style.width = `${yellow}%`;
        pbarGreen.style.width = `${green}%`;
    }

    /** 
    * Reset applied styles and load next 
    */
    loadNextTaskFromCategory() {
        blockCheckKeyboard = false;
        document.getElementById("keyboard-wrapper").style.border = "none";

        this.v.clearArticleContent();
        this.activeTask = this.currCategoryTasks[this.nextActiveTaskIndex % this.currCategoryTasks.length];
        this.renderActiveTask();
        this.nextActiveTaskIndex =
            (this.nextActiveTaskIndex + 1) % this.currCategoryTasks.length;
        if (this.currCategoryTasks.length === 0) {
            this.v.renderWelcome();
        }
    }

    /** 
    * Fisher Yates Array Shuffling inplace.
    */    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

// creating Presenter here, to use it's checkAnswer Method on Keypresses
const p = new Presenter();
// Keyboard sound config copied from Qwerty-hancock-WebSite source code https://stuartmemo.com/qwerty-hancock/ 
keyboard.keyDown = function(note, frequency) {
    var oscillator = context.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = frequency;
    oscillator.connect(masterGain);
    oscillator.start(0);

    if (!blockCheckKeyboard)
        p.checkAnswer(null, null, note);

    nodes.push(oscillator);
};

keyboard.keyUp = function(note, frequency) {
    var new_nodes = [];
    for (var i = 0; i < nodes.length; i++) {
        if (Math.round(nodes[i].frequency.value) === Math.round(frequency)) {
            nodes[i].stop(0);
            nodes[i].disconnect();
        } else {
            new_nodes.push(nodes[i]);
        }
    }

    nodes = new_nodes;
};

export default p;
