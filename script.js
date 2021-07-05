const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let tool = "brush";
let size = 5;
let mousePressed = false;
ctx.lineJoin = "round";
ctx.lineCap = "round";
let x, y;
let existingLines = [];

const brush = document.getElementById("brush");
const line = document.getElementById("line");
const eraser = document.getElementById("eraser");
const rectangle = document.getElementById("rectangle");
const bg = document.getElementById("bg");
const clear = document.getElementById("clear");
const save = document.getElementById("save");

canvas.addEventListener("mousedown", brushDown);
canvas.addEventListener("mousemove", brushMove);
canvas.addEventListener("mouseup", brushUp);

// ----- Pencil and toolbox Menu -----
const items = document.querySelectorAll(".items");
const brush_menu = document.getElementById("brush-menu");
const bg_menu = document.getElementById("bg-menu");
const eraser_menu = document.getElementById("eraser-menu");
// eraser - options - active;

items.forEach((item, idx) => {
  item.addEventListener("click", () => {
    items.forEach((item) => item.classList.remove("active"));
    if (items[idx].classList.contains("pencil")) {
      brush.classList.add("active");

      //remove other pop up
      bg_menu.classList.remove("bg-option-active");
      eraser_menu.classList.remove("eraser-options-active");

      brush_menu.classList.add("pencil-active");
    } else if (items[idx].classList.contains("bg")) {
      bg.classList.add("active");

      //remove other pop up
      brush_menu.classList.remove("pencil-active");
      eraser_menu.classList.remove("eraser-options-active");

      bg_menu.classList.add("bg-option-active");
    } else if (items[idx].classList.contains("eraser")) {
      eraser.classList.add("active");

      // remove other pop up
      brush_menu.classList.remove("pencil-active");
      bg_menu.classList.remove("bg-option-active");

      eraser_menu.classList.add("eraser-options-active");
    } else {
      items[idx].classList.add("active");
      brush_menu.classList.remove("pencil-active");
      bg_menu.classList.remove("bg-option-active");
      eraser_menu.classList.remove("eraser-options-active");
    }
  });
});

const optionItems = document.querySelectorAll(".options-items");

optionItems.forEach((item, idx) => {
  item.addEventListener("click", () => {
    optionItems.forEach((option) => option.classList.remove("selected"));
    optionItems[idx].classList.add("selected");
  });
});

const sizeOptionItems = document.querySelectorAll(".size-options-items");

sizeOptionItems.forEach((item, idx) => {
  item.addEventListener("click", () => {
    sizeOptionItems.forEach((option) => option.classList.remove("selected"));
    sizeOptionItems[idx].classList.add("selected");
  });
});

// ----- color + size change -----

const options = document.querySelectorAll(".options-items div");

options.forEach((option) => {
  option.addEventListener("click", () => {
    let color = option.className;
    colorChange(color);
  });
});

const bgOptions = document.querySelectorAll(".bg-options-items div");

bgOptions.forEach((option) => {
  option.addEventListener("click", () => {
    console.log("working");
    let bgColor = option.className;
    canvas.style.background = bgColor;
  });
});

const sizeOptions = document.querySelectorAll(".size-options-items div");

sizeOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.classList.contains("marker")) {
      size = 15;
      sizeChange(size);
    } else if (option.classList.contains("mid")) {
      size = 8;
      sizeChange(size);
    } else if (option.classList.contains("normal")) {
      size = 5;
      sizeChange(size);
    }
    console.log(ctx.lineWidth);
  });
});

let restoreArray = [];
let restoreIndex = -1;

function colorChange(color) {
  myColor = color;
  ctx.strokeStyle = myColor;
}

function sizeChange(mySize) {
  // mySize = size;
  ctx.lineWidth = size;
}

// ----- coordinates -----

function getCoordinates(canvas, e) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

// ----- draw functions -----

