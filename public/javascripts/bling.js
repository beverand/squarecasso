//import blingdraw.js
//create an array for the free gem (big) and all the small gems
let gems = document.querySelectorAll(".free");
var cv = document.querySelector("#frame");
let resetbtn = document.querySelector("#resetbk");
let bk = 'white'
let counter = [];
var isDragging=false;
let dragok = false;

//-------select random colors for gems and assign-------------------------//
function getRandomColor() {
    var x = Math.floor(Math.random() * 256);
    var y = Math.floor(Math.random() * 256);
    var z = Math.floor(Math.random() * 256);
    var bgColor = "rgb(" + x + "," + y + "," + z + ")";
    return bgColor;
  }
  var now = new Date(),
    then = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()+1,
        0,0,0),
    diff = then.getTime()- now.getTime(); // difference in milliseconds

console.log(`now: ${now}, then: ${then}, diff: ${diff}`)

  //var timeDifference = //time remaining in ms until midnight. 
setTimeout(function(){
  //code you want to run at midnight. 
  console.log('timeout run')
  for(g of gems){
    document.getElementById(g.id).style.background = getRandomColor()
  }
},diff)
  // Convert to midnight in your timezone first
  then.setHours(0,0,0,0);
  // Convert to midnight UTC
  then.setUTCHours(0,0,0,0);
  
  console.log(then.toString())

  localStorage.setItem('playdate', now.toISOString())
// if(localStorage.getItem('playdate') > today.getDate().toString())
// (
//     localStorage.setItem('playdate', date.getDate().toString())
// )

//   var b = new Date();
//   console.log(today, localStorage.getItem(playdate)); //this works
//   localStorage.a = a;
//   localStorage.b = b;
   a = localStorage.getItem('playdate'); // parse to date object
//   b = Date.parse(localStorage.b);
  console.log(a); // now, this will work
  console.log(a.split(' '))





//-------initalize gem count array with 0----------------------// 
for (var i = 0; i <= gems.length; i++){
    //document.getElementById(gems[i].id).style.color = getRandomColor()
    counter[i] = i+1;
}
 
console.log(gems);
console.log(counter)

//------------Get context for drawing for boxes------------------------//

var context = cv.getContext("2d");
var drawn = [];

//-----------------Drag and drop functionality----------------------//
function dragStart(ev){
    console.log(ev.target.getAttribute("id"))
    let idx = Number(ev.target.getAttribute("id").replace(/[^0-9]/g,''))
    console.log(idx) 
    ev.dataTransfer.setData("Text", ev.target.getAttribute("id"));
    ev.dataTransfer.setDragImage(ev.target, 0,0);
    if(counter[idx] <=1) {
        ev.target.draggable = false
        ev.target.classList.remove('dragstart');
    }   
}

function dragEnter(ev){
    ev.preventDefault();
    cv.classList.add('drag-over');
}

function dragOver(ev){
    ev.preventDefault();
    ev.target.classList.add('drag-over');
    cv.classList.add('drag-over');
}

function dragLeave(ev){
    ev.target.classList.remove('drag-over');
    cv.classList.remove('drag-over');
}

function drop(ev){
    ev.target.classList.remove('drag-over');
    ev.preventDefault();
    const id = ev.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);
    
    cv.classList.remove('drag-over');
    //store the background color 
    let gColor = window.getComputedStyle(draggable, null).getPropertyValue("background-color");

    //if after removing all of the characters from the id, if there is a number use it, else 0
    let idx = draggable.id.replace(/[^0-9]/g,'') || 0

    drawn.push({x:ev.clientX - cv.offsetLeft, y:ev.clientY- cv.offsetTop, width: draggable.clientWidth, height: draggable.clientHeight, color: gColor, isDragging: false, index: idx, id: draggable })
    context.fillStyle = gColor;
    context.fillRect (ev.clientX - cv.offsetLeft ,ev.clientY - cv.offsetTop,draggable.clientWidth,draggable.clientHeight);
    
    counter[idx]--;      
    draggable.innerText = counter[idx];

    if (counter[idx] <= 1){
        ev.target.draggable = false
        ev.target.classList.remove('dragstart');
        ev.target.classList.remove('drop');
    }
    //console.log(gems)
    return false;
}

