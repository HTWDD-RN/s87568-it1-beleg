/**
    * The api module handles the tasks of the 
    * "allgemein" category
    *
    *
    *
    */


class api {


    constructor() {
        this.serverAddr = "https://idefix.informatik.htw-dresden.de:8888/api";
        this.user = "joshua.heninger@stud.htw-dresden.de";
        this.passwd = "tafelwerk";
        this.page = Math.floor(Math.random() * 100); // Randomize the starting page

        // Encode credentials to Base64 for Basic Auth
        this.credentials = btoa(`${this.user}:${this.passwd}`);

    }

    /**
    * Get Array of max. 10 Quizzes from the server.
    * this.page sets the next page to get. This function increments it
    *
    *
    */
    async getQuizzes() {
        let response = await fetch(this.serverAddr + "/quizzes?page=" + this.page, {
            method: "GET",
            headers: {
                "Authorization": `Basic ${this.credentials}`
            }
        })
        let data = await response.json();
        // this.page++ % data.totalPages;
        let prevPage = this.page;
        // Randomize the page to get a different set of quizzes each time
        while (this.page === prevPage) {
            // Ensure we don't get the same page again
            this.page = Math.floor(Math.random() * data.totalPages);
        }


        return data.content;
    }



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

        console.log(data);

        return data;
    }



}


export default new api();
