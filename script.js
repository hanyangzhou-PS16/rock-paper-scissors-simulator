const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ROCK_IMAGE = new Image();
ROCK_IMAGE.src = "images/rock.png";

const SCISSORS_IMAGE = new Image();
SCISSORS_IMAGE.src = "images/scissors.png";

const PAPER_IMAGE = new Image();
PAPER_IMAGE.src = "images/paper.png";

const SPRITE_SPEED = 3;
const SPRITE_SIZE = 50;

class GameObject {
    constructor(image, x, y, speedX, speedY) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width - SPRITE_SIZE) {
            this.speedX *= -1;
        }

        if (this.y < 0 || this.y > canvas.height - SPRITE_SIZE) {
            this.speedY *= -1;
        }
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, SPRITE_SIZE, SPRITE_SIZE);
    }
}

class Rock extends GameObject {
    constructor(x, y) {
        super(ROCK_IMAGE, x, y, randomDirection(), randomDirection());
    }
}

class Scissors extends GameObject {
    constructor(x, y) {
        super(SCISSORS_IMAGE, x, y, randomDirection(), randomDirection());
    }
}

class Paper extends GameObject {
    constructor(x, y) {
        super(PAPER_IMAGE, x, y, randomDirection(), randomDirection());
    }
}

function randomDirection() {
    return Math.random() < 0.5 ? -SPRITE_SPEED : SPRITE_SPEED;
}

const gameObjects = [];

for (let i = 0; i < 10; i++) {
    const x = Math.random() * (canvas.width - SPRITE_SIZE);
    const y = Math.random() * (canvas.height - SPRITE_SIZE);
    gameObjects.push(new Rock(x, y));
}

for (let i = 0; i < 10; i++) {
    const x = Math.random() * (canvas.width - SPRITE_SIZE);
    const y = Math.random() * (canvas.height - SPRITE_SIZE);
    gameObjects.push(new Scissors(x, y));
}

for (let i = 0; i < 10; i++) {
    const x = Math.random() * (canvas.width - SPRITE_SIZE);
    const y = Math.random() * (canvas.height - SPRITE_SIZE);
    gameObjects.push(new Paper(x, y));
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gameObjects.forEach((gameObject) => {
        gameObject.update();
        gameObject.draw();
    });

    requestAnimationFrame(updateGame);
}

updateGame();
