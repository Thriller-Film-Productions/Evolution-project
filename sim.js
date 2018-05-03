const players = [];
const playersStorage = [];
const playerAmt = 100;
const walls = [];
let sim;
let graphW;
let graphH;
let graphpos;

function setup() {
  createCanvas(windowWidth, windowHeight).position(0, 0);
  for (let i = 0; i < playerAmt; i++) {
    console.log("new player");
    players.push(new player(new NeuralNetwork(6, 16, 2)));
  }
  graphW = height;
  graphH = height;
  graphPos = createVector(width - height, 0);
  sim = createGraphics(graphW, graphH);
  walls.push(new wall());
}

function draw() {
  graphW = height;
  graphH = height;
  graphPos = createVector(width - height, 0);
  sim = createGraphics(graphW, graphH);
  sim.background(51);
  sim.fill(235);
  sim.text("FPS: "+round(frameRate()), 10, 15);
  for (let i = walls.length - 1; i >= 0; i--) {
    if (walls[i].show() == "spliceMe") {
      walls.splice(i, 1);
    }
  }
  for (let i = players.length - 1; i >= 0; i--) {
    if (players[i].show() == "spliceMe") {
      players.splice(i, 1);
    }
  }
  image(sim, graphPos.x, graphPos.y);
  newGen();
  console.log("frame");
}

function newGen() {
  console.log(players);
  if (players.length <=0) {
    for (let i = 0; i < playerAmt; i++) {
      console.log("new player");
      players.push(new player(new NeuralNetwork(6, 16, 2)));
    }
  }
}

const player = function (nn) {
  this.nn = nn;
  this.y = random(0.1, 0.9);
  this.vel = 0;
  this.r = 1 / 16;
  this.show = () => {
    sim.noStroke();
    sim.fill(235, 255 / 5);
    sim.ellipse(sim.width / 3, sim.height * this.y, sim.width * this.r, sim.height * this.r);
    this.vel-=0.0002;
    this.y-= this.vel;
    console.log(sim.height, this.y-1/sim.height);
    if (this.y+this.r/2 > 1 || this.y+this.r < 0) {
      return "spliceMe";
    }
  }
  this.run = (y, vel, tyu, w, tyb, dist) => {
    return this.nn.predict([y, vel, tyu, w, tyb, dist, ryb, ryt]);
  }
  this.up = () => {
    this.run(this.y, this.vel, /*top of wall*/ 1, /*height of wall*/ 1, /*bottom of wall*/ 1, /*distance to wall*/ 1);
  }
}

const wall = function() {
  this.topY = random(2/16, 8/16);
  this.bottomY = random(this.topY, 14/16);
  this.height = this.bottomY-this.topY;
  this.width = 1/16;
  this.x = sim.width;
  this.show = () => {
    this.x=-0.1;
    fill(235, 255);
    sim.rect(this.x, this.topY*sim.height, this.height*sim.height, this.width*sim.width);
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
