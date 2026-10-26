const audio = document.getElementById("audio");
const drugsVisual=document.getElementById("drugsVisual")
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const songTitle = document.getElementById("songTitle");
const cassette = document.getElementById("cassette");
const statusText = document.getElementById("statusText");
const statusDot = document.getElementById("statusDot");
const volume = document.getElementById("volume");
const playlist = [
    {
        title: "VATTHIKUCHI PATHIKATHU (DHEENA)",
        src: "songs/Vathikuchi.mp3"
    },
    {
        title: "SOLLAMAL (DHEENA)",
        src: "songs/Sollamal.mp3"
    },
    {
        title: "Senyoreeta",
        src: "songs/Senyoreeta.mp3"
    },
    {
        title: "IRAVA PAGALA",
        src: "songs/Irava-Pagala.mp3"
    },
    {
        title: "En Anbae",
        src: "songs/En-Anbae.mp3"
    },
    {
        title: "Chinna-Chinnathai",
        src: "songs/Chinna-Chinnathai.mp3"
    },
    {
        title: "Mun Paniya",
        src: "songs/Mun-Paniyaa.mp3"
    },
    {
        title: "Ninaithu Ninaithu Parthen",
        src: "songs/Ninaithu-Ninaithu-Parthen.mp3"
    },
    {
        title: "Kanaa-Kaanum-Kalangal",
        src: "songs/Kanaa-Kaanum.mp3"
    },
    {
        title: "ORU NAALIL (PUDHUPETTAI)",
        src: "songs/Oru Naalil.mp3"
    },
    {
        title: "ORU KAL ORU KANADI (SMS)",
        src: "songs/Oru Kal.mp3"
    },
    {
        title: "THULI THULI (PAIYAA)",
        src: "songs/thuli.mp3"
    },
    {
        title: "Poongatre Poongatre (PAIYAA)",
        src: "songs/Poongatre-Poongatre.mp3"
    },
    {
        title: "EN KADHAL SOLLA (PAIYAA)",
        src: "songs/En-Kadhal-Solla.mp3"
    },
    {
        title: "Idhu Varai (Goa)",
        src: "songs/Idhu-Varai.mp3"
    },
    {
        title: "YELA YELA (ARINTHUM ARIYAMALUM)",
        src: "songs/Yela Yela.mp3"
    },
    {
        title: "VENMEGAM (YAARADI NEE MOHINI)",
        src: "songs/Venmegam.mp3"
    },
    {
        title: "IRAGAI POLE (NAAN MAHAN ALLA)",
        src: "songs/Iragai-Pole.mp3"
    },
    {
        title: "NEEDHAANE (SARVAM)",
        src: "songs/Needhane.mp3"
    },
    {
        title: "KADHAL VAITHU KADHAL VAITHIU",
        src: "songs/Kadhal Vaithu.mp3"
    },
    {
        title: "POGADHE POGADHE (DEEPAWALI)",
        src: "songs/Pogadhey Pogadhey.mp3"
    },
    {
        title: "Jalsa-Remix (CHENNAI 600028)",
        src: "songs/Jalsa-Remix.mp3"
    },
    {
        title: "Patheyam Pedikudhu",
        src: "songs/Paitheyam.mp3"
    },
    {
        title: "Thakuthe",
        src: "songs/Thakuthe.mp3"
    }
];
let currentIndex = 0;
function loadSong(index) {
    currentIndex = index;
    audio.src = playlist[currentIndex].src;
    songTitle.textContent = playlist[currentIndex].title;
    progress.value = 0;
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";
    updateStatus(false);
}
function updateStatus(isPlaying) {
if (isPlaying) {
playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
playBtn.setAttribute("aria-label", "Pause");
statusText.textContent = "Now Playing";
statusText.classList.remove("text-gray-400");
statusText.classList.add("text-cyan-400");
statusDot.classList.remove("bg-gray-500");
statusDot.classList.add("bg-cyan-400");
cassette.classList.add("cassette-playing");
drugsVisual.classList.add("crystals-active"); } else { playBtn.innerHTML = '<i class="fa-solid fa-play"></i>'; playBtn.setAttribute("aria-label", "Play"); statusText.textContent = "Paused"; statusText.classList.remove("text-cyan-400"); statusText.classList.add("text-gray-400"); statusDot.classList.remove("bg-cyan-400"); statusDot.classList.add("bg-gray-500"); cassette.classList.remove("cassette-playing");
    drugsVisual.classList.remove("crystals-active");
}
}

async function playSong() {


    try {
        await audio.play();
        updateStatus(true);
    } catch (error) {
        console.error("Unable to play the song:", error);
        statusText.textContent = "Unable to play song";
        updateStatus(false);
    }
}
function pauseSong() {
    audio.pause();
    updateStatus(false);
}
playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});
nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadSong(currentIndex);
    playSong();
});
prevBtn.addEventListener("click", () => {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
    } else {
        currentIndex =
            (currentIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentIndex);
        playSong();
    }
});
audio.addEventListener("timeupdate", () => {

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progress.value =
            (audio.currentTime / audio.duration) * 100;
        currentTimeEl.textContent =
            formatTime(audio.currentTime);
    }
});
audio.addEventListener("loadedmetadata", () => {
    if (Number.isFinite(audio.duration)) {

        durationEl.textContent =
            formatTime(audio.duration);
    }
});
progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime =
            (Number(progress.value) / 100) * audio.duration;
    }
});
audio.addEventListener("ended", () => {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadSong(currentIndex);
    playSong();
});
volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
});
audio.addEventListener("play", () => {
    updateStatus(true);
});
audio.addEventListener("pause", () => {
    updateStatus(false);
});
audio.addEventListener("error", () => {
    statusText.textContent = "Song file not found";
    updateStatus(false);
    console.error(
        "Audio file could not be loaded:",
        playlist[currentIndex].src
    );
});
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}
audio.volume = Number(volume.value);
loadSong(currentIndex);
























