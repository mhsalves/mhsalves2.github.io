// Global variables.
var stopped = true;
var canMovePlayer = true;

var player = null;
var blockContainer = null;
var scoreContainer = null;
var resetContainer = null;
var step = 6;
const margin = 8;

var containerWidth = 0;
var containerHeight = 0;
var playerWidth = 0;
var playerHeight = 0;

var score = 0;

var playerMoveDirection = 'up';

var creationLoop;
var moveLoop;
var playerMoveLoop;

// Utils methods.
function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

function getPixel(string) {
  return parseInt(string.split('px')[0]);
}

function getBlock() {
  const newBlock = document.createElement('div');
  newBlock.classList.add('block');
  newBlock.classList.add(defineStartPosition());
  return newBlock;
}

// This method defines randomly position for a new block.
function defineStartPosition() {
  const rand = Math.floor(Math.random() * 10 % 2);
  if (rand === 1) { return 'up'; }
  return 'down';
}

// Apply calculation for player TOP position.
function calcTop(toPosition) {
  if (toPosition === 'up') { return margin + 'px'; }
  return (containerHeight - playerHeight - margin) + 'px';
}

// This method load some data globally.
function loadGlobally() {
  player = document.getElementById('player'); // Load Player variable.
  blockContainer = document.getElementById('block-container'); // Load Block Container variable.
  scoreContainer = document.getElementById('score-container'); // Load Block Container variable.
  resetContainer = document.getElementById('reset-container'); // Load Block Container variable.
  containerWidth = getPixel(getComputedStyle(blockContainer).width);
  containerHeight = getPixel(getComputedStyle(blockContainer).height);
  playerWidth = getPixel(getComputedStyle(player).width);
  playerHeight = getPixel(getComputedStyle(player).height);
}

// This method creates a new block recursively.
function createBlocks() {
  creationLoop = setTimeout(function() {
    blockContainer.appendChild(getBlock());
    createBlocks();
  }, 800);
}

// This method moves the blocks recursively.
function moveBlocks() {
  moveLoop = setTimeout(function() {
    if (!canMovePlayer && stopped) {
      return;
    }

    const blocks = blockContainer.querySelectorAll('.block');
    blocks.forEach(function (block) {
      const currentRight = getPixel(getComputedStyle(block).right);
      block.style.right = currentRight + step + 'px';
      checkCollision(block);
    });

    if (blocks[0] !== undefined) {
      const currentRight = getPixel(getComputedStyle(blocks[0]).right);
      if (currentRight > containerWidth) {
        blockContainer.removeChild(blocks[0]);
        gainPoint();
      }
    }
    moveBlocks();
  }, 20);
}

function movePlayer() {
  playerMoveLoop = setTimeout(function() {
    if (!canMovePlayer) { return; }

    const playerTop = getPixel(getComputedStyle(player).top);
    const playerSteps = 5;

    if (playerMoveDirection === 'up' && playerTop > margin) {
      player.style.top = (playerTop - playerSteps) + 'px';
    } else if (playerMoveDirection === 'down' && playerTop + playerHeight + margin < containerHeight) {
      player.style.top = (playerTop + playerSteps) + 'px';
    }

    movePlayer();
  }, 10);
}

// This method checks if some block colides with player.
function checkCollision(block) {
  const playerTop = getPixel(getComputedStyle(player).top);
  const heightLimit = containerHeight - getPixel(getComputedStyle(block).height);

  const xBlockPosition = containerWidth - getPixel(getComputedStyle(block).right);
  const isUp = block.classList.contains('up');

  const checkX = xBlockPosition < playerWidth + margin;
  var checkY = false;

  if (isUp) {
    checkY = playerTop < getPixel(getComputedStyle(block).height);
  } else {
    checkY = playerTop + playerHeight > heightLimit;
  }

  if (checkX && checkY) {
    endGame();
    showReset(true);
  }
}

function gainPoint() {
  score++;
  scoreContainer.innerHTML = score;
}

function showReset(show) {
  if (show) {
    resetContainer.classList.add('show');
    return;
  }
  resetContainer.classList.remove('show');
}

// This method start the main functions of the game.
function startGame() {
  if (!stopped) {
    createBlocks();
    moveBlocks();
    movePlayer();
  }
}

function endGame() {
  clearTimeout(creationLoop);
  clearTimeout(moveLoop);
  canMovePlayer = false;
  stopped = true;
}

function restartGame() {
  blockContainer.innerHTML = '';
  canMovePlayer = true;
  score = -1;
  gainPoint();
  player.style = null;
  showReset(false);
}

// This method start the game if the game wasn't started.
function validStartGame() {
  if (stopped) {
    stopped = false;
    startGame();
  }
}

function loadGameProperties() {
  const upKey = [119, 105]; // Key Codes for Up Action.
  const downKey = [115, 107]; // Key Codes for Down Action.
  loadGlobally(); // Load some datas globally.

  // Apply key press listener for commands.
  document.onkeypress = function (e) {
    e = e || window.event;

    if (!canMovePlayer) {
      return;
    }

    if (isInArray(e.keyCode, upKey)) {
      validStartGame();
      playerMoveDirection = 'up';
    }

    if (isInArray(e.keyCode, downKey)) {
      validStartGame();
      playerMoveDirection = 'down';
    }
  }
}
