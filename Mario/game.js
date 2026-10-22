const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const coinsElement = document.getElementById("coins");
const livesElement = document.getElementById("lives");

const overlay = document.getElementById("gameOverlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayMessage = document.getElementById("overlayMessage");
const overlayIcon = document.getElementById("overlayIcon");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const pauseBtn = document.getElementById("pauseBtn");
const pauseText = document.getElementById("pauseText");
const pauseIcon = document.getElementById("pauseIcon");

const soundBtn = document.getElementById("soundBtn");
const soundIcon = document.getElementById("soundIcon");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const GRAVITY = 0.55;
const MOVE_SPEED = 4.5;
const JUMP_POWER = -12.5;

const WORLD_WIDTH = 2500;
const FINISH_X = 2300;
let gameStarted = false;
let gamePaused = false;
let gameOver = false;
let gameWon = false;

let score = 0;
let coinCount = 0;
let lives = 3;

let cameraX = 0;
let soundEnabled = true;
let audioContext = null;

let animationId = null;
const player = {
    x: 80,
    y: 350,
    width: 30,
    height: 42,

    velocityX: 0,
    velocityY: 0,

    onGround: false,
    invincible: 0
};


const keys = {
    left: false,
    right: false
};


let platforms = [];
let coins = [];
let enemies = [];


function createLevel() {

    platforms = [
        // Main ground sections
        { x: 0, y: 465, width: 500, height: 75 },
        { x: 570, y: 465, width: 450, height: 75 },
        { x: 1100, y: 465, width: 450, height: 75 },
        { x: 1640, y: 465, width: 860, height: 75 },

        // Floating platforms
        { x: 210, y: 370, width: 120, height: 18 },
        { x: 390, y: 310, width: 110, height: 18 },
        { x: 650, y: 375, width: 120, height: 18 },
        { x: 820, y: 315, width: 120, height: 18 },
        { x: 1190, y: 370, width: 120, height: 18 },
        { x: 1390, y: 310, width: 120, height: 18 },
        { x: 1740, y: 375, width: 130, height: 18 },
        { x: 1950, y: 310, width: 130, height: 18 }
    ];


    coins = [
        { x: 250, y: 330, collected: false },
        { x: 300, y: 330, collected: false },
        { x: 430, y: 270, collected: false },
        { x: 470, y: 270, collected: false },

        { x: 680, y: 335, collected: false },
        { x: 730, y: 335, collected: false },
        { x: 860, y: 275, collected: false },

        { x: 1200, y: 330, collected: false },
        { x: 1250, y: 330, collected: false },
        { x: 1430, y: 270, collected: false },

        { x: 1770, y: 335, collected: false },
        { x: 1820, y: 335, collected: false },
        { x: 1980, y: 270, collected: false },
        { x: 2050, y: 420, collected: false },
    ];


    enemies = [
        { x: 350, y: 435, width: 30, height: 30, minX: 320, maxX: 460, direction: 1, speed: 1.4 },
        { x: 730, y: 435, width: 30, height: 30, minX: 600, maxX: 900, direction: 1, speed: 1.6 },
        { x: 1270, y: 435, width: 30, height: 30, minX: 1140, maxX: 1480, direction: 1, speed: 1.8 },
        { x: 1810, y: 435, width: 30, height: 30, minX: 1680, maxX: 2100, direction: 1, speed: 1.7 }
    ];

}


function playSound(frequency = 600, duration = 0.1) {

    if (!soundEnabled) return;

    try {

        if (!audioContext) {
            const AudioContextClass =
                window.AudioContext || window.webkitAudioContext;

            if (!AudioContextClass) return;

            audioContext = new AudioContextClass();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "square";
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(0.06, audioContext.currentTime);

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + duration
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);

    } catch (error) {
        console.warn("Audio is unavailable.", error);
    }

}


function updateHUD() {

    scoreElement.textContent = score;
    coinsElement.textContent = coinCount;
    livesElement.textContent = lives;

}
function showOverlay(title, message, icon, buttonText) {
    overlayTitle.textContent = title;
    overlayMessage.textContent = message;

    overlayIcon.innerHTML = `<i class="${icon}"></i>`;

    startBtn.innerHTML =
        `<i class="fa-solid fa-play mr-2"></i>${buttonText}`;

    overlay.classList.remove("hidden");
    overlay.classList.add("flex");

}


function hideOverlay() {

    overlay.classList.add("hidden");
    overlay.classList.remove("flex");

}


function resetGame() {

    cancelAnimationFrame(animationId);

    score = 0;
    coinCount = 0;
    lives = 3;

    cameraX = 0;

    gameStarted = false;
    gamePaused = false;
    gameOver = false;
    gameWon = false;

    keys.left = false;
    keys.right = false;

    player.x = 80;
    player.y = 350;

    player.velocityX = 0;
    player.velocityY = 0;

    player.onGround = false;
    player.invincible = 0;

    pauseBtn.disabled = true;

    pauseText.textContent = "Pause Game";
    pauseIcon.className = "fa-solid fa-pause mr-2";

    createLevel();
    updateHUD();

    draw();

    showOverlay(
        "Let's Adventure!",
        "Collect coins, avoid enemies and reach the flag!",
        "fa-solid fa-gamepad",
        "Start Game"
    );

}


function startGame() {

    if (gameStarted && !gamePaused) return;

    gameStarted = true;
    gamePaused = false;

    gameOver = false;
    gameWon = false;

    hideOverlay();

    pauseBtn.disabled = false;

    pauseText.textContent = "Pause Game";
    pauseIcon.className = "fa-solid fa-pause mr-2";

    if (audioContext && audioContext.state === "suspended") {
        audioContext.resume();
    }

    cancelAnimationFrame(animationId);

    gameLoop();

}


function togglePause() {

    if (!gameStarted || gameOver || gameWon) return;

    gamePaused = !gamePaused;

    if (gamePaused) {

        cancelAnimationFrame(animationId);

        pauseText.textContent = "Resume Game";
        pauseIcon.className = "fa-solid fa-play mr-2";

        showOverlay(
            "Game Paused",
            "Take a break! Resume when you are ready.",
            "fa-solid fa-pause",
            "Resume Game"
        );

    } else {

        hideOverlay();

        pauseText.textContent = "Pause Game";
        pauseIcon.className = "fa-solid fa-pause mr-2";

        gameLoop();

    }

}



function isColliding(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );

}


