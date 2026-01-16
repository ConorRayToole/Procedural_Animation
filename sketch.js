let chain;

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
  mouse = createVector(mouseX, mouseY);
  chain = new Chain(15);
}

function draw() {
  mouse = createVector(mouseX, mouseY);
  background(220);
  chain.update();
}

class Chain {
  constructor(length){
    this.length = length;
    this.links = [];
    for (let i = 0; i < this.length; i++){
      if (i === 0){
        this.links.push(new ChainLink(40, null));
      } else {
        this.links.push(new ChainLink(30, this.links[i - 1]));
      }
    }
  } 
  
  update() {
    for (let i = 0; i < this.length; i++){
      this.links[i].update();
      //this.links[i].display();
      this.generateSkin(this.links);
      //this.links[i].displayBones();
    }
  }
  
  generateSkin(chain){
    fill(100, 180, 100);
    stroke(150, 230, 150)
    beginShape();
    for (let i = 0; i < this.length; i++){
      curveVertex(chain[i].rightEdge.x, chain[i].rightEdge.y);
      if (i === this.length - 1){
        //tail
        let reverseDirection = p5.Vector.mult(chain[i].direction, -1)
        let tail = p5.Vector.add(chain[i].position, reverseDirection);
        curveVertex(tail.x, tail.y);
      }
    }
    for (let i = this.length - 1; i > 0; i--){
      curveVertex(chain[i].leftEdge.x, chain[i].leftEdge.y);
    }
    endShape(CLOSE);
    //head
    ellipse(chain[0].position.x, chain[0].position.y, chain[0].r*2)
  }

}

class ChainLink {
  constructor(r, previous) {
    this.position = createVector(0,0);
    this.direction = createVector(0,0); //from ellipse
    this.r = r;
    this.rightEdge = createVector(0,0);
    this.leftEdge = createVector(0,0);
    this.previous = previous;
  }
  
  update(){
    if (this.previous === null) {
      this.position.set(mouseX, mouseY)
    } else {
      this.position.add(this.calculateLocation());
    }
    this.skin();
  }
  
  skin() {
    let offset1 = createVector(this.direction.y * -1, this.direction.x);
    let offset2 = createVector(this.direction.y, this.direction.x * -1);
    this.rightEdge = p5.Vector.add(this.position, offset1);
    this.leftEdge = p5.Vector.add(this.position, offset2);
  }
  
  getPointOnEllipse(angle){
    let result = createVector(0,0);
    result.x = this.position.x + this.r * cos(angle);
    result.y = this.position.y + this.r * sin(angle);
    return result
  }
  
  calculateLocation() {
    let distanceBetween = p5.Vector.sub(this.previous.position, this.position);
    this.direction = p5.Vector.normalize(distanceBetween);
    this.direction.mult(this.r);
    return p5.Vector.sub(distanceBetween, this.direction);
  }
  
  displayBones(){
    fill(0, 235, 100);
    stroke(0);
    ellipse(this.position.x, this.position.y, this.r*2)
    fill(0);
    ellipse(this.rightEdge.x, this.rightEdge.y, 20)
    fill(0);
    ellipse(this.leftEdge.x, this.leftEdge.y, 20)
  }

}