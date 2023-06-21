// Store the drawing history as an array of paths
let paths = [];
let currentPath = [];

// Get the canvas element and its 2D context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Get button and color picker elements
const undoButton = document.getElementById('undoButton');
const clearButton = document.getElementById('clearButton');
const colorPicker = document.getElementById('colorPicker');
const saveButton = document.getElementById('saveButton');

// Set up the initial drawing settings
ctx.lineWidth = 5;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = '#000';

// Variables to track the mouse position
let isDrawing = false;
let lastX = 0;
let lastY = 0;


// Event listener for mouse movement to draw on the canvas
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousedown', draw); // For the case of clicking without dragging
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mouseout', endDrawing);

// For color picker change
colorPicker.addEventListener('change', updateStrokeColor);

// For clear button
clearButton.addEventListener('click', userClear)

// For undo button
undoButton.addEventListener('click', undoLastLine);

// For keyboard events
document.addEventListener('keydown', handleKeyDown);

// Reset color picker to black on page load
window.addEventListener('load', resetColorPicker);

// For save button
saveButton.addEventListener('click', saveCanvas);

// Function for undo
function undoLastLine() {
  if (paths.length === 0) return;

  paths.pop();
  clearCanvas();

  // Redraw all the remaining paths
  paths.forEach((path) => {
    for (let i = 0; i < path.length - 1; i++) {
      const { x, y, color } = path[i];
      const { x: nextX, y: nextY } = path[i + 1];

      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(nextX, nextY);
      ctx.stroke();
    }
  });
}

// Function to start the drawing path
function startDrawing(event) {
  //dont draw if right-clicking
  if (event.button === 0) {
    isDrawing = true;
    [lastX, lastY] = [event.offsetX, event.offsetY];
    currentPath = [{ x: lastX, y: lastY, color: ctx.strokeStyle }];
    
  }
}

function draw(event) {
  if (!isDrawing) return;

  const { offsetX, offsetY } = event;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();

  [lastX, lastY] = [offsetX, offsetY];
  currentPath.push({ x: lastX, y: lastY, color: ctx.strokeStyle });
}

// Function to end the drawing path
function endDrawing() {
  if (!isDrawing) return;

  isDrawing = false;
  paths.push(currentPath);
}


// Function to clear the canvas, for the script (doesnt clear paths)
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to clear the canvas, but by the user (clears paths)
function userClear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  paths = [];
}

// Function to change brush color
function updateStrokeColor() {
  ctx.strokeStyle = colorPicker.value;
}
//Function to reset color to black
function resetColorPicker() {
  colorPicker.value = '#000000';
  ctx.strokeStyle = colorPicker.value;
}

// Function to handle keyboard events, only used for undo atm
function handleKeyDown(event) {
  // Check if the "Ctrl" key and "Z" key are pressed simultaneously for windows/linux
  if (event.ctrlKey && event.key === 'z') {
    undoLastLine();
  }
  // Check if the "Cmd" key and "Z" key are pressed simultaneously for mac
  if (event.metaKey && event.key === 'z') {
    undoLastLine();
  }
}


// Function to save the canvas as an image
function saveCanvas() {
  // Create a link element
  const link = document.createElement('a');
  // Set the download attribute to specify the filename
  link.download = 'drawing.png';
  // Convert the canvas to a data URL
  const dataURL = canvas.toDataURL('image/png');
  // Set the href attribute of the link to the data URL
  link.href = dataURL;
  // Simulate a click on the link to trigger the download
  link.click();
}