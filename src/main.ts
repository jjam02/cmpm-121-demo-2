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

function drawLine(line: Point[]) {
  const head: Point = line[0];
  console.log(line);
  if (line.length) {
    context.beginPath();

    context.moveTo(head.x, head.y);
    line.forEach((point) => {
      context.lineTo(point.x, point.y);
    });

    context.stroke();
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

interface Point {
  x: number;
  y: number;
}

const change = new Event("drawing-change");

const lines: Point[][] = [];
let currLine: Point[] = [];

canvas.addEventListener("mousedown", (e) => {
  setCursorState(true);
  setCursorPos(cursor, e);
  currLine.length = 0;
  lines.push(currLine);
  currLine.push({ x: cursor.x, y: cursor.y });
  canvas.dispatchEvent(change);
});

canvas.addEventListener("mousemove", (e) => {
  if (cursor.active && context) {
    setCursorPos(cursor, e);
    currLine.push({ x: cursor.x, y: cursor.y });
    canvas.dispatchEvent(change);
  }
});

canvas.addEventListener("mouseup", () => {
  cursor.active = false;
  currLine = [];

  canvas.dispatchEvent(change);
});

canvas.addEventListener("mouseleave", () => {
  setCursorState(false);
  currLine = [];
  canvas.dispatchEvent(change);
});

canvas.addEventListener("drawing-change", () => {
  clearCanvas();
  lines.forEach((line) => drawLine(line));
});

const clear = document.createElement("button");
clear.textContent = "clear";
clear.addEventListener("click", () => {
  lines.length = 0;
  console.log(lines);
  clearCanvas();
});
container.append(clear);
