// ############# Model ###########################################################################
class Model {
    constructor() {
        this.categoryData = {};
        // fetch json data into memory
        // fetch needs to finish, so store the Promise in this.ready to use it for callers to synchronize
        this.ready = fetch("./json/tasks-static.json")
            .then((response) => response.json()) // Parse JSON
            .then((data) => (this.categoryData = data))
            .catch((error) => console.error("Error fetching JSON:", error));
    }

    getCategories() {
        "return array with all category names";
        return Object.keys(this.categoryData);
    }

    getTasksForCategory(category) {
        "return array of tasks for selected category";
        return this.categoryData[category];
    }
}

export default Model;
