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

  setupAutoSave();

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

  let about = JSON.parse(localStorage.getItem("aboutMe") || "{}");

  if (about.name) {
    showPage(1); // skip About Me
  } else {
    showPage(0);
  }
}

function openSettings() {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("settings").classList.remove("hidden");
}

/* ================= ABOUT ME ================= */
function saveAbout() {
  const data = {
    name: document.getElementById("aboutName").value,
    age: document.getElementById("aboutAge").value,
    dream: document.getElementById("aboutDream").value,
    likes: document.getElementById("aboutLikes").value,
    place: document.getElementById("aboutPlace").value
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
  if (e.target.closest(".about-info")) {
    saveAbout();
  }
});

/* ================= PHOTO ================= */
document.getElementById("photoUpload")?.addEventListener("change", function(e){
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(){
    const img = document.getElementById("profilePreview");
    img.src = reader.result;
    img.style.display = "block";
    localStorage.setItem("profileImage", reader.result);
  };

  if(file) reader.readAsDataURL(file);
});

window.addEventListener("load", ()=>{
  const saved = localStorage.getItem("profileImage");
  if(saved){
    const img = document.getElementById("profilePreview");
    img.src = saved;
    img.style.display = "block";
  }
});

function removePhoto(){
  const img = document.getElementById("profilePreview");
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
    about: JSON.parse(localStorage.getItem("aboutMe") || "{}"),
    week: JSON.parse(localStorage.getItem(getWeekKey()) || "{}"),
    tasks: JSON.parse(localStorage.getItem(getTodayKey()) || "[]"),
    reflection: journalText?.value || "",
    feeling: feel?.value || "",
    why: why?.value || "",
    story: storyText?.value || ""
  };

  entries.unshift(entry);
  localStorage.setItem("entries", JSON.stringify(entries));

  localStorage.removeItem("currentEntry");

  showSaveMessage("Saved full entry 💖");
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

    div.innerHTML = `
      <b>${e.date}</b><br>
      ${e.reflection?.substring(0,40) || "No text"}...<br>
      <button onclick="viewEntry(${i})">📖 Open</button>
      <button onclick="deleteEntry(${i})">❌</button>
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

/* ================= TODO ================= */
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
      <input type="checkbox" ${t.done ? "checked":""} onchange="toggleTask(${i})">
      ${t.text}
      <button onclick="deleteTask(${i})">❌</button>
    `;

    list.appendChild(div);
  });
}

function toggleTask(i){
  let tasks = JSON.parse(localStorage.getItem(getTodayKey()) || "[]");
  tasks[i].done = !tasks[i].done;
  localStorage.setItem(getTodayKey(), JSON.stringify(tasks));
}

function deleteTask(i){
  let tasks = JSON.parse(localStorage.getItem(getTodayKey()) || "[]");
  tasks.splice(i,1);
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

/* ================= AUTO SAVE CURRENT ================= */
function autoSaveCurrent(){
  const data = {
    reflection: journalText?.value || "",
    feeling: feel?.value || "",
    why: why?.value || "",
    story: storyText?.value || ""
  };

  localStorage.setItem("currentEntry", JSON.stringify(data));
}

function loadCurrent(){
  let data = JSON.parse(localStorage.getItem("currentEntry") || "{}");

  if(data.reflection) journalText.value = data.reflection;
  if(data.feeling) feel.value = data.feeling;
  if(data.why) why.value = data.why;
  if(data.story) storyText.value = data.story;
}

function setupAutoSave(){
  document.querySelectorAll("#journal textarea").forEach(el=>{
    el.addEventListener("input", autoSaveCurrent);
  });
}

/* ================= SETTINGS ================= */
function setMusic(src){
  let music = document.getElementById("bgMusic");
  music.src = src;
  music.play().catch(()=>{});
}

function setFont(f){
  document.body.style.fontFamily = f;
}

function setBG(img){
  if(!img){
    document.body.style.background = "linear-gradient(135deg,#fbc2eb,#a6c1ee)";
    return;
  }
  document.body.style.backgroundImage = `url(${img})`;
  document.body.style.backgroundSize = "cover";
}

function setBGColor(colors){
  if(!colors) return;
  let c = colors.split(",");
  document.body.style.background = `linear-gradient(135deg, ${c[0]}, ${c[1]})`;
}

/* ================= SAVE MESSAGE ================= */
function showSaveMessage(text="Saved 💖"){
  let msg = document.getElementById("saveMsg");
  if(!msg) return;

  msg.innerText = text;
  msg.style.opacity = "1";

  setTimeout(()=>{
    msg.style.opacity = "0";
  },2000);
}