function drawBrush(canvas, x, y) {
  if (mousePressed) {
    ctx.globalCompositeOperation = "source-over";
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function drawLine(x, y) {
  if (mousePressed) {
    ctx.globalCompositeOperation = "source-over";
    ctx.moveTo(x, y);
    ctx.stroke();
  }
}

// ----- brush function - down - move - up -----

function brushDown(e) {
  mousePressed = true;
  let coordinates = getCoordinates(canvas, e);
  let x0 = coordinates.x;
  let y0 = coordinates.y;
  ctx.lineWidth = size;
  ctx.beginPath();

  if (tool === "brush") {
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0, y0);
    ctx.stroke();
  } else if (tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.moveTo(x0, y0);
    ctx.stroke();
    ctx.fill();
  } else if (tool === "line") {
    existingLines = [
      {
        startX: x0,
        startY: y0,
      },
    ];
    drawLine(x0, y0);
  }
  // else if (tool === "circle") {
  //   // ctx.arc(x0, y0, size, 0, Math.PI * 2);
  //   // ctx.stroke;
  // }
}

function brushMove(e) {
  let coordinates = getCoordinates(canvas, e);
  let x1 = coordinates.x;
  let y1 = coordinates.y;

  existingLines.push({
    lastX: x1,
    lastY: y1,
  });

  // sizeChange(size);

  if (tool === "brush") {
    drawBrush(canvas, x1, y1);
  } else if (tool === "eraser" && mousePressed) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineWidth = size * 2;
    ctx.lineTo(x1, y1);
    ctx.stroke();
  } else if (tool === "line" && mousePressed) {
    // clearCanvas();
    let prevX = existingLines[1].lastX;
    let prevY = existingLines[1].lastY;

    // ctx.moveTo(prevX, prevY);
    // ctx.lineTo(x1, y1);
    // console.log("working2");
    ctx.stroke();
  }
  // else if (tool === "circle") {
  //   ctx.arc(x1, y1, 8, 0, Math.PI * 2);
  //   ctx.stroke;
  // }
}

function brushUp(e) {
  stop = getCoordinates(canvas, e);
  stopX = stop.x;
  stopY = stop.y;
  mousePressed = false;

  if (tool === "line") {
    ctx.lineTo(stopX, stopY);
    ctx.stroke();
  }
  if (!mousePressed) {
    restoreArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    restoreIndex++;
  }
}

// ----- click handler functions -----

function brushClick() {
  tool = "brush";
  // colorChange();
  // sizeChange(size);

  canvas.addEventListener("mousedown", brushDown);
  canvas.addEventListener("mousemove", brushMove);
  canvas.addEventListener("mouseup", brushUp);
}

function eraserClick() {
  tool = "eraser";
  // ctx.strokeStyle = "#16161a";
  // sizeChange(size * 3);

  canvas.addEventListener("mousedown", brushDown);
  canvas.addEventListener("mousemove", brushMove);
  canvas.addEventListener("mouseup", brushUp);
}

function lineClick() {
  tool = "line";

  canvas.addEventListener("mousedown", brushDown);
  canvas.addEventListener("mousemove", brushMove);
  canvas.addEventListener("mouseup", brushUp);
}

function circleClick() {
  tool = "circle";

  canvas.addEventListener("mousedown", brushDown);
  canvas.addEventListener("mousemove", brushMove);
  canvas.addEventListener("mouseup", brushUp);
}

brush.addEventListener("click", brushClick);
eraser.addEventListener("click", eraserClick);
line.addEventListener("click", lineClick);
// circle.addEventListener("click", circleClick);

// ----- undo functioning -----

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "z") {
    console.log("ctrl + z");
    undo();
  }
});

function undo() {
  if (restoreIndex <= 0) {
    clearCanvas();
  } else {
    restoreIndex -= 1;
    restoreArray.pop();
    ctx.putImageData(restoreArray[restoreIndex], 0, 0);
  }
}

// ----- clear screen function -----
clear.addEventListener("click", clearCanvas);

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  restoreIndex = -1;
  restoreArray = [];
}

// ----- Save Button function -----
save.addEventListener("click", function () {
  let imageName = prompt("Please enter image name");
  let canvasDataURL = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = canvasDataURL;
  a.download = imageName || none;
  a.click();
});

// ----- window resize function -----
resize();
function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}
