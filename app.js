let currentPage = 0;
let pages = [];

/* ================= INIT ================= */
window.addEventListener("load", () => {
  pages = document.querySelectorAll("#journal .page");

  loadAbout();
  loadEntries();
  loadTasks();
  loadWeek();

  showPage(0);
});

/* ================= PAGE SYSTEM ================= */
function showPage(index) {
  if (!pages.length) return;

  pages.forEach(p => p.classList.remove("active"));

  if (pages[index]) {
    pages[index].classList.add("active");
    currentPage = index;
  }
}

function next() {
  if (currentPage < pages.length - 1) {
    showPage(currentPage + 1);
  }
}

function prev() {
  if (currentPage > 0) {
    showPage(currentPage - 1);
  }
}

/* ================= NAVIGATION ================= */
function enterApp() {
  document.getElementById("cover").style.display = "none";
  document.getElementById("home").classList.remove("hidden");
}

function goHome() {
  document.getElementById("journal").classList.add("hidden");
  document.getElementById("settings").classList.add("hidden");
  document.getElementById("home").classList.remove("hidden");
}

function openJournal() {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("journal").classList.remove("hidden");
  pages = document.querySelectorAll("#journal .page");
  showPage(0);
}

function openJournalPage(index) {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("journal").classList.remove("hidden");

  pages = document.querySelectorAll("#journal .page");
  showPage(index);
}

function openSettings() {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("settings").classList.remove("hidden");
}

/* ================= ABOUT ME ================= */
function saveAbout() {
  const data = {
    name: aboutName.value || "",
    age: aboutAge.value || "",
    dream: aboutDream.value || "",
    likes: aboutLikes.value || "",
    place: aboutPlace.value || ""
  };

  localStorage.setItem("aboutMe", JSON.stringify(data));
}

function loadAbout() {
  let data = JSON.parse(localStorage.getItem("aboutMe") || "{}");

  if (aboutName) aboutName.value = data.name || "";
  if (aboutAge) aboutAge.value = data.age || "";
  if (aboutDream) aboutDream.value = data.dream || "";
  if (aboutLikes) aboutLikes.value = data.likes || "";
  if (aboutPlace) aboutPlace.value = data.place || "";
}

/* auto save about */
document.addEventListener("input", (e) => {
  if (
    e.target.id === "aboutName" ||
    e.target.id === "aboutAge" ||
    e.target.id === "aboutDream" ||
    e.target.id === "aboutLikes" ||
    e.target.id === "aboutPlace"
  ) {
    saveAbout();
  }
});

/* ================= ENTRIES ================= */
function saveEntry() {
  let entries = JSON.parse(localStorage.getItem("entries") || "[]");

  const entry = {
    date: new Date().toLocaleString(),
    reflection: journalText?.value || "",
    feeling: feel?.value || "",
    why: why?.value || "",
    story: storyText?.value || ""
  };

  entries.unshift(entry);
  localStorage.setItem("entries", JSON.stringify(entries));

  showSaveMessage("Entry saved 💖");
  loadEntries();
  goHome();
}

function loadEntries() {
  let box = document.getElementById("entries");
  if (!box) return;

  let entries = JSON.parse(localStorage.getItem("entries") || "[]");

  box.innerHTML = "";

  entries.forEach((e, i) => {
    let div = document.createElement("div");

    let text = e.reflection || e.story || "No content";

    div.innerHTML = `
      <b>${e.date}</b><br>
      ${text}<br><br>
      <button onclick="deleteEntry(${i})">🗑 Delete</button>
      <hr>
    `;

    box.appendChild(div);
  });
}

function deleteEntry(i) {
  let entries = JSON.parse(localStorage.getItem("entries") || "[]");

  entries.splice(i, 1);

  localStorage.setItem("entries", JSON.stringify(entries));
  loadEntries();
}

/* ================= TODO LIST ================= */
function getTodayKey() {
  return "todo_" + new Date().toDateString();
}

