$(document).ready( function() {
	 //alert("hasdi");

  var canvas, context, tool, tempCanvas, tempContext;

  var mousedown = false;
  var mouse = {x:0, y:0}
  var lastMouse = {x:0, y:0}
  var rect = {};

  var shapeArr = [];
  var shape = {
      lineWidth : 4,
      lineCap : 'round',
      strokeStyle : 'black',
      cord : {x:0, y:0}
  };

  tempCanvas = document.getElementById('myCanvas');
  tempContext = tempCanvas.getContext('2d');

  var container = tempCanvas.parentNode;
  canvas = document.createElement('canvas');
  canvas.id = 'imageTemp';
  canvas.width = tempCanvas.width;
  canvas.height = tempCanvas.height;
  container.appendChild(canvas); 

  context = canvas.getContext('2d');


  canvas.addEventListener('mousedown', onmousedown, false);
  canvas.addEventListener('mouseup', onmouseup, false);
  canvas.addEventListener('mousemove', onmousemove, false);

  function setup() {
    
    tool = 'pencil';
    context.lineWidth = 4;
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.fillStyle = 'black';
    canvas.style.cursor = 'crosshair';
  
  }

  function imgUpdate() {
    tempContext.drawImage(canvas, 0, 0);
    context.clearRect(0,0, canvas.width, canvas.height);
  }

  function onmousedown(ev) {
    mousedown = true;
    if (tool === 'rect') {
      rect.startX = ev.pageX - this.offsetLeft;
      rect.startY = ev.pageY - this.offsetTop;
    }
    ev.preventDefault();
    //bua til nytt shape object
    
  }

  function onmouseup(ev) {
    mousedown = false;
    imgUpdate();
    ev.preventDefault();
    //setja shape objectid i array
  }

  function onmousemove(ev) {
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
    mouse.x = ev.pageX - this.offsetLeft;
    mouse.y = ev.pageY - this.offsetTop;

    if (mousedown) {

      if(tool === 'rect') {
        rect.w = (ev.pageX - this.offsetLeft) - rect.startX;
        rect.h = (ev.pageY - this.offsetTop) - rect.startY ;
        context.clearRect(0,0,canvas.width,canvas.height);
      } 
      paint(mouse.x,mouse.y);

    }
  }

  function paint(x,y) {
    //setja x og y gildi i shape objectid (array af x og y)

    if (tool === 'pencil') {
      context.beginPath();
      context.moveTo(lastMouse.x, lastMouse.y);
      context.lineTo(x, y);
      context.stroke();
      context.closePath();

    } else if (tool === 'rect') {
      context.strokeRect(rect.startX, rect.startY, rect.w, rect.h);

      // context.stroke();
      // context.closePath();
    } else if (tool === 'circle') {
      context.clearRect(0,0,canvas.width,canvas.height);
      context.beginPath();
      context.arc(x,y,100,0,Math.PI*2,true);
      context.stroke();
    }
  }


  $("#clearBoard").click( function () {
    clearBoard();
  })

  function clearBoard() {
    tempCanvas.width = tempCanvas.width;
    canvas.width = canvas.width;

    setup();
  }

  $("#brush-size").on('change', function() {
    // console.log($("#brush-size").val());
    $("#brush-value").html($("#brush-size").val());
    context.lineWidth = $("#brush-size").val();
  });

  $("#eraser").click( function() {
    context.strokeStyle = 'white';
    context.lineCap = 'round';
    tool = 'pencil';
  });

  $(".color").click( function() {
    // console.log(this.id);
    $(".color").removeClass("selected");
    $("#"+this.id).addClass("selected");
    context.strokeStyle = this.id;
    context.fillStyle = this.id;
  });

  $(".tool").click( function() {
    $(".tool").removeClass("selected");
    $("#"+this.id).addClass("selected");
    tool = this.id;
  });

  // $("#pencil").click( function() {
  //   // console.log("pensil");
  //   context.lineCap = 'round';
  //   tool = 'pencil';
  // });

  // $("#rect").click( function() {
  //   // console.log("rect");
  //   context.lineCap = 'round';
  //   tool = 'rect';
  // });

  // $("#circle").click( function() {
  //   // console.log("rect");
  //   context.lineCap = 'round';
  //   tool = 'circle';
  // });


  

setup();
	
});