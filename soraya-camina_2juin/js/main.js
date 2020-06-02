//
// var customContainer = document.getElementById('my-gui-container');
// customContainer.appendChild(GUI.domElement);

let LAYERS = {};

let ZOOM = {
    C: 2,
    A: 2.5,
    S: 1,
    P: 1.5,
}


let PROPS = {
    'Save Image': function() {
        saveCanvas();
    },

    letterWeight: 72,
    layers: [],
    currLayer: 'geisel',
    //image: PROPS.currLayer,
}

let lW = PROPS.letterWeight;

let FONT;

function preload() {

    let directory = 'rsrc/images/';

    LAYERS['jinhua'] = loadLayer(directory + 'jinhua.png');
    LAYERS['water'] = loadLayer(directory + 'water.png');
    LAYERS['brutaliste'] = loadLayer(directory + 'brutaliste.png');
    LAYERS['concrete'] = loadLayer(directory + 'concrete.png');
    LAYERS['corbusier'] = loadLayer(directory + 'corbusier.png');
    LAYERS['eisenmann1'] = loadLayer(directory + 'eisenmann1.png');
    LAYERS['eisenmann2'] = loadLayer(directory + 'eisenmann2.png');
    LAYERS['eisenmann3'] = loadLayer(directory + 'eisenmann3.png');
    LAYERS['escalier'] = loadLayer(directory + 'escalier.png');
    LAYERS['geisel'] = loadLayer(directory + 'geisel.png');
    LAYERS['pavillon'] = loadLayer(directory + 'pavillon.png');
    LAYERS['utopia'] = loadLayer(directory + 'utopia.png');
    LAYERS['yougoslavia'] = loadLayer(directory + 'yougoslavia.png');

    PROPS.layers = Object.keys(LAYERS);

    FONT = loadFont('rsrc/fonts/UniversLTStd-BoldCn.otf');

}

function loadLayer(imagePath) {

    let layer = createGraphics(1, 1);

    loadImage(imagePath, function(img) {
        layer.resizeCanvas(img.width, img.height);
        layer.image(img, 0, 0);
    });

    return layer;
}

function setup() {

    const ratio = 0.7085001177;
    const paperWidth = 500;
    createCanvas(paperWidth, round(paperWidth / ratio));

    setupGui();
}

function setupGui() {
    const gui = new dat.GUI();


    ZOOM.folder = gui.addFolder('Zoom');

    ZOOM.folder.add(ZOOM, 'C').min(1).max(5);
    ZOOM.folder.add(ZOOM, 'A').min(1).max(5);
    ZOOM.folder.add(ZOOM, 'S').min(1).max(5);
    ZOOM.folder.add(ZOOM, 'P').min(1).max(5);

    ZOOM.folder.open();


    gui.add(PROPS, 'letterWeight').min(30).max(72);
    gui.add(PROPS, 'Save Image');
    gui.add(PROPS, 'currLayer', PROPS.layers);
}

function drawLetterC() {
    // C shape
    fill(LAYERS[PROPS.currLayer], 'repeat', function() {
        translate(this.width, this.height);
        let zoom = ZOOM.C;
        scale(zoom, zoom);
    });

    beginShape();
    vertex(width - 2, 2);
    vertex(2, 2);
    vertex(2, height - 2);
    vertex(width - 2, height - 2);
    vertex(width - 2, height - lW);
    vertex(lW, height - lW);
    vertex(lW, lW);
    vertex(width - 2, lW);
    endShape(CLOSE);
}

function drawLetterA() {
    // A shape

    fill(LAYERS[PROPS.currLayer], 'repeat', function() {
        translate(this.width, this.height);
        let zoom = ZOOM.A; //ZOOM.C * 2, map(ZOOM.C, 2, 10, -2, 5)
        scale(zoom, zoom);
    });

    beginShape();
    vertex(lW, lW);
    vertex(width - 2, lW);
    vertex(width - 2, height - lW);
    vertex(width - lW, height - lW);
    vertex(width - lW, lW + lW + lW);
    vertex(lW + lW, lW + lW + lW);
    vertex(lW + lW, height - lW);
    vertex(lW, height - lW);
    endShape(CLOSE);

    //trou A
    beginShape();
    vertex(lW + lW, lW + lW);
    vertex(width - lW, lW + lW);
    vertex(width - lW, lW + lW);
    endShape(CLOSE);
}

