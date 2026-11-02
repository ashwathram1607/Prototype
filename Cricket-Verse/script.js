// ==========================================
// CRICKETVERSE - API CONFIGURATION
// ==========================================

const API_BASE_URL = "https://api.cricketdatabase.com/v1";

// Paste your NEW API key here.
// Never share this key publicly.
const API_KEY = "cdb_live_91de2a4b64efbda9a5cd136779658be4";


// ==========================================
// DOM ELEMENTS
// ==========================================

const exploreButtons = document.querySelectorAll(".explore-button");

const exploreMessage = document.getElementById("exploreMessage");

const exploreDetails = document.getElementById("exploreDetails");


// ==========================================
// API FETCH FUNCTION
// ==========================================

async function fetchCricketData(endpoint) {

    try {

        exploreMessage.textContent = "Loading cricket data...";

        exploreDetails.innerHTML = `
            <div class="col-span-full rounded-xl bg-[#111a24] p-6 text-center">
                <i class="fa-solid fa-spinner fa-spin text-3xl text-green-400"></i>
                <p class="mt-3 text-slate-400">Fetching cricket data...</p>
            </div>
        `;

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {

            method: "GET",

            headers: {
                Authorization: `Bearer ${API_KEY}`,
                Accept: "application/json"
            }

        });

        const result = await response.json();

        if (!response.ok) {

            throw new Error(
                result.message ||
                result.error?.message ||
                result.error ||
                `API Error: ${response.status}`
            );

        }

        return result.data;

    }

    catch (error) {

        console.error("Cricket API Error:", error);

        exploreMessage.textContent = "Unable to load cricket data.";

        exploreDetails.innerHTML = `
            <div class="col-span-full rounded-xl border border-red-400/20 bg-red-400/10 p-6">

                <i class="fa-solid fa-circle-exclamation text-2xl text-red-400"></i>

                <h3 class="mt-3 font-bold text-red-400">
                    Something went wrong
                </h3>

                <p class="mt-2 text-sm text-slate-300">
                    ${escapeHTML(error.message)}
                </p>

                <p class="mt-3 text-xs text-slate-400">
                    Check your API key, browser console and API permissions.
                </p>

            </div>
        `;

        return null;

    }

}


// ==========================================
// HTML SECURITY HELPER
// ==========================================

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ==========================================
// DISPLAY MESSAGE
// ==========================================

function showMessage(message) {

    exploreMessage.textContent = message;

}


// ==========================================
// GET ARRAY DATA
// ==========================================

function getArray(data) {

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.results)) {
        return data.results;
    }

    if (Array.isArray(data?.items)) {
        return data.items;
    }

    return [];

}


// ==========================================
// CREATE CARD
// ==========================================

function createCard(title, description, icon = "fa-cricket") {

    const card = document.createElement("div");

    card.className = `
        rounded-xl
        border border-white/10
        bg-[#111a24]
        p-5
        transition
        hover:border-green-400/50
    `;

    card.innerHTML = `

        <div class="flex items-center gap-3">

            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-green-400/10">

                <i class="fa-solid ${icon} text-xl text-green-400"></i>

            </div>

            <h3 class="font-bold text-white">
                ${escapeHTML(title)}
            </h3>

        </div>

        <p class="mt-4 text-sm leading-6 text-slate-400">
            ${escapeHTML(description)}
        </p>

    `;

    return card;

}


// ==========================================
// 1. PLAYERS
// ==========================================

async function loadPlayers() {

    showMessage("Explore legendary cricket players");

    const data = await fetchCricketData("/players?limit=30");

    if (!data) return;

    const players = getArray(data);

    exploreDetails.innerHTML = "";

    if (players.length === 0) {

        showMessage("No players found.");

        return;

    }

    showMessage(`${players.length} players loaded successfully.`);

    players.forEach(function (player) {

        const name = player.name || player.player || "Unknown Player";

        const card = createCard(
            name,
            `Matches: ${player.matches ?? "Not available"}`,
            "fa-user"
        );

        const button = document.createElement("button");

        button.className = `
            mt-5
            rounded-lg
            bg-green-500
            px-4
            py-2
            text-sm
            font-bold
            text-black
            hover:bg-green-400
        `;

        button.textContent = "View Career Stats";

        button.addEventListener("click", function () {

            const playerId = player.player;

            if (!playerId) {

                showMessage("Player ID is not available.");

                return;

            }

            loadPlayerDetails(playerId, name);

        });

        card.appendChild(button);

        exploreDetails.appendChild(card);

    });

}


