let cvs = document.getElementById("gameOfLifeScreen"); // cvs.width and cvs.height to access cvs properties
let ctx = cvs.getContext('2d');
const SIZE = 20;
let width = cvs.width/SIZE; // number of units wide (each unit is 20 pixels width)
let height = cvs.height/SIZE; // number of units tall (each unit is 20 pixels tall)
var xPlace = 0;
var yPlace = 0;
var boxArray = [];
var pause =  1;

// eventually save the run through of the game
function refreshScreen() {
  ctx.fillStyle = "white"
  ctx.fillRect(0,0, cvs.width, cvs.height)
}


function drawBox(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x,y,width,height);
}


function vertLines() {
  for (let i = 0; i < cvs.width; i += SIZE) {
    drawBox(i, 0, 1, cvs.height, "black");
  }
  drawBox(cvs.width - 1, 0, 1, cvs.height, "black")
}


function horLines() {
  for (let i = 0; i <= cvs.height; i += SIZE) {
    drawBox(0, i, cvs.width, 1, "black");
  }
  drawBox(0, cvs.height - 1, cvs.width, 1, "black")
}


function loadBoxArray() {
  // load the boxArray with box objects to render
    for (var i = 0; i <= width*height; i++){
  
      if (xPlace >= cvs.width){
        xPlace = 0;
        yPlace += SIZE;
      }
  
      var box = new litBox(xPlace, yPlace)
      boxArray.push(box);
      xPlace += SIZE;
    }
  }


function renderArray() { 
  for (var i = 0; i <= width*height; i++){ 
    boxArray[i].drawBox();
    console.log(boxArray[i].state);
  }
  vertLines();
  horLines();
}


function examineBox(index) {
  // first determine number of neighbors
  // then determine if current box is alive or dead to 
  // then determine if next state is alive or dead
  var neighbors = 0;
  // left and right neighbors
  if (boxArray[index-1].state == 1) {neighbors+=1;}
  if (boxArray[index+1].state == 1) {neighbors+=1;}
  if (boxArray[index-width].state == 1) {neighbors+=1;}
  if (boxArray[index+width].state == 1) {neighbors+=1;}
  if (boxArray[index+width +1].state == 1) {neighbors+=1;}
  if (boxArray[index+width -1].state == 1) {neighbors+=1;}
  if (boxArray[index-width +1].state == 1) {neighbors+=1;}
  if (boxArray[index-width -1].state == 1) {neighbors+=1;}

  if (boxArray[index].state == 1) {
    if (neighbors == 2 || neighbors == 3){
      boxArray[index].nextState = 1;
    }
    else {
      boxArray[index].nextState = -1;}
  }

  else if (boxArray[index].state == -1){
    if (neighbors == 3) {
      boxArray[index].nextState = 1;
    }
    else {
      boxArray[index].nextState = -1;}
  }
}


function lifeArray() { 
  
  //***
  //    Any live cell with two or three live neighbours survives.
  //    Any dead cell with three live neighbours becomes a live cell.
  //    All other live cells die in the next generation. Similarly, all other dead cells stay dead.
  //***

  // the top and bottom rows as well as the left and right columns have special factors to 

  for (var i = 0; i <= width*height; i++){
    // this string of conditionals will exclude outer border of boxes 
    if ( (i >= width & i < (width*height - width)) & (i%width != 0) & ((i+1)%width != 0))  {
      // boxArray[i].stateChange();
      examineBox(i); // examine box will look at the heights and update nextState attribute 
    }
  }
  
  // this second for loops goes through and updates array with nextState values
  for (var i = 0; i <= width*height; i++){
    if ( (i >= width & i < (width*height - width)) & (i%width != 0) & ((i+1)%width != 0))  {
      boxArray[i].state = boxArray[i].nextState;
    }
  }
}


function callFunctions() {
  refreshScreen();
  renderArray();
  if (pause == -1){ 
    lifeArray();
  }
}

function animate(timeMs) {
  setInterval(callFunctions, timeMs);
}


class litBox {
  constructor(xStart, yStart) {
    this.xStart = xStart;
    this.yStart = yStart;
    this.color = "#FF8040";
    this.state = -1;
    this.nextState = -1;
  }
  

  drawBox() {
    
    if (this.state == 1) {
      ctx.fillStyle = this.color;
    }
    else {
      ctx.fillStyle = "white";
    }
    ctx.fillRect(this.xStart, this.yStart, SIZE, SIZE);
  }

