const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const highPriorityTasks = document.getElementById("highPriorityTasks");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");

const taskModal = document.getElementById("taskModal");
const taskForm = document.getElementById("taskForm");

const taskId = document.getElementById("taskId");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");

const modalTitle = document.getElementById("modalTitle");
const saveTaskButton = document.getElementById("saveTaskButton");

const progressBar = document.getElementById("progressBar");
const progressPercentage = document.getElementById("progressPercentage");
const progressSummary = document.getElementById("progressSummary");

const visibleTaskCount = document.getElementById("visibleTaskCount");
const currentDate = document.getElementById("currentDate");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const toastIcon = document.getElementById("toastIcon");

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const openTaskModal = document.getElementById("openTaskModal");
const closeTaskModal = document.getElementById("closeTaskModal");
const cancelTask = document.getElementById("cancelTask");
let tasks = [];

let editingTaskId = null;
let toastTimer;

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem("smartTasks");

        if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks);

            if (Array.isArray(parsedTasks)) {
                tasks = parsedTasks;
            }
        }
    } catch (error) {
        console.error("Unable to load saved tasks:", error);
        tasks = [];
    }
}
function saveTasks() {
    try {
        localStorage.setItem("smartTasks", JSON.stringify(tasks));
    } catch (error) {
        console.error("Unable to save tasks:", error);

        showToast(
            "Unable to save tasks in this browser.",
            "error"
        );
    }
}
function displayCurrentDate() {
    const today = new Date();

    currentDate.textContent = today.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function showToast(message, type = "success") {
    toastMessage.textContent = message;

    toastIcon.className =
        type === "error"
            ? "fa-solid fa-circle-exclamation text-rose-400"
            : "fa-solid fa-circle-check text-emerald-400";

    toast.classList.remove(
        "translate-y-5",
        "opacity-0"
    );

    toast.classList.add(
        "translate-y-0",
        "opacity-100"
    );

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove(
            "translate-y-0",
            "opacity-100"
        );

        toast.classList.add(
            "translate-y-5",
            "opacity-0"
        );
    }, 2500);
}

function openModal() {
    editingTaskId = null;

    taskForm.reset();

    taskId.value = "";

    modalTitle.textContent = "Add New Task";

    saveTaskButton.innerHTML =
        '<i class="fa-solid fa-plus mr-2"></i> Save Task';

    taskPriority.value = "medium";

    taskModal.classList.remove("hidden");
    taskModal.classList.add("flex");

    document.body.classList.add("overflow-hidden");

    setTimeout(() => {
        taskTitle.focus();
    }, 100);
}

function closeModal() {
    taskModal.classList.add("hidden");
    taskModal.classList.remove("flex");

    document.body.classList.remove("overflow-hidden");

    taskForm.reset();

    editingTaskId = null;
}