function addTask() {
  let text = taskInput.value.trim();
  if (!text) return;

  let tasks = JSON.parse(localStorage.getItem(getTodayKey()) || "[]");

  tasks.push({ text, done: false });

  localStorage.setItem(getTodayKey(), JSON.stringify(tasks));

  taskInput.value = "";
  loadTasks();
}

function loadTasks() {
  let list = document.getElementById("taskList");
  if (!list) return;

  let tasks = JSON.parse(localStorage.getItem(getTodayKey()) || "[]");

  list.innerHTML = "";

  tasks.forEach((t, i) => {
    let div = document.createElement("div");

    div.innerHTML = `
      <label>
        <input type="checkbox" ${t.done ? "checked" : ""} onchange="toggleTask(${i})">
        ${t.text}
      </label>
      <button onclick="deleteTask(${i})">❌</button>
    `;

    list.appendChild(div);
  });
}

function toggleTask(i) {
  let tasks = JSON.parse(localStorage.getItem(getTodayKey()) || "[]");
  tasks[i].done = !tasks[i].done;
  localStorage.setItem(getTodayKey(), JSON.stringify(tasks));
  loadTasks();
}

function deleteTask(i) {
  let tasks = JSON.parse(localStorage.getItem(getTodayKey()) || "[]");

  tasks.splice(i, 1);

  localStorage.setItem(getTodayKey(), JSON.stringify(tasks));
  loadTasks();
}

/* ================= WEEKLY PLANNER ================= */
function getWeekKey() {
  let now = new Date();
  let year = now.getFullYear();
  let week = Math.ceil(((now - new Date(year, 0, 1)) / 86400000) / 7);
  return "week_" + year + "_" + week;
}

function saveWeek() {
  const data = {
    title: weekTitle?.value || "",
    notes: weekNotes?.value || "",
    mon: mon?.value || "",
    tue: tue?.value || "",
    wed: wed?.value || "",
    thu: thu?.value || "",
    fri: fri?.value || "",
    sat: sat?.value || "",
    sun: sun?.value || ""
  };

  localStorage.setItem(getWeekKey(), JSON.stringify(data));
  showSaveMessage("Weekly plan saved 💖");
}

function loadWeek() {
  let data = JSON.parse(localStorage.getItem(getWeekKey()) || "{}");

  if (!weekTitle) return;

  weekTitle.value = data.title || "";
  weekNotes.value = data.notes || "";
  mon.value = data.mon || "";
  tue.value = data.tue || "";
  wed.value = data.wed || "";
  thu.value = data.thu || "";
  fri.value = data.fri || "";
  sat.value = data.sat || "";
  sun.value = data.sun || "";
}

/* ================= MUSIC ================= */
function setMusic(src) {
  let music = document.getElementById("bgMusic");
  if (!music) return;

  music.src = src;
  music.play().catch(() => {});
}

/* ================= BACKGROUND ================= */
function setBG(img) {
  if (!img) {
    document.body.style.background = "linear-gradient(135deg,#fbc2eb,#a6c1ee)";
    return;
  }

  document.body.style.backgroundImage = `url(${img})`;
  document.body.style.backgroundSize = "cover";
}

function setBGColor(colors) {
  if (!colors) {
    document.body.style.background = "linear-gradient(135deg,#fbc2eb,#a6c1ee)";
    return;
  }

  let c = colors.split(",");
  document.body.style.background = `linear-gradient(135deg, ${c[0]}, ${c[1]})`;
}

/* ================= SAVE MESSAGE ================= */
function showSaveMessage(text = "Saved 💖") {
  let msg = document.getElementById("saveMsg");
  if (!msg) return;

  msg.innerText = text;
  msg.style.opacity = "1";

  setTimeout(() => {
    msg.style.opacity = "0";
  }, 2000);
}

/* ================= FONT ================= */
function setFont(font) {
  if (!font) return;

  document.body.style.fontFamily = font;
}