const players = [];
const playersStorage = [];
const playerAmt = 250;
let sim;
let graphW;
let graphH;

function setup() {
  createCanvas(windowWidth, windowHeight).position(0, 0);
  for (let i = 0; i < playerAmt; i++) {
    players.push(new player(new NeuralNetwork(8, 32, 2)));
  }
  graphW = width / 2;
  graphH = height / 2;
}

function draw() {
  graphW = width / 2;
  graphH = height / 2;
  sim = createGraphics(graphW, graphH);
  sim.background(51);
  for (let player of players) {
    player.show();
  }
  image(sim, width / 2, 0);
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
    sim.ellipse(sim.width / 3, sim.height * this.y, sim.width * this.width, sim.height * this.height)
  }
  this.run = (y, vel, tyu, w, tyb, dist, ryb, ryt) => {
    return this.nn.predict([y, vel, tyu, w, tyb, dist, ryb, ryt]);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}