function formatDate(dateString) {
    if (!dateString) {
        return "No due date";
    }

    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function isOverdue(task) {
    if (!task.dueDate || task.completed) {
        return false;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(`${task.dueDate}T00:00:00`);

    return dueDate < today;
}

function getPriorityStyles(priority) {
    const styles = {
        high: {
            badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
            icon: "fa-solid fa-fire"
        },

        medium: {
            badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
            icon: "fa-solid fa-flag"
        },

        low: {
            badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
            icon: "fa-solid fa-leaf"
        }
    };

    return styles[priority] || styles.medium;
}

function createTaskCard(task) {
    const card = document.createElement("article");

    card.className =
        "flex flex-col gap-4 p-5 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 sm:flex-row sm:items-start sm:justify-between sm:p-6";

    if (task.completed) {
        card.classList.add("opacity-70");
    }

    const leftSection = document.createElement("div");

    leftSection.className = "flex min-w-0 flex-1 gap-4";

    const checkbox = document.createElement("button");

    checkbox.type = "button";

    checkbox.setAttribute(
        "aria-label",
        task.completed ? "Mark as pending" : "Mark as completed"
    );

    checkbox.className =
        "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition";

    if (task.completed) {
        checkbox.classList.add(
            "border-emerald-500",
            "bg-emerald-500",
            "text-white"
        );

        checkbox.innerHTML = '<i class="fa-solid fa-check text-xs"></i>';
    } else {
        checkbox.classList.add(
            "border-slate-300",
            "text-transparent",
            "hover:border-indigo-500",
            "dark:border-slate-600"
        );
    }

    checkbox.addEventListener("click", () => {
        toggleTask(task.id);
    });

    const content = document.createElement("div");

    content.className = "min-w-0 flex-1";

    const title = document.createElement("h4");

    title.className = "break-words font-semibold";

    title.textContent = task.title;

    if (task.completed) {
        title.classList.add(
            "text-slate-400",
            "line-through"
        );
    }

    const description = document.createElement("p");

    description.className =
        "mt-1 whitespace-pre-wrap break-words text-sm text-slate-500 dark:text-slate-400";

    description.textContent = task.description || "";

    if (!task.description) {
        description.classList.add("hidden");
    }

    const metadata = document.createElement("div");

    metadata.className = "mt-3 flex flex-wrap items-center gap-2";

    const priority = document.createElement("span");
    const priorityStyles = getPriorityStyles(task.priority);
    priority.className =
        `inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${priorityStyles.badge}`;

    priority.innerHTML =
        `<i class="${priorityStyles.icon}"></i> ` +
        task.priority.charAt(0).toUpperCase() +
        task.priority.slice(1);
    const dueDate = document.createElement("span");

    dueDate.className =
        "inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300";

    if (isOverdue(task)) {
        dueDate.className =
            "inline-flex items-center gap-1.5 rounded-lg bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-300";

        dueDate.innerHTML =
            '<i class="fa-solid fa-triangle-exclamation"></i> Overdue: ' +
            formatDate(task.dueDate);
    } else {
        dueDate.innerHTML =
            '<i class="fa-regular fa-calendar"></i> ' +
            formatDate(task.dueDate);
    }

    metadata.appendChild(priority);
    metadata.appendChild(dueDate);

    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(metadata);

    leftSection.appendChild(checkbox);
    leftSection.appendChild(content);

    const actions = document.createElement("div");

    actions.className = "flex shrink-0 items-center gap-2";

    const editButton = document.createElement("button");

    editButton.type = "button";

    editButton.setAttribute("aria-label", "Edit task");

    editButton.className =
        "flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400";

    editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';

    editButton.addEventListener("click", () => {
        editTask(task.id);
    });
    const deleteButton = document.createElement("button");

    deleteButton.type = "button";

    deleteButton.setAttribute("aria-label", "Delete task");

    deleteButton.className =
        "flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/20 dark:hover:text-rose-400";

    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

    deleteButton.addEventListener("click", () => {
        deleteTask(task.id);
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    card.appendChild(leftSection);
    card.appendChild(actions);

    return card;
}

function renderTasks() {
    taskList.replaceChildren();

    const searchTerm = searchInput.value
        .trim()
        .toLowerCase();

    const selectedStatus = statusFilter.value;
    const selectedPriority = priorityFilter.value;

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm);

        const matchesStatus =
            selectedStatus === "all" ||
            (selectedStatus === "pending" && !task.completed) ||
            (selectedStatus === "completed" && task.completed);

        const matchesPriority =
            selectedPriority === "all" ||
            task.priority === selectedPriority;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority
        );
    });

    if (filteredTasks.length === 0) {
        const emptyState = document.createElement("div");

        emptyState.className =
            "px-5 py-16 text-center sm:px-6";

        const icon = document.createElement("div");

        icon.className =
            "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-2xl text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400";

        icon.innerHTML =
            '<i class="fa-solid fa-clipboard-list"></i>';

        const heading = document.createElement("h4");

        heading.className = "text-lg font-bold";

        heading.textContent =
            tasks.length === 0
                ? "No tasks yet"
                : "No matching tasks";


        const message = document.createElement("p");

        message.className =
            "mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400";

        message.textContent =
            tasks.length === 0
                ? "Create your first task and start organizing your day."
                : "Try changing your search or filter options.";


        emptyState.appendChild(icon);
        emptyState.appendChild(heading);
        emptyState.appendChild(message);

        taskList.appendChild(emptyState);
    } else {
        filteredTasks.forEach((task) => {
            taskList.appendChild(createTaskCard(task));
        });
    }

    visibleTaskCount.textContent =
        `${filteredTasks.length} ${filteredTasks.length === 1 ? "task" : "tasks"}`;


    updateDashboard();
}

