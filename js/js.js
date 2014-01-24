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

  //uhhh 
  canvas.addEventListener("touchstart", onmousedown, false);
  canvas.addEventListener("touchmove", onmousemove, true);
  canvas.addEventListener("touchend", onmouseup, false);

  function setup() {
    
    var colorrr = $(".selected").attr('id');
    tool = tool; 
    context.lineWidth = $("#brush-size").val();
    context.lineCap = 'round';
    context.strokeStyle = colorrr;
    context.fillStyle = colorrr;
    // canvas.style.cursor = 'crosshair';
    context.font = fontsize + "px " + fontName;


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
    $("#redo").prop('disabled', true);
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

      $("#undo").prop('disabled', false);

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

  function drawFomArray(arr) { //taka med ser arr????

    for (var i = 0; i < arr.length; i++) {
      context.beginPath();
      context.lineWidth = arr[i].lineWidth;
      context.lineCap = arr[i].lineCap;
      context.strokeStyle = arr[i].strokeStyle;
      context.fillStyle = arr[i].strokeStyle;

      if (arr[i].tool === 'rect') {

        if (arr[i].filled) {
          context.fillRect(arr[i].startX, arr[i].startY, arr[i].w, arr[i].h);
        } else {
          context.strokeRect(arr[i].startX, arr[i].startY, arr[i].w, arr[i].h);
        }
        

      } else if (arr[i].tool === 'pencil') {

        for (var j = 0; j < arr[i].cord.length; j++) {

          context.moveTo(arr[i].cord[j].x, arr[i].cord[j].y);
          context.lineTo(arr[i].lastCord[j].lastX, arr[i].lastCord[j].lastY);
          context.stroke();

        }

      } else if (arr[i].tool === 'circle') {
        
        context.arc(arr[i].startX, arr[i].startY, arr[i].r ,0,Math.PI*2,true);
        
        if (arr[i].filled) {
          context.fill();
        } else {
          context.stroke();
        }
        
      } else if (arr[i].tool === 'line') {

          context.moveTo(arr[i].startX, arr[i].startY);
          context.lineTo(arr[i].mouseX, arr[i].mouseY);
          context.stroke();

      } else if (arr[i].tool === 'text') {
          fontsize = arr[i].fontsize;
          fontName = arr[i].fontName;
          context.font = fontsize + "px "+  fontName;

          text = arr[i].text;
          context.fillText(text, arr[i].finalX, arr[i].finalY);
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
    tempCanvas.width = tempCanvas.width;
    canvas.width = canvas.width;
    drawFomArray(shapeArr);
    setup();
    imgUpdate();
    }
  }

  function redo() {

    if (redoArr.length === 0) {

      console.log("nothing to redo");
      $("#redo").prop('disabled', true);
      $("#undo").prop('disabled', false);

    } else {

    shapeArr.push(redoArr.pop());
    tempCanvas.width = tempCanvas.width;
    canvas.width = canvas.width;
    drawFomArray(shapeArr);
    setup();
    imgUpdate();
    } 
  }

  $("#undo").click( function() {
    undo();
  });

   $("#redo").click( function() {
    redo();
  });

  function clearBoard() {
    var areYouSure = confirm("Are you sure ?");
    if (areYouSure) {
      shapeArr = [];
      redoArr = [];
      tempCanvas.width = tempCanvas.width;
      canvas.width = canvas.width;
      // context.lineWidth = $("#brush-size").val();
      setup();
    } 
  }

  $("#clearBoard").click( function () {
    clearBoard();
  });

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

  function changeColor(color) {
     $(".color").removeClass("selected");
    $("#eraser").removeClass("selected");
    $("#"+color).addClass("selected");

    $("#currColor").css("background-color",color);
    $("#currColor").html(color);
    if (color === 'black' || color === 'blue') {
      $("#currColor").css("color","white");
    } else {
      $("#currColor").css("color","black");
    }

    if (tool === 'text') {
      $("#text-box").focus();
    }

    context.strokeStyle = color;
    context.fillStyle = color;
  }

  $(".color").click( function() {
    // console.log(this.id);
   
    changeColor(this.id);
  });

  function changeTool(theTool) {
    $(".tool").removeClass("active");
    // $("#eraser").removeClass("selected");
    $("#"+theTool).addClass("active");
    tool = theTool;
    if (tool === 'rect' || tool === 'circle') {
      $("#filler").show();
    } else {
      $("#filler").hide();
    }

  }

  $(".tool").click( function() {
    // console.log(this.id);
    changeTool(this.id);
  });



  function save() {

      var stringifiedArray = JSON.stringify(shapeArr);
      var param = { 
        "user": $("#artist-name").val(), // You should use your own username!
        "name": $("#drawing-name").val(),
        "content": stringifiedArray,
        "template": true
      };
      console.log(stringifiedArray);
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "http://whiteboard.apphb.com/Home/Save",
        data: param,
        dataType: "jsonp",
        crossDomain: true,
        success: function (data) {
          // The save was successful...
          $("#save-result").html("Drawing saved...<br>Username: " + param.user);
          $("#artist-name").val("");
          $("#drawing-name").val(""),
          setTimeout(function() { 
            $("#saveBox").hide();
            $("#blackout").hide();
            $("#save-result").html("");
             }, 2500);
          console.log(data);
        },
        error: function (xhr, err) {
          // Something went wrong...
          // console.log(xhr);
          // console.log(err);
          $("#save-result").html("Someting went wrong...try again or not...");
        }
      });

  }

  $("#save").click( function() {
    $("#blackout").show();
    $("#saveBox").show();
    // save();
  });


  function load(id) {
    //515
    //http://whiteboard.apphb.com/Home/GetList
    //http://whiteboard.apphb.com/Home/GetWhiteboard

    var param = {
        "id": id
      };
      $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://whiteboard.apphb.com/Home/GetWhiteboard",
        data: param,
        dataType: "jsonp",
        crossDomain: true,
        success: function (data) {
          // The save was successful...
          
          // clearBoard();
          redoArr = [];
          canvas.width = canvas.width;
          tempCanvas.width = tempCanvas.width;

          var object = JSON.parse(data.WhiteboardContents);
          console.log(object);
          shapeArr = object;
          // console.log(shapeArr);

          drawFomArray(shapeArr);
          setup();
          imgUpdate();

        },
        error: function (xhr, err) {
          // Something went wrong...
          // console.log(xhr);
          // console.log(err);
        }
      });


  }

  $("#load").click( function() {
        // load();
      $("#blackout").show();
      $("#loadBox").show();
    });

  function getResult(user) {
     var param = {
        "user": user, // You should use your own username!
        "template": true
      };
      $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://whiteboard.apphb.com/Home/GetList",
        data: param,
        dataType: "jsonp",
        crossDomain: true,
        success: function (data) {
         
          // The save was successful...

          var resultHTML = $("#load-result");
          resultHTML.html("");
          resultHTML.html("<ul>");

          if (jQuery.isEmptyObject(data)){
            resultHTML.html("Nothing found...");
          }

          for (var i = 0; i < data.length; i++) {
            console.log(data[i]);
            var id = data[i].ID;
            var name = data[i].WhiteboardTitle;
            resultHTML.append("<li class='load-data' id=" + id + "><a href=#>" + name + "</a></li>");

          }
          resultHTML.append("</ul>");
          // $("#blackout").css("height", "800px");
          console.log(data);

          $(".load-data").click( function() {
            $("#blackout").hide();
            $("#loadBox").hide();
            load(this.id);
          });

        },
        error: function (xhr, err) {
          // Something went wrong...
          console.log(xhr);
          // console.log(err);
        }
      });
  }

  $("#search").click( function() {
    var user = $("#artist-name-load").val()
    getResult(user);
  });


  $(".cancel").click( function() {
    // console.log("wtf");
    $("#blackout").hide();
    $(".overlay-box").hide();
  });

  $("#saveOK").click(function() {
    save();
  });

  $(".change-font").on('change', function() {
    if (tool === 'text') {
      $("#text-box").focus();
    }
  });


setup();


//SpeechRecognition support!

if (annyang) {
  console.log("Listening");

  var commands = {
    'undo': function () {
      undo();
    },
    'redo':function() {
      redo();
    },
    'red':function() {
      changeColor('red');
    },
    'blue':function() {
      changeColor('blue');
    },
    'yellow':function() {
      changeColor('yellow');
    },
    'white':function() {
      changeColor('white');
    },
    'black':function() {
      changeColor('black');
    },
    'green':function() {
      changeColor('green');
    },
    'ff00ee':function() {
      console('heeee');
      changeColor('ff00ee');
    },
    '*term':function(term){
      console.log(term);
    }
    
  };

  annyang.addCommands(commands);

  annyang.start();

}
});