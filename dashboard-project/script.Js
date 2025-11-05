function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString();
  document.getElementById("clock").textContent = time;
}

setInterval(updateClock, 1000);
updateClock();


function saveTasks() {
  const tasks = [];
  const completed = [];

  document.querySelectorAll("#taskList li").forEach(li => {
    const text = li.querySelector("span").textContent;
    const createdAt = li.dataset.created;
    tasks.push({ text, createdAt });
  });

  document.querySelectorAll("#completedList li").forEach(li => {
    const text = li.querySelector("span").textContent;
    const completedAt = li.dataset.completed;
    completed.push({ text, completedAt });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("completedTasks", JSON.stringify(completed));
}


function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const savedCompleted = JSON.parse(localStorage.getItem("completedTasks")) || [];

  savedTasks.forEach(task => addTask(task.text, false, task.timestamp));
  savedCompleted.forEach(task => addTask(task.text, true, task.timestamp));

  updateProgress();
}


function addTask(taskText, isCompleted = false, timestamp = null) {
  const li = document.createElement("li");

  const now = new Date();
  
  if (!timestamp) {
    timestamp = now.toISOString();
  }

  li.dataset[isCompleted ? "completed" : "created"] = timestamp;

  const formatted = formatTimestamp(timestamp);

  li.innerHTML = `<span>${taskText}</span><small style="opacity:0.6; font-size:12px; margin-left:10px;">${formatted}</small>`;

  const completeBtn = document.createElement("button");
  completeBtn.textContent = isCompleted ? "↩️" : "✅";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";

  completeBtn.addEventListener("click", () => {
    li.remove();
    const newTimestamp = new Date().toISOString();
    addTask(taskText, !isCompleted, newTimestamp);
    saveTasks();
    updateProgress();
  });

  editBtn.addEventListener("click", () => {
    const newText = prompt("Edit your task:", taskText);
    if (newText && newText.trim() !== ""){
      li.querySelector("span").textContent = newText.trim();
      saveTasks();
    }
  });

  deleteBtn.addEventListener("click", () => {
    li.remove();
    saveTasks();
    updateProgress();
  });


  [completeBtn,editBtn,deleteBtn].forEach(btn => {
    btn.style.marginLeft = "8px";
    btn.style.cursor = "pointer";
    btn.style.border = "none";
    btn.style.background = "transparent";
    btn.style.fontSize = "16px";
  });

  li.appendChild(completeBtn);
  li.appendChild(editBtn)
  li.appendChild(deleteBtn);

  if (isCompleted) {
    document.getElementById("completedList").appendChild(li);
  } else {
    document.getElementById("taskList").appendChild(li);
  }
}



function updateProgress(){
  const tasks = document.querySelectorAll("#taskList li").length;
  const completed = document.querySelectorAll("#completedList li").length;

  const progressDisplay = document.getElementById("progressDisplay");
  progressDisplay.textContent = `Tasks Left: ${tasks} | Completed: ${completed}`;

}


function formatTimestamp(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = (now - date) / (1000 * 60 * 60);

  if (diffHours < 24) {
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  } else {
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  }
}


function enableDragAndDrop(listId){
  const List = document.getElementById(listId);
  let draggedItem = null;

  list.addEventListener("dragstart", (e) => {
    draggedItem = e.target;
    e.target.style.opacity = o.5;
  });
  
  list.addEventListener("dragend", (e) => {
    draggedItem = null;
    e.target.style.opacity = 1
    saveTasks();
  });

  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(list,e.clientY);
    if (afterElement == null){
      list.appendChild(draggedItem);
    } else {
      list.insertBefore(draggedItem, afterElement);
  }
});

function getDragAfterElement(list,y){
  const draggableElements = [...list.querySelectorAll("li:not(.dragging)")];

  return draggableElements.reduce(
    (closest,child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top -box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return{ offset: offset, element; child};
      } else {
        return closest;
      }
    },
    { offset ; Number.NEGATIVE_INFINITY }
  ).element;
}

  list.querySelectorAll("li").forEach((li) =. (li.draggable = true));
}



document.getElementById("addTaskBtn").addEventListener("click", () => {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();

  if (text !== "") {
    addTask(text);
    saveTasks();
    input.value = "";
  }
});


loadTasks();