//-----------------------mouse for canvas moves--------------------//
//https://stackoverflow.com/questions/28284754/dragging-shapes-using-mouse-after-creating-them-with-html5-canvas
// handle mousedown events
function myDown(e){

    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
  
    // get the current mouse position
    var mx=parseInt(e.clientX-cv.offsetLeft);
    var my=parseInt(e.clientY-cv.offsetTop);
  
    // test each shape to see if mouse is inside
    dragok=false;
    for(var i=0;i<drawn.length;i++){
      var s=drawn[i];
      // decide if the shape is a rect or circle               
      if(s.width){
        // test if the mouse is inside this rect
        if(mx>s.x && mx<s.x+s.width && my>s.y && my<s.y+s.height){
          // if yes, set that rects isDragging=true
          dragok=true;
          s.isDragging=true;
        }
      }else{
        var dx=s.x-mx;
        var dy=s.y-my;
        // test if the mouse is inside this circle
        if(dx*dx+dy*dy<s.r*s.r){
          dragok=true;
          s.isDragging=true;
        }
      }
    }
    // save the current mouse position
    startX=mx;
    startY=my;
  }
  
  
  // handle mouseup events
  function myUp(e){
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
  
    // clear all the dragging flags
    dragok = false;
    for(var i=0;i<drawn.length;i++){
      drawn[i].isDragging=false;
    }
  }
  
  
  // handle mouse moves
  function myMove(e){
    // if we're dragging anything...
    if (dragok){
  
      // tell the browser we're handling this mouse event
      e.preventDefault();
      e.stopPropagation();
  
      // get the current mouse position
      var mx=parseInt(e.clientX-cv.offsetLeft);
      var my=parseInt(e.clientY-cv.offsetTop);
  
      // calculate the distance the mouse has moved
      // since the last mousemove
      var dx=mx-startX;
      var dy=my-startY;
  
      // move each rect that isDragging 
      // by the distance the mouse has moved
      // since the last mousemove
      for(var i=0;i<drawn.length;i++){
        var s= drawn[i];
        if(s.isDragging){
          s.x+=dx;
          s.y+=dy;
        }
      }
  
      // redraw the scene with the new rect positions
      draw();
  
      // reset the starting mouse position for the next mousemove
      startX=mx;
      startY=my;
  
    }
  }

//-----------------------click functions----------------------------//
function click(ev){
    cv.style.background = getComputedStyle(this).background;
    bk = cv.style.background
    bk = bk.match(/rgb\(.*\)/)[0] 
    //console.log(bk)
}

function dblclick(ev){
    //console.log(ev.clientX,ev.clientY);
    //console.log(ev.clientX - cv.offsetLeft, ev.clientY - cv.offsetTop);
    //get pixel color
    const p = context.getImageData(ev.x- cv.offsetLeft, ev.y- cv.offsetTop, 1, 1).data
    console.log(`rgb(${p[0]}, ${p[1]}, ${p[2]})`)

    removed_idx = drawn.findIndex(v => (v.color == `rgb(${p[0]}, ${p[1]}, ${p[2]})` &&
    contains(v, ev.clientX - cv.offsetLeft, ev.clientY - cv.offsetTop))
    )

    //reinstitute draggable capacity
    if(removed_idx != -1){
        if(counter[Number(removed_idx)] == 0){
            gems[removed_idx].draggable = true
        }
      
        //increment counter
        counter[removed_idx]++

        //update gem count
        gems[removed_idx].innerText = counter[removed_idx]
        
        //all of the not selected squares are reassigned to drawn[]
        drawn.splice(removed_idx,1)

        //redraw canvas
        draw()
    }
}

  
//   cv.addEventListener('click', (ev) => {
//     const pos = {
//       x: ev.clientX - cv.offsetLeft,
//       y: ev.clientY - cv.offsetTop
//     };
//     const p = context.getImageData(ev.x- cv.offsetLeft, ev.y- cv.offsetTop, 1, 1).data
//     let c = drawn.filter((clr) => clr.gColor.replace('rgb(', '').replace(")", "").split(',') == p )
//     drawn.forEach(gem => {
//       if(p[0] == gem.color)
//       if (isIntersect(pos, gem)) {
//         alert('click on circle: ' + gem.id);
//       }
//     });
//   });


