class Network {
    constructor(startX, startY, width, height) {
        this.startX = startX;
        this.startY = startY;
        this.width = width;
        this.height = height;
        
        this.numLayers = 2;
        this.layers = []
        this.refreshLayerPositions()
    }

    refreshLayerPositions() {
        this.layers = [];
        for (let i = 0; i < this.numLayers; i++) {
            this.layers.push(new Layer(
                this.startX + this.width * i / this.numLayers,
                this.startY,
                this.width / this.numLayers,
                this.height,
                i == 0 || i == this.numLayers - 1
            ));
        }
    }

    addLayer() {
        this.numLayers++;
        this.refreshLayerPositions();
    }

    removeLayer() {
        this.numLayers++;
        this.refreshLayerPositions();
    }

    render() {
        this.layers.forEach((layer) => {layer.render()});

        for (let i = 0; i < this.layers.length - 1; i++) {
            this.connectLayers(this.layers[i], this.layers[i + 1]);
        }

        let layerAddButton = createButton("Add Layer");
        let removeLayerButton = createButton("Remove Layer");
        layerAddButton.position(this.startX, this.startY + 50);
        removeLayerButton.position(this.startX + 80, this.startY + 50);

        layerAddButton.mousePressed(() => {
            this.numLayers++;
            this.refreshLayerPositions();
        });

        removeLayerButton.mousePressed(() => {
            this.numLayers--;
            this.refreshLayerPositions();
        })
    }

    connectLayers(firstLayer, secondLayer) {
        for (let i = 0; i < firstLayer.numNodes; i++) {
            for (let j = 0; j < secondLayer.numNodes; j++) {
                this.connectNodes(
                    firstLayer.nodeX,
                    firstLayer.nodePositions[i],
                    secondLayer.nodeX,
                    secondLayer.nodePositions[j]
                );
            }
        }
    }

    connectNodes(x1, y1, x2, y2) {
        let angle = atan2(y1 - y2, x1 - x2);
        this.arrow(
            x1 - nodeRadius * 1 / 2 * Math.cos(angle),
            y1 - nodeRadius * 1 / 2 * Math.sin(angle),
            x2 + nodeRadius * 1 / 2 * Math.cos(angle),
            y2 + nodeRadius * 1 / 2 * Math.sin(angle)
        );
    }
    
    arrow(x1, y1, x2, y2) {
        let offset = 5;
        line(x1, y1, x2, y2)
        push()
        var angle = atan2(y1 - y2, x1 - x2);
        translate(x2, y2);
        rotate(angle - HALF_PI);
        triangle(-offset * 0.6, offset * 1.5, offset * 0.6, offset * 1.5, 0, 0);
        pop();
    }
}

class Layer {
    constructor(posX, posY, width, height, isFirstOrLast) {
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;
        this.isFirstOrLast = isFirstOrLast;

        this.nodeX = this.posX + this.width / 2;
        this.numNodes = 1;
        this.maxNodes = 6;
        this.nodePositions = []
        this.refreshNodePositions()
    }

    refreshNodePositions() {
        this.nodePositions = [];
        for (let i = 0; i < this.numNodes; i++) {
            this.nodePositions.push(this.posY + this.height * (i + 1) / (this.numNodes + 1));
        }
    }

    addNode() {
        if (this.numNodes >= 7) {
            return;
        }
        this.numNodes++;
        this.refreshNodePositions()
    }

    render() {
        this.nodePositions.forEach((nodeY) => {
            this.drawRegularNode(this.nodeX, nodeY);
        });
        
        if (!this.isFirstOrLast) {
            let lastNodeY = this.nodePositions[this.nodePositions.length - 1];
            this.drawAddNodeButton(this.nodeX, lastNodeY + 50);

            let mouseInButton = (Math.pow(mouseX - this.nodeX, 2) + Math.pow(mouseY - lastNodeY - 50, 2)) < Math.pow(nodeRadius / 2, 2);
            
            if (mouseIsPressed && mouseInButton) {
                this.addNode();
            }
        }
    }

    drawAddNodeButton(xPos, yPos) {
        fill(137, 207, 240, 100);
        ellipse(xPos, yPos, nodeRadius, nodeRadius);
        fill(0, 0, 0);
        textAlign(CENTER);
        text("+", xPos, yPos);
    }

    drawRegularNode(xPos, yPos) {
        fill(137, 207, 240);
        ellipse(xPos, yPos, nodeRadius, nodeRadius);
        fill(0, 0, 0);
    }
}