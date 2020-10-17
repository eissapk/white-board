//* Register the Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/white-board/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err));
  });
}

let painting = false;
let eraserToggle = true;
let penWidth = 3;
let penColor = "#000000";
let lastWidth;
let lastColor;
// select inputs
const colorInput = document.getElementById("colorInput");
const sizeInput = document.getElementById("sizeInput");
const btn = document.querySelector("button");
const svg = document.querySelector("svg");
// select canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// set canvas width
const setSize = () => {
  canvas.width = window.innerWidth - 15;
  canvas.height = window.innerHeight - 60;
};

// eraser tool
const eraser = e => {
  if (e.target.classList.contains("clickEraser")) {
    // active
    if (eraserToggle) {
      // store last settings
      lastWidth = penWidth;
      lastColor = penColor;
      // add active class
      svg.classList.add("activeEraser");
      // set eraser props
      penWidth = 50;
      penColor = "#ffffff";
      // die
      eraserToggle = false;
    } else {
      // remove active class
      svg.classList.remove("activeEraser");
      // restore last settings
      penWidth = lastWidth;
      penColor = lastColor;
      // die
      eraserToggle = true;
    }
  }
};

// mouse position
const mousePos = e => {
  let status = e.type == "mousedown" ? true : false;
  if (status) {
    // mouse down
    painting = true;
    draw_via_mouse(e);
  } else {
    // mouse up
    painting = false;
    ctx.beginPath();
  }
};

// draw via mouse
const draw_via_mouse = e => {
  // prevent default behavior
  e.preventDefault();

  // !start getting cursor pos
  e = e || window.event;
  let a = e.target.getBoundingClientRect();
  let x = e.pageX - a.left;
  let y = e.pageY - a.top;
  // !end getting cursor pos
  if (!painting) return;

  ctx.lineWidth = penWidth;
  ctx.lineCap = "round";
  ctx.strokeStyle = penColor;
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
};

// touch position
const touchPos = e => {
  let status = e.type == "touchstart" ? true : false;
  if (status) {
    // touch start
    painting = true;
    draw_via_touch(e);
  } else {
    // touch end
    painting = false;
    ctx.beginPath();
  }
};

// draw via touch
const draw_via_touch = e => {
  // prevent default behavior
  e.preventDefault();

  // !start getting cursor pos
  e = e || window.event;
  let a = e.target.getBoundingClientRect();
  let x = e.touches[0].pageX - a.left;
  let y = e.touches[0].pageY - a.top;
  // !end getting cursor pos
  if (!painting) return;

  ctx.lineWidth = penWidth;
  ctx.lineCap = "round";
  ctx.strokeStyle = penColor;
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
};

//! events
//* canvas size
window.addEventListener("DOMContentLoaded", setSize);
window.addEventListener("resize", setSize);

//* drawing
// desktop
canvas.addEventListener("mousedown", mousePos);
canvas.addEventListener("mouseup", mousePos);
// touch
canvas.addEventListener("touchstart", touchPos);
canvas.addEventListener("touchend", touchPos);
// draw
canvas.addEventListener("touchmove", draw_via_touch); // touch
canvas.addEventListener("mousemove", draw_via_mouse); // desktop

// stop painting if cursor out of the board
canvas.addEventListener("mouseleave", () => {
  painting = false;
  ctx.beginPath();
  console.log("Out Board");
});

//* settings
// size
sizeInput.addEventListener("input", e => {
  //! disable eraser
  if (!eraserToggle) btn.click();

  if (+e.target.value > 0 && +e.target.value <= 10) penWidth = +e.target.value;
  else if (+e.target.value <= 0) penWidth = 1;
  else if (+e.target.value >= 10) penWidth = 10;
});
// color
colorInput.addEventListener("change", e => {
  //! disable eraser
  if (!eraserToggle) btn.click();

  penColor = e.target.value;
});
// eraser
btn.addEventListener("click", eraser);

// blur settings if user draw
["click", "touchstart"].forEach(event => canvas.addEventListener(event, () => sizeInput.blur()));
