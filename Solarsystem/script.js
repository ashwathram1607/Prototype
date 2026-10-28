

// 1. PLANET DATA

const planets = [
    {
        name: "Mercury",
        order: 1,
        type: "Terrestrial Planet",
        diameter: "4,879 km",
        day: "58.6 Earth days",
        moons: "0",
        color: "bg-stone-400",
        textColor: "text-stone-400",
        shadow: "shadow-[0_0_50px_rgba(168,162,158,0.3)]",
        description:
            "Mercury is the smallest planet in our Solar System and the closest to the Sun. It has an extremely thin atmosphere and experiences dramatic temperature changes.",
        fact: "A year on Mercury lasts just 88 Earth days."
    },

    {
        name: "Venus",
        order: 2,
        type: "Terrestrial Planet",
        diameter: "12,104 km",
        day: "243 Earth days",
        moons: "0",
        color: "bg-amber-300",
        textColor: "text-amber-300",
        shadow: "shadow-[0_0_50px_rgba(252,211,77,0.3)]",
        description:
            "Venus has a thick atmosphere rich in carbon dioxide. Its powerful greenhouse effect makes it the hottest planet in our Solar System.",
        fact: "Venus rotates in the opposite direction to most planets."
    },

    {
        name: "Earth",
        order: 3,
        type: "Terrestrial Planet",
        diameter: "12,742 km",
        day: "24 hours",
        moons: "1",
        color: "bg-sky-400",
        textColor: "text-sky-400",
        shadow: "shadow-[0_0_50px_rgba(56,189,248,0.35)]",
        description:
            "Earth is our home planet and the only world currently known to support life. Its liquid water, atmosphere and suitable temperatures make it unique.",
        fact: "About 71% of Earth's surface is covered by water."
    },

    {
        name: "Mars",
        order: 4,
        type: "Terrestrial Planet",
        diameter: "6,779 km",
        day: "24 hours 37 minutes",
        moons: "2",
        color: "bg-red-500",
        textColor: "text-red-400",
        shadow: "shadow-[0_0_50px_rgba(239,68,68,0.3)]",
        description:
            "Mars is known as the Red Planet because iron minerals in its soil have oxidized. Scientists study Mars to understand its ancient environment and potential for past microbial life.",
        fact: "Mars is home to Olympus Mons, a gigantic shield volcano."
    },

    {
        name: "Jupiter",
        order: 5,
        type: "Gas Giant",
        diameter: "139,820 km",
        day: "9 hours 56 minutes",
        moons: "95 known",
        color: "bg-orange-300",
        textColor: "text-orange-300",
        shadow: "shadow-[0_0_50px_rgba(253,186,116,0.3)]",
        description:
            "Jupiter is the largest planet in our Solar System. This gas giant has enormous storms, powerful magnetic fields and many known natural satellites.",
        fact: "The Great Red Spot is a giant storm that has lasted for centuries."
    },

    {
        name: "Saturn",
        order: 6,
        type: "Gas Giant",
        diameter: "116,460 km",
        day: "About 10.7 hours",
        moons: "274 known",
        color: "bg-yellow-200",
        textColor: "text-yellow-200",
        shadow: "shadow-[0_0_50px_rgba(254,240,138,0.3)]",
        description:
            "Saturn is famous for its spectacular rings, which consist mainly of pieces of ice and rocky material. It is a gas giant with a large family of moons.",
        fact: "Saturn is less dense than water on average."
    },

    {
        name: "Uranus",
        order: 7,
        type: "Ice Giant",
        diameter: "50,724 km",
        day: "About 17 hours",
        moons: "28 known",
        color: "bg-cyan-200",
        textColor: "text-cyan-200",
        shadow: "shadow-[0_0_50px_rgba(165,243,252,0.3)]",
        description:
            "Uranus is an ice giant with a blue-green appearance caused by methane in its atmosphere. Its rotation axis is tilted dramatically compared with most planets.",
        fact: "Uranus rotates on its side relative to its orbit."
    },

    {
        name: "Neptune",
        order: 8,
        type: "Ice Giant",
        diameter: "49,244 km",
        day: "About 16 hours",
        moons: "16 known",
        color: "bg-blue-500",
        textColor: "text-blue-400",
        shadow: "shadow-[0_0_50px_rgba(59,130,246,0.3)]",
        description:
            "Neptune is the most distant planet from the Sun. It is an ice giant with a deep blue atmosphere and some of the fastest winds measured on any planet.",
        fact: "Neptune takes about 165 Earth years to orbit the Sun."
    }
];


