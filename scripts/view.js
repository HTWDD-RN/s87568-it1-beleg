/**
 * Filie view.js
 * Description: Main Rendering functions are implemented here. 
 * Author: Joshua Heninger
 */

/**
* Handles main dynamic HTML rendering
*/
class View {
    constructor(p) {
        this.p = p; // Presenter
        this.article = document.getElementById("q-and-a");
        this.categoryUl = document.getElementById("category-ul");
    }

    /** 
    * Renders the landing page where the user first chooses which category to learn
    */    
    renderWelcome() {

        this.article.insertAdjacentHTML('beforeend', `<h3 id="welcome-heading">Wähle eine Kategorie zum Lernen</h3>`);
        this.setCategoryList();
    }

    /** 
    * Renders a List of Categories
    */     
    setCategoryList() {
        this.categoryUl.innerHTML = this.p.getCategoryListHTML();

        // bind the Event-Listeners for the created categories
        const categorySpans = document.querySelectorAll(".category");
        for (let category of categorySpans) {
            category.parentElement.addEventListener(
                "click",
                this.p.setCategory.bind(this.p, category.textContent)
            );
        }
    }

    /** 
    * Renders Task inside the article tag
    */ 
    renderCategoryTask(articleTaskHTML) {
        this.article.insertAdjacentHTML('beforeend', articleTaskHTML);
    }

    displayNextTaskButton() {
        const last = document.querySelector("article > :last-child");
        last.insertAdjacentHTML(
            "afterend",
            `
            <button id="next-task-btn"><span>N</span>ext</button>
        `
        );
    }

    /** 
    * Parses LaTeX Math
    */ 
    parseKatex() {
        // let Katex parse latex code
        renderMathInElement(document.body, {
            // customized options
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false },
            ],
            throwOnError: false,
        });
    }

    /** 
    * Clears the article tags' content for new content
    */ 
    clearArticleContent() {
        document.getElementById("keyboard-wrapper").style.display = "none";
        document.getElementById("keyboard-wrapper").style.border = "none";
        document
            .querySelectorAll(
                "#question, #answers, #welcome-heading, #next-task-btn, #submit-btn"
            )
            .forEach((element) => {
                element.remove();
            });
        document.getElementById("output").classList.add("hidden");
    }
}

export default View;
