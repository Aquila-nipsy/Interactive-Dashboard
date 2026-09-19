const state = {
  menuOpen: false,
  dropdownOpen: false,
  modalOpen: false,
  activeTab: "overview",
  searchTerm: "",

  tasks: [],

  activity: []
};


const sidebar = document.querySelector("#sidebar");
const overlay = document.querySelector("#overlay");

const profileButton = document.querySelector("#profileButton");
const profileDropdown = document.querySelector("#profileDropdown");

const logoutModal = document.querySelector("#logoutModal");

const searchInput = document.querySelector("#searchInput");
const taskList = document.querySelector("#taskList");
const fullTaskList = document.querySelector("#fullTaskList");

const activityList = document.querySelector("#activityList");
const actionMessage = document.querySelector("#actionMessage");

const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");



function render() {
  updateMenu();
  updateDropdown();
  updateModal();
  updateTabs();

  renderTasks();
  renderFullTaskList();
  renderActivity();

  updateStats();
}


function updateMenu() {
  sidebar.classList.toggle(
    "-translate-x-full",
    !state.menuOpen
  );

  sidebar.classList.toggle(
    "translate-x-0",
    state.menuOpen
  );

  overlay.classList.toggle(
    "hidden",
    !state.menuOpen
  );
}

function closeMenu() {
  state.menuOpen = false;
  render();
}



function updateDropdown() {
  profileDropdown.classList.toggle(
    "hidden",
    !state.dropdownOpen
  );

  profileButton.setAttribute(
    "aria-expanded",
    String(state.dropdownOpen)
  );
}

function closeDropdown() {
  state.dropdownOpen = false;
  render();
}



function updateModal() {
  logoutModal.classList.toggle(
    "hidden",
    !state.modalOpen
  );

  logoutModal.classList.toggle(
    "flex",
    state.modalOpen
  );
}

function openModal() {
  state.modalOpen = true;
  render();

  document.querySelector("#cancelModal").focus();
}

function closeModal() {
  state.modalOpen = false;
  render();
}



function updateTabs() {
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.add("hidden");
  });

  const activePanel = document.querySelector(
    `#${state.activeTab}Panel`
  );

  activePanel.classList.remove("hidden");


  document.querySelectorAll(".tab-button").forEach((button) => {
    const isActive =
      button.dataset.tab === state.activeTab;

    button.classList.toggle(
      "bg-indigo-500",
      isActive
    );

    button.classList.toggle(
      "text-white",
      isActive
    );

    button.classList.toggle(
      "text-slate-300",
      !isActive
    );

    button.classList.toggle(
      "hover:bg-slate-800",
      !isActive
    );
  });
}



function getFilteredTasks() {
  const searchTerm = state.searchTerm.toLowerCase();

  return state.tasks.filter((task) => {
    return task.title
      .toLowerCase()
      .includes(searchTerm);
  });
}



function getStatusClasses(status) {
  if (status === "Completed") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "In Progress") {
    return "bg-indigo-50 text-indigo-700";
  }

  return "bg-amber-50 text-amber-700";
}



function renderTasks() {
  const filteredTasks = getFilteredTasks();

  taskList.innerHTML = "";


  if (filteredTasks.length === 0) {
    taskList.innerHTML = `
      <div class="rounded-xl border border-dashed border-slate-200 p-8 text-center">
        <p class="font-medium text-slate-600">
          ${
            state.tasks.length === 0
              ? "No tasks yet"
              : "No matching tasks"
          }
        </p>

        <p class="mt-1 text-sm text-slate-400">
          ${
            state.tasks.length === 0
              ? "Add your first task to get started."
              : "Try a different search."
          }
        </p>
      </div>
    `;

    return;
  }


  filteredTasks.forEach((task) => {
    const item = document.createElement("div");

    item.className =
      "flex flex-col gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between";

    item.innerHTML = `
      <div>
        <p class="font-medium text-slate-800">
          ${task.title}
        </p>

        <p class="mt-1 text-xs text-slate-400">
          Task
        </p>
      </div>

      <div class="flex items-center gap-2">

        <button
          data-task-id="${task.id}"
          class="task-status rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(task.status)}"
        >
          ${task.status}
        </button>

        <button
          data-delete-id="${task.id}"
          class="delete-task rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
        >
          Delete
        </button>

      </div>
    `;

    taskList.appendChild(item);
  });
}


function renderFullTaskList() {
  fullTaskList.innerHTML = "";


  if (state.tasks.length === 0) {
    fullTaskList.innerHTML = `
      <div class="rounded-xl border border-dashed border-slate-200 p-8 text-center">
        <p class="font-medium text-slate-600">
          No tasks yet
        </p>

        <p class="mt-1 text-sm text-slate-400">
          Add a task from the Overview page.
        </p>
      </div>
    `;

    return;
  }


  state.tasks.forEach((task) => {
    const item = document.createElement("div");

    item.className =
      "flex flex-col gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between";

    item.innerHTML = `
      <div>
        <p class="font-medium text-slate-800">
          ${task.title}
        </p>

        <p class="mt-1 text-xs text-slate-400">
          Click the status to change it
        </p>
      </div>

      <div class="flex items-center gap-2">

        <button
          data-task-id="${task.id}"
          class="rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(task.status)}"
        >
          ${task.status}
        </button>

        <button
          data-delete-id="${task.id}"
          class="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
        >
          Delete
        </button>

      </div>
    `;

    fullTaskList.appendChild(item);
  });
}



