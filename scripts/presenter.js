
// ############ Presenter ########################################################################


let boundClick = {}; // for stable reference to bound method to button event-listeners for simple removal


class Presenter {
    constructor() {
        this.activeCategory = null;
        this.currCategoryTasks = [];
        this.activeTask = {};
        this.nextActiveTaskIndex = 0;

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

    setCategory(category) {

        // clear the article element for new based on chosen category
        this.v.clearArticleContent();

        // reset active-category state for setting a new category
        this.activeCategory = null;
        this.currCategoryTasks = [];
        this.activeTask = {};
        this.activeTaskIndex = 0;

        // remove active-category class from all category-list Items
        for (let categorySpan of document.querySelectorAll(".category")) {
            categorySpan.parentElement.classList.remove("active-category");
        }
        // add active category class to new active category nav-list-Item
        document.getElementById(`category-${category}`).classList.add("active-category");
        this.activeCategory = category;

        
        // TODO: maybe get n amount of tasks, then use them
        this.currCategoryTasks = this.m.getTasksForCategory(category);
        // randomize task order
        this.shuffleArray(this.currCategoryTasks);
        console.log(this.currCategoryTasks);

        // take first task of this randomized task array as first to show
        this.activeTask = this.currCategoryTasks[this.activeTaskIndex];
        this.nextActiveTaskIndex = (this.nextActiveTaskIndex + 1) % this.currCategoryTasks.length;

        this.renderTask();
        
     
    }

    renderTask() {
        // build question and answer block with first task (same for all categories)
        let firstTaskHtml = `<div id="question"><span>${this.activeTask.a}</span></div>`;

        // handle special categories 
        switch (this.activeCategory) {
            case ("noten"): 
                // TODO: add method to handle virtual keyboard
                // this.loadKeyboard();
                break;
            default:
                // first build each button with corresponding solution value
                firstTaskHtml += `<div id="answers"><div id="button-wrapper">`;
                let buttonAnswerArr = [];
                this.activeTask.l.forEach((answer, index) => {
                    buttonAnswerArr.push(`<button data-correct=${ index === 0 ? "true" : "false"}>${answer}</button>`);
                });
                    
                // use Fisher-Yates shuffle algorithm to randomize answers array so
                // not the first answer is always correct
                this.shuffleArray(buttonAnswerArr);
                

                for (let answerButton of buttonAnswerArr) {
                    firstTaskHtml += `${answerButton}`
                }
                firstTaskHtml +=  `</div></div>`;    
                
                this.v.renderCategoryTask(firstTaskHtml);
                this.v.parseKatex();

                // bind button EventListeners
                document.querySelectorAll("#button-wrapper > button").forEach(function (answerButton, buttonKey) {
                    boundClick[buttonKey] = this.checkAnswer.bind(this, answerButton);
                    answerButton.addEventListener("click", boundClick[buttonKey]);
                }.bind(this));
        }
    }


    checkNoteEvent(note) {
        `this method gets called, when a piano key is pressed during a notes-category question;
        this note is then compared to the solution in the task obj. `
        console.log(note === this.activeTask.l[0]);
        return note === this.activeTask.l[0];

    }




    checkAnswer(answerButton) {
        // when the user presses a button for an answer,
        // the button will change it's color to green if true else red.
        // After this, this Eventlistener is unbound and the next Task button
        // appears.

        if (answerButton.dataset.correct === "true")
            answerButton.style.backgroundColor = "green";
        else 
            answerButton.style.backgroundColor = "red";

        document.querySelectorAll("#button-wrapper > button").forEach((button, buttonKey) => {
            // console.log(button);
            button.removeEventListener("click", boundClick[buttonKey]);
        });

        
        this.v.displayNextTaskButton();
        // add the eventlistener for the nextTask button
        document.getElementById("next-task-btn").addEventListener("click",this.loadNextTaskFromCategory.bind(this));

        return answerButton.dataset.correct === "true";
    }

    loadNextTaskFromCategory() {

        this.activeTask = this.currCategoryTasks[this.nextActiveTaskIndex];
        this.renderTask();
        this.nextActiveTaskIndex = (this.nextActiveTaskIndex + 1) % this.currCategoryTasks.length;

    }


    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
    }

}



export default Presenter;