// ==========================================
// PLAYER DETAILS + COUNTRY + CAREER STATS
// ==========================================

async function loadPlayerDetails(playerId, playerName) {

    showMessage(`Loading ${playerName} details...`);

    // Fetch player details and career stats together.
    // Two API calls for the selected player.

    const [playerData, statsData] = await Promise.all([

        fetchCricketData(
            `/players/${encodeURIComponent(playerId)}`
        ),

        fetchCricketData(
            `/players/${encodeURIComponent(playerId)}/stats`
        )

    ]);

    if (!playerData || !statsData) return;

    exploreDetails.innerHTML = "";

    const name = playerData.name || playerName;

    const country =
        playerData.nationality ||
        "Country information not available";

    const birthplace =
        playerData.birthplace ||
        "Not available";

    const battingStyle =
        playerData.batting_style ||
        "Not available";

    const bowlingStyle =
        playerData.bowling_style ||
        "Not available";


    showMessage(`${name} - Player Profile & Career Statistics`);


    // PLAYER PROFILE CARD

    const profileCard = document.createElement("div");

    profileCard.className = `
        col-span-full
        rounded-xl
        border border-green-400/20
        bg-[#111a24]
        p-6
    `;

    profileCard.innerHTML = `

        <h2 class="text-2xl font-bold text-green-400">
            ${escapeHTML(name)}
        </h2>

        <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div>
                <p class="text-xs text-slate-400">Country</p>
                <p class="mt-1 font-semibold text-white">
                    <i class="fa-solid fa-flag text-green-400"></i>
                    ${escapeHTML(country)}
                </p>
            </div>

            <div>
                <p class="text-xs text-slate-400">Birthplace</p>
                <p class="mt-1 font-semibold text-white">
                    ${escapeHTML(birthplace)}
                </p>
            </div>

            <div>
                <p class="text-xs text-slate-400">Batting Style</p>
                <p class="mt-1 font-semibold text-white">
                    ${escapeHTML(battingStyle)}
                </p>
            </div>

            <div>
                <p class="text-xs text-slate-400">Bowling Style</p>
                <p class="mt-1 font-semibold text-white">
                    ${escapeHTML(bowlingStyle)}
                </p>
            </div>

        </div>

    `;

    exploreDetails.appendChild(profileCard);


    // CAREER STATISTICS

    const batting = statsData.batting || {};

    const formats = [
        "test",
        "odi",
        "t20i",
        "t20_leagues"
    ];

    formats.forEach(function (format) {

        const stats = batting[format];

        if (!stats) return;

        const card = document.createElement("div");

        card.className = `
            rounded-xl
            border border-white/10
            bg-[#111a24]
            p-5
        `;

        card.innerHTML = `

            <h3 class="text-xl font-bold text-green-400">
                ${escapeHTML(format.toUpperCase())}
            </h3>

            <div class="mt-5 space-y-3 text-sm">

                <p class="flex justify-between">
                    <span class="text-slate-400">Matches</span>
                    <strong>${escapeHTML(stats.matches ?? 0)}</strong>
                </p>

                <p class="flex justify-between">
                    <span class="text-slate-400">Runs</span>
                    <strong>${escapeHTML(stats.runs ?? 0)}</strong>
                </p>

                <p class="flex justify-between">
                    <span class="text-slate-400">Average</span>
                    <strong>${escapeHTML(stats.average ?? 0)}</strong>
                </p>

                <p class="flex justify-between">
                    <span class="text-slate-400">Strike Rate</span>
                    <strong>${escapeHTML(stats.strike_rate ?? 0)}</strong>
                </p>

                <p class="flex justify-between">
                    <span class="text-slate-400">Centuries</span>
                    <strong>${escapeHTML(stats.hundreds ?? 0)}</strong>
                </p>

                <p class="flex justify-between">
                    <span class="text-slate-400">Half Centuries</span>
                    <strong>${escapeHTML(stats.fifties ?? 0)}</strong>
                </p>

            </div>

        `;

        exploreDetails.appendChild(card);

    });


    // BOWLING INFORMATION

    const bowling = statsData.bowling || {};

    if (Object.keys(bowling).length === 0) {

        const note = document.createElement("p");

        note.className = "col-span-full text-sm text-slate-400";

        note.textContent =
            "Bowling statistics are not available in this response.";

        exploreDetails.appendChild(note);

    }

}


// ==========================================
// 2. INTERNATIONAL TEAMS
// ==========================================

