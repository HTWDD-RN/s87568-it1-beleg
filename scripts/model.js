/**
 * Module Model.js
 *
 * This handles the tasks data for the presenter. What tasks and which categories exist.
 *
 * The available categories are:
 *  * mathe, noten, allgemein, web
 *
 * where allgemein is going to consist of questions being handled by the 
 * WebQuiz API at https://idefix.informatik.htw-dresden.de:8888/api. 
 * View the api module for further details.
 * All other categories are stored in json/tasks-statc.json.
 */
import api from "./api.js";




class Model {
    /**
     * Creates new model object for handling tasks data.
     * Reads the main tasks JSON file into memory.
     * This constructor sets the ready property of the Model object,
     * which contains the Promise, to handle the asyncronous loading
     * of the json file
     * 
     */
    constructor() {
        this.categoryData = {};
        // fetch json data into memory
        // fetch needs to finish, so store the Promise in this.ready to use it for callers to synchronize
        this.ready = fetch("./json/tasks-static.json")
            .then((response) => response.json()) // Parse JSON
            .then((data) => (this.categoryData = data))
            .catch((error) => console.error("Error fetching JSON:", error));
    }


    /**
     * Return array with all category names
     */
    getCategories() {
        return Object.keys(this.categoryData);
    }

    /**
     * @returns array of tasks objects for selected category
    */
    async getTasksForCategory(category) {
        if (category === "allgemein") {
            let quizzes = await api.getQuizzes();

            // always save the last batch of tasks to memory
            // for offline convenience
            this.categoryData["allgemein"] = quizzes;
            return quizzes;
        }

        return this.categoryData[category];
    }




    /**
     * Given an answer to a task of category "allgemein"
     * check if the answer is correct
     *
     * @param taskId
     * @param answers int[] Array of answers, can be empty or have distinct values from 0 to 4
     * @returns bool 
     *
     */
    async checkAnswerAllgemein(taskId, answers) {
        let data = await api.solve(taskId, answers);
        return data.success;
    }
}



export default new Model();
