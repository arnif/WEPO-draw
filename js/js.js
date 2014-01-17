$(document).ready( function() {
	 //alert("hasdi");

  var canvas, context, tool;

  var mousedown = false;
  var mouse = {x:0, y:0}
  var lastMouse = {x:0, y:0}

  canvas = document.getElementById('myCanvas');
  context = canvas.getContext('2d');


  canvas.addEventListener('mousedown', onmousedown, false);
  canvas.addEventListener('mouseup', onmouseup, false);
  canvas.addEventListener('mousemove', onmousemove, false);

  function setup() {
    
    context.lineWidth = 4;
    context.lineCap = 'round';
    context.strokeStyle = 'rgb(0, 0, 50)';
  
  }

  function onmousedown(ev) {
    mousedown = true;
    ev.preventDefault();
  }

  function onmouseup(ev) {
    mousedown = false;
    ev.preventDefault();
  }

  function onmousemove(ev) {
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
    mouse.x = ev.pageX - this.offsetLeft;
    mouse.y = ev.pageY - this.offsetTop;

    if (mousedown) {
      // console.log(x);
      paint(mouse.x,mouse.y);
    }
  }

  function paint(x,y) {

    context.beginPath();
    context.moveTo(lastMouse.x, lastMouse.y);
    context.lineTo(x, y);
    context.stroke();
    context.closePath();
  }


  $("#earase").click( function () {
    earaseBoard();
  })

  function earaseBoard() {
    canvas.width = canvas.width;
    setup();
  }



setup();


	
});