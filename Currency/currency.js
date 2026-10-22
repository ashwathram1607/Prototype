const CURRENCIES_API = "https://api.frankfurter.dev/v2/currencies";
const RATES_API = "https://api.frankfurter.dev/v2/rates";
const currencySearch = document.getElementById("currencySearch");
const currencyTableBody = document.getElementById("currencyTableBody");
const lastUpdated = document.getElementById("lastUpdated");
const statusMessage = document.getElementById("statusMessage");
const refreshBtn = document.getElementById("refreshBtn");
const amountInput = document.getElementById("amountInput");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertedAmount = document.getElementById("convertedAmount");

let currencies = [];
let inrRates = [];
let currencyRates = {};
let filteredCurrencies = [];
const currencyFlags = {
    INR: "🇮🇳",
    USD: "🇺🇸",
    GBP: "🇬🇧",
    EUR: "🇪🇺",
    JPY: "🇯🇵",
    CNY: "🇨🇳",
    SGD: "🇸🇬",
    AED: "🇦🇪",
    AUD: "🇦🇺",
    CAD: "🇨🇦",
    CHF: "🇨🇭",
    NZD: "🇳🇿",
    MYR: "🇲🇾",
    THB: "🇹🇭",
    LKR: "🇱🇰",
    NPR: "🇳🇵",
    BDT: "🇧🇩",
    PKR: "🇵🇰",
    KRW: "🇰🇷",
    HKD: "🇭🇰",
    SAR: "🇸🇦",
    QAR: "🇶🇦",
    KWD: "🇰🇼",
    ZAR: "🇿🇦",
    RUB: "🇷🇺",
    BRL: "🇧🇷",
    MXN: "🇲🇽",
    IDR: "🇮🇩",
    PHP: "🇵🇭",
    VND: "🇻🇳",
    TRY: "🇹🇷",
    SEK: "🇸🇪",
    NOK: "🇳🇴",
    DKK: "🇩🇰",
    PLN: "🇵🇱",
    EGP: "🇪🇬"
};

async function loadCurrencyData() {
    try {
        showStatus("Loading currency exchange rates...", false);

        if (refreshBtn) {
            refreshBtn.disabled = true;
        }
        const currenciesResponse = await fetch(CURRENCIES_API);

        if (!currenciesResponse.ok) {
            throw new Error("Unable to load currency list.");
        }

        currencies = await currenciesResponse.json();
        const ratesResponse = await fetch(`${RATES_API}?base=INR`);

        if (!ratesResponse.ok) {
            throw new Error("Unable to load exchange rates.");
        }
        inrRates = await ratesResponse.json();
        currencyRates = {};
        currencyRates.INR = 1;

        inrRates.forEach((item) => {
            currencyRates[item.quote] = item.rate;
        });
        populateCurrencyDropdowns();

        filteredCurrencies = [...currencies];

        renderCurrencyTable(filteredCurrencies);

        // Update last refreshed date
        const dates = inrRates.map((item) => item.date);
        const latestDate = dates.sort().at(-1);

        if (lastUpdated) {
            lastUpdated.textContent = latestDate
                ? `Rates date: ${latestDate}`
                : "Rates loaded successfully";
        }

        showStatus(
            `Successfully loaded ${currencies.length} currencies.`,
            false
        );
        convertCurrency();

    } catch (error) {
        console.error("Currency API Error:", error);

        showStatus(
            "Unable to load currency data. Please check your internet connection and try again.",
            true
        );

    } finally {
        if (refreshBtn) {
            refreshBtn.disabled = false;
        }
    }
}
function showStatus(message, isError) {
    if (!statusMessage) return;

    statusMessage.textContent = message;

    statusMessage.classList.toggle("text-red-500", isError);
    statusMessage.classList.toggle("text-green-600", !isError);
}
function getValueInINR(currencyCode) {
    if (currencyCode === "INR") {
        return 1;
    }

    const rate = currencyRates[currencyCode];

    if (!rate || rate <= 0) {
        return null;
    }
    return 1 / rate;
}
function formatNumber(value) {
    if (value === null || !Number.isFinite(value)) {
        return "Not available";
    }

    return value.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
    });
}

