// ##################### View #####################################################################
class View {
    constructor(p) {
        this.p = p;  // Presenter
        this.article = document.getElementById("q-and-a");
        this.categoryUl = document.getElementById("category-ul");
    }


    renderWelcome() {
        "renders the landing page where the user first chooses which category to learn"

        this.article.innerHTML = `<h3 id="welcome-heading">Choose a category to learn</h3>`;

        this.setCategoryList();
        

    }

    setCategoryList() {
        this.categoryUl.innerHTML = this.p.getCategoryListHTML();
        const categorySpans = document.querySelectorAll(".category");

        // bind the Event-Listeners
        for (let category of categorySpans) {
            category.parentElement.addEventListener("click", this.p.setCategory.bind(this.p, category.textContent));
        }
    }

    renderCategoryTask(articleTaskHTML) {
        this.article.innerHTML = articleTaskHTML;

        const answerButtons = document.querySelectorAll("#button-wrapper > button");
        // bind button EventListeners
        for (let answerButton of answerButtons) {
            answerButton.addEventListener("click", this.p.checkAnswer.bind(this.p, answerButton));
        }
    }


}


export default View;