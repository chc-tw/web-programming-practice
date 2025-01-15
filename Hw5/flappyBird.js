// Fetch the canvas element from the DOM
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

// Audio files
var passPipeSound = new Audio('passPipe.mp3');
var endGameSound = new Audio('endGame.mp3');

// Images
var birdImage = new Image();
birdImage.src = "bird.png";
var pipeUpImage = new Image();
pipeUpImage.src = "pipeUp.png";
var pipeDownImage = new Image();
pipeDownImage.src = "pipeDown.png";
var bgImage = new Image();
bgImage.src = "background.png";
var birdFrame = 0;
var bgX = 0;
var scrollSpeed = 1;
var backgroundX = 0;

// Game variables
var gravity = 0.1;
var velocity = 0;
var position = 250; // Initial position of bird
var obstacles = [];
var gameSpeed = 2;
var frame = 0;
var score = 0;
var highestScore = 0;
var pipe = 0;
var highestPipe = 0;
var isGameOver = false;
var restart = false;
var bird = {
    x: 50,
    y: 250,
    w: 34,
    h: 24,
    angle: 0
};


// Draw bird
function drawBird() {
    ctx.save();
    ctx.translate(bird.x + bird.w / 2, bird.y + bird.h / 2);
    ctx.rotate(bird.angle * Math.PI / 180);
    var frame_x = (birdFrame % 3) * 255; // 255 is the width of one bird frame in the source image
    ctx.drawImage(birdImage, frame_x, 0, 255, 180, -bird.w / 2, -bird.h / 2, bird.w, bird.h);
    ctx.restore();
    if(frame % 50 == 0)
        birdFrame++;
}

// Create Obstacles
function createObstacles() {
    let obstaclePos = 800;
    let minHeight = 20;
    let maxHeight = 200;
    let height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    let gap = 170;
    let obstacleWidth = 90;

    obstacles.push({
        x: obstaclePos,
        y: 0,
        width: obstacleWidth,
        height: height
    });

    obstacles.push({
        x: obstaclePos,
        y: height + gap,
        width: obstacleWidth,
        height: canvas.height - height - gap
    });
}


// Draw obstacles
function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        if(i % 2 == 0){
            let scaledHeightUp = obstacles[i].height ;
            ctx.drawImage(pipeUpImage, obstacles[i].x, 0, obstacles[i].width, scaledHeightUp);
        } else {
            let scaledHeightDown = (canvas.height - obstacles[i-1].height - 170) ;
            ctx.drawImage(pipeDownImage, obstacles[i].x, obstacles[i-1].height + 170, obstacles[i].width, scaledHeightDown);
        }
    }
}

// Draw score
function drawScore() {
    ctx.fillStyle = "#000000";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, 10, 50);
    ctx.fillText("Pass Pipe: " + pipe, 10, 100);
}

function drawBackground() {
    var pattern = ctx.createPattern(bgImage, 'repeat-x');
    ctx.fillStyle = pattern;
    ctx.translate(bgX, 0);
    ctx.fillRect(0, 0, canvas.width + bgImage.width, canvas.height);
    ctx.translate(-bgX, 0);
    bgX--;
    if (bgX < -bgImage.width) bgX = 0;
}

// Update the game frame
function update() {
    if (!isGameOver) {
        // Clearing and redrawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        drawBird();
        drawObstacles();
        drawScore();
        
        score++; // Time-based scoring

        // Obstacle creation and handling
        if (frame % 150 == 0) {
            createObstacles();
        }
        for (let i = 0; i < obstacles.length; i++) {
            obstacles[i].x -= gameSpeed;
            if (bird.x < obstacles[i].x + obstacles[i].width &&
                bird.x + bird.w > obstacles[i].x &&
                bird.y < obstacles[i].y + obstacles[i].height &&
                bird.y + bird.h > obstacles[i].y) {
                // Bird has collided with an obstacle
                console.log("Game Over!");
                velocity = -5;
                isGameOver = true;
                //return;
            }
            if (!obstacles[i].scored && obstacles[i].x < bird.x) {
                // Bird passed an obstacle
                passPipeSound.play();
                pipe++;
                obstacles[i].scored = true;
                obstacles[i+1].scored = true;
                console.log("Passed an obstacle!"+pipe+obstacles[i].scored+i);
            }
        }

        // Bird physics
        velocity += gravity; // Apply gravity to velocity
        bird.y += velocity; // Apply velocity to bird's position
        bird.angle = Math.min((velocity / 10) * 90, 90);

        // Boundary handling
        if (bird.y > canvas.height - bird.h) { // Stop the bird from falling off the screen
            bird.y = canvas.height - bird.h;
            velocity = 0;
        }
        if (bird.y < 0) { // Stop the bird from flying off the screen
            bird.y = 0;
            velocity = 0;
        }

        frame++;
        requestAnimationFrame(update);
    } else{
        endGameSound.play();
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        drawBird();
        drawObstacles();
        drawScore();
        velocity += gravity;
        bird.y += velocity;
        ctx.fillStyle = "#000000";
        ctx.font = "50px Arial";
        ctx.fillText("Game Over!", canvas.width / 2 - 120, canvas.height / 2);
        ctx.font = "25px Arial";
        ctx.fillText("press keys to Play Again", canvas.width / 2 - 120, canvas.height / 2 + 50);
        if (score > highestScore) {
            highestScore = score;
        }
        if (pipe > highestPipe) {
            highestPipe = pipe;
        }
        ctx.fillText("highest score:" + (highestScore-1) + "  " + "highest pipe:" + highestPipe, canvas.width / 2 - 170, canvas.height / 2 + 100);
        if (bird.y > canvas.height+10) {
            restart = true;
            return; // If bird has dropped out of the window, stop updating
        }
        requestAnimationFrame(update);
    }
}

// Click handling
// canvas.addEventListener("click", function(e) {
//     if (isGameOver) {
//         // Reset all the variables
//         velocity = 0;
//         position = 250;
//         obstacles = [];
//         frame = 0;
//         score = 0;
//         pipe = 0;
//         isGameOver = false;
//         bird = {
//             x: 50,
//             y: 250,
//             w: 34,
//             h: 24,
//             angle: 0
//         };
//         requestAnimationFrame(update);
//     } else {
//         velocity -= 20;
//     }
// });

window.addEventListener("keydown", function(e) {
    if (isGameOver && restart) {
        // Reset all the variables
        velocity = 0;
        position = 250;
        obstacles = [];
        frame = 0;
        score = 0;
        pipe = 0;
        isGameOver = false;
        restart = false;
        bird = {
            x: 50,
            y: 250,
            w: 34,
            h: 24,
            angle: 0
        };
        requestAnimationFrame(update);
    } else if (!isGameOver) {
        if (e.key == "ArrowUp") {
            velocity = 0;
            velocity -= 4;
        } else if (e.key == "ArrowRight") {
            bird.x += 10;
        } else if (e.key == "ArrowLeft") {
            bird.x -= 10;
        }
    }
    
});

update();
