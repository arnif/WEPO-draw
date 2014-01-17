$(document).ready( function() {
	 //alert("hasdi");

  var canvas, context, tool;

  var mousedown = false;
  var mouse = {x:0, y:0}
  var lastMouse = {x:0, y:0}

  var shapeHistory = [];

  canvas = document.getElementById('myCanvas');
  context = canvas.getContext('2d');


  canvas.addEventListener('mousedown', onmousedown, false);
  canvas.addEventListener('mouseup', onmouseup, false);
  canvas.addEventListener('mousemove', onmousemove, false);

  function setup() {
    
    context.lineWidth = 4;
    context.lineCap = 'round';
    context.strokeStyle = 'black';
  
  }

  function onmousedown(ev) {
    mousedown = true;
    ev.preventDefault();
    //bua til nytt shape object
  }

  function onmouseup(ev) {
    mousedown = false;
    ev.preventDefault();
    //setja shape objectid i array
  }

  function onmousemove(ev) {
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
    mouse.x = ev.pageX - this.offsetLeft;
    mouse.y = ev.pageY - this.offsetTop;

    if (mousedown) {
      paint(mouse.x,mouse.y);

    }
  }

  function paint(x,y) {
    //setja x og y gildi i shape objectid
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

  $("#brush-size").on('change', function() {
    // console.log($("#brush-size").val());
    $("#brush-value").html($("#brush-size").val());
    context.lineWidth = $("#brush-size").val();
  });

  $(".color").click( function() {
    // console.log(this.id);
    context.strokeStyle = this.id;
  })



setup();


	
});