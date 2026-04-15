let currentPage = 0;
let pages = [];

/* ================= INIT ================= */
window.onload = function () {
  pages = document.querySelectorAll(".page");

  loadAbout();
  loadTasks();
  loadWeek();
  loadCurrent();

  showPage(0);
};

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

/* ================= SAFE GET ================= */
function get(id) {
  return document.getElementById(id);
}

/* ================= ABOUT ================= */
function saveAbout() {
  const data = {
    name: get("name")?.value || "",
    age: get("age")?.value || "",
    dreams: get("dreams")?.value || "",
    energy: get("energy")?.value || ""
  };

  localStorage.setItem("aboutMe", JSON.stringify(data));
}

function loadAbout() {
  let data = JSON.parse(localStorage.getItem("aboutMe") || "{}");

  if (get("name")) get("name").value = data.name || "";
  if (get("age")) get("age").value = data.age || "";
  if (get("dreams")) get("dreams").value = data.dreams || "";
  if (get("energy")) get("energy").value = data.energy || "";
}

/* ================= TODO ================= */
function getTodayKey() {
  return "todo_" + new Date().toDateString();
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem(getTodayKey()) || "[]");

  for (let i = 1; i <= 4; i++) {
    let el = get("todo" + i);
    if (el) el.value = tasks[i - 1]?.text || "";
  }
}

function saveTasks() {
  let tasks = [];

  for (let i = 1; i <= 4; i++) {
    let val = get("todo" + i)?.value || "";
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
    mon: get("mon")?.value || "",
    tue: get("tue")?.value || "",
    wed: get("wed")?.value || "",
    thu: get("thu")?.value || "",
    fri: get("fri")?.value || "",
    sat: get("sat")?.value || "",
    sun: get("sun")?.value || "",
    notes: get("weekly_notes")?.value || ""
  };

  localStorage.setItem(getWeekKey(), JSON.stringify(data));
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
  if (get("weekly_notes")) get("weekly_notes").value = data.notes || "";
}

/* ================= AUTO SAVE ================= */
function autoSave() {
  saveTasks();
  saveWeek();

  const data = {
    feel: get("feel")?.value || "",
    why: get("why")?.value || "",
    day: get("day")?.value || ""
  };

  localStorage.setItem("todayEntry", JSON.stringify(data));
}

function loadCurrent() {
  let data = JSON.parse(localStorage.getItem("todayEntry") || "{}");

  if (get("feel")) get("feel").value = data.feel || "";
  if (get("why")) get("why").value = data.why || "";
  if (get("day")) get("day").value = data.day || "";
}

/* AUTO SAVE EVENTS */
document.addEventListener("input", autoSave);

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
