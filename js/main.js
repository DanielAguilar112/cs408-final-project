

const API_URL = 'https://7rn8nt9ngi.execute-api.us-east-2.amazonaws.com/tasks';  // API endpoint

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    const span = document.createElement("span");
    span.textContent = task.text;
    span.style.cursor = "pointer";
    span.onclick = () => toggleTask(index);

    const actions = document.createElement("div");
    actions.className = "actions";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "btn-delete";
    deleteBtn.onclick = () => deleteTask(index);

    actions.appendChild(deleteBtn);
    li.appendChild(span);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();

  if (text !== "") {
    try {
      // Send the new task to the API using a POST request
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'  // Set the content type as JSON
        },
        body: JSON.stringify({ text })  // Send the task text as the request body
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const task = await response.json();  // Parse the response
      tasks.push(task);  // Add the task to the local list
      saveTasks();  // Save the updated task list in localStorage
      renderTasks();  // Re-render the tasks on the page
      input.value = "";  // Clear the input field
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Error adding task.");
    }
  }
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

renderTasks();