function loseLife() {

    if (player.invincible > 0 || gameOver || gameWon) {
        return;
    }

    lives--;

    player.invincible = 90;

    playSound(150, 0.25);

    if (lives <= 0) {

        lives = 0;

        gameOver = true;
        gameStarted = false;

        pauseBtn.disabled = true;

        updateHUD();

        showOverlay(
            "Game Over!",
            `Final score: ${score}. Try again and beat your score!`,
            "fa-solid fa-heart-crack",
            "Play Again"
        );

        return;

    }

      player.x = Math.max(80, player.x - 70);
    player.y = 350;

    player.velocityX = 0;
    player.velocityY = 0;

    cameraX = Math.max(0, player.x - 250);

    updateHUD();

}


function collectCoins() {

    for (const coin of coins) {

        if (coin.collected) continue;

        const coinBox = {
            x: coin.x - 10,
            y: coin.y - 10,
            width: 20,
            height: 20
        };

        if (isColliding(player, coinBox)) {

            coin.collected = true;

            coinCount++;
            score += 10;

            playSound(900, 0.08);

            updateHUD();

        }

    }

}


function updateEnemies() {

    for (const enemy of enemies) {

        enemy.x += enemy.speed * enemy.direction;

        if (enemy.x <= enemy.minX) {
            enemy.direction = 1;
        }

        if (enemy.x + enemy.width >= enemy.maxX) {
            enemy.direction = -1;
        }

        if (player.invincible === 0 && isColliding(player, enemy)) {
            loseLife();
        }

    }

}


function updatePlayer() {

    const previousBottom = player.y + player.height;

        player.velocityX = 0;

    if (keys.left) {
        player.velocityX = -MOVE_SPEED;
    }

    if (keys.right) {
        player.velocityX = MOVE_SPEED;
    }

    player.x += player.velocityX;

        player.x = Math.max(
        0,
        Math.min(WORLD_WIDTH - player.width, player.x)
    );

    // Gravity
    player.velocityY += GRAVITY;
    player.y += player.velocityY;

    player.onGround = false;

        for (const platform of platforms) {

        const currentBottom = player.y + player.height;

        const overlapsHorizontally =
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width;

        const crossedPlatformTop =
            previousBottom <= platform.y &&
            currentBottom >= platform.y;

        if (
            overlapsHorizontally &&
            crossedPlatformTop &&
            player.velocityY >= 0
        ) {

            player.y = platform.y - player.height;

            player.velocityY = 0;

            player.onGround = true;

        }

    }

        if (player.invincible > 0) {
        player.invincible--;
    }

        if (player.y > HEIGHT + 100) {
        loseLife();
    }

}


function jump() {

    if (!gameStarted || gamePaused || gameOver || gameWon) {
        return;
    }

    if (player.onGround) {

        player.velocityY = JUMP_POWER;

        player.onGround = false;

        playSound(450, 0.08);

    }

}

