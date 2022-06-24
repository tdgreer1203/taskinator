var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var taskIdCounter = 0;
var taskArray = [];

var taskFormHandler = function(event) {
    event.preventDefault();
    
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    if(!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");

    if(isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        createTaskEl(taskDataObj);
    }
};

var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("Task Updated");

    formEl.removeAttribute("data-task-id");
    document.querySelector('#save-task').textContent = "Add Task";

    taskArray[taskId].name = taskName;
    taskArray[taskId].type = taskType;
    saveTasks();
};

var createTaskEl = function(taskDataObj) {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    var taskActionsEl = createTaskActions(taskIdCounter);

    listItemEl.appendChild(taskInfoEl);
    listItemEl.appendChild(taskActionsEl);
    tasksToDoEl.appendChild(listItemEl);

    taskDataObj.id = taskIdCounter;
    taskArray.push(taskDataObj);

    saveTasks();

    taskIdCounter++;
};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        statusSelectEl.appendChild(statusOptionEl);
    }

    actionContainerEl.appendChild(editButtonEl);
    actionContainerEl.appendChild(deleteButtonEl);
    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);

var taskButtonHandler = function(event) {
    var targetEl = event.target;
    if(targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id")
        deleteTask(taskId);
    } else if(targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    saveTasks();
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskArray.splice(taskId, 1);
    taskSelected.remove();
    saveTasks();
};

var editTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type'").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);

    taskArray[taskId].name = document.querySelector("input[name='task-name']").value;
    taskArray[taskId].type = document.querySelector("select[name='task-type'").value;
    saveTasks();
};

var taskStatusChangeHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");
    var statusValue = event.target.value.toLowerCase();
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    if(statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } else if(statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    } else if(statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    taskArray[taskId].status = statusValue;
    saveTasks();
};

var saveTasks = function() {
    console.log(taskArray);
    localStorage.setItem("tasks", JSON.stringify(taskArray));
};

var loadTasks = function() {
    var tasks = localStorage.getItem("tasks");
    if(!tasks) {
        tasks = [];
        return false;
    } 
    
    tasks = JSON.parse(tasks);
    throwItUp(tasks);
};

var throwItUp = function(tasks) {   
    console.log(tasks);
    taskIdCounter = 0;
    for(var i = 0; i < tasks.length; i++) {
        taskIdCounter++;
        console.log(tasks[i].status);
        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";

        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        listItemEl.setAttribute("data-task-id", tasks[i].id);
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";

        var actionContainerEl = document.createElement("div");
        actionContainerEl.className = "task-actions";

        var editButtonEl = document.createElement("button");
        editButtonEl.textContent = "Edit";
        editButtonEl.className = "btn edit-btn";
        editButtonEl.setAttribute("data-task-id", tasks[i].id);

        var deleteButtonEl = document.createElement("button");
        deleteButtonEl.textContent = "Delete";
        deleteButtonEl.className = "btn delete-btn";
        deleteButtonEl.setAttribute("data-task-id", tasks[i].id);

        var statusSelectEl = document.createElement("select");
        statusSelectEl.className = "select-status";
        statusSelectEl.setAttribute("name", "status-change");
        statusSelectEl.setAttribute("data-task-id", tasks[i].id);
        var statusChoices = ["To Do", "In Progress", "Completed"];
        for(var x = 0; x < statusChoices.length; x++) {
            var statusOptionEl = document.createElement("option");
            statusOptionEl.textContent = statusChoices[x];
            statusOptionEl.setAttribute("value", statusChoices[x]);
            statusSelectEl.appendChild(statusOptionEl);
        }

        if(tasks[i].status === "to do") {
            statusSelectEl.selectedIndex = 0;
        } else if(tasks[i].status === "in progress") {
            statusSelectEl.selectedIndex = 1;
        } else {
            statusSelectEl.selectedIndex = 2;
        }

        actionContainerEl.appendChild(editButtonEl);
        actionContainerEl.appendChild(deleteButtonEl);
        actionContainerEl.appendChild(statusSelectEl);

        listItemEl.appendChild(taskInfoEl);
        listItemEl.appendChild(actionContainerEl);

        if(tasks[i].status === "to do") {
            tasksToDoEl.appendChild(listItemEl);
        } else if(tasks[i].status === "in progress") {
            tasksInProgressEl.appendChild(listItemEl);
        } else {
            tasksCompletedEl.appendChild(listItemEl);
        }

        taskArray.push(tasks[i]);
        saveTasks();
    }
}

pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
loadTasks();