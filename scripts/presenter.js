
// ############ Controller ########################################################################
class Presenter {
    constructor() {
        this.anr = 0;
        this.activeCategory = null;
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
        // remove active categoryy class from all list Items
        for (let categorySpan of document.querySelectorAll(".category")) {
            categorySpan.parentElement.classList.remove("active-category");
        }
        // add active category class to new active category
        document.getElementById(`category-${category}`).classList.add("active-category");

        this.activeCategory = category;

        const keyboard = document.getElementById("keyboard");
        keyboard.style.display = "none";
        console.log(category);
        if (category === "noten") {
            keyboard.style.display = "block";
        }

        let tasks = this.m.getTasksForCategory(category);
        // TODO: choose random task not just first
        this.shuffleArray(tasks);

        let firstTask = tasks[0];
        
        // build question and answer block with first task
        let firstTaskHtml = `<div id="question"><span>${firstTask.a}</span></div><div id="answers"><div id="button-wrapper">`;

        // first build each button with corresponding solution value
        let buttonAnswerArr = [];
        firstTask.l.forEach((answer, index) => {

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
    }


    checkAnswer(answerButton) {
        // extract the data-correct attribute for handling checkanswer(data-correct)
        let dataCorrect = answerButton.dataset.correct;
        this.v.renderCategoryTask(dataCorrect === "true");
        console.log(dataCorrect === "true");

    }


    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
    }

}



export default Presenter;