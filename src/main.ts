import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Jonathan Paint";
const canWidth = 256;
const canHeight = 256;

document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const canvas = document.createElement("canvas");
canvas.width = canWidth;
canvas.height = canHeight;
canvas.id = "draw";
app.append(canvas);
const context = canvas.getContext("2d")!;

context.fillStyle = "white";
context.fillRect(0, 0, canWidth, canHeight);
