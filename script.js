const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('game-overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayMessage = document.getElementById('overlay-message');

const CELL_SIZE = 20;
const BORDER = 2; // For inner cells to look like segments
let GAME_SPEED = 200; // ms

let snake = [];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snake-high-score') || 0;
let gameInterval = null;
let isStarted = false;
let isPaused = false;
let changingDirection = false;

highScoreEl.innerText = highScore;

// Define colors
const COLORS = {
    head: '#252e1b',
    body: '#252e1b',
    food: '#252e1b',
    bg: '#8b9d77'
};

function initGame() {
    // Starting position
    snake = [
        { x: 10 * CELL_SIZE, y: 10 * CELL_SIZE },
        { x: 9 * CELL_SIZE, y: 10 * CELL_SIZE },
        { x: 8 * CELL_SIZE, y: 10 * CELL_SIZE }
    ];
    dx = CELL_SIZE;
    dy = 0;
    score = 0;
    scoreEl.innerText = score;
    GAME_SPEED = 200;
    createFood();
    
    // reset visual
    clearCanvas();
    drawFood();
    drawSnake();
}

function clearCanvas() {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function randomFood(min, max) {
    return Math.round((Math.random() * (max - min) + min) / CELL_SIZE) * CELL_SIZE;
}

function createFood() {
    food = {
        x: randomFood(0, canvas.width - CELL_SIZE),
        y: randomFood(0, canvas.height - CELL_SIZE)
    };
    // Ensure food doesn't spawn on snake
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            createFood();
        }
    });
}

function drawFood() {
    ctx.fillStyle = COLORS.food;
    // Classic square food, slightly smaller than cell for pixel vibe
    ctx.fillRect(food.x + 2, food.y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
}

function drawSnake() {
    // Draw classic blocky snake
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? COLORS.head : COLORS.body;
        
        // Draw square with 1px border visually by making it smaller
        ctx.fillRect(part.x + 1, part.y + 1, CELL_SIZE - 2, CELL_SIZE - 2);

        // Simple pixel eyes for the head
        if(index === 0) {
            ctx.fillStyle = '#000000';
            let eyeSize = 4;
            
            // determine offset based on direction
            let offsetX1 = 4, offsetY1 = 4, offsetX2 = 12, offsetY2 = 4;
            if (dx === CELL_SIZE) { // right
                offsetX1 = 12; offsetY1 = 4; offsetX2 = 12; offsetY2 = 12;
            } else if (dx === -CELL_SIZE) { // left
                offsetX1 = 4; offsetY1 = 4; offsetX2 = 4; offsetY2 = 12;
            } else if (dy === CELL_SIZE) { // down
                offsetX1 = 4; offsetY1 = 12; offsetX2 = 12; offsetY2 = 12;
            }
            
            ctx.fillRect(part.x + offsetX1, part.y + offsetY1, eyeSize, eyeSize);
            ctx.fillRect(part.x + offsetX2, part.y + offsetY2, eyeSize, eyeSize);
        }
    });
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Food check
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.innerText = score;
        
        // speed up significantly after each point
        if(GAME_SPEED > 60) {
            GAME_SPEED -= 5;
        }

        if (score > highScore) {
            highScore = score;
            highScoreEl.innerText = highScore;
            localStorage.setItem('snake-high-score', highScore);
        }
        createFood();
        
        // UI effect
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(0,0, canvas.width, canvas.height); // flash
        
    } else {
        snake.pop();
    }
}

function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function main() {
    if (hasGameEnded()) {
        gameOver();
        return;
    }
    
    setTimeout(() => {
        changingDirection = false;
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        if(isStarted) {
            main();
        }
    }, GAME_SPEED);
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const W_KEY = 87;
    const A_KEY = 65;
    const S_KEY = 83;
    const D_KEY = 68;

    if(changingDirection) return;
    const keyPressed = event.keyCode;
    const goingUp = dy === -CELL_SIZE;
    const goingDown = dy === CELL_SIZE;
    const goingRight = dx === CELL_SIZE;
    const goingLeft = dx === -CELL_SIZE;

    if ((keyPressed === LEFT_KEY || keyPressed === A_KEY) && !goingRight) {
        dx = -CELL_SIZE;
        dy = 0;
        changingDirection = true;
    }
    if ((keyPressed === UP_KEY || keyPressed === W_KEY) && !goingDown) {
        dx = 0;
        dy = -CELL_SIZE;
        changingDirection = true;
    }
    if ((keyPressed === RIGHT_KEY || keyPressed === D_KEY) && !goingLeft) {
        dx = CELL_SIZE;
        dy = 0;
        changingDirection = true;
    }
    if ((keyPressed === DOWN_KEY || keyPressed === S_KEY) && !goingUp) {
        dx = 0;
        dy = CELL_SIZE;
        changingDirection = true;
    }
}

function startGame() {
    isStarted = true;
    overlay.classList.add('hidden');
    initGame();
    main();
}

function gameOver() {
    isStarted = false;
    overlayTitle.innerText = 'Game Over';
    overlayTitle.style.color = '#ef4444';
    overlayMessage.innerHTML = `Your Score: <strong>${score}</strong><br>Press <strong>Space</strong> or <strong>Button</strong> to Restart`;
    overlay.classList.remove('hidden');
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    // Start with space
    if(!isStarted && e.code === 'Space') {
        startGame();
        return;
    }
    if(isStarted) {
        changeDirection(e);
        // Prevent default scrolling for arrows and space
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }
});

startBtn.addEventListener('click', () => {
    if(!isStarted) startGame();
});

// initial setup graphic
initGame(); // draw initial state behind overlay

