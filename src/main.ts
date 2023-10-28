import "./style.css";

//--------------------HTML--------------------------------------------------------------------------------\
const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Jonathan Paint";
const canWidth = 256;
const canHeight = 256;

const container = document.createElement("container");
container.id = "Mycontainer";
app.append(container);

const containerPen = document.createElement("container");
containerPen.id = "Mycontainer";
app.append(containerPen);

const containerStick = document.createElement("container");
containerStick.id = "Mycontainer";
app.append(containerStick);

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

const sticker1 = document.createElement("button");
sticker1.textContent = "🔥";

const sticker2 = document.createElement("button");
sticker2.textContent = "💯";

const sticker3 = document.createElement("button");
sticker3.textContent = "😂";

container.append(clear, redo, undo);
containerPen.append(thin, standard, thick);
containerStick.append(sticker1, sticker2, sticker3);

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
  sticker: string;
  mode: string;
  constructor(x: number, y: number, sticker: string, mode: string) {
    this.x = x;
    this.y = y;
    this.sticker = sticker;
    this.mode = mode;
  }

  display(ctx: CanvasRenderingContext2D) {
    const fillStyle = ctx.fillStyle;
    if (this.mode == "line") {
      switch (lineWidth) {
        case standardLine:
          ctx.fillStyle = "black";
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
    } else if (this.mode == "sticker") {
      ctx.font = `${Math.max(7, 25)}px monospace`;
      ctx.fillText(this.sticker, this.x - 2, this.y + 2.5);
    }
  }
}

class StickerCommand {
  x: number;
  y: number;
  sticker: string;

  constructor(x: number, y: number, sticker: string) {
    this.x = x;
    this.y = y;
    this.sticker = sticker;
  }
  display(ctx: CanvasRenderingContext2D) {
    ctx.font = `${Math.max(7, 25)}px monospace`;
    ctx.fillText(this.sticker, this.x - 2, this.y + 2.5);
  }
  drag(x: number, y: number) {
    this.x = x;
    this.y = y;
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

const standardLine = 4;
const thickLine = 8;
const thinLine = 2;
let mode = "line";
let currenSticker = "";
let lineWidth: number = standardLine;

const change = new Event("drawing-change");
const toolChange = new Event("tool-move");

const lines: (LineCommand | StickerCommand)[] = [];
const redoLines: (LineCommand | StickerCommand)[] = [];
//----------------------------------------------------------------

//-----------------EVENT HANDLING------------------------

canvas.addEventListener("mouseout", () => {
  tool = null;
  //redraw();
});

canvas.addEventListener("mouseenter", (e) => {
  setCursorPos(cursor, e);

  tool = new ToolCommnad(cursor.x, cursor.y, currenSticker, mode);
});

canvas.addEventListener("mousedown", (e) => {
  setCursorState(true);
  setCursorPos(cursor, e);
  tool = null;
  if (currenSticker == "") {
    lines.push(new LineCommand(cursor.x, cursor.y, lineWidth));
  } else {
    lines.push(new StickerCommand(cursor.x, cursor.y, currenSticker));
  }
  canvas.dispatchEvent(change);
});

canvas.addEventListener("mousemove", (e) => {
  setCursorPos(cursor, e);
  if (cursor.active && ctx && !currenSticker) {
    tool = null;
    lines[lines.length - 1].drag(cursor.x, cursor.y);
    lines[lines.length - 1].display(ctx);
    redoLines.length = 0;
  } else {
    tool = new ToolCommnad(cursor.x, cursor.y, currenSticker, mode);
    lines[lines.length - 1].display(ctx);
    canvas.dispatchEvent(toolChange);
  }
});

canvas.addEventListener("mouseup", (e) => {
  cursor.active = false;
  setCursorPos(cursor, e);
  tool = new ToolCommnad(cursor.x, cursor.y, currenSticker, mode);

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
  currenSticker = "";
  mode = "line";
});

thick.addEventListener("click", () => {
  thick.classList.add("selected");
  standard.classList.remove("selected");
  thin.classList.remove("selected");
  lineWidth = thickLine;
  currenSticker = "";
  mode = "line";
});

thin.addEventListener("click", () => {
  thin.classList.add("selected");
  standard.classList.remove("selected");
  thick.classList.remove("selected");
  lineWidth = thinLine;
  currenSticker = "";
  mode = "line";
});

sticker1.addEventListener("click", () => {
  currenSticker = "🔥";
  mode = "sticker";
});

sticker2.addEventListener("click", () => {
  currenSticker = "💯";
  mode = "sticker";
});

sticker3.addEventListener("click", () => {
  currenSticker = "😂";
  mode = "sticker";
});

//-------------------------------------------------------------------------------------
