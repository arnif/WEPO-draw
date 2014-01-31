$(document).ready( function() {

  var canvas, context, tool = 'pencil', tempCanvas, tempContext, cColor;

  var mousedown = false;
  var mouse = {startX:0, startY:0, x:0, y:0, prevMouseX:0, prevMouseY:0, finalX:0, finalY:0}

  var w = 0;
  var h = 0;
  var r = 0;
  var text;
  var filled = false;
  var move = false;
  var redoArr = [];
  var fontsize;
  var fontName;

  var tempShape;
  var sID;
  var shapeArr = [];

  function shape() {

    this.lineWidth = context.lineWidth;
    this.lineCap = context.lineCap;
    this.lineJoin = context.lineJoin;
    this.strokeStyle = context.strokeStyle;
    this.filleStyle = context.fillStyle;
    this.tool = tool;
    this.startX = mouse.startX;
    this.startY = mouse.startY;
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
    // this.display = true;

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

  //uhhh nice try
  canvas.addEventListener("touchstart", onmousedown, false);
  canvas.addEventListener("touchmove", onmousemove, true);
  canvas.addEventListener("touchend", onmouseup, false);

  function setup() {

    cColor = $(".selected").attr('id');
    tool = tool; 
    context.lineWidth = $("#brush-size").val();
    context.lineCap = 'round';
    context.strokeStyle = cColor;
    context.fillStyle = cColor;
    context.lineJoin = 'round';
    canvas.style.cursor = 'crosshair';
    context.font = fontsize + "px " + fontName;


  }

  function imgUpdate() {
    tempContext.drawImage(canvas, 0, 0);
    context.clearRect(0,0, canvas.width, canvas.height);
  }

  function onmousedown(ev) {
    mousedown = true;
    mouse.startX = ev.pageX - this.offsetLeft;
    mouse.startY = ev.pageY - this.offsetTop;

    redoArr = [];
    $("#redo").prop('disabled', true);
    if (tool === 'text') {

        // console.log(fontsize);
        $("#text-box").show();


        fontName = $("#font-selector").val();
        fontsize = $("#font-size").val();

        $("#text-box").css("top", mouse.y - fontsize);
        $("#text-box").css("left", mouse.x);
        $("#text-box").css('font-family',fontName);
        $("#text-box").css('color', "#" + cColor);
        $("#text-box").css('font-size', fontsize + "px");
        $("#text-box").css('height', fontsize *2 + "px");

        $("#text-box").focus();
      } else if (tool != 'select') {
    //bua til nytt shape object
    tempShape = new shape();

  } else if (tool === 'select') {

    var moveThisShape = hitTest(mouse.startX, mouse.startY);

    if (!jQuery.isEmptyObject(moveThisShape)) {
      move = true;

    } 
  }
}


function onmouseup(ev) {

  mousedown = false;
  move = false;

  if (tool === 'text') {
    mouse.finalX = ev.pageX - this.offsetLeft;
    mouse.finalY = ev.pageY - this.offsetLeft;
    $("#text-box").focus();

  }  else if (tool != 'select'){
    tempShape.finalX = ev.pageX - this.offsetLeft;
    tempShape.finalY = ev.pageY - this.offsetTop;
      //setja shape objectid i array
      shapeArr.push(tempShape);

    } else if (tool === 'select') {

      tempCanvas.width = tempCanvas.width;
      canvas.width = canvas.width;

      drawFomArray(shapeArr);

    }
    // console.log(shapeArr);
    setup();
    imgUpdate();
    
  }

  function onmousemove(ev) {

    mouse.prevMouseX = mouse.x;
    mouse.prevMouseY = mouse.y;
    var x = mouse.x = ev.pageX - this.offsetLeft;
    var y = mouse.y = ev.pageY - this.offsetTop;
    
    if (mousedown) {

      if (!move) {
        $("#undo").prop('disabled', false);
        filled = $("#filled").is(':checked');

        if(tool === 'rect') {

          w = (ev.pageX - this.offsetLeft) - mouse.startX;
          h = (ev.pageY - this.offsetTop) - mouse.startY ;
          context.clearRect(0,0,canvas.width,canvas.height);
          if (filled) {
            context.fillRect(mouse.startX, mouse.startY, w, h);
          } else {
            context.strokeRect(mouse.startX, mouse.startY, w, h);
          }

          tempShape = new shape();

        } else if (tool === 'pencil') {

          context.beginPath();
          context.moveTo(mouse.prevMouseX, mouse.prevMouseY);
          context.lineTo(x, y);
          context.stroke();
          context.closePath();
          tempShape.cord.push({"x": x, "y":y});
          tempShape.lastCord.push({"lastX": mouse.prevMouseX, "lastY": mouse.prevMouseY});


        } else if (tool === 'circle') {

          var cx = (ev.pageX - this.offsetLeft) - mouse.startX;
          var cy = (ev.pageY - this.offsetTop) - mouse.startY;
          r = Math.abs(cy + cx);
          context.clearRect(0,0,canvas.width,canvas.height);
          context.beginPath();
          context.arc(mouse.startX, mouse.startY, r ,0,Math.PI*2,true);

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
          context.moveTo(mouse.startX, mouse.startY);
          context.lineTo(x, y);
          context.stroke();

          tempShape = new shape();

        } else if (tool === 'text') {

          $("#text-box").show();
          $("#text-box").css("top", mouse.y - fontsize);
          $("#text-box").css("left", mouse.x);
          $("#text-box").focus();

        }

      } else {
      //move objects

      var dx = mouse.x - mouse.prevMouseX;
      var dy = mouse.y - mouse.prevMouseY;

        shapeArr[sID].startX += dx;
        shapeArr[sID].startY += dy;
        shapeArr[sID].mouseX += dx;
        shapeArr[sID].mouseY += dy;
        shapeArr[sID].finalX += dx;
        shapeArr[sID].finalY += dy;

      context.lineWidth = shapeArr[sID].lineWidth;
      context.strokeStyle = shapeArr[sID].strokeStyle;
      context.fillStyle = shapeArr[sID].strokeStyle;

      if (shapeArr[sID].tool === 'pencil') {

        context.clearRect(0,0,canvas.width,canvas.height);

        for (var i = 0; i < shapeArr[sID].cord.length; i++) {

          context.beginPath();
          shapeArr[sID].lastCord[i].lastX += dx;
          shapeArr[sID].lastCord[i].lastY += dy;
          shapeArr[sID].cord[i].x += dx; 
          shapeArr[sID].cord[i].y += dy;
          context.moveTo(shapeArr[sID].lastCord[i].lastX, shapeArr[sID].lastCord[i].lastY);
          context.lineTo(shapeArr[sID].cord[i].x, shapeArr[sID].cord[i].y);
          context.stroke();
          context.closePath();

        }

      } else if (shapeArr[sID].tool === 'rect') {
        // console.log("MOVEIT");

        context.clearRect(0,0,canvas.width,canvas.height);
        if (shapeArr[sID].filled) {
          context.fillRect(shapeArr[sID].startX, shapeArr[sID].startY, shapeArr[sID].w, shapeArr[sID].h);
        } else {
          context.strokeRect(shapeArr[sID].startX, shapeArr[sID].startY, shapeArr[sID].w, shapeArr[sID].h);
        }

      } else if (shapeArr[sID].tool === 'circle') {
        // console.log("MOVE CIRCL");

        context.clearRect(0,0,canvas.width,canvas.height);
        context.beginPath();
        context.arc(shapeArr[sID].startX, shapeArr[sID].startY, shapeArr[sID].r ,0,Math.PI*2,true);

        if (shapeArr[sID].filled) {
          context.fill();
        } else {
          context.stroke();
        }
        context.closePath();

      } else if (shapeArr[sID].tool === 'line') {
        // console.log("MOVE LINE");


        context.clearRect(0,0,canvas.width,canvas.height);
        context.beginPath();
        context.moveTo(shapeArr[sID].startX, shapeArr[sID].startY);
        context.lineTo(shapeArr[sID].mouseX, shapeArr[sID].mouseY);
        context.stroke();
        context.closePath();

      } else if (shapeArr[sID].tool === 'text') {
        console.log("MOVE TEXT");
        fontsize = shapeArr[sID].fontsize;
        fontName = shapeArr[sID].fontName;
        context.font = fontsize + "px "+  fontName;

        text = shapeArr[sID].text;
        context.clearRect(0,0,canvas.width,canvas.height);
        context.beginPath();
        context.fillText(text, shapeArr[sID].finalX, shapeArr[sID].finalY);
        context.closePath();

      }
    }
  }
}

function hitTest(startX, startY) {
  console.log("x:  " + startX + "  y:" + startY);

  for (var i = shapeArr.length -1; i >= 0; i--){ 
      // console.log(shapeArr[i]);
      if (shapeArr[i].tool === 'pencil') {

        for (var j = 0; j < shapeArr[i].cord.length; j++){
          // console.log(startY + shapeArr[i].lineWidth);
          if (startX + shapeArr[i].lineWidth >= shapeArr[i].cord[j].x 
            && startX - shapeArr[i].lineWidth <= shapeArr[i].cord[j].x
            && startY + shapeArr[i].lineWidth >= shapeArr[i].cord[j].y 
            && startY - shapeArr[i].lineWidth <= shapeArr[i].cord[j].y) {
            console.log('HIT a pencil');
          // console.log(i);
          sID = i;
          return shapeArr[sID];

        }
      }

    } else if (shapeArr[i].tool === 'rect') {
        //some calculations to find out if mouse is on rect
        // console.log(shapeArr[i].startX);
        if ((startX + shapeArr[i].lineWidth >= shapeArr[i].startX && startX + shapeArr[i].lineWidth  <= shapeArr[i].finalX
          && startY + shapeArr[i].lineWidth  >= shapeArr[i].startY && startY - shapeArr[i].lineWidth  <= shapeArr[i].finalY)
          || (startX + shapeArr[i].lineWidth  <= shapeArr[i].startX && startX + shapeArr[i].lineWidth  >= shapeArr[i].finalX
            && startY + shapeArr[i].lineWidth  >= shapeArr[i].startY && startY - shapeArr[i].lineWidth  <= shapeArr[i].finalY)){
          console.log('HIT a rect'); //need fixx!!
        console.log(shapeArr[i]);
        sID = i;
        return shapeArr[sID];

      } else if (startX + shapeArr[i].lineWidth <= shapeArr[i].finalX && startX + shapeArr[i].lineWidth  >= shapeArr[i].startX
        && startY + shapeArr[i].lineWidth >= shapeArr[i].finalY && startY - shapeArr[i].lineWidth  <= shapeArr[i].startY
        || startX + shapeArr[i].lineWidth >= shapeArr[i].finalX && startX + shapeArr[i].lineWidth  <= shapeArr[i].startX
        && startY + shapeArr[i].lineWidth >= shapeArr[i].finalY && startY - shapeArr[i].lineWidth  <= shapeArr[i].startY) {
        console.log('HIT a rect'); 
        console.log(shapeArr[i]);
        sID = i;
        return shapeArr[sID];
      }

    } else if (shapeArr[i].tool === 'circle') {
        //find if its circle
        if ((startX - shapeArr[i].startX) * (startX - shapeArr[i].startX) 
          + (startY - shapeArr[i].startY) * (startY - shapeArr[i].startY) + shapeArr[i].lineWidth 
          < shapeArr[i].r * shapeArr[i].r) {
          console.log("hit circl");
        sID = i;
        return shapeArr[sID];
      }

    } else if (shapeArr[i].tool === 'line') {
        //more calculations
        var hallatala = ((shapeArr[i].mouseY - shapeArr[i].startY) /  (shapeArr[i].mouseX - shapeArr[i].startX));
        var correctQ = (shapeArr[i].mouseY - (hallatala * shapeArr[i].mouseX));
          // console.log("hallatala " + hallatala);
          // console.log("Q " + correctQ);

          var callculateQ = (startY - (hallatala * startX));
          // console.log("callculate Q " +callculateQ);
          // console.log(shapeArr[i]);
          if ((startX + shapeArr[i].lineWidth >= shapeArr[i].startX && startX + shapeArr[i].lineWidth  <= shapeArr[i].finalX
            && startY + shapeArr[i].lineWidth  >= shapeArr[i].startY && startY - shapeArr[i].lineWidth  <= shapeArr[i].finalY)
            || (startX + shapeArr[i].lineWidth  <= shapeArr[i].startX && startX + shapeArr[i].lineWidth  >= shapeArr[i].finalX
              && startY + shapeArr[i].lineWidth  >= shapeArr[i].startY && startY - shapeArr[i].lineWidth  <= shapeArr[i].finalY)){
            // console.log("inni kassanum");
            if (correctQ + shapeArr[i].lineWidth  >= callculateQ && correctQ  <= callculateQ + shapeArr[i].lineWidth ) {
              // console.log("hit a line based on Q upp");
              sID = i;
              return shapeArr[sID];

            } else if (hallatala == Number.POSITIVE_INFINITY || hallatala === Number.NEGATIVE_INFINITY ) {
                // console.log("To infinity and beyond");
                sID = i;
                return shapeArr[sID];
            }

          } else if (startX <= shapeArr[i].finalX && startX >= shapeArr[i].startX
            && startY >= shapeArr[i].finalY && startY <= shapeArr[i].startY
            || startX >= shapeArr[i].finalX && startX <= shapeArr[i].startX
            && startY >= shapeArr[i].finalY && startY <= shapeArr[i].startY) {
             // console.log("inni kassanum");
            if (correctQ + shapeArr[i].lineWidth  >= callculateQ && correctQ  <= callculateQ + shapeArr[i].lineWidth ) {
              // console.log("hit a line based on Q down");
              sID = i;
              return shapeArr[sID];
            }  else if (hallatala == Number.POSITIVE_INFINITY || hallatala === Number.NEGATIVE_INFINITY ) {
                // console.log("To infinity and beyond");
                sID = i;
                return shapeArr[sID];
            }
          } 

        } else if (shapeArr[i].tool === 'text') {
        //major calculations
        console.log(shapeArr[i]);
        var textUpperY = shapeArr[i].finalY - parseInt(shapeArr[i].fontsize /1.5);

        var metrics = context.measureText(shapeArr[i].text);
        var width = metrics.width;
        
        if (startY <= shapeArr[i].finalY && startY >= textUpperY
          && startX >= shapeArr[i].finalX && startX <= shapeArr[i].finalX + width) {
          // console.log("hit text");
          sID = i;
          return shapeArr[sID];
        }
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

    } else if (e.keyCode === 27) {

      $("#text-box").val("");
      $("#text-box").hide();
    }
  });

  function drawFomArray(arr) { 
    // console.log(arr);

    for (var i = 0; i < arr.length; i++) {

      context.beginPath();
      context.lineJoin = arr[i].lineJoin;
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

  function changeColor(color) {
    $(".colors").hide();
    $(".color").removeClass("selected");
    $("#"+color).addClass("selected");
    $("#currentColor").css("background-color","#" + color);

    if (tool === 'text') {
      $("#text-box").focus();
    }

    cColor = color;
    context.strokeStyle = color;
    context.fillStyle = color;
  }

  $(".color").click( function() {
    changeColor(this.id);
  });

  function changeTool(theTool) {
    $(".tool").removeClass("active");
    $("#"+theTool).addClass("active");
    tool = theTool;
    if (tool === 'rect' || tool === 'circle') {
      $("#filler").show();
    } else {
      $("#filler").hide();
    }

    if (tool === 'text') {
      $("#text-selector").show();
    } else {
      $("#text-selector").hide();
    }
  }

  $(".tool").click( function() {
    changeTool(this.id);
  });



  function save() {

    var stringifiedArray = JSON.stringify(shapeArr);
    var param = { 
      "user": $("#artist-name").val(), 
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
          $("#save-result").show();
          $("#save-result").append("<p>Drawing saved...<br>Username: <b>" + param.user + "</b><br>Name: <b>" + param.name +"</b></p><button class='cancel save-btn btn btn-lg btn-primary'>Ok</button>");
          $("#artist-name").val("");
          $("#drawing-name").val("");

          $(".cancel, #blackout").click( function() {
            hideBlack();
         });


        },
        error: function (xhr, err) {
          $("#save-result").html("Someting went wrong...try again or not...");
        }
      });

  }

  $("#save").click( function() {
    $("#blackout").show();
    $("#saveBox").show();
  });


  function load(id) {

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
          redoArr = [];
          canvas.width = canvas.width;
          tempCanvas.width = tempCanvas.width;

          var object = JSON.parse(data.WhiteboardContents);
          console.log(object);
          shapeArr = object;
          drawFomArray(shapeArr);
          setup();
          imgUpdate();

        },
        error: function (xhr, err) {
          // Something went wrong...

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
    "user": user, 
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
          // console.log(data);

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

function hideBlack() {
    $("#save-result").html("");
  $("#save-result").hide();
  $("#blackout").hide();
  $(".overlay-box").hide();
}

$(".cancel, #blackout").click( function() {
  hideBlack();
});

$("#saveOK").click(function() {
  save();
});

$(".change-font").on('change', function() {
  if (tool === 'text') {
    $("#text-box").focus();
    fontName = $("#font-selector").val();
    fontsize = $("#font-size").val();
    console.log(fontName);
    console.log(fontsize);
    $("#text-box").css('font-family',fontName);
    $("#text-box").css('color', "#" + cColor);
    $("#text-box").css('font-size', fontsize + "px");
    $("#text-box").css('height', fontsize *2 + "px");
  }
});

$("#currentColor").mouseenter( function() { 
  $(".colors").show(); 
});

$(window).click(function() {
  $(".colors").hide(); 
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
    '*term':function(term){
      console.log(term);
    }

  };

  annyang.addCommands(commands);

  annyang.start();

}

});