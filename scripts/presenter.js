
// ############ Presenter ########################################################################
import QHkeyboard from "./keyboardConfig.js";


const synth = new Tone.Synth().toDestination();

class Presenter {
    constructor() {
        this.anr = 0;
        this.activeCategory = null;
        this.activeTask = {};
        this.keyboard = QHkeyboard;



        this.keyboard.keyDown = function (note, frequency) {
            synth.triggerAttack(note);
        };
        
        this.keyboard.keyUp = function (note, frequency) {
            synth.triggerRelease();
        };

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
        document.getElementById("welcome-heading")?.remove();


        // remove active categoryy class from all category-list Items
        for (let categorySpan of document.querySelectorAll(".category")) {
            categorySpan.parentElement.classList.remove("active-category");
        }
        // add active category class to new active category
        document.getElementById(`category-${category}`).classList.add("active-category");
        this.activeCategory = category;

        
    
        let tasks = this.m.getTasksForCategory(category);
        // TODO: choose random task not just first
        this.shuffleArray(tasks);
        this.activeTask = tasks[0];

        // add inline latex to math questions and answers
        // if (category === "mathe") {
        //     this.activeTask.a = "$"+ this.activeTask.a + "$";
        //     for (let i = 0; i < this.activeTask.l.length; i++) {
        //         this.activeTask.l[i] = "$" + this.activeTask.l[i] + "$";
        //     }
        // }
        // console.log(this.activeTask);

        
        // build question and answer block with first task
        let firstTaskHtml = `<div id="question"><span>${this.activeTask.a}</span></div>`;


         // handle special case of adding virtual piano to notes category
         const keyboardWrapper = document.getElementById("keyboard-wrapper");
        //  console.log(keyboard);
         keyboardWrapper.style.display = "none";
         if (category === "noten") {
             keyboardWrapper.style.display = "flex";
 
             this.keyboard.keyDown = function (note, frequency) {
                 // keydown should now be treated as the answer-interface for the user
                 synth.triggerAttack(note);
                 const keyPressed = document.getElementById(note);
                 const bgCol = keyPressed.dataset.noteType;
 
                 // console.log(note);
                 // change backgroundColor depending on correctness for one second
                 if (this.checkNoteEvent(note))
                     keyPressed.style.backgroundColor = "green";
                 else
                     keyPressed.style.backgroundColor = "red";
 
                 // reset bg color
                 setTimeout(() => {
                     keyPressed.style.backgroundColor = bgCol; // or original color like 'white'
                 }, 2000);
 
             }.bind(this);

             this.v.renderCategoryTask(firstTaskHtml);
             return;
         }


        
        

        // first build each button with corresponding solution value
        firstTaskHtml += `<div id="answers"><div id="button-wrapper">`;
        let buttonAnswerArr = [];
        this.activeTask .l.forEach((answer, index) => {

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


    checkNoteEvent(note) {
        `this method gets called, when a piano key is pressed during a notes-category question;
        this note is then compared to the solution in the task obj. `
        console.log(note === this.activeTask.l[0]);
        return note === this.activeTask.l[0];

    }




    checkAnswer(answerButton) {
        // extract the data-correct attribute for handling checkanswer(data-correct)
        let dataCorrect = answerButton.dataset.correct;
        // this.v.renderCategoryTask(dataCorrect === "true");
        if (dataCorrect === "true")
            answerButton.style.backgroundColor = "green";
        else 
            answerButton.style.backgroundColor = "red";
    

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