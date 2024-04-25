let CANVAS_X;
let CANVAS_Y;

let functionPoints = [];
let nodeDiameter = 70;
let nodeRadius = nodeDiameter / 2;
let network;
let predictedFunction = null;

function setup() {
    CANVAS_X = windowWidth;
    CANVAS_Y = windowHeight - 53;
    createCanvas(CANVAS_X, CANVAS_Y);

    network = new Network(0, 0, CANVAS_X / 2, CANVAS_Y);
}

function drawAxes() {
    strokeWeight(3)
    line(CANVAS_X / 2 + 20, 30, CANVAS_X / 2 + 20, CANVAS_Y - 30);
    line(CANVAS_X / 2 + 20, CANVAS_Y / 2, CANVAS_X - 20, CANVAS_Y / 2);
    strokeWeight(1);
}

function inDrawableArea() {
    return mouseX > CANVAS_X / 2 + 20 && mouseX < CANVAS_X - 20 && mouseY > 30 && mouseY < CANVAS_Y - 30;
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
    fill(137, 207, 240);
    ellipse(xPos, yPos, nodeDiameter, nodeDiameter);

    fill(0, 0, 0);
    line(xPos, yPos - nodeRadius, xPos, yPos + nodeRadius);
    textSize(40);
    text("Σ", xPos - nodeRadius * (4 / 5), yPos + nodeRadius * (4 / 9));
    text("σ", xPos + nodeRadius * (1 / 8), yPos + nodeRadius * (4 / 11));
}

function processFunctionPoints(points) {
    let origin_x = CANVAS_X / 2 + 20;
    let origin_y = CANVAS_Y / 2;

    return points.map((point) => [(point[0] - origin_x) / (CANVAS_X / 2), -(point[1] - origin_y) / (CANVAS_Y)]);
}

function unprocessFunctionPoints(points) {
    let origin_y = CANVAS_Y / 2;

    return points.map((point) => -1 * point * CANVAS_Y + origin_y)
}

function sendInfo() {
    let activation = "activation=" + network.activation;
    let optimizer = "optimizer=" + network.optimizer;
    let networkNodes = "networkNodes=" + JSON.stringify(network.layers.map((layer) => layer.numNodes));
    let data = "functionPoints=" + JSON.stringify(processFunctionPoints(functionPoints));
    let url = "http://127.0.0.1:5000/send_info?" + activation + "&" + optimizer + "&" + networkNodes + "&" + data;

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        response.json().then((out) => {predictedFunction = out})
        // predictedFunction = response.json();
        // predictedFunction.then((out) => {console.log(out)})
        // console.log("Predicted function: " + response)
    })
    .then(data => {
        console.log('Response from Flask backend:', data);
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}

function drawFunctionArea() {
    let clearFunctionButton = createButton("Clear Points");
    clearFunctionButton.position(CANVAS_X / 2, 50);
    clearFunctionButton.mousePressed(() => {
        fill(197,199,196);
        rect(CANVAS_X / 2, 0, CANVAS_X, CANVAS_Y);
        functionPoints = [];
        predictedFunction = null;
    });
    
    let trainButton = createButton("Train!");
    trainButton.position(CANVAS_X / 2 + 90, 50);
    trainButton.mousePressed(sendInfo);

    drawAxes();
    if (canDrawPoint(mouseX)) {
        mousePoint = [mouseX, mouseY];
        functionPoints.push(mousePoint);
        ellipse(mouseX, mouseY, 6, 6);
    }
}

function drawFunction(points) {
    let origin_x = CANVAS_X / 2 + 20;
    let unprocessedPoints = unprocessFunctionPoints(points);
    console.log(unprocessedPoints);
    for (let i = 0; i < unprocessedPoints.length - 1; i++) {
        pt = unprocessedPoints[i];
        next_pt = unprocessedPoints[i + 1];

        let x = i / unprocessedPoints.length;
        let next_x = (i + 1) / unprocessedPoints.length;
        line(x * CANVAS_X / 2 + origin_x, pt, next_x * CANVAS_X / 2 + origin_x, next_pt);
    }
}

function draw() {
    // Background
    fill("#D9CAB3");
    rect(0, 0, CANVAS_X / 2, CANVAS_Y)
    fill(0, 0, 0);

    // Divider
    line(CANVAS_X / 2, 0, CANVAS_X / 2, CANVAS_Y)

    // Function Drawing Area
    drawFunctionArea();

    // Network Creation Area
    network.render();

    if (predictedFunction != null) {
        drawFunction(predictedFunction[predictedFunction.length - 1]);
    }
}

