// ================= GLOBAL =================
let currentPage = 0;
let pages = [];

// ================= INIT =================
window.onload = function () {
  pages = document.querySelectorAll("#journal .page");

  loadAbout();
  loadWeek();
  loadCurrent();
  loadTasks();
  loadStory();

  // load saved photo
  const savedPhoto = localStorage.getItem("profilePhoto");
  if (savedPhoto && get("profilePreview")) {
    get("profilePreview").src = savedPhoto;
    get("profilePreview").style.display = "block";
  }

  // story continue
  let savedStory = localStorage.getItem("story");
  if (savedStory && confirm("Continue your story?")) {
    if (get("storyText")) get("storyText").value = savedStory;
  }

  showPage(0);
  setupPhotoUpload();
};

// ================= PAGE SYSTEM =================
function showPage(index) {
  pages.forEach(p => p.classList.remove("active"));

  if (pages[index]) {
    pages[index].classList.add("active");
    currentPage = index;
  }
}

function next() {
  if (currentPage < pages.length - 1) showPage(currentPage + 1);
}

function prev() {
  if (currentPage > 0) showPage(currentPage - 1);
}

// ================= NAVIGATION =================
function enterApp() {
  get("cover").style.display = "none";
  get("home").classList.remove("hidden");
}

function openJournal() {
  get("home").classList.add("hidden");
  get("settings").classList.add("hidden");
  get("journal").classList.remove("hidden");
  showPage(0);
}

function openJournalPage(i) {
  openJournal();
  showPage(i);
}

function openSettings() {
  get("home").classList.add("hidden");
  get("settings").classList.remove("hidden");
}

function goHome() {
  get("journal").classList.add("hidden");
  get("settings").classList.add("hidden");
  get("savedPage")?.classList.add("hidden");
  get("home").classList.remove("hidden");
  loadEntries();
}

// ================= SAFE GET =================
function get(id) {
  return document.getElementById(id);
}

// ================= ABOUT =================
function saveAbout() {
  const cards = document.querySelectorAll(".about-card textarea");

  const data = {
    name: cards[0]?.value || "",
    age: cards[1]?.value || "",
    dreams: cards[2]?.value || "",
    likes: cards[3]?.value || "",
    place: cards[4]?.value || ""
  };

  localStorage.setItem("aboutMe", JSON.stringify(data));
}

function loadAbout() {
  const data = JSON.parse(localStorage.getItem("aboutMe") || "{}");
  const cards = document.querySelectorAll(".about-card textarea");

  if (cards[0]) cards[0].value = data.name || "";
  if (cards[1]) cards[1].value = data.age || "";
  if (cards[2]) cards[2].value = data.dreams || "";
  if (cards[3]) cards[3].value = data.likes || "";
  if (cards[4]) cards[4].value = data.place || "";
}

// ================= WEEK =================
function getWeekKey() {
  let now = new Date();
  let week = Math.ceil(now.getDate() / 7);
  return `week_${now.getFullYear()}_${now.getMonth()}_${week}`;
}

function saveWeek() {
  const days = document.querySelectorAll(".day-card textarea");

  const data = {
    mon: days[0]?.value || "",
    tue: days[1]?.value || "",
    wed: days[2]?.value || "",
    thu: days[3]?.value || "",
    fri: days[4]?.value || "",
    sat: days[5]?.value || "",
    sun: days[6]?.value || ""
  };

  localStorage.setItem(getWeekKey(), JSON.stringify(data));
  showSaveMessage();
}

function loadWeek() {
  const data = JSON.parse(localStorage.getItem(getWeekKey()) || "{}");
  const days = document.querySelectorAll(".day-card textarea");

  if (days[0]) days[0].value = data.mon || "";
  if (days[1]) days[1].value = data.tue || "";
  if (days[2]) days[2].value = data.wed || "";
  if (days[3]) days[3].value = data.thu || "";
  if (days[4]) days[4].value = data.fri || "";
  if (days[5]) days[5].value = data.sat || "";
  if (days[6]) days[6].value = data.sun || "";
}

// ================= DAILY =================
function autoSave() {
  const data = {
    feel: get("feel")?.value || "",
    why: get("why")?.value || "",
    text: get("journalText")?.value || "",
    date: get("date")?.value || ""
  };

  localStorage.setItem("todayEntry", JSON.stringify(data));
  saveTasks();
}

function loadCurrent() {
  let data = JSON.parse(localStorage.getItem("todayEntry") || "{}");

  if (get("feel")) get("feel").value = data.feel || "";
  if (get("why")) get("why").value = data.why || "";
  if (get("journalText")) get("journalText").value = data.text || "";
  if (get("date")) get("date").value = data.date || "";
}