async function loadTeams() {

    showMessage("Explore international cricket teams");

    const data = await fetchCricketData("/teams");

    if (!data) return;

    const teams = getArray(data);

    exploreDetails.innerHTML = "";

    if (teams.length === 0) {

        showMessage("No teams found.");

        return;

    }

    showMessage(`${teams.length} teams loaded successfully.`);

    teams.forEach(function (team) {

        const name = team.name || team.team || "Unknown Team";

        const matches = team.matches ?? team.match_count ?? "Not available";

        const card = createCard(
            name,
            `Total matches: ${matches}`,
            "fa-flag"
        );

        const button = document.createElement("button");

        button.className = `
            mt-5
            rounded-lg
            bg-green-500
            px-4
            py-2
            text-sm
            font-bold
            text-black
            hover:bg-green-400
        `;

        button.textContent = "View Team Details";

        button.addEventListener("click", function () {

            const teamId = team.team;

            if (!teamId) return;

            loadTeamDetails(teamId);

        });

        card.appendChild(button);

        exploreDetails.appendChild(card);

    });

}


// ==========================================
// TEAM DETAILS
// ==========================================

async function loadTeamDetails(teamId) {

    const data = await fetchCricketData(
        `/teams/${encodeURIComponent(teamId)}`
    );

    if (!data) return;

    exploreDetails.innerHTML = "";

    const teamName = data.name || teamId;

    showMessage(`${teamName} - Team Statistics`);

    const records = data.record || {};

    ["test", "odi", "t20i"].forEach(function (format) {

        const stats = records[format];

        if (!stats) return;

        const card = document.createElement("div");

        card.className = `
            rounded-xl
            border border-white/10
            bg-[#111a24]
            p-5
        `;

        card.innerHTML = `

            <h3 class="text-xl font-bold text-green-400">
                ${escapeHTML(format.toUpperCase())}
            </h3>

            <div class="mt-5 space-y-3 text-sm">

                <p class="flex justify-between">
                    <span class="text-slate-400">Played</span>
                    <strong>${escapeHTML(stats.played ?? 0)}</strong>
                </p>

                <p class="flex justify-between">
                    <span class="text-slate-400">Won</span>
                    <strong>${escapeHTML(stats.won ?? 0)}</strong>
                </p>

                <p class="flex justify-between">
                    <span class="text-slate-400">Lost</span>
                    <strong>${escapeHTML(stats.lost ?? 0)}</strong>
                </p>

            </div>

        `;

        exploreDetails.appendChild(card);

    });

    if (exploreDetails.children.length === 0) {

        exploreDetails.appendChild(
            createCard(teamName, "No format statistics available.", "fa-flag")
        );

    }

}


// ==========================================
// 3. TOURNAMENTS
// ==========================================

async function loadTournaments() {

    showMessage("Explore cricket tournaments");

    const data = await fetchCricketData("/competitions");

    if (!data) return;

    const tournaments = getArray(data);

    exploreDetails.innerHTML = "";

    if (tournaments.length === 0) {

        showMessage("No tournaments found.");

        return;

    }

    showMessage(`${tournaments.length} tournaments loaded successfully.`);

    tournaments.forEach(function (tournament) {

        const name =
            tournament.name ||
            tournament.competition ||
            "Unknown Tournament";

        const kind = tournament.kind || "Cricket Competition";

        const matches =
            tournament.matches ??
            tournament.match_count ??
            "Not available";

        const card = createCard(
            name,
            `${kind} | Matches: ${matches}`,
            "fa-trophy"
        );

        const button = document.createElement("button");

        button.className = `
            mt-5
            rounded-lg
            bg-green-500
            px-4
            py-2
            text-sm
            font-bold
            text-black
            hover:bg-green-400
        `;

        button.textContent = "View Tournament";

        button.addEventListener("click", function () {

            const competitionId = tournament.competition;

            if (!competitionId) return;

            loadTournamentDetails(competitionId);

        });

        card.appendChild(button);

        exploreDetails.appendChild(card);

    });

}


// ==========================================
// TOURNAMENT DETAILS
// ==========================================

async function loadTournamentDetails(competitionId) {

    const data = await fetchCricketData(
        `/competitions/${encodeURIComponent(competitionId)}`
    );

    if (!data) return;

    exploreDetails.innerHTML = "";

    showMessage("Tournament Details");

    const name = data.name || competitionId;

    exploreDetails.appendChild(
        createCard(name, "Tournament information", "fa-trophy")
    );

    const titles = data.titles || [];

    titles.forEach(function (title) {

        const teamName = title.team || title.name || "Unknown Team";

        exploreDetails.appendChild(
            createCard(
                teamName,
                `Titles: ${title.titles ?? title.count ?? "Not available"}`,
                "fa-medal"
            )
        );

    });

    const leaders = data.leaders || [];

    leaders.forEach(function (leader) {

        exploreDetails.appendChild(
            createCard(
                leader.name || leader.player || "Tournament Leader",
                "Tournament statistics leader",
                "fa-star"
            )
        );

    });

}


