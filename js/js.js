$(document).ready( function() {

  var canvas, context, tool = 'pencil', tempCanvas, tempContext;

  var mousedown = false;
  var mouse = {x:0, y:0, finalX:0, finalY:0}
  var lastMouse = {x:0, y:0}
  var startX = 0;
  var startY = 0;

  var w = 0;
  var h = 0;
  var r = 0;
  var text;
  var filled = false;
  var redoArr = [];
  var fontsize;
  var fontName;

  var tempShape;
  var shapeArr = [];
  function shape() {

    this.lineWidth = context.lineWidth;
    this.lineCap = context.lineCap;
    this.strokeStyle = context.strokeStyle;
    this.filleStyle = context.fillStyle;
    this.tool = tool;
    this.startX = startX;
    this.startY = startY;
    this.mouseX = mouse.x;
    this.mouseY = mouse.y;
    this.finalX = mouse.finalX;
    this.finalY = mouse.finalY;
    this.w = w;
    this.h = h;
    this.r = r;
    this.cord = [];
    this.lastCord = [];
    this.filled = filled;
    this.text = text;
    this.fontsize = fontsize;
    this.fontName = fontName;

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
    
    var colorrr = $(".selected").attr('id');
    tool = tool;
    context.lineWidth = 4;
    context.lineCap = 'round';
    context.strokeStyle = colorrr;
    context.fillStyle = colorrr;
    canvas.style.cursor = 'crosshair';
    context.font = fontsize + " " + fontName;

        // $(".selected").removeClass("selected");
    // $("#pencil").addClass("selected");
    // $("#black").addClass("selected");
    // $("#brush-value").html("4");

  }

  function imgUpdate() {
    tempContext.drawImage(canvas, 0, 0);
    context.clearRect(0,0, canvas.width, canvas.height);
  }

  function onmousedown(ev) {
    mousedown = true;
    startX = ev.pageX - this.offsetLeft;
    startY = ev.pageY - this.offsetTop;

    redoArr = [];
    if (tool === 'text') {
        $("#text-box").show();
        $("#text-box").css("top", mouse.y);
        $("#text-box").css("left", mouse.x);
        $("#text-box").focus();
      } else {
    //bua til nytt shape object
    
      tempShape = new shape();
      }
    
  }

  function onmouseup(ev) {
    mousedown = false;
    mouse.finalX = ev.pageX - this.offsetLeft;
    mouse.finalY = ev.pageY - this.offsetTop;
    if (tool === 'text') {
      $("#text-box").focus();
    }  else {
    //setja shape objectid i array
    // console.log(tempShape);
    shapeArr.push(tempShape);

  }
    
    imgUpdate();
    
  }

  function onmousemove(ev) {
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
    var x = mouse.x = ev.pageX - this.offsetLeft;
    var y = mouse.y = ev.pageY - this.offsetTop;
    
    if (mousedown) {

      $("#redo").prop('disabled', true);
      filled = $("#filled").is(':checked');
      
      if(tool === 'rect') {

        w = (ev.pageX - this.offsetLeft) - startX;
        h = (ev.pageY - this.offsetTop) - startY ;
        context.clearRect(0,0,canvas.width,canvas.height);
        if (filled) {
          context.fillRect(startX, startY, w, h);
        } else {
          context.strokeRect(startX, startY, w, h);
        }

        tempShape = new shape();

      } else if (tool === 'pencil') {

        context.beginPath();
        context.moveTo(lastMouse.x, lastMouse.y);
        context.lineTo(x, y);
        context.stroke();
        context.closePath();
        tempShape.cord.push({"x": x, "y":y});
        tempShape.lastCord.push({"lastX": lastMouse.x, "lastY": lastMouse.y});


      } else if (tool === 'circle') {

        var cx = (ev.pageX - this.offsetLeft) - startX;
        var cy = (ev.pageY - this.offsetTop) - startY;
        r = Math.abs(cy + cx);
        context.clearRect(0,0,canvas.width,canvas.height);
        context.beginPath();
        context.arc(startX, startY, r ,0,Math.PI*2,true);
        if (filled) {
          context.fill();
        } else {
          context.stroke();
        }
        context.closePath();

        tempShape = new shape();

      } else if (tool === 'line') {

        context.clearRect(0,0,canvas.width,canvas.height);
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(x, y);
        context.stroke();

        tempShape = new shape();


      } else if (tool === 'text') {

        $("#text-box").show();
        $("#text-box").css("top", mouse.y);
        $("#text-box").css("left", mouse.x);
        $("#text-box").focus();
        
      }
    }
  }

  $("#text-box").keyup(function(e) {
          
          if (e.keyCode === 13) {
            
            fontsize = $("#font-size").val();
            fontName = $("#font-selector").val();
            context.font = fontsize + "px "+  fontName;

            text = $("#text-box").val();
            context.fillText(text, mouse.finalX, mouse.finalY);
            imgUpdate();
            $("#text-box").val("");
            $("#text-box").hide();
            
            tempShape = new shape();
            shapeArr.push(tempShape);
            console.log(shapeArr);
            
          } else if (e.keyCode === 27) {

            $("#text-box").val("");
            $("#text-box").hide();
          }
        });

  function drawFomArray() {

    for (var i = 0; i < shapeArr.length; i++) {
      context.beginPath();
      context.lineWidth = shapeArr[i].lineWidth;
      context.lineCap = shapeArr[i].lineCap;
      context.strokeStyle = shapeArr[i].strokeStyle;
      context.fillStyle = shapeArr[i].strokeStyle;

      if (shapeArr[i].tool === 'rect') {

        if (shapeArr[i].filled) {
          context.fillRect(shapeArr[i].startX, shapeArr[i].startY, shapeArr[i].w, shapeArr[i].h);
        } else {
          context.strokeRect(shapeArr[i].startX, shapeArr[i].startY, shapeArr[i].w, shapeArr[i].h);
        }
        

      } else if (shapeArr[i].tool === 'pencil') {
        // console.log(shapeArr[i]);

        for (var j = 0; j < shapeArr[i].cord.length; j++) {
          // console.log(shapeArr[i].lastCord[j]);
          // context.beginPath();
          context.moveTo(shapeArr[i].cord[j].x, shapeArr[i].cord[j].y);
          context.lineTo(shapeArr[i].lastCord[j].lastX, shapeArr[i].lastCord[j].lastY);

          context.stroke();
          // context.closePath();
        }

      } else if (shapeArr[i].tool === 'circle') {
        
        context.arc(shapeArr[i].startX, shapeArr[i].startY, shapeArr[i].r ,0,Math.PI*2,true);
        
        if (shapeArr[i].filled) {
          context.fill();
        } else {
          context.stroke();
        }
        
      } else if (shapeArr[i].tool === 'line') {
        // context.beginPath();
          context.moveTo(shapeArr[i].startX, shapeArr[i].startY);
          context.lineTo(shapeArr[i].mouseX, shapeArr[i].mouseY);
          context.stroke();
        // context.closePath();

      } else if (shapeArr[i].tool === 'text') {
          fontsize = shapeArr[i].fontsize;
          fontName = shapeArr[i].fontName;
          context.font = fontsize + "px "+  fontName;

          text = shapeArr[i].text;
          context.fillText(text, shapeArr[i].finalX, shapeArr[i].finalY);
      }
      context.closePath();
    }
  }

  function undo() {
    if (shapeArr.length === 0){
      console.log("notning to undo")
      $("#undo").prop('disabled', true);
      $("#redo").prop('disabled', false);
    } else {
    $("#redo").prop('disabled', false);
    redoArr.push(shapeArr.pop());
    console.log(redoArr);
    tempCanvas.width = tempCanvas.width;
    canvas.width = canvas.width;
    drawFomArray();
    setup();
    imgUpdate();
    console.log(shapeArr.length)
    }
  }

  function redo() {
    console.log("shapeArr");
 
    if (redoArr.length === 0) {
      console.log("nothing to redo");
      $("#redo").prop('disabled', true);
      $("#undo").prop('disabled', false);
    } else {
    shapeArr.push(redoArr.pop());

    tempCanvas.width = tempCanvas.width;
    canvas.width = canvas.width;
    drawFomArray();
    setup();
    imgUpdate();
    } 
  }

  $("#undo").click( function() {
    // console.log("redoArr");
    undo();
    
  });

   $("#redo").click( function() {
    
    redo();

  });


  $("#clearBoard").click( function () {
    clearBoard();
  });

  function clearBoard() {
    var areYouSure = confirm("Are you sure ?");
    if (areYouSure) {
      tempCanvas.width = tempCanvas.width;
      canvas.width = canvas.width;
      context.lineWidth = $("#brush-size").val();
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


//SpeechRecognition support!

if (annyang) {

  var commands = {
    'undo': function () {
      undo();
    },
    'redo': function() {
      redo();
    }
  };

  annyang.addCommands(commands);

  annyang.start();

}


});