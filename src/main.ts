import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Jonathan Paint";
const canWidth = 256;
const canHeight = 256;

const container = document.createElement("container");
container.id = "Mycontainer";
app.append(container);

document.title = gameName;

const canvas = document.createElement("canvas");
canvas.width = canWidth;
canvas.height = canHeight;
canvas.id = "draw";
app.prepend(canvas);
const context = canvas.getContext("2d")!;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.prepend(header);

context.fillStyle = "white";

function clearCanvas() {
  context.fillRect(0, 0, canWidth, canHeight);
}

function draw(
  e: MouseEvent,
  cursor: { active: boolean; x: number; y: number }
) {
  if (cursor.active) {
    context.beginPath();
    context.moveTo(cursor.x, cursor.y);
    context.lineTo(e.offsetX, e.offsetY);
    context.stroke();
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
  }
}

function setCursorState(active: boolean) {
  cursor.active = active;
}

function setCursorPos(
  cursor: { active: boolean; x: number; y: number },
  e: MouseEvent
) {
  cursor.x = e.offsetX;
  cursor.y = e.offsetY;
}

clearCanvas();

const cursor = { active: false, x: 0, y: 0 };

canvas.addEventListener("mousedown", (e) => {
  setCursorState(true);
  setCursorPos(cursor, e);
  context.beginPath();
});

canvas.addEventListener("mousemove", (e) => {
  if (cursor.active && context) {
    draw(e, cursor);
  }
});

canvas.addEventListener("mouseup", () => {
  cursor.active = false;
});

canvas.addEventListener("mouseleave", () => {
  console.log("enter canvas");
  setCursorState(false);
  context.beginPath();
});

const clear = document.createElement("button");
clear.textContent = "clear";
clear.addEventListener("click", clearCanvas);
container.append(clear);