function updateDashboard() {
    const total = tasks.length;

    const completed = tasks.filter(
        (task) => task.completed
    ).length;

    const pending = total - completed;

    const highPriority = tasks.filter(
        (task) => task.priority === "high" && !task.completed
    ).length;


    totalTasks.textContent = total;

    pendingTasks.textContent = pending;

    completedTasks.textContent = completed;

    highPriorityTasks.textContent = highPriority;


    // Calculate progress

    const percentage =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);


    progressPercentage.textContent = `${percentage}%`;

    progressBar.style.width = `${percentage}%`;


    progressSummary.textContent =
        total === 0
            ? "Start adding tasks to track your progress."
            : `${completed} of ${total} tasks completed. ${pending} remaining.`;
}

function handleTaskSubmit(event) {
    event.preventDefault();

    const title = taskTitle.value.trim();

    const description = taskDescription.value.trim();

    const dueDate = taskDate.value;

    const priority = taskPriority.value;

    if (!title) {
        showToast("Please enter a task title.", "error");

        taskTitle.focus();

        return;
    }


    if (dueDate) {
        const selectedDate = new Date(`${dueDate}T00:00:00`);

        if (Number.isNaN(selectedDate.getTime())) {
            showToast("Please select a valid due date.", "error");
            return;
        }
    }

    if (editingTaskId !== null) {
        tasks = tasks.map((task) => {
            if (task.id === editingTaskId) {
                return {
                    ...task,
                    title,
                    description,
                    dueDate,
                    priority
                };
            }

            return task;
        });

        showToast("Task updated successfully!");
    } else {

        const newTask = {
            id: Date.now() + Math.random(),
            title,
            description,
            dueDate,
            priority,
            completed: false,
            createdAt: new Date().toISOString()
        };

        tasks.unshift(newTask);

        showToast("Task added successfully!");
    }

    saveTasks();

    renderTasks();

    closeModal();
}

function editTask(id) {
    const task = tasks.find(
        (item) => item.id === id
    );

    if (!task) {
        showToast("Task not found.", "error");
        return;
    }


    editingTaskId = id;

    taskId.value = String(id);

    taskTitle.value = task.title;

    taskDescription.value = task.description;

    taskDate.value = task.dueDate;

    taskPriority.value = task.priority;


    modalTitle.textContent = "Edit Task";

    saveTaskButton.innerHTML =
        '<i class="fa-solid fa-floppy-disk mr-2"></i> Update Task';


    taskModal.classList.remove("hidden");

    taskModal.classList.add("flex");

    document.body.classList.add("overflow-hidden");

    setTimeout(() => {
        taskTitle.focus();
    }, 100);
}

function toggleTask(id) {
    tasks = tasks.map((task) => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });


    saveTasks();

    renderTasks();

    showToast("Task status updated!");
}

function deleteTask(id) {
    const confirmed = window.confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
        return;
    }


    tasks = tasks.filter(
        (task) => task.id !== id
    );


    saveTasks();

    renderTasks();

    showToast("Task deleted successfully!");
}


searchInput.addEventListener("input", () => {
    renderTasks();
});

statusFilter.addEventListener("change", () => {
    renderTasks();
});

priorityFilter.addEventListener("change", () => {
    renderTasks();
});

openTaskModal.addEventListener("click", openModal);

closeTaskModal.addEventListener("click", closeModal);

cancelTask.addEventListener("click", closeModal);

taskForm.addEventListener("submit", handleTaskSubmit);


// Close modal when clicking outside the form

taskModal.addEventListener("click", (event) => {
    if (event.target === taskModal) {
        closeModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        !taskModal.classList.contains("hidden")
    ) {
        closeModal();
    }
});


// 21. DARK MODE

function updateThemeIcon() {
    const isDarkMode =
        document.documentElement.classList.contains("dark");

    themeIcon.className = isDarkMode
        ? "fa-solid fa-sun"
        : "fa-solid fa-moon";
}


function loadTheme() {
    try {
        const savedTheme = localStorage.getItem("smartTaskTheme");

        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        const useDarkMode =
            savedTheme === "dark" ||
            (savedTheme === null && prefersDark);

        document.documentElement.classList.toggle(
            "dark",
            useDarkMode
        );

        updateThemeIcon();
    } catch (error) {
        console.error("Unable to load theme:", error);
    }
}


themeToggle.addEventListener("click", () => {
    const isDarkMode =
        document.documentElement.classList.toggle("dark");

    try {
        localStorage.setItem(
            "smartTaskTheme",
            isDarkMode ? "dark" : "light"
        );
    } catch (error) {
        console.error("Unable to save theme:", error);
    }

    updateThemeIcon();
});

function init() {
    loadTheme();

    loadTasks();

    displayCurrentDate();

    renderTasks();
}

init();