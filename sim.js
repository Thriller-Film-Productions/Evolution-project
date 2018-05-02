const players = [];
const playersStorage = [];
const playerAmt = 250;
let sim;
let graphW;
let graphH;
let graphpos;

function setup() {
  createCanvas(windowWidth, windowHeight).position(0, 0);
  for (let i = 0; i < playerAmt; i++) {
    console.log("new player");
    players.push(new player(new NeuralNetwork(8, 16, 2)));
  }
  graphW = width / 2;
  graphH = height / 2;
  graphPos = createVector(width - height, 0);
}

function draw() {
  graphW = height;
  graphH = height;
  graphPos = createVector(width - height, 0);
  sim = createGraphics(graphW, graphH);
  sim.background(51);
  for (let playery of players) {
    playery.show();
    console.log("rendering");
  }
  image(sim, graphPos.x, graphPos.y);
}

function newGen() {

}

const player = function (nn) {
  this.nn = nn;
  this.y = random(0.1, 0.9);
  this.width = 1 / 16;
  this.height = 1 / 16;
  this.show = () => {
    sim.noStroke();
    sim.fill(235, 255 / 5);
    sim.ellipse(sim.width / 3, sim.height * this.y, sim.width * this.width, sim.height * this.height)
  }
  this.run = (y, vel, tyu, w, tyb, dist, ryb, ryt) => {
    return this.nn.predict([y, vel, tyu, w, tyb, dist, ryb, ryt]);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}