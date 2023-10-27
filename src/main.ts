import "./style.css";

//--------------------HTML--------------------------------------------------------------------------------\
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
const ctx = canvas.getContext("2d")!;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.prepend(header);

ctx.fillStyle = "white";

const clear = document.createElement("button");
clear.textContent = "clear";

const redo = document.createElement("button");
redo.textContent = "redo";

const undo = document.createElement("button");
undo.textContent = "undo";

const standard = document.createElement("button");
standard.classList.add("selected");
standard.textContent = "standard";

const thick = document.createElement("button");
thick.textContent = "thick";

const thin = document.createElement("button");
thin.textContent = "thin";

container.append(clear, redo, undo, standard, thick, thin);

//--------------------------------------------------------------------------------------------------------

//----------------------------CLASS DEFINITIONS----------------------------------------------

class LineCommand {
  points: { x: number; y: number }[];
  thickness: number;
  constructor(x: number, y: number, thick: number) {
    this.points = [{ x, y }];
    this.thickness = thick;
  }
  display(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = this.thickness;
    ctx.strokeStyle = "black";
    const head: Point = this.points[0];

    console.log("now youre drawing ");
    ctx.beginPath();

    ctx.moveTo(head.x, head.y);
    this.points.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });

    ctx.stroke();
  }
  drag(x: number, y: number) {
    this.points.push({ x, y });
  }
}

//--------------------------------------------------------------------------------------------------------

//-------------------helper functions-------------------------------------------------------------------
function clearCanvas() {
  ctx.fillRect(0, 0, canWidth, canHeight);
}

function isEmpty<T>(arr: T[]): boolean {
  return arr.length <= 0;
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

//-------------------------------------------------------------------------------------

//---------------------------data---------------------------------

const cursor = { active: false, x: 0, y: 0 };

interface Point {
  x: number;
  y: number;
}
const standardLine = 2;
const thickLine = 5;
const thinLine = 0.5;
let lineWidth: number = standardLine;

const change = new Event("drawing-change");

const lines: LineCommand[] = [];
const redoLines: LineCommand[] = [];
//----------------------------------------------------------------

//-----------------EVENT HANDLING------------------------

canvas.addEventListener("mousedown", (e) => {
  setCursorState(true);
  setCursorPos(cursor, e);

  lines.push(new LineCommand(cursor.x, cursor.y, lineWidth));
});

canvas.addEventListener("mousemove", (e) => {
  if (cursor.active && ctx) {
    setCursorPos(cursor, e);
    lines[lines.length - 1].drag(cursor.x, cursor.y);
    lines[lines.length - 1].display(ctx);
    redoLines.length = 0;
  }
});

canvas.addEventListener("mouseup", () => {
  cursor.active = false;

  canvas.dispatchEvent(change);
});

canvas.addEventListener("drawing-change", () => {
  clearCanvas();
  lines.forEach((line) => line.display(ctx));
});

clear.addEventListener("click", () => {
  lines.length = 0;
  redoLines.length = 0;

  clearCanvas();
});

redo.addEventListener("click", () => {
  if (!isEmpty(redoLines)) {
    lines.push(redoLines.pop()!);
    canvas.dispatchEvent(change);
  }
});

undo.addEventListener("click", () => {
  if (!isEmpty(lines)) {
    redoLines.push(lines.pop()!);
    canvas.dispatchEvent(change);
  }
});

standard.addEventListener("click", () => {
  standard.classList.add("selected");
  thin.classList.remove("selected");
  thick.classList.remove("selected");
  lineWidth = standardLine;
});

thick.addEventListener("click", () => {
  thick.classList.add("selected");
  standard.classList.remove("selected");
  thin.classList.remove("selected");
  lineWidth = thickLine;
});

thin.addEventListener("click", () => {
  thin.classList.add("selected");
  standard.classList.remove("selected");
  thick.classList.remove("selected");
  lineWidth = thinLine;
});

//-------------------------------------------------------------------------------------
