// setting up canvas
var ctx = document.getElementById('game-canvas').getContext('2d');

// framerates
var fps = 1000 / 10;
var animationSpeed = 3; // fps between each animation update
var animationTimer = 0;
var rotatingSpeed = 0.05;

var groundSpeed = -2;

var gameStart = false;
var playerDead = false;

var pipeSpacing = 160;
var screenWidth = 320;

var pipeTopY = 340;
var pipeBottomY = -140;

var score = 0;

var font = new FontFace('flap', '/fonts/flappybird.TTF');

// loading resources
var resources = new Image;
resources.src = 'images/resources.png';

// creating objects
var player = getObject(160, 200, 34, 24, 6, 982, 34, 24, 6, 62, 118);
var background = getObject(0, 0, 320, 570, 0, 0, 287, 511);
var ground = getObject(0, 460, 320, 111, 584, 0, 336, 111);
var groundCopy = getObject(320, 460, 320, 111, 584, 0, 336, 111);

var logo = getObject(71, 100, 178, 48, 702, 182, 178, 48);
var instructions = getObject(103, 260, 114, 98, 584, 182, 114, 98);

var playButton = getObject(108, 220, 104, 58, 708, 236, 104, 58);

var pipe1Top = getObject(screenWidth, pipeTopY, 52, 320, 168, 646, 52, 320);
var pipe1Bottom = getObject(screenWidth, pipeBottomY, 52, 320, 112, 646, 52, 320);

var pipe2Top = getObject(screenWidth + pipeSpacing, pipeTopY, 52, 320, 168, 646, 52, 320);
var pipe2Bottom = getObject(screenWidth + pipeSpacing, pipeBottomY, 52, 320, 112, 646, 52, 320);

var pipe3Top = getObject(screenWidth + pipeSpacing * 2, pipeTopY, 52, 320, 168, 646, 52, 320);
var pipe3Bottom = getObject(screenWidth + pipeSpacing * 2, pipeBottomY, 52, 320, 112, 646, 52, 320);

randomizePipe(pipe1Top, pipe1Bottom);
randomizePipe(pipe2Top, pipe2Bottom);
randomizePipe(pipe3Top, pipe3Bottom);

pipe1Top.scored = false;
pipe2Top.scored = false;
pipe3Top.scored = false;

// physics
var dy = 0;
var ay = 0;

// add mouse listener
document.addEventListener('mousedown', function (event) {
  if (!playerDead) {
    dy = -18;
    if (!gameStart) {
      gameStart = true;
      ay = 2;
    }
  } else {
    playerDead = false;
    gameStart = false;
    player.x = 160;
    player.y = 200;
    ay = 0;
    dy = 0;
    pipe1Top.x = screenWidth;
    pipe1Bottom.x = screenWidth;
    pipe2Top.x = screenWidth + pipeSpacing;
    pipe2Bottom.x = screenWidth + pipeSpacing;
    pipe3Top.x = screenWidth + pipeSpacing * 2;
    pipe3Bottom.x = screenWidth + pipeSpacing * 2;
    pipe1Top.scored = false;
    pipe2Top.scored = false;
    pipe3Top.scored = false;
    score = 0;
  }
});

function getObject(x, y, width, height, spriteX, spriteY, spriteWidth, spriteHeight, ...animationPosition) {
  var obj = {};

  if (animationPosition.length > 0) {
    obj.animationPosition = animationPosition;
    obj.currentFrame = 0;
    obj.animatingForward = true;
  }

  obj.x = x;
  obj.y = y;
  obj.width = width;
  obj.height = height;
  obj.rotation = 0;

  obj.spriteX = spriteX;
  obj.spriteY = spriteY;
  obj.spriteWidth = spriteWidth;
  obj.spriteHeight = spriteHeight;

  obj.contains = function (px, py) {
    return px > obj.x && py > obj.y && px < obj.x + obj.width && py < obj.y + obj.height;
  }

  obj.render = function () {
    if (animationPosition.length > 0) {
      ctx.save();
      ctx.translate(obj.x, obj.y);
      ctx.rotate(obj.rotation);
      ctx.drawImage(resources, obj.animationPosition[obj.currentFrame], obj.spriteY, obj.spriteWidth, obj.spriteHeight, -obj.width / 2, -obj.height / 2, obj.width, obj.height);
      ctx.restore();
      if (!playerDead) {
        animationTimer++;
        if (animationTimer >= animationSpeed) {
          if (obj.animatingForward) {
            obj.currentFrame++;
            if (obj.currentFrame >= obj.animationPosition.length - 1) {
              obj.animatingForward = false;
            }
          } else {
            obj.currentFrame--;
            if (obj.currentFrame <= 0) {
              obj.animatingForward = true;
            }
          }
          animationTimer = 0;
        }
      }
    } else {
      ctx.drawImage(resources, obj.spriteX, obj.spriteY, obj.spriteWidth, obj.spriteHeight, obj.x, obj.y, obj.width, obj.height);
    }
  }

  return obj;
}

