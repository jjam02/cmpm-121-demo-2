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
standard.classList.add("selectable");

const thick = document.createElement("button");
thick.textContent = "thick";
thick.classList.add("selectable");

const thin = document.createElement("button");
thin.textContent = "thin";
thin.classList.add("selectable");
const exportButton = document.createElement("button");
exportButton.textContent = "export";
exportButton.style.fontSize = "2em";
app.append(exportButton);

container.append(clear, redo, undo);
containerPen.append(thin, standard, thick);

//--------------------------------------------------------------------------------------------------------

//----------------------------CLASS DEFINITIONS----------------------------------------------
interface Point {
  x: number;
  y: number;
}

interface Sticker {
  emoji: string;
  button: HTMLButtonElement;
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
      const fillStyle = ctx.fillStyle;
      ctx.fillStyle = "black";
      ctx.font = `${Math.max(7, 25)}px monospace`;
      ctx.fillText(this.sticker, this.x - 2, this.y + 2.5);
      ctx.fillStyle = fillStyle;
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
    const fillStyle = ctx.fillStyle;
    ctx.font = `${Math.max(7, 25)}px monospace`;
    ctx.fillStyle = "black";
    ctx.fillText(this.sticker, this.x - 2, this.y + 2.5);
    ctx.fillStyle = fillStyle;
  }
  drag(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

//--------------------------------------------------------------------------------------------------------

//-------------------HELPER FUNCTIONS-------------------------------------------------------------------
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

function setupStickerButton(sticker: Sticker) {
  sticker.button.textContent = sticker.emoji;
  sticker.button.addEventListener("click", function () {
    const selectableButtons = document.querySelectorAll(".selectable");
    selectableButtons.forEach((button) => {
      button.classList.remove("selected");
    });
    this.classList.add("selected");
    currentSticker = sticker.emoji;
    mode = "sticker";
  });
  sticker.button.classList.add("selectable");
  containerStick.append(sticker.button);
}

function exportImg() {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = 1024;
  tempCanvas.height = 1024;
  const tempCtx = tempCanvas.getContext("2d")!;
  tempCtx.fillStyle = "white";
  tempCtx.fillRect(0, 0, 1024, 1024);
  tempCtx.scale(4, 4);
  lines.forEach((line) => line.display(tempCtx));

  const anchor = document.createElement("a");
  anchor.href = tempCanvas.toDataURL("image/png");
  anchor.download = "Jonathan Paint.png";
  anchor.click();
  tempCanvas.remove();
}

clearCanvas();

//-------------------------------------------------------------------------------------

//---------------------------DATA---------------------------------

const cursor = { active: false, x: 0, y: 0 };
let tool: ToolCommnad | null = null;

const standardLine = 4;
const thickLine = 8;
const thinLine = 2;
let mode = "line";
let currentSticker = "";
let lineWidth: number = standardLine;

const change = new Event("drawing-change");
const toolChange = new Event("tool-move");

const lines: (LineCommand | StickerCommand)[] = [];
const redoLines: (LineCommand | StickerCommand)[] = [];

const availableStickers: Sticker[] = [
  {
    emoji: "🔥",
    button: document.createElement("button"),
  },
  {
    emoji: "💯",
    button: document.createElement("button"),
  },
  {
    emoji: "😂",
    button: document.createElement("button"),
  },
  {
    emoji: "Custom sticker",
    button: document.createElement("button"),
  },
];

availableStickers.forEach((sticker) => setupStickerButton(sticker));

//----------------------------------------------------------------

//-----------------EVENT HANDLING------------------------

canvas.addEventListener("mouseout", () => {
  tool = null;
  redraw();
});

canvas.addEventListener("mouseenter", (e) => {
  setCursorPos(cursor, e);

  tool = new ToolCommnad(cursor.x, cursor.y, currentSticker, mode);
});

canvas.addEventListener("mousedown", (e) => {
  setCursorState(true);
  setCursorPos(cursor, e);
  tool = null;
  if (mode == "line") {
    lines.push(new LineCommand(cursor.x, cursor.y, lineWidth));
  }

  canvas.dispatchEvent(change);
});

canvas.addEventListener("mousemove", (e) => {
  setCursorPos(cursor, e);
  if (cursor.active && ctx && mode == "line") {
    tool = null;
    lines[lines.length - 1].drag(cursor.x, cursor.y);
    lines[lines.length - 1].display(ctx);
    redoLines.length = 0;
  } else {
    tool = new ToolCommnad(cursor.x, cursor.y, currentSticker, mode);
    lines[lines.length - 1].display(ctx);
    canvas.dispatchEvent(toolChange);
  }
});

canvas.addEventListener("mouseup", (e) => {
  cursor.active = false;
  setCursorPos(cursor, e);
  if (mode == "sticker") {
    lines.push(new StickerCommand(cursor.x, cursor.y, currentSticker));
  }
  tool = new ToolCommnad(cursor.x, cursor.y, currentSticker, mode);

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

standard.addEventListener("click", function () {
  const selectableButtons = document.querySelectorAll(".selectable");
  selectableButtons.forEach((button) => {
    button.classList.remove("selected");
  });
  this.classList.add("selected");
  lineWidth = standardLine;
  currentSticker = "";
  mode = "line";
});

thick.addEventListener("click", function () {
  const selectableButtons = document.querySelectorAll(".selectable");
  selectableButtons.forEach((button) => {
    button.classList.remove("selected");
  });
  this.classList.add("selected");
  lineWidth = thickLine;
  currentSticker = "";
  mode = "line";
});

thin.addEventListener("click", function () {
  const selectableButtons = document.querySelectorAll(".selectable");
  selectableButtons.forEach((button) => {
    button.classList.remove("selected");
  });
  this.classList.add("selected");
  lineWidth = thinLine;
  currentSticker = "";
  mode = "line";
});

availableStickers[3].button.addEventListener("click", function () {
  const custStick = prompt("type the cursom sticker below");
  if (custStick) {
    availableStickers[3].emoji = custStick;
    currentSticker = availableStickers[3].emoji;
    mode = "sticker";
  }
});

exportButton.addEventListener("click", exportImg);
//-------------------------------------------------------------------------------------
