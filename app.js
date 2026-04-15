let currentPage = 0;
let pages = [];

/* ================= INIT ================= */
window.addEventListener("load", () => {
  pages = document.querySelectorAll("#journal .page");

  loadAbout();
  loadEntries();
  loadTasks();
  loadWeek();
  loadCurrent();

  showPage(0);

  // auto save typing
  document.querySelectorAll("#journal textarea").forEach(el=>{
    el.addEventListener("input", autoSaveCurrent);
  });
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

  let about = JSON.parse(localStorage.getItem("aboutMe") || "{}");

  if (about && about.name && about.name.trim() !== "") {
    currentPage = 1; // skip About Me
  } else {
    currentPage = 0;
  }

  showPage(currentPage);
}

function openSettings() {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("settings").classList.remove("hidden");
}

/* ================= ABOUT ME ================= */
function saveAbout() {
  const data = {
    name: document.getElementById("aboutName")?.value || "",
    age: document.getElementById("aboutAge")?.value || "",
    dream: document.getElementById("aboutDream")?.value || "",
    likes: document.getElementById("aboutLikes")?.value || "",
    place: document.getElementById("aboutPlace")?.value || ""
  };

  localStorage.setItem("aboutMe", JSON.stringify(data));
}

function loadAbout() {
  let data = JSON.parse(localStorage.getItem("aboutMe") || "{}");

  if (document.getElementById("aboutName"))
    document.getElementById("aboutName").value = data.name || "";

  if (document.getElementById("aboutAge"))
    document.getElementById("aboutAge").value = data.age || "";

  if (document.getElementById("aboutDream"))
    document.getElementById("aboutDream").value = data.dream || "";

  if (document.getElementById("aboutLikes"))
    document.getElementById("aboutLikes").value = data.likes || "";

  if (document.getElementById("aboutPlace"))
    document.getElementById("aboutPlace").value = data.place || "";
}

/* AUTO SAVE ABOUT */
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

/* PHOTO REMOVE */
function removePhoto(){
  const img = document.getElementById("profilePreview");

  if(!img) return;

  img.src = "";
  img.style.display = "none";

  localStorage.removeItem("profileImage");

  showSaveMessage("Photo removed ❌");
}

/* ================= ENTRIES ================= */
function saveEntry() {
  let entries = JSON.parse(localStorage.getItem("entries") || "[]");

  const entry = {
    date: new Date().toLocaleString(),
    reflection: document.getElementById("journalText")?.value || "",
    feeling: document.getElementById("feel")?.value || "",
    why: document.getElementById("why")?.value || "",
    story: document.getElementById("storyText")?.value || ""
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
      <p><b>${e.date}</b></p>
      <p>${text.substring(0,50)}...</p>
      <button onclick="viewEntry(${i})">📖 Open</button>
      <button onclick="deleteEntry(${i})">❌ Delete</button>
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

/* ================= TODO ================= */
function getTodayKey() {
  return "todo_" + new Date().toDateString();
}

function addTask() {
  let input = document.getElementById("taskInput");
  let text = input.value.trim();

  if (!text) return;

  let tasks = JSON.parse(localStorage.getItem(getTodayKey()) || "[]");

  tasks.push({ text, done: false });

  localStorage.setItem(getTodayKey(), JSON.stringify(tasks));

  input.value = "";
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
}

function deleteTask(i) {
  let tasks = JSON.parse(localStorage.getItem(getTodayKey()) || "[]");
  tasks.splice(i, 1);
  localStorage.setItem(getTodayKey(), JSON.stringify(tasks));
  loadTasks();
}

/* ================= WEEK ================= */
function getWeekKey() {
  let now = new Date();
  let year = now.getFullYear();
  let week = Math.ceil(((now - new Date(year, 0, 1)) / 86400000) / 7);
  return "week_" + year + "_" + week;
}

function saveWeek() {
  const data = {
    title: document.getElementById("weekTitle")?.value || "",
    notes: document.getElementById("weekNotes")?.value || "",
    mon: document.getElementById("mon")?.value || "",
    tue: document.getElementById("tue")?.value || "",
    wed: document.getElementById("wed")?.value || "",
    thu: document.getElementById("thu")?.value || "",
    fri: document.getElementById("fri")?.value || "",
    sat: document.getElementById("sat")?.value || "",
    sun: document.getElementById("sun")?.value || ""
  };

  localStorage.setItem(getWeekKey(), JSON.stringify(data));
}

function loadWeek() {
  let data = JSON.parse(localStorage.getItem(getWeekKey()) || "{}");

  if (!document.getElementById("weekTitle")) return;

  document.getElementById("weekTitle").value = data.title || "";
  document.getElementById("weekNotes").value = data.notes || "";

  document.getElementById("mon").value = data.mon || "";
  document.getElementById("tue").value = data.tue || "";
  document.getElementById("wed").value = data.wed || "";
  document.getElementById("thu").value = data.thu || "";
  document.getElementById("fri").value = data.fri || "";
  document.getElementById("sat").value = data.sat || "";
  document.getElementById("sun").value = data.sun || "";
}

/* ================= AUTO SAVE ================= */
function autoSaveCurrent(){
  const data = {
    reflection: document.getElementById("journalText")?.value || "",
    feeling: document.getElementById("feel")?.value || "",
    why: document.getElementById("why")?.value || "",
    story: document.getElementById("storyText")?.value || ""
  };

  localStorage.setItem("currentEntry", JSON.stringify(data));
}

function loadCurrent(){
  let data = JSON.parse(localStorage.getItem("currentEntry") || "{}");

  if(data.reflection) document.getElementById("journalText").value = data.reflection;
  if(data.feeling) document.getElementById("feel").value = data.feeling;
  if(data.why) document.getElementById("why").value = data.why;
  if(data.story) document.getElementById("storyText").value = data.story;
}

/* ================= VIEW ENTRY ================= */
function viewEntry(i){
  let entries = JSON.parse(localStorage.getItem("entries") || "[]");
  let e = entries[i];

  alert(`📅 ${e.date}

💭 ${e.feeling}

🌸 ${e.why}

📖 ${e.reflection}

📚 ${e.story}`);
}

/* ================= MESSAGE ================= */
function showSaveMessage(text="Saved 💖"){
  let msg = document.getElementById("saveMsg");
  if (!msg) return;

  msg.innerText = text;
  msg.style.opacity = "1";

  setTimeout(()=>{
    msg.style.opacity = "0";
  },2000);
}
