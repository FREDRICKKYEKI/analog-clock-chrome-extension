let timePickerAlarm;
let alarmBtn = document.getElementById("set-alarm-btn");
let alarmTime = document.getElementById("time");
let verseDiv = document.getElementById("verse");
let alarmSound = document.getElementById("alarm-sound");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let radius = canvas.height / 2;
let savedIndex = localStorage.getItem("bgIndex");
let arrowBack = document.getElementById("backAlarm");
let isAlarmOn = true;
const urls = [
  "https://images.pexels.com/photos/192136/pexels-photo-192136.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/7598020/pexels-photo-7598020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/4592219/pexels-photo-4592219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/7004697/pexels-photo-7004697.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/5603660/pexels-photo-5603660.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
  "https://images.pexels.com/photos/4597942/pexels-photo-4597942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/11057005/pexels-photo-11057005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/1579708/pexels-photo-1579708.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/383568/pexels-photo-383568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/354939/pexels-photo-354939.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/4194850/pexels-photo-4194850.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];

alarmSound.src = "media/beautifulName.mp3";

verseDiv.innerHTML = "Verse Loading...";

setTimeout(() => {
  if (verseDiv.innerHTML.length < 1) verseDiv.style.display = "none";
}, 10000);

alarmSound.load();
ctx.translate(radius, radius);
radius = radius * 0.9;
addEventListeners();
initAlarmList();
setImage();
drawClock();

fetchBibleVerse();

setInterval(drawClock, 1000);
arrowBack.style.display = "none";

navigator.serviceWorker
  .register("background.js")
  .then(() => {
    console.log("Service worker registered!");
  })
  .catch((error) => {
    console.error("Error registering service worker:", error);
  });

/**
 * Adds event listeners to respective HTML Elements on initialization
 */
function addEventListeners() {
  document.getElementById("random").addEventListener("click", randomizeBG);
  document
    .getElementById("alarm-clock")
    .addEventListener("click", openAlarmSettings);
  document
    .getElementById("backAlarm")
    .addEventListener("click", closeAlarmSettings);
  document
    .getElementById("timePicker")
    .addEventListener("change", changeHandler);
  alarmBtn.addEventListener("click", setAlarm);
}

/**
 * Fetches bible verse
 */
async function fetchBibleVerse() {
  console.log("verse loading...");
  const options = { method: "GET", headers: { accept: "application/json" } };
  fetch("https://beta.ourmanna.com/api/v1/get?format=json&order=daily", options)
    .then((response) => response.json())
    .then((response) => {
      document.getElementById("verse").innerHTML =
        response.verse.details.text +
        `<br/>` +
        "<b>" +
        response.verse.details.reference +
        "</b>";
      // setTimeout(
      // () => (
      // document.getElementById("verse").style.display = "block";
      // ),
      // 0);
    })
    .catch((err) => console.error(err));
}
/**
 * Converts time from time picker to Date object
 * @param {Event} e event emitted by timepicker
 */
function changeHandler(e) {
  isAlarmOn = true;
  const [hours, minutes] = e.target.value.split(":");
  const today = convertDateTime();
  const time = convertDateTime(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    parseInt(hours),
    parseInt(minutes)
  );
  timePickerAlarm = time;
}

/**
 * Converts time to a Date object
 * @param  {...any} dt date/time args
 * @returns {Date} a new Date object
 */
function convertDateTime(...dt) {
  return new Date(...(dt || null));
}

/**
 * Formats time to hours : mins
 * @param {Date} time time in epoch format (timestamp)
 * @returns {String} formatted time in hours : mins
 */
function formatTimeHM(time) {
  let [hours, mins] = [
    convertDateTime(time).getHours(),
    convertDateTime(time).getMinutes(),
  ];

  if (mins < 10) {
    mins = "0" + mins;
  }
  return `${hours}:${mins}`;
}

/**
 * Sets alarm
 */
function setAlarm() {
  const currentTime = Date.now();
  if (!timePickerAlarm || timePickerAlarm < currentTime) return;

  document.getElementById("time").innerHTML = formatTimeHM(timePickerAlarm);
  localStorage.setItem("alarmTime", timePickerAlarm);
  console.log("Alarm set at ", timePickerAlarm);

  chrome.alarms.create("myAlarm", {
    when: Number(timePickerAlarm),
  });
}

/**
 * Fetches time in local storage and displays in the alarm list
 */
function initAlarmList() {
  alarmTime.innerHTML = formatTimeHM(localStorage.getItem("alarmTime"));
}

/**
 * Opens alarm settings page
 */
function openAlarmSettings() {
  if (isAlarmOn) {
    isAlarmOn = false;
  }

  arrowBack.style.display = "block";
  document.getElementById("back").style.width = "0";
  document.getElementById("back").style.height = "0";
  document.getElementById("alarm-settings").style.display = "block";
  document.getElementById("alarm-settings").style.width = "300px";
}

/**
 * Closes alarm settings page
 */
function closeAlarmSettings() {
  arrowBack.style.display = "none";
  document.getElementById("back").style.width = "max-content";
  document.getElementById("back").style.height = "max-content";
  document.getElementById("alarm-settings").style.width = "0";
  document.getElementById("alarm-settings").style.display = "none";
}

/**
 * Sets background image
 */
function setImage() {
  if (savedIndex) {
    document.getElementById(
      "back"
    ).style.backgroundImage = `url(${urls[savedIndex]})`;
  } else {
    document.getElementById("back").style.backgroundImage = `url(${urls[0]})`;
  }
}

/**
 * Randomizes background image and saves the new one in local storage
 */
function randomizeBG() {
  try {
    let index = Math.floor(Math.random() * urls.length);
    document.getElementById(
      "back"
    ).style.backgroundImage = `url(${urls[index]})`;
    localStorage.setItem("bgIndex", index);
  } catch (e) {
    console.log(e);
  }
}

/**
 * Clears the alarm
 */
function clearAlarms() {
  chrome.alarms?.clear("myAlarm").then(() => {
    console.log("Alarm cleared");
  });
}

function drawClock() {
  let time = formatTimeHM(new Date());

  drawFace(ctx, radius);
  drawNumbers(ctx, radius);
  drawTime(ctx, radius);
  document.getElementById("digital-clock").innerHTML = time;

  if (localStorage.getItem("alarmTime") == time && isAlarmOn) {
    alarmSound.play();
    document.getElementById("alarm-icon").style =
      "animation:  shake  .6s infinite linear;";
  } else {
    document.getElementById("alarm-icon").style = "none";
    alarmSound.pause();
  }
}

function drawFace(ctx, radius) {
  let grad;

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();

  grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
  grad.addColorStop(0, "#333");
  grad.addColorStop(0.5, "white");
  grad.addColorStop(1, "#333");
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius * 0.02;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
  ctx.fillStyle = "#333";
  ctx.fill();
}

function drawNumbers(ctx, radius) {
  let ang;
  let num;
  ctx.font = radius * 0.15 + "px arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  for (num = 1; num < 13; num++) {
    ang = (num * Math.PI) / 6;
    ctx.rotate(ang);
    ctx.translate(0, -radius * 0.85);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius * 0.85);
    ctx.rotate(-ang);
  }
}

function drawTime(ctx, radius) {
  let now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();
  //hour
  hour = hour % 12;
  hour =
    (hour * Math.PI) / 6 +
    (minute * Math.PI) / (6 * 60) +
    (second * Math.PI) / (360 * 60);
  drawHand(ctx, hour, radius * 0.5, radius * 0.07);
  //minute
  minute = (minute * Math.PI) / 30 + (second * Math.PI) / (30 * 60);
  drawHand(ctx, minute, radius * 0.8, radius * 0.07);
  // second
  second = (second * Math.PI) / 30;
  drawHand(ctx, second, radius * 0.9, radius * 0.02);
}

function drawHand(ctx, pos, length, width) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0, 0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-pos);
}