  stateChange() {
    this.state *= (-1);
  }
}


cvs.addEventListener("click", function(e) { 
  var cRect = cvs.getBoundingClientRect();        
  var cvsX = Math.floor((e.clientX - cRect.left)/SIZE);  // these are the rounded values of the mouse click event
  var cvsY = Math.floor((e.clientY - cRect.top)/SIZE);   // this offsetted value is used in rendering the boxes

  // given an x coord and a y coord of a click this
  // will determine the index number of the clicked box that is stored in the list []

  var num = (cvsX) + width*((cvsY));  // this is the index of the box to be rendered that is stored in the boxArray
  boxArray[num].stateChange();
  boxArray[num].drawBox();
  vertLines();
  horLines();
});

window.addEventListener('keydown', (event) => {
  if (event.code === "Enter"){
    pause*=-1;
  }
});   

function gameOfLifePlay() {
  pause*=-1;
  if (pause == -1){
    document.getElementById("gameOfLifeButton").innerHTML = "Pause";
  }
  else {
    document.getElementById("gameOfLifeButton").innerHTML = "Play";
  }
}

function lifeRulesClose() {
  document.getElementById("rulesClose").style.display = "none";
}

function gameOfLifeRules() {
  document.getElementById("rulesClose").style.display = "flex";
}

function gameOfLifeClear(){
  
  boxArray.forEach(function (item, index) {
    item.state = -1;
  });
  pause = 1;
  document.getElementById("gameOfLifeButton").innerHTML = "Play";
  refreshScreen()
  vertLines();
  horLines();

}

function loadExample2() {
  gameOfLifeClear()

  boxArray[378-40].state = 1;
  boxArray[378-40].drawBox();
  boxArray[378].state = 1;
  boxArray[378].drawBox();
  boxArray[378+40].state = 1;
  boxArray[378+40].drawBox();
  
  boxArray[380].state = 1;
  boxArray[380].drawBox();
  boxArray[381].state = 1;
  boxArray[381].drawBox();
  boxArray[382].state = 1;
  boxArray[382].drawBox();
  vertLines();
  horLines();
}

function loadExample1() {
  gameOfLifeClear()

  boxArray[378-40].state = 1;
  boxArray[378-40].drawBox();  
  boxArray[378-40+1].state = 1;
  boxArray[378-40+1].drawBox();
  boxArray[378-40+2].state = 1;
  boxArray[378-40+2].drawBox(); 

  boxArray[378].state = 1;
  boxArray[378].drawBox();

  boxArray[378+2].state = 1;
  boxArray[378+2].drawBox();

  boxArray[378+40].state = 1;
  boxArray[378+40].drawBox();  
  boxArray[378+40+1].state = 1;
  boxArray[378+40+1].drawBox();
  boxArray[378+40+2].state = 1;
  boxArray[378+40+2].drawBox();

  vertLines();
  horLines();
}


function loadExample3(){
  gameOfLifeClear()

  boxArray[378-40].state = 1;
  boxArray[378-40].drawBox();  
  boxArray[378-40+1].state = 1;
  boxArray[378-40+1].drawBox();
  boxArray[378-40+2].state = 1;
  boxArray[378-40+2].drawBox();
  
  boxArray[378-80+3].state = 1; 
  boxArray[378-80+3].drawBox();
  boxArray[378-120+3].state = 1; 
  boxArray[378-120+3].drawBox();  
  boxArray[378-80+4].state = 1; 
  boxArray[378-80+4].drawBox(); 
  

  boxArray[378].state = 1;
  boxArray[378].drawBox();
  boxArray[378+2].state = 1;
  boxArray[378+2].drawBox();


 
  boxArray[378+40].state = 1;
  boxArray[378+40].drawBox();  
  
  boxArray[378+79].state = 1;
  boxArray[378+79].drawBox();

  boxArray[378+119].state = 1;
  boxArray[378+119].drawBox();
  
  boxArray[378+78].state = 1;
  boxArray[378+78].drawBox(); 

  boxArray[378+40+1].state = 1;
  boxArray[378+40+1].drawBox();
  boxArray[378+40+2].state = 1;
  boxArray[378+40+2].drawBox();

  vertLines();
  horLines();
}


refreshScreen();
loadBoxArray();


loadExample1();
animate(400);







