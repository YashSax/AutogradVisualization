let CANVAS_X;
let CANVAS_Y;

let functionPoints = [];

function setup() {
    CANVAS_X = windowWidth;
    CANVAS_Y = windowHeight - 53;
    createCanvas(CANVAS_X, CANVAS_Y);
}

function drawAxes() {
    strokeWeight(3)
    line(CANVAS_X / 2 + 20, 30, CANVAS_X / 2 + 20, CANVAS_Y - 30);
    line(CANVAS_X / 2 + 20, CANVAS_Y / 2, CANVAS_X - 20, CANVAS_Y / 2);
    strokeWeight(1);
}

function inDrawableArea() {
    return mouseX > CANVAS_X / 2 + 20 && mouseX < CANVAS_X - 20;
}

function canDrawPoint(xPos) {
    if (!mouseIsPressed || !inDrawableArea()) {
        return false;
    }
    for (let i = 0; i < functionPoints.length; i++) {
        if (Math.abs(xPos - functionPoints[i][0]) <= 3) {
            return false;
        }
    }
    return true;
}

function drawRegularNode(xPos, yPos) {
    fill(137, 207, 240);
    ellipse(xPos, yPos, 70, 70);
}

function drawHiddenNode(xPos, yPos) {
    let radius = 70;
    fill(137, 207, 240);
    ellipse(xPos, yPos, radius, radius);

    line(xPos, yPos - radius / 2, xPos, yPos + radius / 2);
}

function draw() {
    // Background
    fill("#D9CAB3");
    rect(0, 0, CANVAS_X / 2, CANVAS_Y)
    fill(0, 0, 0);

    // Divider
    line(CANVAS_X / 2, 0, CANVAS_X / 2, CANVAS_Y)

    // Function Drawing Area
    drawAxes();
    console.log(canDrawPoint(mouseX))
    if (canDrawPoint(mouseX)) {
        mousePoint = [mouseX, mouseY];
        functionPoints.push(mousePoint);
        ellipse(mouseX, mouseY, 10, 10);
    }

    drawRegularNode(90, 90);
    drawHiddenNode(200, 200);
}

