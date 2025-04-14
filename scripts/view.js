// ##################### View #####################################################################
class View {
    constructor(p) {
        this.p = p;  // Presenter
        this.article = document.getElementById("q-and-a");
        this.categoryUl = document.getElementById("category-ul");
    }


    renderWelcome() {
        "renders the landing page where the user first chooses which category to learn"

        this.article.innerHTML = `<h3 id="welcome-heading">Wähle eine Kategorie zum Lernen</h3>` + this.article.innerHTML;
        this.setCategoryList();
        

    }

    setCategoryList() {
        this.categoryUl.innerHTML = this.p.getCategoryListHTML();

        // bind the Event-Listeners for the created categories
        const categorySpans = document.querySelectorAll(".category");        
        for (let category of categorySpans) {
            category.parentElement.addEventListener("click", this.p.setCategory.bind(this.p, category.textContent));
        }
    }

    renderCategoryTask(articleTaskHTML) {
        this.article.innerHTML = articleTaskHTML;
    }


    displayNextTaskButton() {
        const last = document.querySelector("article > :last-child");
        last.insertAdjacentHTML('afterend', `
            <button id="next-task-btn"><span>N</span>ext</button>
        `);
    }



    parseKatex() {
        // let katex parse latex code
        renderMathInElement(document.body, {
            // customised options
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
            ],
            throwOnError : false
          });

    }

    clearArticleContent() {
        document.querySelectorAll("#question, #answers, #welcome-heading, #keyboard, #next-task-btn").forEach(element => {
            element.remove();
        });
    }

}


export default View;