const players = [];
const playerStorage = [];
const playerAmt = 50;
const walls = [];
let generations = 0;
let sim;
let graphW;
let graphH;
let graphpos;

function setup() {
  if (playerAmt % 2) {
    throw new Error("playerAmt must be an even number.");
  }
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
  sim.text("Generations: "+generations, 20+textWidth("FPS: "+round(frameRate())), 15);
  for (let i = walls.length - 1; i >= 0; i--) {
    if (walls[i].show() == "spliceMe") {
      walls.splice(i, 1);
      walls.push(new wall());
    }
  }
  for (let i = players.length - 1; i >= 0; i--) {
    players[i].up();
    if (players[i].show() == "spliceMe") {
      playerStorage.push(players.splice(i, 1));
    }
  }
  image(sim, graphPos.x, graphPos.y);
  newGen();
  console.log("frame");
}

function newGen() {
  if (players.length <= 0) {
    generations++;
    walls.splice(0, walls.length);
    walls.push(new wall());
    players.sort((a, b) => {
      return b.score-a.score;
    })
    for (let i = 0; i < playerAmt/2; i++) {
      players.push(playerStorage[i].nn.mutate(mutate));
      players.push(playerStorage[i].nn.mutate(mutate));
    }
    playerStorage.splice(0, playerStorage.length);
  }
}

function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

const player = function (nn) {
  this.score = 0;
  this.nn = nn;
  this.y = random(0.1, 0.9);
  this.vel = 0;
  this.r = 1 / 16;
  this.show = () => {
    this.score++;
    sim.noStroke();
    sim.fill(235, 255 / 5);
    sim.ellipse(sim.width / 3, sim.height * this.y, sim.width * this.r, sim.height * this.r);
    this.vel-=0.0002;
    this.y-= this.vel;
    console.log(sim.height, this.y-1/sim.height);
    if (this.y+this.r/2 > 1 || this.y+this.r < 0 || collideRectCircle(walls[0].x, walls[0].topY, walls[0].width, walls[0].height, 1/3, this.y, this.r)) {
      return "spliceMe";
    }
  }
  this.run = (y, vel, tyu, w, tyb, dist) => {
    return this.nn.predict([y, vel, tyu, w, tyb, dist]);
  }
  this.up = () => {
    let out = this.run(this.y, this.vel*100, walls[0].topY, walls[0].height, walls[0].bottomY, walls[0].x-1/3);
    // console.log(walls[0].x-1/3);
    if (out[0] > out[1]) {
      this.vel+=0.001;
    }
  }
}

const wall = function() {
  this.topY = random(2/16, 8/16);
  this.bottomY = random(this.topY, 14/16);
  this.height = this.bottomY-this.topY;
  this.width = 1/16;
  this.x = 1;
  this.show = () => {
    this.x-=0.01;
    sim.noStroke();
    sim.fill(235, 255);
    sim.rect(this.x*sim.width, this.topY*sim.height, this.width*sim.width, this.height*sim.height);
    if (this.x <= 0) {
      return "spliceMe";
    }
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
