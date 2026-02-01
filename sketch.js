let fish;
let showBones;
let isFin;

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
  mouse = createVector(mouseX, mouseY);
  fish = new Fish(2);
  isFin = false;
  showBones = true;
}

function draw() {
  mouse = createVector(mouseX, mouseY);
  background(220);
  fish.update();
}

class Fish {
  constructor(size){
    this.size = size
    this.shape = [20, 30, 25, 20, 15, 12, 10];
    this.shape = this.shape.map(item => {return item * size});
    this.chain = new Chain(7, this.shape);
  }
  
  update() {
    this.chain.update();
  }
}

class Chain {
  constructor(length, shape){
    this.length = length;
    this.shape = shape;
    this.links = [];
    for (let i = 0; i < this.length; i++){
      if (i === 0){
        this.links.push(new ChainLink(shape[i], null, null));
      } else {
        this.links.push(new ChainLink(shape[i], this.links[i - 1], null));
      }
    }
    for (let i = 0; i < this.length - 1; i++){
      this.links[i].next = this.links[i + 1];
    }
    
  } 
  
  update() {
    this.generateSkin(this.links);
    for (let i = 0; i < this.length; i++){
      this.links[i].update();
      if (showBones) {
        this.links[i].displayBones();
      }
    }
  }
  
  generateSkin(chain){
    fill(100, 180, 100);
    stroke(150, 230, 150)
    beginShape();
    for (let i = 0; i < this.length; i++){
      curveVertex(chain[i].rightEdge.x, chain[i].rightEdge.y);
      if (i === this.length - 1){
        curveVertex(chain[i].tailEdge.x, chain[i].tailEdge.y);
      }
    }
    for (let i = this.length - 1; i > -1; i--){
      curveVertex(chain[i].leftEdge.x, chain[i].leftEdge.y);
      if (i === 0) {
        curveVertex(chain[i].headEdge.x, chain[i].headEdge.y);
      }
    }
    endShape(CLOSE);
  }

}

class ChainLink {
  constructor(r, previous, next) {
    this.position = createVector(0,0);
    this.direction = createVector(0,0); //from ellipse
    this.rightEdge = createVector(0,0);
    this.leftEdge = createVector(0,0);
    this.headEdge = createVector(0,0);
    this.tailEdge = createVector(0,0);
    this.r = r;
    this.previous = previous;
    this.next = next;
  }
  
  update(){
    if (this.previous === null) {
      this.position.set(mouseX, mouseY)
    } else {
      this.position.add(this.calculateLocation());
    }
    this.skeleton(this.position, this.previous, this.next, this.direction, this.r);
  }

  skeleton(position, previous, next, direction, r) {
    if (previous === null){
      this.calculateLocation(next); //get direction for head
      this.headEdge = p5.Vector.add(position, direction);
    }
    if (next === null){
      this.tailEdge = p5.Vector.sub(position, direction);
    }
    let offset1 = createVector(direction.y * -1, direction.x);
    let offset2 = createVector(direction.y, direction.x * -1);
    this.rightEdge = p5.Vector.add(position, offset1);
    this.leftEdge = p5.Vector.add(position, offset2);
  }
  
  calculateLocation(next) { //change this to link nodes or something
    let distanceBetween;
    if (next) {
      distanceBetween = p5.Vector.sub(this.position, this.next.position);
    } else {
      distanceBetween = p5.Vector.sub(this.previous.position, this.position);
    }
    this.direction = p5.Vector.normalize(distanceBetween);
    this.direction.mult(this.r);
    return p5.Vector.sub(distanceBetween, this.direction);
  }
  
  displayBones(){
    fill(0, 235, 100);
    stroke(0);
    ellipse(this.position.x, this.position.y, this.r*2);
    fill(0);
    ellipse(this.rightEdge.x, this.rightEdge.y, 20);
    ellipse(this.leftEdge.x, this.leftEdge.y, 20);
    if (this.isFin) {
      ellipse(this.finR.x, this.finR.y, 20);
      ellipse(this.finL.x, this.finL.y, 20);
    }
    if (this.previous === null) {
      ellipse(this.headEdge.x, this.headEdge.y, 20);
    }
    if (this.next === null){
      ellipse(this.tailEdge.x, this.tailEdge.y, 20);
    }
  }

}
