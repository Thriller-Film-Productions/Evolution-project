const players = [];
const playerStorage = [];
const playerAmt = 1000;
const walls = [];
let avgs = [];
let generations = 0;
let sim;
let graphW;
let graphH;
let graphpos;


function setup() {
  if (playerAmt % 4) {
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
  sim.text("FPS: " + round(frameRate()), 10, 15);
  sim.text("Generations: " + generations, 20 + textWidth("FPS: " + round(frameRate())), 15);
  sim.text("Avg score: " + getAvgScore(), 30 + textWidth("FPS: " + round(frameRate())+"Generations: " + generations), 15);
  for (let i = walls.length - 1; i >= 0; i--) {
    if (walls[i].show() == "spliceMe") {
      walls.splice(i, 1);
      walls.push(new wall());
    }
  }
  for (let i = players.length - 1; i >= 0; i--) {
    if (players[i]) {
      players[i].up();
      if (players[i].show() == "spliceMe") {
        playerStorage.push(players.splice(i, 1)[0]);
      }
    }
  }
  image(sim, graphPos.x, graphPos.y);
  newGen();
}

function newGen() {
  if (players.length <= 0) {
    avgs.push(getAvgScore());
    //console.log(JSON.stringify(avgs))
    generations++;
    walls.splice(0, walls.length);
    walls.push(new wall());
    players.sort((a, b) => {
      return b.score - a.score;
    })
    for (let i = 0; i < playerAmt / 4; i++) {
      players.push(new player(playerStorage[i].nn));
      players.push(new player(playerStorage[i].nn));
      players.push(new player(playerStorage[i].nn));
      players.push(new player(playerStorage[i].nn));
    }
    playerStorage.splice(0, playerStorage.length);
  }
}

function mutate(x) {
  if (random(1) < 0.5) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

const player = function (nn) {
  this.score = 0;
  this.nn = nn.copy();
  this.nn.mutate(mutate);
  this.y = 0.5
  this.vel = 0;
  this.r = 1 / 16;
  this.show = () => {
    this.score++;
    sim.noStroke();
    sim.fill(235, 255 / 5);
    sim.ellipse(sim.width / 3, sim.height * this.y, sim.width * this.r, sim.height * this.r);
    this.vel -= 0.0002;
    this.y -= this.vel;
    if (this.y - this.r / 2 > 1 || this.y + this.r < 0 || collideRectCircle(walls[0].x, walls[0].topY, walls[0].width, walls[0].height, 1 / 3, this.y, this.r)) {
      return "spliceMe";
    }
  }
  this.run = (y, vel, tyu, w, tyb, dist) => {
    return this.nn.predict([y, vel, tyu, w, tyb, dist]);
  }
  this.up = () => {
    let out = this.run(this.y, this.vel * 100, walls[0].topY, walls[0].height, walls[0].bottomY, walls[0].x - 1 / 3);
    // console.log(walls[0].x-1/3);
    if (out[0] > out[1]) {
      this.vel += 0.001;
    }
  }
}

const wall = function () {
  this.topY = random(0, 2/3);
  this.bottomY = this.topY-1/3;
  this.height = this.topY-this.bottomY;
  this.width = 1 / 16;
  this.x = 1;
  this.show = () => {
    this.x -= 0.01;
    sim.noStroke();
    sim.fill(235, 255);
    sim.rect(this.x * sim.width, this.topY * sim.height, this.width * sim.width, this.height * sim.height);
    if (this.x <= 0) {
      return "spliceMe";
    }
  }
}

function getAvgScore() {
  let arr = players.concat(playerStorage);
  let scores = arr.map(i => i.score);
  let avg = scores.reduce((acc, val) => acc+val)/arr.length;
  return avg;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