function drawLetterS() {
    // S shape
    fill(LAYERS[PROPS.currLayer], 'repeat', function() {
        translate(this.width, this.height);
        let zoom = ZOOM.S; //ZOOM.C * 2, map(ZOOM.C, 2, 10, -2, 5)
        //  let zoom = map(mouseX, 0, width, 0.8, 3);
        scale(zoom, zoom);
    });

    beginShape();
    vertex(2 * lW, 3 * lW);
    vertex(width - lW, 3 * lW);
    vertex(width - lW, 6 * lW);
    vertex(2 * lW, 6 * lW);
    vertex(2 * lW, 6 * lW);
    endShape(CLOSE);

    //trou S haut
    beginShape();
    vertex(width - lW, 4 * lW);
    vertex(3 * lW, 4 * lW);
    vertex(width - (2 * lW), 4 * lW);
    endShape(CLOSE);

    //trou S bas
    beginShape();
    vertex(2 * lW, 5 * lW);
    vertex(width - 2 * lW, 5 * lW);
    vertex(2 * lW, 5 * lW);
    endShape(CLOSE);
}

function drawLetterP() {
    // P shape
    fill(LAYERS[PROPS.currLayer], 'repeat', function() {
        translate(this.width, this.height);
        let zoom = ZOOM.P; //ZOOM.C * 2, map(ZOOM.C, 2, 10, -2, 5)
        //let zoom = map(mouseX, 0, width, 0.4, 6);
        scale(zoom, zoom);
    });

    beginShape();
    vertex(2 * lW, height - 4 * lW);
    vertex(width - lW, height - 4 * lW);
    vertex(width - lW, height - (2 * lW));
    vertex(3 * lW, height - (2 * lW));
    vertex(3 * lW, height - lW);
    vertex(2 * lW, height - lW);
    endShape(CLOSE);

    //trou P
    beginShape();
    vertex(3 * lW, height - 3 * lW);
    vertex(width - 2 * lW, height - 3 * lW);
    vertex(3 * lW, height - 3 * lW);
    endShape(CLOSE);
}

function drawLogo() {
    // cartouche logo
    push();
    fill(0);
    rectMode(CORNERS);
    rect(3 * lW, height - (2 * lW), width - lW, height - lW);
    pop();
}

function drawText() {
    push();
    textAlign(RIGHT, BOTTOM);
    fill(255);
    noStroke();
    textFont(FONT);

    textLeading(12);
    text('CONTEMPORARY\nARCHITECTURE SPACE', width - lW, height - lW);

    // text('CONTEMPORARY', 3 * lW, height - 2 * lW, 3 * lW - 6, lW - 20)
    // text('ARCHITECTURE SPACE', 3 * lW, height - 2 * lW, 3 * lW - 6, lW - 6)
    pop();
}

function draw() {

    lW = PROPS.letterWeight;

    //background(255, 255, 0);


    background(255, 255, 0);


    fill(LAYERS[PROPS.currLayer], 'repeat', function() {
        translate(this.width, this.height);
        scale(0.3);
    });
    rect(0, 0, width, height);
    // image(LAYERS[PROPS.currLayer], 0, 0, width, height);

    strokeWeight(4);
    //stroke(255, 255, 0);
    stroke(0);
    //stroke(255);
    // stroke(57, 255, 20);


    drawLetterC();
    drawLetterA();
    drawLetterS();
    drawLetterP();
    drawLogo();


    push();
    stroke(255);
    strokeWeight(1);
    drawText();
    pop();

}