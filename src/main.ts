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
interface Point {
  x: number;
  y: number;
}
class LineCommand {
  points: Point[];
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

class ToolCommnad {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  display(ctx: CanvasRenderingContext2D) {
    console.log("drawing tool");
    const fillStyle = ctx.fillStyle;
    switch (lineWidth) {
      case standardLine:
        ctx.fillStyle = "black";
        console.log("CASE 143 I LOVE YOU");
        ctx.font = "24px monospace";
        ctx.fillText(".", this.x - 8, this.y + 3);
        ctx.fillStyle = fillStyle;
        break;
      case thinLine:
        ctx.fillStyle = "black";
        ctx.font = "8px monospace";
        ctx.fillText(".", this.x - 2, this.y + 2.5);
        ctx.fillStyle = fillStyle;
        break;
      case thickLine:
        ctx.fillStyle = "black";
        ctx.font = "64px monospace";
        ctx.fillText(".", this.x - 20, this.y + 10);
        ctx.fillStyle = fillStyle;
        break;
    }
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

function redraw() {
  clearCanvas();
  lines.forEach((line) => line.display(ctx));
  if (tool) {
    tool.display(ctx);
  }
}

clearCanvas();

//-------------------------------------------------------------------------------------

//---------------------------data---------------------------------

const cursor = { active: false, x: 0, y: 0 };
let tool: ToolCommnad | null = null;

const standardLine = 2;
const thickLine = 5;
const thinLine = 0.5;
let lineWidth: number = standardLine;

const change = new Event("drawing-change");
const toolChange = new Event("tool-move");

const lines: LineCommand[] = [];
const redoLines: LineCommand[] = [];
//----------------------------------------------------------------

//-----------------EVENT HANDLING------------------------

canvas.addEventListener("mouseout", () => {
  tool = null;
});

canvas.addEventListener("mouseenter", (e) => {
  setCursorPos(cursor, e);

  tool = new ToolCommnad(cursor.x, cursor.y);
});

canvas.addEventListener("mousedown", (e) => {
  setCursorState(true);
  setCursorPos(cursor, e);
  tool = null;

  lines.push(new LineCommand(cursor.x, cursor.y, lineWidth));
  canvas.dispatchEvent(change);
});

canvas.addEventListener("mousemove", (e) => {
  setCursorPos(cursor, e);
  if (cursor.active && ctx) {
    tool = null;
    lines[lines.length - 1].drag(cursor.x, cursor.y);
    lines[lines.length - 1].display(ctx);
    redoLines.length = 0;
    tool = null;
  } else {
    tool = new ToolCommnad(cursor.x, cursor.y);
    canvas.dispatchEvent(toolChange);
  }
});

canvas.addEventListener("mouseup", (e) => {
  cursor.active = false;
  setCursorPos(cursor, e);
  tool = new ToolCommnad(cursor.x, cursor.y);

  canvas.dispatchEvent(change);
});

canvas.addEventListener("drawing-change", () => {
  redraw();
});

canvas.addEventListener("tool-move", () => {
  redraw();
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
