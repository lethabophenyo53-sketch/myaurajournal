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

  showPage(0);
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
  document.getElementById("cover").style.display = "none";
  document.getElementById("home").classList.remove("hidden");
}

function openJournal() {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("settings").classList.add("hidden");
  document.getElementById("journal").classList.remove("hidden");

  showPage(0);
}

function openJournalPage(i) {
  openJournal();
  showPage(i);
}

function openSettings() {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("settings").classList.remove("hidden");
}

function goHome() {
  document.getElementById("journal").classList.add("hidden");
  document.getElementById("settings").classList.add("hidden");
  document.getElementById("home").classList.remove("hidden");

  loadEntries();
}

// ================= SAFE GET =================
function get(id) {
  return document.getElementById(id);
}

// ================= ABOUT =================
function saveAbout() {
  const data = {
    name: get("name")?.value || "",
    age: get("age")?.value || "",
    dreams: get("dreams")?.value || "",
    likes: get("likes")?.value || "",
    place: get("place")?.value || ""
  };

  localStorage.setItem("aboutMe", JSON.stringify(data));
}

function loadAbout() {
  let data = JSON.parse(localStorage.getItem("aboutMe") || "{}");

  if (get("name")) get("name").value = data.name || "";
  if (get("age")) get("age").value = data.age || "";
  if (get("dreams")) get("dreams").value = data.dreams || "";
  if (get("likes")) get("likes").value = data.likes || "";
  if (get("place")) get("place").value = data.place || "";
}

// ================= WEEK =================
function getWeekKey() {
  let now = new Date();
  let week = Math.ceil(now.getDate() / 7);
  return `week_${now.getFullYear()}_${now.getMonth()}_${week}`;
}

function saveWeek() {
  const data = {
    mon: get("mon")?.value || "",
    tue: get("tue")?.value || "",
    wed: get("wed")?.value || "",
    thu: get("thu")?.value || "",
    fri: get("fri")?.value || "",
    sat: get("sat")?.value || "",
    sun: get("sun")?.value || ""
  };

  localStorage.setItem(getWeekKey(), JSON.stringify(data));
  showSaveMessage();
}

function loadWeek() {
  let data = JSON.parse(localStorage.getItem(getWeekKey()) || "{}");

  if (get("mon")) get("mon").value = data.mon || "";
  if (get("tue")) get("tue").value = data.tue || "";
  if (get("wed")) get("wed").value = data.wed || "";
  if (get("thu")) get("thu").value = data.thu || "";
  if (get("fri")) get("fri").value = data.fri || "";
  if (get("sat")) get("sat").value = data.sat || "";
  if (get("sun")) get("sun").value = data.sun || "";
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
  // already saved in add/remove
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
  let entries = JSON.parse(localStorage.getItem("entries") || "[]");

  entries.push({
    text: get("journalText")?.value || "",
    date: new Date().toLocaleDateString()
  });

  localStorage.setItem("entries", JSON.stringify(entries));
  showSaveMessage();
}

function loadEntries() {
  const container = get("entries");
  if (!container) return;

  container.innerHTML = "";

  let entries = JSON.parse(localStorage.getItem("entries") || "[]");

  entries.slice().reverse().forEach(e => {
    const div = document.createElement("div");
    div.className = "entry";

    div.innerHTML = `
      <h4>${e.date}</h4>
      <p>${e.text}</p>
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
  saveTimeout = setTimeout(autoSave, 500);
});
