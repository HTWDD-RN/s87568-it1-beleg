
/**
 * Filie api.js
 * Author: Joshua Heninger
 */


/**
* handles the tasks of the "allgemein" category, by connecting to a webquiz server https://github.com/swsms/web-quiz-engine
*/
class api {
    constructor() {
        this.serverAddr = "https://idefix.informatik.htw-dresden.de:8888/api";
        this.user = "joshua.heninger@stud.htw-dresden.de";
        this.passwd = "tafelwerk";
        this.page = Math.floor(Math.random() * 100); // Randomize the starting page to fetch

        // Encode credentials to Base64 for Basic Auth
        this.credentials = btoa(`${this.user}:${this.passwd}`);
    }

    /**
    * Get Array of max. 10 Quizzes from the server.
    * this.page sets the next page to get. This function increments it
    *
    * @return {Array} Array of 10 Quizzes
    */
    async getQuizzes() {
        let response = await fetch(this.serverAddr + "/quizzes?page=" + this.page, {
            method: "GET",
            headers: {
                "Authorization": `Basic ${this.credentials}`
            }
        })
        let data = await response.json();
        let prevPage = this.page;
        // Randomize the page to get a different set of quizzes each time
        while (this.page === prevPage) {
            // Ensure we don't get the same page again
            this.page = Math.floor(Math.random() * data.totalPages);
        }

        return data.content;
    }

    /** 
    * Brief description of the function here.
    * @summary If the description is long, write your summary here. Otherwise, feel free to remove this.
    * @param {Number} taskId - The ID of the task to solve.
    * @param {Object} answers - The answers to the task. There can be multiple answers
    * @return {Object} includes whether the question was answered correctly
    */
    async solve(taskId, answers) {
        let response = await fetch(this.serverAddr + "/quizzes/" + taskId + "/solve", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${this.credentials}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(answers)
        })
        let data = await response.json();
        
        return data;
    }
}

export default new api();
