const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const songTitle = document.getElementById("songTitle");
const playlist = [
  { title: "VATTHIKUCHI PATHIKATHU (DHEENA)", src: "songs/Vathikuchi.mp3" },
  { title: "SOLLAMAL (DHEENA)", src: "songs/Sollamal.mp3" },
  { title: "Senyoreeta", src: "songs/Senyoreeta.mp3" },
  { title: "IRAVA PAGALA", src: "songs/Irava-Pagala.mp3" },
  { title: "Ninaithu Ninaithu Parthen", src: "songs/Ninaithu-Ninaithu-Parthen.mp3" },
  { title: "Kanaa-Kaanum-Kalangal", src: "songs/Kanaa-Kaanum.mp3" },
  { title: "ORU NAALIL (PUDHUPETTAI)", src: "songs/Oru Naalil.mp3" },
  { title: "ORU KAL ORU KANADI (SMS)", src: "songs/Oru Kal.mp3" },
   { title: "THULI THULI (PAIYAA)", src: "songs/thuli.mp3" },
   { title: "Poongatre Poongatre (PAIYAA)", src: "songs/Poongatre-Poongatre.mp3" },
  { title: "EN KADHAL SOLLA (PAIYAA)", src: "songs/En-Kadhal-Solla.mp3" },
  { title: "Idhu Varai (Goa)", src: "songs/Idhu-Varai.mp3" },
  { title: "YELA YELA (ARINTHUM ARIYAMALUM)", src: "songs/Yela Yela.mp3" },
  { title: "VENMEGAM (YAARADI NEE MOHINI)", src: "songs/Venmegam.mp3" },
  { title: "IRAGAI POLE (NAAN MAHAN ALLA)", src: "songs/Iragai-Pole.mp3" },
  { title: "NEEDHAANE (SARVAM)", src: "songs/Needhane.mp3" },
  { title: "KADHAL VAITHU KADHAL VAITHIU", src: "songs/Kadhal Vaithu.mp3" },
  { title: "POGADHE POGADHE(DEEPAWALI)", src: "songs/Pogadhey Pogadhey.mp3" },
  { title: "Jalsa-Remix (CHENNAI 600028)", src: "songs/Jalsa-Remix.mp3" },
  { title: "Patheyam Pedikudhu", src: "songs/Paitheyam.mp3" },
  { title: "Thakuthe", src: "songs/Thakuthe.mp3" },

];

let currentIndex = 0;
function loadSong(index) {
  audio.src = playlist[index].src;
  songTitle.innerText = playlist[index].title;
}

function playSong() {
  audio.play();
  playBtn.innerText = "Pause";
}

function pauseSong() {
  audio.pause();
  playBtn.innerText = "Play";
}

loadSong(currentIndex);

playBtn.onclick = () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
};

nextBtn.onclick = () => {
  currentIndex = (currentIndex + 1) % playlist.length;
  loadSong(currentIndex);
  playSong();
};

prevBtn.onclick = () => {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentIndex);
  playSong();
};

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.innerText = formatTime(audio.currentTime);
  }
});

audio.addEventListener("loadedmetadata", () => {
  durationEl.innerText = formatTime(audio.duration);
});

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

audio.addEventListener("ended", () => {
  currentIndex = (currentIndex + 1) % playlist.length;
  loadSong(currentIndex);
  playSong();
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
