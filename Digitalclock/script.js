const body = document.getElementById("body");
const card = document.getElementById("card");
const title = document.getElementById("title");
const date = document.getElementById("date");
const time = document.getElementById("time");
const greeting = document.getElementById("greeting");
const themeButton = document.getElementById("themeButton");
const sunriseIcon = document.getElementById("sunriseIcon");
const sunIcon = document.getElementById("sunIcon");
const sunsetIcon = document.getElementById("sunsetIcon");
const moonIcon = document.getElementById("moonIcon");
const icons = {
morning: sunriseIcon,
afternoon: sunIcon,
evening: sunsetIcon,
night: moonIcon
};
const scenes = {
morning: {
background:
"flex min-h-screen items-center justify-center bg-gradient-to-b from-orange-300 to-yellow-100 px-4 py-10 transition-colors duration-1000",
greeting: "Good Morning!",
iconColor: "text-orange-500"
},
afternoon: {
    background:
        "flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-400 to-blue-200 px-4 py-10 transition-colors duration-1000",
    greeting: "Good Afternoon!",
    iconColor: "text-yellow-500"
},
evening: {
    background:
        "flex min-h-screen items-center justify-center bg-gradient-to-b from-purple-600 via-orange-400 to-yellow-200 px-4 py-10 transition-colors duration-1000",
    greeting: "Good Evening!",
    iconColor: "text-orange-500"
},
night: {
    background:
        "flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-800 px-4 py-10 transition-colors duration-1000",
    greeting: "Good Night!",
    iconColor: "text-yellow-300"
}
};
let isDarkMode = false;
function updateClock() {
const now = new Date();
const hours = now.getHours();
time.textContent = now.toLocaleTimeString("en-IN");
date.textContent = now.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
});
let period;

if (hours >= 5 && hours < 11) {
    period = "morning";
} else if (hours >= 11 && hours < 16) {
    period = "afternoon";
} else if (hours >= 16 && hours < 19) {
    period = "evening";
} else {
    period = "night";
}
changeScene(period);
}
function changeScene(period) {
const scene = scenes[period];
body.className = scene.background;
Object.values(icons).forEach(function (icon) {
    icon.classList.add("hidden");
icon.classList.add("hidden");
});
icons[period].classList.remove("hidden");
greeting.textContent = scene.greeting;
Object.values(icons).forEach(function (icon) {
    icon.classList.remove(
        "text-orange-500",
        "text-yellow-500",
        "text-yellow-300"
    );
});
icons[period].classList.add(scene.iconColor);
if (period === "night" && !isDarkMode) {
    card.classList.add("bg-white/90");
}
}
themeButton.addEventListener("click", function () {
isDarkMode = !isDarkMode;
if (isDarkMode) {
    card.classList.remove("bg-white/90");
    card.classList.add("bg-slate-900/90");

    title.classList.remove("text-slate-800");
    title.classList.add("text-white");

    date.classList.remove("text-slate-500");
    date.classList.add("text-slate-300");

    themeButton.innerHTML =
        '<i class="fa-solid fa-sun mr-2"></i> Light Mode';
} else {
    card.classList.remove("bg-slate-900/90");
    card.classList.add("bg-white/90");

    title.classList.remove("text-white");
    title.classList.add("text-slate-800");

    date.classList.remove("text-slate-300");
    date.classList.add("text-slate-500");

    themeButton.innerHTML =
        '<i class="fa-solid fa-moon mr-2"></i> Dark Mode';
}
})
updateClock();
setInterval(updateClock, 1000);























