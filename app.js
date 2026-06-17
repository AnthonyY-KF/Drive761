const ADMIN_PASSWORD = "Drive761!";

let adminUnlocked = false;

if(!localStorage.getItem("worldCupGeoDoors")){

let prizes = [];

// 4 Delivered Drinks
for(let i=0;i<4;i++){
prizes.push("Delivered Drinks");
}

// 10 Sweet Tubs
for(let i=0;i<10;i++){
prizes.push("Sweet Tub");
}

// 86 No Win
for(let i=0;i<86;i++){
prizes.push("No Win");
}

// Shuffle

for(let i=prizes.length-1;i>0;i--){

let j=Math.floor(Math.random()*(i+1));

[prizes[i],prizes[j]]=
[prizes[j],prizes[i]];

}

localStorage.setItem(
"worldCupGeoDoors",
JSON.stringify(prizes)
);

localStorage.setItem(
"openedDoors",
JSON.stringify([])
);

localStorage.setItem(
"results",
JSON.stringify([])
);

}

document
.getElementById("openDoorBtn")
.addEventListener("click",openDoor);

function openDoor(){

if(!adminUnlocked){

const password =
prompt("Enter Admin Password");

if(password!==ADMIN_PASSWORD){

alert("Incorrect Password");

return;
}

adminUnlocked=true;

}

const centre =
document.getElementById("centreCode")
.value
.trim();

if(!centre){

alert("Enter Centre Code");

return;
}

const doors =
JSON.parse(
localStorage.getItem(
"worldCupGeoDoors"
)
);

const opened =
JSON.parse(
localStorage.getItem(
"openedDoors"
)
);

const available=[];

for(let i=0;i<100;i++){

if(!opened.includes(i)){

available.push(i);

}

}

if(available.length===0){

alert("All doors opened");

return;
}

document
.getElementById("spinnerOverlay")
.style.display="flex";

document
.getElementById("drumroll")
.play();

let flash =
document.getElementById("flashNumber");

let interval=setInterval(()=>{

flash.innerText=
Math.floor(Math.random()*100)+1;

},50);

setTimeout(()=>{

clearInterval(interval);

let selectedIndex=
available[
Math.floor(
Math.random()*available.length
)
];

opened.push(selectedIndex);

localStorage.setItem(
"openedDoors",
JSON.stringify(opened)
);

let prize=
doors[selectedIndex];

saveResult(
centre,
selectedIndex+1,
prize
);

showReveal(
centre,
selectedIndex+1,
prize
);

document
.getElementById("spinnerOverlay")
.style.display="none";

updateStatus();

},2000);

}

function saveResult(
centre,
door,
prize
){

let results=
JSON.parse(
localStorage.getItem(
"results"
)
);

results.push({

centre,
door,
prize,
date:new Date()

});

localStorage.setItem(
"results",
JSON.stringify(results)
);

}

function showReveal(
centre,
door,
prize
){

let image="";
let title="";

if(prize==="Delivered Drinks"){

image=
"assets/deliverdrinks.png";

title=
"🥤 £25 DELIVERED DRINKS";

}

else if(prize==="Sweet Tub"){

image=
"assets/sweettub.png";

title=
"🍬 SWEET TUB";

}

else{

image=
"assets/nowin.png";

title=
"❌ NO WIN";

}

document
.getElementById("revealImage")
.src=image;

document
.getElementById("prizeText")
.innerText=title;

document
.getElementById("centreText")
.innerText=
"Centre "+centre;

document
.getElementById("doorText")
.innerText=
"Door "+door;

document
.getElementById("revealOverlay")
.style.display="flex";

updateLeaderboard();

}

function closeReveal(){

document
.getElementById("revealOverlay")
.style.display="none";

}

function updateStatus(){

let opened=
JSON.parse(
localStorage.getItem(
"openedDoors"
)
);

document
.getElementById("doorsRemaining")
.innerText=
(100-opened.length)+
" Doors Remaining";

}

function updateLeaderboard(){

let results=
JSON.parse(
localStorage.getItem(
"results"
)
);

let centres={};

results.forEach(r=>{

if(!centres[r.centre]){

centres[r.centre]=0;

}

centres[r.centre]++;

});

let sorted=
Object.entries(centres)
.sort((a,b)=>b[1]-a[1]);

let html="";

sorted.slice(0,10)
.forEach((c,index)=>{

html+=
(index+1)+
". Centre "+
c[0]+
" - "+
c[1]+
" Doors<br>";

});

if(html===""){

html="No activity yet";

}

document
.getElementById("leaderboard")
.innerHTML=html;

}

updateStatus();
updateLeaderboard();