// 2. GET HTML ELEMENTS

const planetCards = document.getElementById("planetCards");
const planetSearch = document.getElementById("planetSearch");
const noResults = document.getElementById("noResults");

const orbitButton = document.getElementById("orbitButton");
const orbitIcon = document.getElementById("orbitIcon");
const orbitText = document.getElementById("orbitText");

const planetDetails = document.getElementById("planetDetails");
const planetName = document.getElementById("planetName");
const planetLabel = document.getElementById("planetLabel");
const planetDescription = document.getElementById("planetDescription");

const planetDiameter = document.getElementById("planetDiameter");
const planetDay = document.getElementById("planetDay");
const planetMoons = document.getElementById("planetMoons");

const planetVisual = document.getElementById("planetVisual");
const sunButton = document.getElementById("sunButton");

const planetOrbitContainer = document.getElementById(
    "planetOrbitContainer"
);


// 3. DISPLAY PLANET CARDS

function displayPlanets(planetList) {

    if (!planetCards || !noResults) {
        console.error("Planet cards or no-results element is missing.");
        return;
    }

    planetCards.innerHTML = "";

    noResults.classList.toggle(
        "hidden",
        planetList.length !== 0
    );

    planetList.forEach(function (planet) {

        const card = document.createElement("article");

        card.className =
            "group overflow-hidden rounded-2xl border border-white/10 bg-slate-900 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/50 hover:bg-slate-800";

        let planetIcon = `
            <i class="fa-solid fa-circle text-2xl text-white/20"></i>
        `;

        if (planet.name === "Earth") {
            planetIcon = `
                <i class="fa-solid fa-earth-americas text-3xl text-white/80"></i>
            `;
        }

        card.innerHTML = `
            <div class="relative flex h-40 items-center justify-center overflow-hidden bg-slate-950">

                <div class="absolute h-32 w-32 rounded-full border border-white/5"></div>

                <div class="absolute h-24 w-24 rounded-full border border-white/5"></div>

                <div class="relative flex h-16 w-16 items-center justify-center rounded-full ${planet.color} ${planet.shadow}">
                    ${planetIcon}
                </div>

                <span class="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                    #${planet.order}
                </span>

            </div>

            <div class="p-5">

                <div class="flex items-center justify-between gap-2">
                    <h3 class="text-xl font-bold">${planet.name}</h3>

                    <i class="fa-solid fa-arrow-up-right-from-square text-sm text-slate-500 transition group-hover:text-indigo-400"></i>
                </div>

                <p class="mt-2 text-xs font-semibold uppercase tracking-wider ${planet.textColor}">
                    ${planet.type}
                </p>

                <p class="mt-4 text-sm leading-6 text-slate-400">
                    ${planet.fact}
                </p>

                <button
                    type="button"
                    class="planet-detail-button mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold transition hover:border-indigo-400 hover:bg-indigo-500/10"
                    data-planet="${planet.name}"
                >
                    Explore Planet
                    <i class="fa-solid fa-arrow-right"></i>
                </button>

            </div>
        `;

        planetCards.appendChild(card);

    });

}


// 4. SHOW SELECTED PLANET DETAILS