function addTask(title) {
  const newTask = {
    id: Date.now(),
    title: title,
    status: "Pending"
  };

  state.tasks.push(newTask);

  state.activity.unshift(
    `Added "${title}"`
  );

  showMessage("Task added successfully.");

  render();
}


function changeTaskStatus(taskId) {
  const task = state.tasks.find(
    (item) => item.id === taskId
  );

  if (!task) {
    return;
  }


  if (task.status === "Pending") {
    task.status = "In Progress";
  }

  else if (task.status === "In Progress") {
    task.status = "Completed";
  }

  else {
    task.status = "Pending";
  }


  state.activity.unshift(
    `"${task.title}" changed to ${task.status}`
  );

  showMessage(
    `"${task.title}" is now ${task.status}.`
  );

  render();
}



function deleteTask(taskId) {
  const task = state.tasks.find(
    (item) => item.id === taskId
  );

  if (!task) {
    return;
  }


  state.tasks = state.tasks.filter(
    (item) => item.id !== taskId
  );


  state.activity.unshift(
    `Deleted "${task.title}"`
  );

  showMessage("Task deleted.");

  render();
}



function updateStats() {
  const total = state.tasks.length;

  const completed = state.tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgress = state.tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const pending = state.tasks.filter(
    (task) => task.status === "Pending"
  ).length;


  document.querySelector("#totalTasks").textContent =
    total;

  document.querySelector("#completedTasks").textContent =
    completed;

  document.querySelector("#progressTasks").textContent =
    inProgress;

  document.querySelector("#pendingTasks").textContent =
    pending;
}



function renderActivity() {
  activityList.innerHTML = "";


  if (state.activity.length === 0) {
    activityList.innerHTML = `
      <li class="py-4 text-sm text-slate-400">
        No activity yet.
      </li>
    `;

    return;
  }


  state.activity
    .slice(0, 8)
    .forEach((entry) => {

      const item = document.createElement("li");

      item.className =
        "py-4 text-sm text-slate-600";

      item.textContent = entry;

      activityList.appendChild(item);
    });
}


function showMessage(message) {
  actionMessage.textContent = message;
}



document
  .querySelector("#openMenu")
  .addEventListener("click", () => {

    state.menuOpen = true;

    render();
  });



document
  .querySelector("#closeMenu")
  .addEventListener("click", closeMenu);

overlay.addEventListener(
  "click",
  closeMenu
);



document
  .querySelectorAll(".tab-button")
  .forEach((button) => {

    button.addEventListener("click", () => {

      state.activeTab =
        button.dataset.tab;

      state.menuOpen = false;

      render();
    });
  });



profileButton.addEventListener(
  "click",
  () => {

    state.dropdownOpen =
      !state.dropdownOpen;

    render();
  }
);



document.addEventListener(
  "click",
  (event) => {

    const clickedInsideProfile =
      profileButton.contains(event.target) ||
      profileDropdown.contains(event.target);


    if (
      state.dropdownOpen &&
      !clickedInsideProfile
    ) {
      closeDropdown();
    }
  }
);



taskForm.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    const title =
      taskInput.value.trim();


    if (title === "") {

      showMessage(
        "Please enter a task."
      );

      return;
    }


    addTask(title);


    taskInput.value = "";

    taskInput.focus();
  }
);



searchInput.addEventListener(
  "input",
  (event) => {

    state.searchTerm =
      event.target.value;

    renderTasks();
  }
);



taskList.addEventListener(
  "click",
  (event) => {

    const deleteButton =
      event.target.closest(
        "[data-delete-id]"
      );


    if (deleteButton) {

      deleteTask(
        Number(
          deleteButton.dataset.deleteId
        )
      );

      return;
    }


    const statusButton =
      event.target.closest(
        "[data-task-id]"
      );


    if (statusButton) {

      changeTaskStatus(
        Number(
          statusButton.dataset.taskId
        )
      );
    }
  }
);



fullTaskList.addEventListener(
  "click",
  (event) => {

    const deleteButton =
      event.target.closest(
        "[data-delete-id]"
      );


    if (deleteButton) {

      deleteTask(
        Number(
          deleteButton.dataset.deleteId
        )
      );

      return;
    }


    const statusButton =
      event.target.closest(
        "[data-task-id]"
      );


    if (statusButton) {

      changeTaskStatus(
        Number(
          statusButton.dataset.taskId
        )
      );
    }
  }
);



document
  .querySelector("#logoutButton")
  .addEventListener(
    "click",
    openModal
  );



document
  .querySelector("#dropdownLogout")
  .addEventListener(
    "click",
    () => {

      state.dropdownOpen = false;

      openModal();
    }
  );


document
  .querySelector("#cancelModal")
  .addEventListener(
    "click",
    closeModal
  );



document
  .querySelector("#confirmModal")
  .addEventListener(
    "click",
    () => {

      closeModal();

      showMessage(
        "Demo logout completed."
      );
    }
  );



document.addEventListener(
  "keydown",
  (event) => {

    if (event.key !== "Escape") {
      return;
    }


    if (state.modalOpen) {

      closeModal();

    }

    else if (state.dropdownOpen) {

      closeDropdown();

    }

    else if (state.menuOpen) {

      closeMenu();

    }
  }
);

render();
