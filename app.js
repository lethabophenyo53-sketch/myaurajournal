let currentPage = 0;
let pages = [];

/* ================= INIT ================= */
window.addEventListener("load", () => {
  pages = document.querySelectorAll(".page");

  loadAbout();
  loadEntries();
  loadTasks();
  loadWeek();
  loadCurrent();

  setupAutoSave();

  showPage(0);
});

/* ================= PAGE SYSTEM ================= */
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

/* ================= COVER ================= */
function openBook() {
  document.querySelector(".cover").style.display = "none";
  document.querySelector(".book").style.display = "block";
}

/* ================= ABOUT ================= */
function saveAbout() {
  const data = {
    name: document.getElementById("name")?.value || "",
    age: document.getElementById("age")?.value || "",
    dreams: document.getElementById("dreams")?.value || "",
    energy: document.getElementById("energy")?.value || ""
  };

  localStorage.setItem("aboutMe", JSON.stringify(data));
}

function loadAbout() {
  let data = JSON.parse(localStorage.getItem("aboutMe") || "{}");

  if (name) name.value = data.name || "";
  if (age) age.value = data.age || "";
  if (dreams) dreams.value = data.dreams || "";
  if (energy) energy.value = data.energy || "";
}

/* AUTO SAVE ABOUT */
document.addEventListener("input", (e) => {
  if (e.target.closest(".profile-map")) {
    saveAbout();
  }
});

/* ================= TODO ================= */
function getTodayKey() {
  return "todo_" + new Date().toDateString();
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem(getTodayKey()) || "[]");

  tasks.forEach((t, i) => {
    let el = document.getElementById("todo" + (i + 1));
    if (el) el.value = t.text;
  });
}

function saveTasks() {
  let tasks = [];

  for (let i = 1; i <= 4; i++) {
    let val = document.getElementById("todo" + i)?.value || "";
    tasks.push({ text: val });
  }

  localStorage.setItem(getTodayKey(), JSON.stringify(tasks));
}

/* ================= WEEK ================= */
function getWeekKey() {
  let now = new Date();
  return "week_" + now.getFullYear() + "_" + now.getMonth();
}

function saveWeek() {
  const data = {
    mon: mon?.value || "",
    tue: tue?.value || "",
    wed: wed?.value || "",
    thu: thu?.value || "",
    fri: fri?.value || "",
    sat: sat?.value || "",
    sun: sun?.value || "",
    notes: weekly_notes?.value || ""
  };

  localStorage.setItem(getWeekKey(), JSON.stringify(data));
}

function loadWeek() {
  let data = JSON.parse(localStorage.getItem(getWeekKey()) || "{}");

  if (mon) mon.value = data.mon || "";
  if (tue) tue.value = data.tue || "";
  if (wed) wed.value = data.wed || "";
  if (thu) thu.value = data.thu || "";
  if (fri) fri.value = data.fri || "";
  if (sat) sat.value = data.sat || "";
  if (sun) sun.value = data.sun || "";
  if (weekly_notes) weekly_notes.value = data.notes || "";
}

/* ================= DAILY SAVE ================= */
function getTodayJournalKey() {
  return "journal_" + new Date().toISOString().split("T")[0];
}

function autoSaveCurrent() {
  const data = {
    feel: document.getElementById("feel")?.value || "",
    why: document.getElementById("why")?.value || "",
    day: document.getElementById("day")?.value || "",
    notes: document.getElementById("notes")?.value || "",
    close: document.getElementById("close")?.value || ""
  };

  localStorage.setItem(getTodayJournalKey(), JSON.stringify(data));

  saveTasks();
  saveWeek();
}

function loadCurrent() {
  let data = JSON.parse(localStorage.getItem(getTodayJournalKey()) || "{}");

  if (feel) feel.value = data.feel || "";
  if (why) why.value = data.why || "";
  if (day) day.value = data.day || "";
  if (notes) notes.value = data.notes || "";
  if (close) close.value = data.close || "";
}

function setupAutoSave() {
  document.querySelectorAll("textarea, input").forEach(el => {
    el.addEventListener("input", autoSaveCurrent);
  });
}

/* ================= ENTRIES ================= */
function saveEntry() {
  let entries = JSON.parse(localStorage.getItem("entries") || "[]");

  const entry = {
    date: new Date().toLocaleString(),
    feel: feel?.value || "",
    why: why?.value || "",
    day: day?.value || ""
  };

  entries.unshift(entry);
  localStorage.setItem("entries", JSON.stringify(entries));

  alert("Saved 💖");
}

function loadEntries() {
  let box = document.getElementById("entries");
  if (!box) return;

  let entries = JSON.parse(localStorage.getItem("entries") || "[]");
  box.innerHTML = "";

  entries.forEach(e => {
    let div = document.createElement("div");
    div.innerHTML = `<b>${e.date}</b><br>${e.day.substring(0,40)}...`;
    box.appendChild(div);
  });
}

/* ================= EMOJI RAIN ================= */
function rain(emoji) {
  for (let i = 0; i < 20; i++) {
    let drop = document.createElement("div");
    drop.className = "emoji-drop";
    drop.innerText = emoji;

    drop.style.left = Math.random() * 100 + "vw";
    drop.style.animationDuration = (Math.random() * 2 + 2) + "s";

    document.body.appendChild(drop);

    setTimeout(() => drop.remove(), 4000);
  }
}