function showPlanetDetails(name, shouldScroll = true) {

    const planet = planets.find(function (item) {
        return item.name === name;
    });

    if (!planet) {
        console.error("Planet not found:", name);
        return;
    }

    if (
        !planetDetails ||
        !planetName ||
        !planetLabel ||
        !planetDescription ||
        !planetDiameter ||
        !planetDay ||
        !planetMoons ||
        !planetVisual
    ) {
        console.error("One or more planet detail HTML elements are missing.");
        return;
    }

    // Update planet information

    planetLabel.textContent = planet.type;
    planetName.textContent = planet.name;
    planetDescription.textContent = planet.description;

    planetDiameter.textContent = planet.diameter;
    planetDay.textContent = planet.day;
    planetMoons.textContent = planet.moons;


    // Update planet appearance

    planetVisual.className =
        `relative flex h-40 w-40 items-center justify-center rounded-full ${planet.color} ${planet.shadow}`;

    if (planet.name === "Earth") {

        planetVisual.innerHTML = `
            <i class="fa-solid fa-earth-americas text-7xl text-white/80"></i>
        `;

    } else if (planet.name === "Saturn") {

        planetVisual.innerHTML = `
            <i class="fa-solid fa-circle text-7xl text-white/20"></i>

            <span class="absolute h-8 w-48 rotate-[-25deg] rounded-full border-8 border-amber-200/80"></span>
        `;

    } else {

        planetVisual.innerHTML = `
            <i class="fa-solid fa-circle text-7xl text-white/20"></i>
        `;

    }


    // Scroll to details

    if (shouldScroll) {

        planetDetails.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// 5. EXPLORE PLANET BUTTON CLICK

if (planetCards) {

    planetCards.addEventListener("click", function (event) {

        const button = event.target.closest(".planet-detail-button");

        if (!button) {
            return;
        }

        const selectedPlanet = button.dataset.planet;

        showPlanetDetails(selectedPlanet);

    });

}


// 6. SELECT PLANET FROM ORBIT

if (planetOrbitContainer) {

    planetOrbitContainer.addEventListener("click", function (event) {

        const button = event.target.closest("[data-planet]");

        if (!button) {
            return;
        }

        const selectedPlanet = button.dataset.planet;

        showPlanetDetails(selectedPlanet);

    });

}


// 7. SEARCH PLANETS

if (planetSearch) {

    planetSearch.addEventListener("input", function () {

        const searchValue = planetSearch.value.trim().toLowerCase();

        const filteredPlanets = planets.filter(function (planet) {

            return (
                planet.name.toLowerCase().includes(searchValue) ||
                planet.type.toLowerCase().includes(searchValue)
            );

        });

        displayPlanets(filteredPlanets);

    });

}


// 8. RESET SEARCH

const resetButton = document.getElementById("resetButton");

if (resetButton) {

    resetButton.addEventListener("click", function () {

        if (planetSearch) {
            planetSearch.value = "";
        }

        displayPlanets(planets);

    });

}


// 9. PAUSE AND RESUME ORBITS

let isOrbitPaused = false;

if (orbitButton) {

    orbitButton.addEventListener("click", function () {

        isOrbitPaused = !isOrbitPaused;

        if (planetOrbitContainer) {

            const orbitElements = planetOrbitContainer.children;

            Array.from(orbitElements).forEach(function (orbit) {

                orbit.style.animationPlayState = isOrbitPaused
                    ? "paused"
                    : "running";

            });

        }

        if (orbitIcon && orbitText) {

            if (isOrbitPaused) {

                orbitIcon.className = "fa-solid fa-play mr-2";
                orbitText.textContent = "Resume Orbits";

            } else {

                orbitIcon.className = "fa-solid fa-pause mr-2";
                orbitText.textContent = "Pause Orbits";

            }

        }

    });

}


// 10. SHOW SUN DETAILS

if (sunButton) {

    sunButton.addEventListener("click", function () {

        if (
            !planetDetails ||
            !planetName ||
            !planetLabel ||
            !planetDescription ||
            !planetDiameter ||
            !planetDay ||
            !planetMoons ||
            !planetVisual
        ) {
            return;
        }

        planetLabel.textContent = "Our Star";
        planetName.textContent = "The Sun";

        planetDescription.textContent =
            "The Sun is the star at the center of our Solar System. Its gravity keeps the planets in orbit, while energy produced in its core provides light and heat for Earth.";

        planetDiameter.textContent = "1.39 million km";
        planetDay.textContent = "About 25 days at the equator";
        planetMoons.textContent = "0";

        planetVisual.className =
            "flex h-40 w-40 items-center justify-center rounded-full bg-amber-400 text-7xl text-amber-950 shadow-[0_0_70px_rgba(251,191,36,0.45)]";

        planetVisual.innerHTML = `
            <i class="fa-solid fa-sun"></i>
        `;

        planetDetails.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

}


// 11. INITIALIZE APPLICATION

displayPlanets(planets);

showPlanetDetails("Earth", false);
