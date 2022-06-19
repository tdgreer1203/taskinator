var buttonEl = document.querySelector("#save-task");
var ulEl = document.querySelector("#tasks-to-do");

var createTaskHandler = function() {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.textContent = "This is a new task.";
    console.log(listItemEl);
    ulEl.appendChild(listItemEl);
};

buttonEl.addEventListener("click", createTaskHandler);