// function rgbToHex(r, g, b) {
//   if (r > 255 || g > 255 || b > 255)
//       throw "Invalid color component";
//   return ((r << 16) | (g << 8) | b).toString(16);
// }

function clickCanvas(ev){
    console.log(ev.clientX,ev.clientY);
    //get pixel color
    console.log(drawn)
    
}

function resetbk(ev){
    cv.style.background = 'white'
}

function saveCanvas(ev){
    
    let dataURL = cv.toDataURL("image/png", 1.0);
    //let win = window.open();
    //console.log(cv.x, cv.y, cv.width, cv.height)
    //let d2 = context.getImageData(0, 0, cv.width, cv.height);
    //ctx.globalCompositeOperation = "destination-in";
  
    // draw image
    //ctx.drawImage(this, 0, 0);
    if(drawn.length > 0)
    {
        let win = window.open();
        //ctx.drawImage(img, 10, 10);
        //win.document.write(`<canvas style="background-color:orange"> <canvas/>`);
        //win.document.write(`<img src="${dataURL}"/>`);
        let n = win.document.createElement('canvas')
        n.width = cv.width
        n.height = cv.height
        n.style.background = bk
        win.document.body.appendChild(n);
        let q = win.document.querySelector("canvas")
        let i = q.getContext("2d")
        i.drawImage(cv, 0,0)
    }
   // let o = n.getContext('2d')
    //context.drawImage(oldCanvas, 0, 0);    
    //n = document.querySelector("#frame")
    
    //let winComponent = win.document.getSelection('canvas')
    //let winCtx = winComponent.getContext('2d')
    //let img = document.querySelector("#frame")
    //winCxt.drawImage(img)
   // win.open()
    //console.log(win.document.style.background)
    // var win2 = window.open();
    // win2.document.write('<canvas height="300" width="300"></canvas>')
    // win2.querySelector('canvas')
    
    // drawn.forEach(n =>{
    //    context.fillStyle = n.color;
    //    context.fillRect(n.x, n.y, n.width, n.height); 
    // })
}

function contains(target, x, y) {
    return (x >= target.x &&
            x <= target.x + target.width &&
            y >= target.y &&
            y <= target.y + target.height
           );
}

function draw() {
    //clear canvas
    context.clearRect(0, 0, cv.width, cv.height); 
    //redraw squares                   
    drawn.forEach(sq => {context.fillStyle = sq.color;
                        context.fillRect (sq.x ,sq.y,sq.width,sq.height)                   
                        });
}

//---------------------add event listeners
cv.addEventListener('dragstart', dragStart);

cv.addEventListener('dragenter', dragEnter);
cv.addEventListener('dragover', dragOver);
cv.addEventListener('dragleave', dragLeave);
cv.addEventListener('drop', drop);

cv.addEventListener('click', clickCanvas);
cv.addEventListener('dblclick', dblclick)

cv.addEventListener('mousedown',myDown);
cv.addEventListener('mousemove',myMove);
cv.addEventListener('mouseup',myUp);
// cv.mouseout(function(e){handleMouseOut(e);});

// cv.addEventListener('mousedown', handleMouseDown);
// cv.addEventListener('mousemove', handleMouseMove);
// cv.addEventListener('mouseup', handleMouseUp);
// cv.addEventListener('mouseout', handleMouseOut);

resetbtn.addEventListener('click', resetbk);
savebtn.addEventListener('click', saveCanvas);


gems.forEach(gem => { 
    gem.addEventListener('click', click);
    gem.draggable = true;
    gem.addEventListener('dragstart', dragStart);
    gem.innerText = counter[gem.id.replace(/[^0-9]/g,'') || 0]
});


// Get the modal
var modal = document.getElementById("login");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
// }

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}