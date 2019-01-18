var zombies = [];
var player;
var bullets = [];
var gunshoot, boss;

function preload() {
  gunshoot = loadSound('gunshoot.mp3');
  boss = loadSound('boss.m4a');
}

function setup() {
  // angleMode(DEGREES);
  rectMode(CENTER);
  createCanvas(document.body.clientWidth, document.body.clientHeight)
  player = new Player(width / 2, height / 2);
  for(let i = 0; i < 10; i++) {
    zombies.push(newZombie());
  }
  boss.loop();
}

function draw() {
  background(0);
  for(let i = bullets.length - 1; i >= 0; i--) {
    for(let j = zombies.length - 1; j >= 0; j--) {
      if(dist(bullets[i].x, bullets[i].y, zombies[j].x, zombies[j].y) < 40) {
        zombies[j].shooted();
        bullets[i].die = true;
      }
    }

    if(bullets[i].die)
      bullets.splice(i, 1);
    else {
      bullets[i].draw();
    }
  }

  player.widthGun();

  for(let i = zombies.length - 1; i >= 0; i --) {
    if(zombies[i].die)
      zombies[i] = newZombie();
    else
      zombies[i].draw();
  }
}

class Zombie {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.rotate = 0;
    this.pos = createVector(0, 0);
    this.speed = 1;
    this.health = 100;
    this.die = false;
  }

  move() {
    let v = createVector(player.x - this.x, player.y - this.y);
    let sub = v.sub(this.pos);
    sub.setMag(this.speed);

    if(sub.mag() < 10) this.pos = createVector(0, 0)

    this.pos = sub;
    this.rotate = this.pos.heading();
    this.x += this.pos.x;
    this.y += this.pos.y;
  }

  shooted() {
    this.health -= 50;
    if(this.health <= 0) this.die = true;
  }

  draw() {
    if(player)
      this.move();

    push();
    translate(this.x, this.y);
    scale(0.8, 0.8);

    stroke(color(100, 100, 100));
    noFill();
    rect(0, -50, 40, 10);
    rectMode(CORNER);
    fill('red');
    rect(-20, -55, map(this.health, 0, 100, 0, 40), 10);
    rectMode(CENTER);

    noStroke();
    rotate(this.rotate);
    // body
    fill('#2196F3');
    rect(0, 0, 40, 40);
    fill('#d5d589');
    rect(0, 0, 25, 25);
    fill('black');
    rect(-5, 0, 15, 15);
    //hand
    fill('#2196F3');
    rect(5, 25, 30, 10);
    fill('#d5d589');
    rect(20, 25, 10, 10);
    fill('#2196F3');
    rect(5, -25, 30, 10);
    fill('#d5d589');
    rect(20, -25, 10, 10);
    pop();
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 2;
    this.rotate = 0;

    this.last_shoot = 0;
    this.delay_shoot = 5;
  }

  turn_around() {
    let v = createVector(mouseX - this.x, mouseY - this.y);
    this.rotate = v.heading();
  }

  move() {
    if(keyIsDown(87)) {
      this.y -= this.speed;
    }
    if(keyIsDown(83)) {
      this.y += this.speed;
    }
    if(keyIsDown(65)) {
      this.x -= this.speed;
    }
    if(keyIsDown(68)) {
      this.x += this.speed;
    }
  }

  shoot() {
    if(frameCount > this.last_shoot + this.delay_shoot) {
      if(mouseIsPressed) {
        let bullet = new Bullet(this.x, this.y, this.rotate);
        bullets.push(bullet);
        this.last_shoot = frameCount;
        gunshoot.play();
      }
    }
  }

  widthGun() {
    this.turn_around()
    this.move();
    this.shoot();

    push();
    translate(this.x, this.y);
    rotate(this.rotate);

    //gun
    noStroke();
    fill('#455A64');
    rect(30, 0, 60, 8)
    beginShape();
    vertex(60, 4);
    quadraticVertex(70, 0, 60, -4);
    endShape(CLOSE);

    // body
    stroke('#a5a576');
    strokeWeight(5);
    fill('#d5d589');
    ellipse(0, 0, 40);

    //hand
    stroke('#F44336');
    strokeWeight(2);
    fill('#E91E63');
    ellipse(22, 2, 10);
    ellipse(45, 6, 10);

    pop();
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(0);
    // body
    stroke('#a5a576');
    strokeWeight(5);
    fill('#d5d589');
    ellipse(0, 0, 40);

    //hand
    stroke('#F44336');
    strokeWeight(2);
    fill('#E91E63');
    ellipse(15, 15, 15);
    ellipse(15, -15, 15);
    pop();
  }
}

class Bullet {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.rotate = r;
    this.pos = createVector(0, 0);
    this.speed = 1;
    this.maxSpeed = 10;
    this.born = frameCount;
    this.life = 100;
    this.die = false;
  }

  destroy() {
    if(frameCount - this.born > this.life)
      this.die = true;
  }

  fly() {
    if(this.speed <= this.maxSpeed) this.speed += 1;
    this.pos = createVector(this.speed, 0).rotate(this.rotate);
    this.x += this.pos.x;
    this.y += this.pos.y;
  }

  draw() {
    this.destroy();
    if(this.die) return;

    this.fly();

    push()
    noStroke();
    translate(this.x, this.y);
    rotate(this.rotate);

    for(let i = 0; i > -15; i--) {
      fill(color(255, 255, 255, 255 + i * 12));
      rect(i * this.speed * 0.5 + 60 + this.speed * 3, 0, 5, 5 + i * 0.1);
    }

    pop();
  }
}

function newZombie() {
  let randomX = !!round(random(0, 1)) ? random(-width, 0) : random(width, 2 * width);
  let randomY = !!round(random(0, 1)) ? random(-height, 0) : random(height, 2 * height);
  let zombie = new Zombie(randomX, randomY);
  return zombie;
}
