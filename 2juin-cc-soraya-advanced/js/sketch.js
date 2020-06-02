let input, button;

let FONTS = {}
let TEXT_SIZE = 25;

let TEXTS = {};

let CURR_TEXT = 'littlePrince'; 
let ORDER_TEXT = ['kleinePrinz', 'petitPrince', 'piccoloPrincipe', 'littlePrince'];

let COUNTER = 0;

// let COLUMNS = [-0.1, 0, 0.1];
let COLUMNS;

function preload() {

    //  FONTS.monoSpace = loadFont('./rsrc/fonts/DM_Mono/DMMono-Italic.ttf');
    FONTS.monoSpace = loadFont('./rsrc/fonts/Unica77/Unica77MonoLowLLTT-Regular.ttf');
    //FONTS.monoSpace= loadFont('./rsrc/fonts/Simplon/SimplonEcalMono-Medium.otf');

}

function setup() {

    COLUMNS = {

        //'UNKNOWN': {posX: 0, color: color(245, 66, 66), rotation: 0, scale: 1},
        'PUNCT': {hidden: false, posX: 0, color: color(255, 0, 0), rotation: 0, scale: 0.8 },
        'ADJ': {hidden: false, posX: 0.05, color: color(245, 173, 66), rotation: 0, scale: 0.8 },
        'ADP': {hidden: false, posX: 0.15, color: color(245, 236, 66), rotation: 0, scale: 0.8 },
        'ADV': {hidden: false, posX: 0.23, color: color(182, 245, 66), rotation: 0, scale: 0.8 },
        'CONJ': {hidden: false, posX: 0.32, color: color(102, 245, 66), rotation: 0, scale: 0.8 },
        'DET': {hidden: false, posX: 0.38, color: color(102, 245, 66), rotation: 0, scale: 0.8 },
        'NOUN': {hidden: false, posX: 0.45, color: color(66, 245, 138), rotation: 0, scale: 0.8 },
        'NUM': {hidden: false, posX: 0.58, color: color(66, 245, 212), rotation: 0, scale: 0.8 },
        'PRON': {hidden: false, posX: 0.67, color: color(66, 236, 245), rotation: 0, scale: 0.8 },
        'VERB': {hidden: false, posX: 0.75, color: color(182, 66, 245), rotation: 0, scale: 0.8 },
        'X': {hidden: false, posX: 0.85, color: color(245, 66, 203), rotation: 0, scale: 0.8 },
        //'AFFIX': {posX: 0.82, color: color(245, 66, 102), rotation: 0, scale: 1},
        'PRT': {hidden: false, posX: 1, color: color(66, 158, 245), rotation: 0, scale: 1},
    }

    setupApi();
    loadAllTexts();

    createCanvas(windowWidth, windowHeight);
    textSize(32);
    // input = createInput();
    // input.position(20, 65);
    // input.size(windowWidth - 100, 60);

    // button = createButton('tester mon texte');
    // button.position(20, 150);
    // button.mousePressed(consoleText);

    // text("Sentences from text ", 20, 200);
    // text("Sentiment", 700, 200);
    // text("Entities", 900, 200);
}

function draw() {
    background(0);

    drawText(TEXTS[CURR_TEXT]);
}