// ==========================================
// 4. CRICKET RECORDS
// ==========================================

function showRecordsOptions() {

    showMessage("Choose a cricket record category");

    exploreDetails.innerHTML = "";

    const container = document.createElement("div");

    container.className = `
        col-span-full
        rounded-xl
        border border-white/10
        bg-[#111a24]
        p-6
    `;

    container.innerHTML = `

        <h3 class="text-xl font-bold text-green-400">
            Cricket Records
        </h3>

        <p class="mt-2 text-sm text-slate-400">
            Select the format and record category.
        </p>

        <div class="mt-6 grid gap-4 sm:grid-cols-3">

            <div>

                <label class="mb-2 block text-sm text-slate-300">
                    Record Type
                </label>

                <select id="recordType"
                    class="w-full rounded-lg border border-white/10 bg-[#080d13] p-3 text-white">

                    <option value="most_runs">Most Runs</option>

                    <option value="most_wickets">Most Wickets</option>

                    <option value="highest_score">Highest Individual Score</option>

                    <option value="best_bowling">Best Bowling</option>

                    <option value="team_totals">Team Totals</option>

                </select>

            </div>

            <div>

                <label class="mb-2 block text-sm text-slate-300">
                    Format
                </label>

                <select id="recordFormat"
                    class="w-full rounded-lg border border-white/10 bg-[#080d13] p-3 text-white">

                    <option value="test">Test</option>

                    <option value="odi">ODI</option>

                    <option value="t20i">T20I</option>

                </select>

            </div>

            <div>

                <label class="mb-2 block text-sm text-slate-300">
                    Gender
                </label>

                <select id="recordGender"
                    class="w-full rounded-lg border border-white/10 bg-[#080d13] p-3 text-white">

                    <option value="male">Men</option>

                    <option value="female">Women</option>

                </select>

            </div>

        </div>

        <button id="loadRecordsButton"
            class="mt-6 rounded-lg bg-green-500 px-6 py-3 font-bold text-black hover:bg-green-400">

            Load Records

            <i class="fa-solid fa-arrow-right ml-2"></i>

        </button>

    `;

    exploreDetails.appendChild(container);

    document.getElementById("loadRecordsButton").addEventListener(
        "click",
        loadRecords
    );

}


// ==========================================
// LOAD RECORDS FROM API
// ==========================================

async function loadRecords() {

    const type = document.getElementById("recordType").value;

    const format = document.getElementById("recordFormat").value;

    const gender = document.getElementById("recordGender").value;

    const query = new URLSearchParams({

        type: type,

        format: format,

        gender: gender

    });

    const data = await fetchCricketData(`/records?${query.toString()}`);

    if (!data) return;

    const records = getArray(data);

    exploreDetails.innerHTML = "";

    showMessage("Cricket Records");

    if (records.length === 0) {

        showMessage("No records available for this selection.");

        return;

    }

    records.forEach(function (record, index) {

        const title =
            record.name ||
            record.player ||
            record.team ||
            record.record ||
            `Record ${index + 1}`;

        const description = Object.entries(record)

            .filter(([key, value]) =>
                key !== "name" &&
                key !== "player" &&
                key !== "team" &&
                value !== null &&
                typeof value !== "object"
            )

            .map(([key, value]) =>
                `${key.replaceAll("_", " ")}: ${value}`
            )

            .join(" | ");

        exploreDetails.appendChild(
            createCard(
                title,
                description || "Record information",
                "fa-chart-column"
            )
        );

    });

}


// ==========================================
// EXPLORE BUTTON EVENTS
// ==========================================

exploreButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const selectedSection = button.dataset.section;

        exploreDetails.innerHTML = "";

        switch (selectedSection) {

            case "players":

                loadPlayers();

                break;

            case "teams":

                loadTeams();

                break;

            case "tournaments":

                loadTournaments();

                break;

            case "records":

                showRecordsOptions();

                break;

            default:

                showMessage("Select a valid cricket category.");

        }

        exploreDetails.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    });

});


// ==========================================
// APPLICATION START
// ==========================================

console.log("Welcome to CRICKETVERSE!");

console.log("Cricket Database API integration initialized.");