// ================= TODO =================
function getTodayKey() {
  return "todo_" + new Date().toDateString();
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem(getTodayKey()) || "[]");

  const list = get("taskList");
  if (!list) return;

  list.innerHTML = "";

  tasks.forEach((t, i) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <span>${t.text}</span>
      <button onclick="removeTask(${i})">❌</button>
    `;

    list.appendChild(div);
  });
}

function addTask() {
  const input = get("taskInput");
  if (!input || !input.value.trim()) return;

  let tasks = JSON.parse(localStorage.getItem(getTodayKey()) || "[]");

  tasks.push({ text: input.value });

  localStorage.setItem(getTodayKey(), JSON.stringify(tasks));

  input.value = "";
  loadTasks();
}

function removeTask(index) {
  let tasks = JSON.parse(localStorage.getItem(getTodayKey()) || "[]");

  tasks.splice(index, 1);

  localStorage.setItem(getTodayKey(), JSON.stringify(tasks));
  loadTasks();
}

function saveTasks() {
  let tasks = JSON.parse(localStorage.getItem(getTodayKey()) || "[]");
  localStorage.setItem(getTodayKey(), JSON.stringify(tasks));
}

// ================= STORY =================
function saveStory() {
  localStorage.setItem("story", get("storyText")?.value || "");
  showSaveMessage();
}

function loadStory() {
  if (get("storyText")) {
    get("storyText").value = localStorage.getItem("story") || "";
  }
}

// ================= ENTRIES =================
function saveEntry() {
  let entry = {
    date: new Date().toLocaleDateString(),
    reflection: {
      feel: get("feel")?.value,
      why: get("why")?.value,
      text: get("journalText")?.value
    },
    story: get("storyText")?.value,
    closing: {
      feel: document.querySelector(".closing-card textarea")?.value,
      grateful: document.querySelectorAll(".closing-card textarea")[1]?.value
    }
  };

  let entries = JSON.parse(localStorage.getItem("entries") || "[]");
  entries.push(entry);

  localStorage.setItem("entries", JSON.stringify(entries));
  alert("Saved full entry 💖");
}

function loadEntries() {
  const container = get("entries");
  if (!container) return;

  container.innerHTML = "";

  let entries = JSON.parse(localStorage.getItem("entries") || "[]");

  if (entries.length === 0) {
    container.innerHTML = "<p style='text-align:center; opacity:0.6;'>No entries yet 💭</p>";
    return;
  }

  entries.slice().reverse().forEach(e => {
    let div = document.createElement("div");

    div.innerHTML = `
      <h3>${e.date}</h3>
      <p>${e.reflection?.feel || ""}</p>
    `;

    container.appendChild(div);
  });
}

function loadSavedEntries() {
  let container = get("savedPage");
  if (!container) return;

  container.innerHTML = "";

  let entries = JSON.parse(localStorage.getItem("entries") || "[]");

  entries.forEach(e => {
    let div = document.createElement("div");

    div.innerHTML = `
      <h3>${e.date}</h3>
      <p><b>Feeling:</b> ${e.reflection?.feel}</p>
      <p><b>Story:</b> ${e.story}</p>
      <p><b>Grateful:</b> ${e.closing?.grateful}</p>
    `;

    container.appendChild(div);
  });
}

// ================= SETTINGS =================
function setFont(font) {
  document.body.style.fontFamily = font;
  localStorage.setItem("font", font);
}

function setMusic(src) {
  const audio = get("bgMusic");
  if (!audio) return;

  audio.pause();

  if (src) {
    audio.src = src;
    audio.play().catch(()=>{});
  }
}

function setBG(img) {
  if (!img) {
    document.body.style.background = "linear-gradient(135deg,#fbc2eb,#a6c1ee)";
    return;
  }

  document.body.style.background = `url(${img})`;
  document.body.style.backgroundSize = "cover";
}

function setBGColor(gradient) {
  if (!gradient) return;
  document.body.style.background = `linear-gradient(135deg, ${gradient})`;
}

// ================= SAVE MESSAGE =================
function showSaveMessage() {
  let msg = document.querySelector(".save-msg");
  if (!msg) return;

  msg.style.opacity = "1";

  setTimeout(() => {
    msg.style.opacity = "0";
  }, 1500);
}

// ================= AUTO SAVE =================
let saveTimeout;

document.addEventListener("input", () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    autoSave();
    saveAbout();
  }, 500);
});

// ================= PHOTO =================
function setupPhotoUpload() {
  const photoInput = get("photoUpload");
  if (!photoInput) return;

  photoInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {
      const img = get("profilePreview");
      img.src = reader.result;
      img.style.display = "block";

      localStorage.setItem("profilePhoto", reader.result);
    };

    reader.readAsDataURL(file);
  });
}

function removePhoto() {
  const img = get("profilePreview");
  if (!img) return;

  img.src = "";
  img.style.display = "none";
  localStorage.removeItem("profilePhoto");
}

// ================= SAVED PAGE =================
function openSaved() {
  get("home").classList.add("hidden");
  get("savedPage").classList.remove("hidden");
  loadSavedEntries();
}