function drawText(analysedText) {

    if (!analysedText)
        return;

    push();

    textFont(FONTS.monoSpace);

    textSize(TEXT_SIZE);



    let baseColor = color(255);

    let x = 20;
    let y = 20;

    let spaceWidth = textWidth(' ');
    // let minX = 0;
    let offsetAmount = map(mouseX, 0, width, 0, 1);
    //let zoom = 5; //?!!!

    let heightColumns = {};

    let nColumns = Object.keys(COLUMNS).length;

    for (let tag in COLUMNS) {
        heightColumns[tag] = TEXT_SIZE;
    }

    let points = [];

    let marginRight = width / 6;
    let marginLeft = 20;
    let lineHeight = 10;

    let oldBeginOffset = 0;

    for (let i = 0; i < analysedText.length; i++) {

        let word = analysedText[i].text.content;
        let beginOffset = analysedText[Math.min(i + 1, analysedText.length - 1)].text.beginOffset;
        let tag = analysedText[i].partOfSpeech.tag;
        let w = (beginOffset - oldBeginOffset) * spaceWidth;

        oldBeginOffset = beginOffset;

        let isLineBreak = (word === '↩️');

        if (isLineBreak || x + w > width - marginRight) {
            x = marginLeft;
            y += TEXT_SIZE + lineHeight;

            if (isLineBreak)
                continue;
        }

        let column = COLUMNS[tag];

        if(!column)
            console.log(tag, 'is Missing');

        // let targetX = map(roundScore, -1/zoom, 1/zoom, 0, width);
        let lerpX = lerp(x, column.posX * width, offsetAmount);
        let targetY = heightColumns[tag];
        let lerpRot = lerp(0, column.rotation, offsetAmount);
        let lerpY = lerp(y, targetY, offsetAmount);
        let lerpScale = lerp(1, column.scale, offsetAmount);

        heightColumns[tag] += TEXT_SIZE;

        let lerpCol = lerpColor(baseColor, column.color, offsetAmount);

        fill(lerpCol);
        if(column.hidden) {
            noFill();
        }

        push();
        translate(lerpX + (width / 10), lerpY + 200);
        rotate(lerpRot);
        scale(lerpScale);
        text(word, 0, 0);
        x += w;

        points.push({ transform: drawingContext.getTransform() });

        pop();
    }

    drawLines(points);


    pop();
}

function drawLines(points) {

    let c = drawingContext;

    c.save();

    c.setLineDash([1, 2]);

    c.beginPath();

    c.strokeStyle = 'rgba(255, 255, 255, 0.3)';

    for (let i = 0; i < points.length; i++) {
        let point = points[i];

        c.setTransform(point.transform);
        c.lineTo(0, 0);

    }

    c.stroke();

    c.restore();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function loadAllTexts() {

    // TEXT
    for (const name in TEXT) {
        setText(name);
        // ORDER_TEXT.push(name);
    }

}

function swapText() {

    let index = ORDER_TEXT.indexOf(CURR_TEXT);
    index = (index + 1) % ORDER_TEXT.length;
    CURR_TEXT = ORDER_TEXT[index];
}

function mousePressed() {
    swapText();
    console.log(CURR_TEXT);


    COLUMNS['ADJ'].hidden = true;
}

// function keyReleased() {
//   if (keyCode == 32) -> change la langue du texte
//
//   if (key == '1') -> cache la 'PUNCT'
//   if (key == '2') ->  cache la 'ADJ'
//   if (key == '3') -> cache la 'APD'
//   if (key == '4') -> cache la 'ADV'
//   if (key == '5') ->  cache la 'CONJ'
//   if (key == '6') -> cache la 'DET'
//   if (key == '7') -> cache la 'NOUN'
//   if (key == '8') ->  cache la 'NUM'
//   if (key == '9') -> cache la 'PRON'
//   if (key == '0') -> cache la 'VERB'
// }

// function keyReleased() {
//   if (keyCode === 32) {
//   //  COUNTER ++;
//     //console.log(COUNTER);
// //setText('petitPrince');
//   }
// // if (COUNTER >0){
// //   switch(COUNTER){
// //     case 1:'petitPrince';
// //     break;
// //     case 2:'petitPrince';
// //     break;
// //     case 3: 'piccoloPrincipe';
// //     break;
// //     case 4: 'littlePrince';
// //     break;
// //   }
// // }
// // if (keyCode === 65){
// //       COLUMNS = {'UNKNOWN': {color: color(0)},
// // }
// // }
// }

async function setText(name) {

    let text = TEXT[name];

    TEXTS[name] = await getTokens(text.text, text.options); // from Google APi
    //  console.log(TEXTS.laFontaine);
    // TEXTS[name] = SAVED.getText(name); //from saved text

}