function checkWin() {

    if (player.x + player.width >= FINISH_X) {

        gameWon = true;
        gameStarted = false;

        score += lives * 50;

        updateHUD();

        pauseBtn.disabled = true;

        playSound(1000, 0.3);

        showOverlay(
            "Level Complete!",
            `Amazing! Your final score is ${score}. Coins collected: ${coinCount}.`,
            "fa-solid fa-trophy",
            "Play Again"
        );

    }

}


function update() {

    if (!gameStarted || gamePaused || gameOver || gameWon) {
        return;
    }

    updatePlayer();

    updateEnemies();

    collectCoins();

    checkWin();

       cameraX = player.x - WIDTH * 0.3;

    cameraX = Math.max(
        0,
        Math.min(WORLD_WIDTH - WIDTH, cameraX)
    );

    updateHUD();

}


function drawBackground() {

    const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);

    sky.addColorStop(0, "#38bdf8");
    sky.addColorStop(1, "#bae6fd");

    ctx.fillStyle = sky;

    ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.fillStyle = "#fde047";

    ctx.beginPath();
    ctx.arc(820, 80, 40, 0, Math.PI * 2);
    ctx.fill();

        drawCloud(100 - cameraX * 0.2, 90);
    drawCloud(350 - cameraX * 0.2, 140);
    drawCloud(650 - cameraX * 0.2, 80);
    drawCloud(900 - cameraX * 0.2, 150);

        ctx.fillStyle = "#86efac";

    for (let i = -1; i < 6; i++) {

        const hillX = i * 260 - (cameraX * 0.35) % 260;

        ctx.beginPath();

        ctx.ellipse(
            hillX + 100,
            465,
            180,
            100,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


function drawCloud(x, y) {

    ctx.fillStyle = "rgba(255,255,255,0.9)";

    ctx.beginPath();

    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.arc(x + 25, y - 12, 30, 0, Math.PI * 2);
    ctx.arc(x + 55, y, 22, 0, Math.PI * 2);

    ctx.fill();

}
function drawPlatform(platform) {

    const x = platform.x - cameraX;

    if (x + platform.width < 0 || x > WIDTH) {
        return;
    }

    // Ground
    ctx.fillStyle = "#854d0e";

    ctx.fillRect(
        x,
        platform.y,
        platform.width,
        platform.height
    );

        ctx.fillStyle = "#22c55e";

    ctx.fillRect(
        x,
        platform.y,
        platform.width,
        10
    );

    
    ctx.fillStyle = "#a16207";

    for (let i = 12; i < platform.width; i += 35) {

        ctx.fillRect(
            x + i,
            platform.y + 25,
            12,
            8
        );

    }

}


function drawCoin(coin) {

    if (coin.collected) return;

    const x = coin.x - cameraX;

    if (x < -20 || x > WIDTH + 20) {
        return;
    }

    const wobble = Math.sin(Date.now() / 150 + coin.x) * 3;

    ctx.fillStyle = "#facc15";

    ctx.beginPath();

    ctx.ellipse(
        x,
        coin.y + wobble,
        10,
        13,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;

    ctx.stroke();

    ctx.fillStyle = "#fff7ae";

    ctx.fillRect(
        x - 2,
        coin.y - 6 + wobble,
        4,
        12
    );

}



function drawEnemy(enemy) {

    const x = enemy.x - cameraX;

    if (x + enemy.width < 0 || x > WIDTH) {
        return;
    }

        ctx.fillStyle = "#7c3aed";

    ctx.beginPath();

    ctx.roundRect(
        x,
        enemy.y,
        enemy.width,
        enemy.height,
        8
    );

    ctx.fill();

        ctx.fillStyle = "#ffffff";

    ctx.fillRect(x + 5, enemy.y + 7, 7, 8);
    ctx.fillRect(x + 18, enemy.y + 7, 7, 8);

    ctx.fillStyle = "#111827";

    ctx.fillRect(x + 8, enemy.y + 10, 3, 4);
    ctx.fillRect(x + 21, enemy.y + 10, 3, 4);

    // Feet
    ctx.fillStyle = "#4c1d95";

    ctx.fillRect(x + 2, enemy.y + 25, 10, 5);
    ctx.fillRect(x + 19, enemy.y + 25, 10, 5);

}


function drawPlayer() {

    const x = player.x - cameraX;
    const y = player.y;

        if (
        player.invincible > 0 &&
        Math.floor(player.invincible / 5) % 2 === 0
    ) {
        return;
    }

        ctx.fillStyle = "#7c2d12";

    ctx.fillRect(x + 1, y + 35, 13, 7);
    ctx.fillRect(x + 17, y + 35, 13, 7);

        ctx.fillStyle = "#2563eb";

    ctx.fillRect(x + 4, y + 20, 22, 16);

        ctx.fillStyle = "#fbbf24";

    ctx.fillRect(x + 5, y + 5, 21, 18);

        ctx.fillStyle = "#78350f";

    ctx.fillRect(x + 3, y + 3, 24, 7);

       ctx.fillStyle = "#dc2626";

    ctx.fillRect(x + 2, y, 25, 7);
    ctx.fillRect(x - 2, y + 5, 32, 4);

        ctx.fillStyle = "#111827";

    ctx.fillRect(x + 19, y + 11, 3, 5);

    ctx.fillStyle = "#facc15";

    ctx.fillRect(x + 9, y + 22, 4, 4);
    ctx.fillRect(x + 18, y + 22, 4, 4);

}


function drawFlag() {

    const x = FINISH_X - cameraX;

    if (x < -50 || x > WIDTH + 50) {
        return;
    }

        ctx.fillStyle = "#475569";

    ctx.fillRect(x, 300, 7, 165);

        ctx.fillStyle = "#16a34a";

    ctx.beginPath();

    ctx.moveTo(x + 7, 305);
    ctx.lineTo(x + 70, 325);
    ctx.lineTo(x + 7, 345);

    ctx.closePath();
    ctx.fill();

        ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Arial";

    ctx.fillText("★", x + 22, 330);

        ctx.fillStyle = "#14532d";
    ctx.font = "bold 14px Arial";

    ctx.fillText("FINISH", x - 15, 285);

}


function draw() {

    drawBackground();

    // Platforms
    for (const platform of platforms) {
        drawPlatform(platform);
    }

        for (const coin of coins) {
        drawCoin(coin);
    }

    // Enemies
    for (const enemy of enemies) {
        drawEnemy(enemy);
    }

       drawFlag();

    // Player
    drawPlayer();

}

function gameLoop() {

    if (!gameStarted || gamePaused || gameOver || gameWon) {
        return;
    }

    update();

    draw();

    animationId = requestAnimationFrame(gameLoop);

}

window.addEventListener("keydown", function (event) {

    const key = event.key.toLowerCase();

    if (
        ["arrowleft", "arrowright", "arrowup", " "].includes(key) ||
        ["w", "a", "d"].includes(key)
    ) {
        event.preventDefault();
    }

    if (key === "arrowleft" || key === "a") {
        keys.left = true;
    }

    if (key === "arrowright" || key === "d") {
        keys.right = true;
    }

    if (
        key === "arrowup" ||
        key === "w" ||
        key === " "
    ) {
        if (!event.repeat) {
            jump();
        }
    }

    if (key === "p") {
        togglePause();
    }

    if (key === "r") {
        resetGame();
        startGame();
    }

});


window.addEventListener("keyup", function (event) {

    const key = event.key.toLowerCase();

    if (key === "arrowleft" || key === "a") {
        keys.left = false;
    }

    if (key === "arrowright" || key === "d") {
        keys.right = false;
    }

});

window.addEventListener("blur", function () {

    keys.left = false;
    keys.right = false;

});


function setupHoldButton(buttonId, direction) {

    const button = document.getElementById(buttonId);

    button.addEventListener("pointerdown", function (event) {

        event.preventDefault();

        keys[direction] = true;

        button.setPointerCapture(event.pointerId);

    });

    function releaseButton() {
        keys[direction] = false;
    }

    button.addEventListener("pointerup", releaseButton);
    button.addEventListener("pointercancel", releaseButton);
    button.addEventListener("lostpointercapture", releaseButton);
    button.addEventListener("pointerleave", releaseButton);

}

setupHoldButton("leftBtn", "left");
setupHoldButton("rightBtn", "right");

document.getElementById("jumpBtn").addEventListener("pointerdown", function (event) {

    event.preventDefault();

    jump();

});

startBtn.addEventListener("click", function () {

    if (gameOver || gameWon) {
        resetGame();
    }

    startGame();

});


restartBtn.addEventListener("click", function () {

    resetGame();

});


pauseBtn.addEventListener("click", function () {

    togglePause();

});


soundBtn.addEventListener("click", function () {

    soundEnabled = !soundEnabled;

    soundIcon.className = soundEnabled
        ? "fa-solid fa-volume-high"
        : "fa-solid fa-volume-xmark";

    soundBtn.setAttribute(
        "aria-label",
        soundEnabled ? "Turn sound off" : "Turn sound on"
    );

    if (soundEnabled) {
        playSound(700, 0.08);
    }

});

createLevel();

updateHUD();

draw();

showOverlay(
    "Let's Adventure!",
    "Collect coins, avoid enemies and reach the flag!",
    "fa-solid fa-gamepad",
    "Start Game"
);

