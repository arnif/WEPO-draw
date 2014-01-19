$(document).ready( function() {

  var canvas, context, tool, tempCanvas, tempContext;

  var mousedown = false;
  var mouse = {x:0, y:0}
  var lastMouse = {x:0, y:0}
  var startX = 0;
  var startY = 0;
  
  var w = 0;
  var h = 0;
  var r = 0;

  var tempShape;
  var shapeArr = [];
  function shape() {

    this.lineWidth = context.lineWidth;
    this.lineCap = context.lineCap;
    this.strokeStyle = context.strokeStyle;
    this.tool = tool;
    this.cordX = this.mouse.x;
    this.cordY = this.mouse.y;
      // lineWidth : 4,
      // lineCap : 'round',
      // strokeStyle : 'black',
      // tool : 'pencil',
      // cord : {x:0, y:0},
      // w: 0,
      // h: 0,
      // r: 0
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
    $(".selected").removeClass("selected");
    $("#pencil").addClass("selected");
    $("#black").addClass("selected");
    $("#brush-value").html("4");

  }

  function imgUpdate() {
    tempContext.drawImage(canvas, 0, 0);
    context.clearRect(0,0, canvas.width, canvas.height);
  }

  function onmousedown(ev) {
    mousedown = true;
    startX = ev.pageX - this.offsetLeft;
    startY = ev.pageY - this.offsetTop;

    if (tool === 'text') {
        $("#text-box").show();
        $("#text-box").css("top", mouse.y);
        $("#text-box").css("left", mouse.x);
        $("#text-box").focus();
      }
    //bua til nytt shape object
    tempShape = new shape;
    
  }

  function onmouseup(ev) {
    mousedown = false;
    mouse.finalX = ev.pageX - this.offsetLeft;
    mouse.finalY = ev.pageY - this.offsetTop;
    if (tool === 'text') {
      $("#text-box").focus();
    }
    imgUpdate();
    //setja shape objectid i array
  }

  function onmousemove(ev) {
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
    var x = mouse.x = ev.pageX - this.offsetLeft;
    var y = mouse.y = ev.pageY - this.offsetTop;

    if (mousedown) {

      if(tool === 'rect') {

        var w = (ev.pageX - this.offsetLeft) - startX;
        var h = (ev.pageY - this.offsetTop) - startY ;
        context.clearRect(0,0,canvas.width,canvas.height);
        context.strokeRect(startX, startY, w, h);

      } else if (tool === 'pencil') {

        context.beginPath();
        context.moveTo(lastMouse.x, lastMouse.y);
        context.lineTo(x, y);
        context.stroke();
        context.closePath();

      } else if (tool === 'circle') {

        var cx = (ev.pageX - this.offsetLeft) - startX;
        var cy = (ev.pageY - this.offsetTop) - startY;
        context.clearRect(0,0,canvas.width,canvas.height);
        context.beginPath();
        context.arc(startX, startY, Math.abs(cy + cx) ,0,Math.PI*2,true);
        context.stroke();
        context.closePath();

      } else if (tool === 'line') {

        context.clearRect(0,0,canvas.width,canvas.height);
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(x, y);
        context.stroke();

      } else if (tool === 'text') {

        $("#text-box").show();
        $("#text-box").css("top", mouse.y);
        $("#text-box").css("left", mouse.x);
        $("#text-box").focus();

        $("#text-box").keyup(function(e) {
          
          if (e.keyCode === 13) {
            context.font = "14px Helvetica ";
            var text = $("#text-box").val();
            context.fillText(text, mouse.finalX, mouse.finalY);
            imgUpdate();
            $("#text-box").val("");
            $("#text-box").hide();
         
          } else if (e.keyCode === 27) {

            $("#text-box").val("");
            $("#text-box").hide();
          }

        });

      }

    }
  }

  $("#clearBoard").click( function () {
    clearBoard();
  });

  function clearBoard() {
    var areYouSure = confirm("Are you sure ?");
    if (areYouSure) {
      tempCanvas.width = tempCanvas.width;
      canvas.width = canvas.width;
      setup();
    } 
  }

  $("#brush-size").on('change', function() {
    // console.log($("#brush-size").val());
    $("#brush-value").html($("#brush-size").val());
    context.lineWidth = $("#brush-size").val();
  });

  $("#eraser").click( function() {
    $(".color").removeClass("selected");
    $(".tool").removeClass("selected");
    $("#eraser").addClass("selected");
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

setup();

});