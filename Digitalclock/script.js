function updateClock() {
    const now = new Date();

    document.getElementById("time").textContent =
        now.toLocaleTimeString("en-IN");

    document.getElementById("date").textContent =
        now.toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
}
updateClock();
setInterval(updateClock, 1000);
let isDark=false;
document.getElementById("themeButton").addEventListener("click", function () {
const body = document.getElementById("body");
    const card = document.getElementById("card");
    const title = document.getElementById("title");
    const date = document.getElementById("date");
    const button = document.getElementById("themeButton");

    isDark = !isDark;

    if (isDark) {

        body.className =
            "flex min-h-screen items-center justify-center bg-slate-950 transition-colors duration-300";

        card.className =
            "w-11/12 max-w-md rounded-3xl bg-slate-800 p-8 text-center shadow-xl";

        title.className =
            "mb-2 text-3xl font-bold text-white";

        date.className =
            "mb-6 text-slate-300";

        button.innerHTML =
            '<i class="fa-solid fa-sun mr-2"></i> Light Mode';

    } else {

        body.className =
            "flex min-h-screen items-center justify-center bg-slate-100 transition-colors duration-300";

        card.className =
            "w-11/12 max-w-md rounded-3xl bg-white p-8 text-center shadow-xl";

        title.className =
            "mb-2 text-3xl font-bold text-slate-800";

        date.className =
            "mb-6 text-slate-500";

        button.innerHTML =
            '<i class="fa-solid fa-moon mr-2"></i> Dark Mode';
    }
        });
