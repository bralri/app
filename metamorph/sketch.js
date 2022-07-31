let bubbleArray = [];

let metamorphosis;
let metaArray = []

function preload() {
  // metamorphosis = loadImage("../img/0.png")

  for (let i = 0; i < 26; i++) {
    metaArray[i] = loadImage(`../img/metamorph/${i}.png`)
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < 50; i++) {
    let _x = random(width);
    let _y = random(height);
    let _r = 150;
    let _img = random(metaArray);
    let b = new BubbleClass(_x, _y, _r, _img)
    bubbleArray.push(b);
  }
}

function draw() {
  background(245, 245, 245);

  for (let i = bubbleArray.length - 1; i >= 0; i--) {
    bubbleArray[i].move();
    bubbleArray[i].display();
  }
}

function mousePressed() {
  for (let i = 0; i < bubbleArray.length; i++) {
    if (bubbleArray[i].contains(mouseX, mouseY)) {
      bubbleArray.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}