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

let selectedSprite = null;
let isDragging = false;

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

    checkCollision(other) {
        return (
            this.x < other.x + SPRITE_SIZE &&
            this.x + SPRITE_SIZE > other.x &&
            this.y < other.y + SPRITE_SIZE &&
            this.y + SPRITE_SIZE > other.y
        );
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

canvas.addEventListener("mousedown", (event) => {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    for (const gameObject of gameObjects) {
        if (
            mouseX >= gameObject.x &&
            mouseX <= gameObject.x + SPRITE_SIZE &&
            mouseY >= gameObject.y &&
            mouseY <= gameObject.y + SPRITE_SIZE
        ) {
            selectedSprite = gameObject;
            isDragging = true;
            break;
        }
    }
});

canvas.addEventListener("mousemove", (event) => {
    if (isDragging && selectedSprite) {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;

        selectedSprite.x = mouseX - SPRITE_SIZE / 2;
        selectedSprite.y = mouseY - SPRITE_SIZE / 2;
    }
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
    selectedSprite = null;
});

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gameObjects.forEach((gameObject) => {
        gameObject.update();
        gameObject.draw();
    });

    gameObjects.forEach((gameObject) => {
        if (selectedSprite && selectedSprite !== gameObject && selectedSprite.checkCollision(gameObject)) {
            handleCollision(selectedSprite, gameObject);
        }
    });

    requestAnimationFrame(updateGame);
}

function handleCollision(sprite1, sprite2) {
    if (sprite1 instanceof Rock) {
        if (sprite2 instanceof Scissors) {
            sprite2.image = ROCK_IMAGE;
            sprite2.constructor = Rock;
            sprite2.speedX *= -1;
            sprite2.speedY *= -1;
            sprite1.speedX *= -1;
            sprite1.speedY *= -1;
        } else if (sprite2 instanceof Paper) {
            sprite1.image = PAPER_IMAGE;
            sprite1.constructor = Paper;
            sprite2.speedX *= -1;
            sprite2.speedY *= -1;
            sprite1.speedX *= -1;
            sprite1.speedY *= -1;
        } else if (sprite2 instanceof Rock) {
            sprite2.speedX *= -1;
            sprite2.speedY *= -1;
            sprite1.speedX *= -1;
            sprite1.speedY *= -1;
        }
    } else if (sprite1 instanceof Scissors) {
        if (sprite2 instanceof Paper) {
            sprite2.image = SCISSORS_IMAGE;
            sprite2.constructor = Scissors;
        } else if (sprite2 instanceof Rock) {
            sprite1.image = ROCK_IMAGE;
            sprite1.constructor = Rock;
            sprite2.speedX *= -1;
            sprite2.speedY *= -1;
            sprite1.speedX *= -1;
            sprite1.speedY *= -1;
        } else if (sprite2 instanceof Scissors) {
            sprite2.speedX *= -1;
            sprite2.speedY *= -1;
            sprite1.speedX *= -1;
            sprite1.speedY *= -1;
        }
    } else if (sprite1 instanceof Paper) {
        if (sprite2 instanceof Rock) {
            sprite2.image = PAPER_IMAGE;
            sprite2.constructor = Paper;
        } else if (sprite2 instanceof Scissors) {
            sprite1.image = SCISSORS_IMAGE;
            sprite1.constructor = Scissors;
            sprite2.speedX *= -1;
            sprite2.speedY *= -1;
            sprite1.speedX *= -1;
            sprite1.speedY *= -1;
        } else if (sprite2 instanceof Paper) {
            sprite2.speedX *= -1;
            sprite2.speedY *= -1;
            sprite1.speedX *= -1;
            sprite1.speedY *= -1;
        }
    }
}

updateGame();