function renderCurrencyTable(currencyList) {
    if (!currencyTableBody) return;

    currencyTableBody.replaceChildren();

    if (currencyList.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 4;
        cell.className = "px-4 py-8 text-center text-gray-500";
        cell.textContent = "No currencies found.";

        row.appendChild(cell);
        currencyTableBody.appendChild(row);

        return;
    }

    currencyList.forEach((currency) => {
        const code = currency.iso_code;
        const name = currency.name;
        const symbol = currency.symbol || code;
        const flag = currencyFlags[code] || "🌐";
        const valueInINR = getValueInINR(code);

        const row = document.createElement("tr");

        row.className =
            "border-b border-gray-100 hover:bg-blue-50 transition";

        // Country / flag column
        const countryCell = document.createElement("td");
        countryCell.className = "px-4 py-4";

        const flagSpan = document.createElement("span");
        flagSpan.className = "mr-2 text-xl";
        flagSpan.textContent = flag;

        const nameSpan = document.createElement("span");
        nameSpan.className = "font-medium text-gray-800";
        nameSpan.textContent = name;

        countryCell.append(flagSpan, nameSpan);

        // Currency code column
        const codeCell = document.createElement("td");
        codeCell.className = "px-4 py-4";

        const codeBadge = document.createElement("span");
        codeBadge.className =
            "rounded-md bg-gray-100 px-2 py-1 font-semibold text-gray-700";

        codeBadge.textContent = code;

        codeCell.appendChild(codeBadge);
        const symbolCell = document.createElement("td");
        symbolCell.className = "px-4 py-4 text-gray-600";
        symbolCell.textContent = symbol;
        const valueCell = document.createElement("td");
        valueCell.className =
            "px-4 py-4 text-right font-semibold text-gray-900";

        valueCell.textContent =
            valueInINR === null
                ? "Not available"
                : `₹ ${formatNumber(valueInINR)}`;

        row.append(
            countryCell,
            codeCell,
            symbolCell,
            valueCell
        );

        currencyTableBody.appendChild(row);
    });
}
function searchCurrency() {
    const searchTerm = currencySearch.value
        .trim()
        .toLowerCase();

    filteredCurrencies = currencies.filter((currency) => {
        const name = currency.name.toLowerCase();
        const code = currency.iso_code.toLowerCase();

        return (
            name.includes(searchTerm) ||
            code.includes(searchTerm)
        );
    });

    renderCurrencyTable(filteredCurrencies);
}
function populateCurrencyDropdowns() {
    if (!fromCurrency || !toCurrency) return;

    const availableCurrencies = currencies.filter((currency) => {
        return currencyRates[currency.iso_code] > 0;
    });

    fromCurrency.replaceChildren();
    toCurrency.replaceChildren();

    availableCurrencies.forEach((currency) => {
        const code = currency.iso_code;
        const name = currency.name;

        const option1 = document.createElement("option");
        option1.value = code;
        option1.textContent = `${code} - ${name}`;

        const option2 = document.createElement("option");
        option2.value = code;
        option2.textContent = `${code} - ${name}`;

        fromCurrency.appendChild(option1);
        toCurrency.appendChild(option2);
    });

    // Default currencies
    fromCurrency.value = "USD";
    toCurrency.value = "INR";
}

function convertCurrency() {
    if (
        !amountInput ||
        !fromCurrency ||
        !toCurrency ||
        !convertedAmount
    ) {
        return;
    }

    const amount = Number(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (!Number.isFinite(amount) || amount < 0) {
        convertedAmount.textContent = "Enter a valid amount";
        return;
    }

    const fromRate = currencyRates[from];
    const toRate = currencyRates[to];

    if (
        fromRate === undefined ||
        toRate === undefined ||
        fromRate <= 0 ||
        toRate <= 0
    ) {
        convertedAmount.textContent = "Rate unavailable";
        return;
    }
    const result = amount * (toRate / fromRate);

    convertedAmount.textContent =
        `${formatNumber(amount)} ${from} = ` +
        `${formatNumber(result)} ${to}`;
}

if (currencySearch) {
    currencySearch.addEventListener("input", searchCurrency);
}

// Refresh currency data
if (refreshBtn) {
    refreshBtn.addEventListener("click", loadCurrencyData);
}

// Update converter when values change
if (amountInput) {
    amountInput.addEventListener("input", convertCurrency);
}

if (fromCurrency) {
    fromCurrency.addEventListener("change", convertCurrency);
}

if (toCurrency) {
    toCurrency.addEventListener("change", convertCurrency);
}

loadCurrencyData();