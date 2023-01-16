var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var radius = canvas.height/2;
var alarmBtn = document.getElementById('set-alarm-btn');
var alarmTime = document.getElementById('time');
var alarmSound = document.getElementById('alarm-sound');
window.savedIndex =localStorage.getItem("bgIndex");
var isAlarmOn=true
const urls=[
    "https://images.pexels.com/photos/4592219/pexels-photo-4592219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/7004697/pexels-photo-7004697.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/5603660/pexels-photo-5603660.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    "https://images.pexels.com/photos/4597942/pexels-photo-4597942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/11057005/pexels-photo-11057005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1579708/pexels-photo-1579708.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/383568/pexels-photo-383568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/354939/pexels-photo-354939.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/4194850/pexels-photo-4194850.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"]

alarmSound.src='https://dl149.dlmate12.online/?file=M3R4SUNiN3JsOHJ6WWQ2a3NQS1Y5ZGlxVlZIOCtyZ1RrTlF1akRGb0k2NU5zNWttMGZHc2FPZE9JNkpFaHFHakhkZFo5eitUVXQrZE5SM0h1NGgxQkhXSSs5TUNxVDdiKzlObEMrOW9XUVBzanVTbTAyTlFoQmVtTzRyckUvMEVTeUVzcUZOMy9BbUYyOERUOXhqbzREdXFva0xlUndGTXR5TWJOT2ZWNVpaRjBEU2FPYUMzaE1CZCtuSE5wSWxBd1BYQTVWS3VtdVJzNzVwbVNCbHdjY0k9'
alarmSound.load();  
ctx.translate(radius,radius)
radius=radius*0.90
addEventListeners();
setAlarms();
setImage();
fetchBibleVerse();
drawClock();
setInterval(drawClock,1000);

function addEventListeners(){
document.getElementById('random').addEventListener('click',randomizeBG)
document.getElementById('alarm-clock').addEventListener('click',openAlarmSettings)
document.getElementById('backAlarm').addEventListener('click',closeAlarmSettings)
document.getElementById('timePicker').addEventListener('change',changeHandler)
}
function fetchBibleVerse(){
    const options = {method: 'GET', headers: {accept: 'application/json'}};
    fetch('https://beta.ourmanna.com/api/v1/get?format=json&order=daily', options)
    .then(response => response.json())
    .then(response => {
      document.getElementById("verse").innerHTML=response.verse.details.text+`<br/>`+'<b>'+response.verse.details.reference+'</b>'
      setTimeout(()=>document.getElementById("verse").style.display="block",1000) 
      }
      )
    .catch(err => console.error(err));
  
}
function changeHandler(e){
    isAlarmOn=true
    var alarmTime = e.target.value.toString()
    if(alarmTime){
    alarmBtn.addEventListener('click',setAlarm)
    function setAlarm(){
            document.getElementById('time').innerHTML=alarmTime
            localStorage.setItem('alarmTime',alarmTime)
        }
    }else{
        alert('Please select alarm time')
    }
}
function setAlarms(){
    console.log(isAlarmOn)
    alarmTime.innerHTML=localStorage.getItem('alarmTime')
}   
function openAlarmSettings(){
    if(isAlarmOn){isAlarmOn=false}
    document.getElementById('back').style.width='0';
    document.getElementById('back').style.height='0';
    document.getElementById('alarm-settings').style.display='block';
    document.getElementById('alarm-settings').style.width='300px';
}
function closeAlarmSettings(){
    document.getElementById('back').style.width='max-content';
    document.getElementById('back').style.height='max-content';
    document.getElementById('alarm-settings').style.width='0';
    document.getElementById('alarm-settings').style.display='none';


}
function setImage(){
    if(savedIndex){
        document.getElementById("back").style.backgroundImage= `url(${urls[savedIndex]})`;
    }else{
    document.getElementById("back").style.backgroundImage= `url(${urls[0]})`;
    }
}
function randomizeBG () {
    try{
    var index =Math.floor(Math.random()*urls.length)
    document.getElementById("back").style.backgroundImage= `url(${urls[index]})`;
    localStorage.setItem("bgIndex",index) 
    }catch(e){
        console.log(e)
    }
}
function drawClock(){
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    window.min;

    if(minute<10){
        min="0"+minute
    }else{
        min=minute
    }
    var time = hour+":"+min

    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius);
    document.getElementById("digital-clock").innerHTML= time

    if(localStorage.getItem('alarmTime')==time&&isAlarmOn){
        alarmSound.play();        
       document.getElementById('alarm-icon').style='animation:  shake  .6s infinite linear;';
    }else{
        document.getElementById('alarm-icon').style='none';
        alarmSound.pause()        

    }
}
function drawFace(ctx, radius) {
    var grad;

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    grad = ctx.createRadialGradient(0, 0 ,radius * 0.95, 0, 0, radius * 1.05);
    grad.addColorStop(0, '#333');
    grad.addColorStop(0.5, 'white');
    grad.addColorStop(1, '#333');
    ctx.strokeStyle = grad;
    ctx.lineWidth = radius*0.02;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
}
function drawNumbers(ctx, radius) {
    var ang;
    var num;
    ctx.font = radius * 0.15 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for(num = 1; num < 13; num++){
        ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.85);
        ctx.rotate(-ang);
    }
}
function drawTime(ctx, radius){
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    //hour
    hour = hour%12;
    hour = (hour*Math.PI/6)+(minute*Math.PI/(6*60))+(second*Math.PI/(360*60));
    drawHand(ctx, hour, radius*0.5, radius*0.07);
    //minute
    minute = (minute*Math.PI/30)+(second*Math.PI/(30*60));
    drawHand(ctx, minute, radius*0.8, radius*0.07);
    // second
    second = (second*Math.PI/30);
    drawHand(ctx, second, radius*0.9, radius*0.02);
}
function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}