resources.onload = function () {

  setTimeout(gameLoop, fps);

}

function randomizePipe(topPipe, bottomPipe) {
  if (Math.random() < 0.5) {
    let d = Math.random() * 100;
    topPipe.y = pipeTopY + d;
    bottomPipe.y = pipeBottomY + d;
  } else {
    let d = Math.random() * 160;
    topPipe.y = pipeTopY - d;
    bottomPipe.y = pipeBottomY - d;
  }
}

var gameLoop = function () {

  // player speed
  dy += ay;
  player.y += dy;

  // check for collision with pipes
  if (pipe1Top.contains(player.x, player.y) ||
    pipe1Bottom.contains(player.x, player.y) ||
    pipe2Top.contains(player.x, player.y) ||
    pipe2Bottom.contains(player.x, player.y) ||
    pipe3Top.contains(player.x, player.y) ||
    pipe3Bottom.contains(player.x, player.y)) {
    playerDead = true;
  }

  // repeating ground
  if (!playerDead) {
    ground.x += groundSpeed;
    groundCopy.x += groundSpeed;
    if (ground.x < -ground.width) {
      ground.x = groundCopy.x + ground.width;
    }
    if (groundCopy.x < -groundCopy.width) {
      groundCopy.x = ground.x + groundCopy.width;
    }
  }

  // obstacles
  if (!playerDead && gameStart) {

    pipe1Top.x += groundSpeed;
    pipe1Bottom.x = pipe1Top.x;

    pipe2Top.x += groundSpeed;
    pipe2Bottom.x = pipe2Top.x;

    pipe3Top.x += groundSpeed;
    pipe3Bottom.x = pipe3Top.x;

    if (pipe1Top.x + pipe1Top.width / 2 < player.x + player.width / 2) {
      if (!pipe1Top.scored) {
        pipe1Top.scored = true;
        score++;
      }
    }

    if (pipe2Top.x + pipe2Top.width / 2 < player.x + player.width / 2) {
      if (!pipe2Top.scored) {
        pipe2Top.scored = true;
        score++;
      }
    }

    if (pipe3Top.x + pipe3Top.width / 2 < player.x + player.width / 2) {
      if (!pipe3Top.scored) {
        pipe3Top.scored = true;
        score++;
      }
    }

    if (pipe1Top.x < -pipe1Top.width) {
      pipe1Top.x = pipe3Top.x + pipeSpacing;
      pipe1Bottom.x = pipe3Top.x + pipeSpacing;
      randomizePipe(pipe1Top, pipe1Bottom);
      pipe1Top.scored = false;
    }

    if (pipe2Top.x < -pipe2Top.width) {
      pipe2Top.x = pipe1Top.x + pipeSpacing;
      pipe2Bottom.x = pipe1Top.x + pipeSpacing;
      randomizePipe(pipe2Top, pipe2Bottom);
      pipe2Top.scored = false;
    }

    if (pipe3Top.x < -pipe3Top.width) {
      pipe3Top.x = pipe2Top.x + pipeSpacing;
      pipe3Bottom.x = pipe2Top.x + pipeSpacing;
      randomizePipe(pipe3Top, pipe3Bottom);
      pipe3Top.scored = false;
    }
  }

  // rotation
  if (!playerDead) {
    player.rotation = (dy * rotatingSpeed) * Math.PI / 4;
    if (player.rotation > Math.PI / 2) {
      player.rotation = Math.PI / 2;
    }
    if (player.rotation < -Math.PI / 4) {
      player.rotation = -Math.PI / 4;
    }
  }

  // acceleration and velocity checking
  if (dy > 40) {
    dy = 40;
  }

  // bounds checking
  if (player.y > background.height - ground.height) {
    player.y = background.height - ground.height;
    playerDead = true;
  }

  // drawing
  background.render();

  pipe1Top.render();
  pipe1Bottom.render();
  pipe2Top.render();
  pipe2Bottom.render();
  pipe3Top.render();
  pipe3Bottom.render();

  if (!gameStart) {
    logo.render();
    instructions.render();
  }

  if (playerDead) {
    playButton.render();
    logo.render();
  }

  // draw text
  if (gameStart) {
    ctx.font = '40px fb';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'blacl';
    ctx.lineWidth = 2;
    if (playerDead) {
      ctx.fillText(score, 160, 400);
      ctx.strokeText(score, 160, 400);
    } else {
      ctx.fillText(score, 160, 100);
      ctx.strokeText(score, 160, 100);
    }
    ctx.textAlign = "center";
  }

  ground.render();
  groundCopy.render();

  player.render();

  setTimeout(gameLoop, fps);
}