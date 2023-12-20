 document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let gridSquares = Array.from(document.querySelectorAll(".grid div"));
  const displayScore = document.querySelector("#score");
  const displayLevel = document.querySelector("#level");
  const startBtn = document.querySelector("#start-button");
  const gridWidth = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  let level = 0;
  const tetriminoColors = [
    "#7ADC84", 
    "#8962EB",
    "#C78BE5",
    "#EBB46D",
    "#EEA197" 
  ];

  // Tetriminos
  const lTetrimino = [
    [0, 1, gridWidth + 1, gridWidth * 2 + 1],
    [gridWidth, gridWidth + 1, gridWidth + 2, 2], 
    [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 2 + 2], 
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth * 2]
  ]

  const sTetrimino = [
    [gridWidth + 1, gridWidth + 2, gridWidth * 2, gridWidth * 2 + 1],
    [0, gridWidth, gridWidth + 1, gridWidth * 2 + 1], 
    [gridWidth + 1, gridWidth + 2, gridWidth * 2, gridWidth * 2 + 1],
    [0, gridWidth, gridWidth + 1, gridWidth * 2 + 1]
  ]

  const zTetrimino = [
    [gridWidth, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 2 + 2],
    [1, gridWidth, gridWidth + 1, gridWidth * 2], 
    [gridWidth, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 2 + 2],
    [1, gridWidth, gridWidth + 1, gridWidth * 2]
  ]
  
  const tTetrimino = [
    [1, gridWidth, gridWidth + 1, gridWidth + 2],
    [1, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 1], 
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 1], 
    [1, gridWidth, gridWidth + 1, gridWidth * 2 + 1]
  ]

  const oTetrimino = [
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1], 
    [0, 1, gridWidth, gridWidth + 1], 
    [0, 1, gridWidth, gridWidth + 1]
  ]

  const iTetrimino = [
    [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3], 
    [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3]
  ]

  const backLTetrimino = [
    [1, gridWidth + 1, gridWidth * 2 + 1, 2],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 2], 
    [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 2], 
    [gridWidth, gridWidth * 2, gridWidth * 2 + 1, gridWidth * 2 + 2]
  ]

  const doubleTetrimino = [
    [gridWidth, gridWidth + 2, gridWidth * 2, gridWidth * 2 + 2],
    [0, 1, gridWidth * 2, gridWidth * 2 + 1], 
    [gridWidth, gridWidth + 2, gridWidth * 2, gridWidth * 2 + 2],
    [0, 1, gridWidth * 2, gridWidth * 2 + 1]
  ]

  const multiTetrimino = [ // this tetrimino switches to a different shape every time it is rotated
    [1, gridWidth, gridWidth + 2, gridWidth * 2 + 1], // crossTetrimino
    [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1], // iTetrimino
    [0, 1, gridWidth, gridWidth + 1], // oTetrimino
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3] // iTetrimino second rotation
  ]

  const tetriminoArr = [lTetrimino, zTetrimino, sTetrimino, tTetrimino, oTetrimino, iTetrimino, backLTetrimino, doubleTetrimino, multiTetrimino]

  let currentPosition = 4;
  let currentRotation = 0;
    
  // randomly selects a tetrimino in its first rotation
  let random = Math.floor(Math.random()*tetriminoArr.length);
  let current = tetriminoArr[random][currentRotation];
  
  // this function creates a tetrimino
  function draw() {
    current.forEach(index => {
      gridSquares[currentPosition + index].classList.add("tetrimino");
      gridSquares[currentPosition + index].style.backgroundColor = tetriminoColors[random];
    });
  }

  // this function removes the tetrimino
  function undraw() {
    current.forEach(index => {
      gridSquares[currentPosition + index].classList.remove("tetrimino");
      gridSquares[currentPosition + index].style.backgroundColor = "";
    });
  }

  // this function assigns the keys and to other functions
  function controls(e) {
    if(e.keyCode === 65) {
      moveTetriminoLeft();
    } else if(e.keyCode === 87) {
      rotateTetrimino();
    } else if(e.keyCode === 68) {
      moveTetriminoRight();
    } else if(e.keyCode === 83) {
      moveTetriminoDown();
    }
  }

  document.addEventListener("keydown", controls);
 
  // this function moves the tetrimino down
  function moveTetriminoDown() {
    undraw();
    currentPosition += gridWidth;
    draw();
    freeze();
  }

  // freeze function
  function freeze() {
    if(current.some(index => gridSquares[currentPosition + index + gridWidth].classList.contains("taken"))) {
      current.forEach(index => gridSquares[currentPosition + index].classList.add("taken"));
      
      // creates a new tetrimino to begin falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * tetriminoArr.length);
      current = tetriminoArr[random][currentRotation];
      currentPosition = 4;

      draw();
      displayNextShape();
      addScore();
      gameOver();
    }
  }

  // moves the tetrimino left and limits the tetrimino from moving left past the grid limits
  function moveTetriminoLeft() {
    undraw();

    const leftLimit = current.some(index => (currentPosition + index) % gridWidth === 0);

    if(!leftLimit) {
      currentPosition --;
    }
    if(current.some(index => gridSquares[currentPosition + index].classList.contains("taken"))) {
      currentPosition ++;
    }

    draw();
  }

  // moves the tetrimino right and limits the tetrimino from moving right past the grid limits
  function moveTetriminoRight() {
    undraw();

    const rightLimit = current.some(index => (currentPosition + index) % gridWidth === gridWidth - 1);

    if(!rightLimit) {
      currentPosition ++;
    }
    if(current.some(index => gridSquares[currentPosition + index].classList.contains("taken"))) {
      currentPosition --;
    }

    draw();
  }

  // fix for the tetriminos moving past the limits occasionally
  function isAtRight() {
    return current.some(index => (currentPosition + index + 1) % gridWidth === 0);
  }

  function isAtLeft() {
    return current.some(index => (currentPosition + index) % gridWidth === 0);
  }

  function checkRotatedPosition(p) {
    p = p || currentPosition;
    if ((p + 1) % gridWidth < 4) {
      if (isAtRight()) {
        currentPosition ++;
        checkRotatedPosition(p);
      }
    } else if (p % gridWidth > 5) {
      if (isAtLeft()) {
        currentPosition --;
        checkRotatedPosition(p);
      }
    }
  }

  // this function rotates the tetrimino
  function rotateTetrimino() {
    undraw();

    currentRotation ++;

    if(currentRotation === current.length) { // the current rotation back to 0
      currentRotation = 0;
    }
    
    current = tetriminoArr[random][currentRotation];

    checkRotatedPosition();
    draw();
  }

  // set up for next-shape-grid box
  const displayTetrimino = document.querySelectorAll(".next-shape-grid div");
  const displayWidth = 4;
  let displayIndex = 0;

  // an array of the first rotation of each tetrimino
  const nextTetrimino = [
    [0, 1, displayWidth + 1, displayWidth * 2 + 1], // lTetrimino
    [displayWidth + 1, displayWidth + 2, displayWidth * 2, displayWidth * 2 + 1], // sTetrimino
    [displayWidth, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2 + 2], // zTetrimino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetrimino
    [0, 1, displayWidth, displayWidth + 1], // oTetrimino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // iTetrimino
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // backLTetrimino
    [displayWidth, displayWidth + 2, displayWidth * 2, displayWidth * 2 + 2], // doubleTetrimino
    [1, displayWidth, displayWidth + 2, displayWidth * 2 + 1] // multiTetrimino
  ]

  // this function shows the next tetrimino in the next-shape-grid box.
  function displayNextShape() {
    // removes the tetrimino from the grid box
    displayTetrimino.forEach(gridSquares => {
      gridSquares.classList.remove("tetrimino");
      gridSquares.style.backgroundColor = "";
    });

    nextTetrimino[nextRandom].forEach(index => {
      displayTetrimino[displayIndex + index].classList.add("tetrimino");
      displayTetrimino[displayIndex + index].style.backgroundColor = tetriminoColors[random];
    });
  }

  // this function adds functionality to the button
  startBtn.addEventListener("click", () => {
    if(timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveTetriminoDown, 300);
      nextRandom = Math.floor(Math.random() * tetriminoArr.length);
      displayNextShape();
    }
  })

  // this function adds a score
  function addScore() {
    for(let i = 0; i < 199; i += gridWidth) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

      if(row.every(index => gridSquares[index].classList.contains("taken"))) {
        score += 10;
        level ++;
        displayScore.innerHTML = score;
        displayLevel.innerHTML = level;
        
        row.forEach(index => {
          gridSquares[index].classList.remove("taken");
          gridSquares[index].classList.remove("tetrimino");
          gridSquares[index].style.backgroundColor = "";
        })

        const removedSquares = gridSquares.splice(i, gridWidth);
        gridSquares = removedSquares.concat(gridSquares);
        gridSquares.forEach(cell => grid.appendChild(cell));
      }
    }
  }

  // this function defines game over
  function gameOver() {
    if(current.some(index => gridSquares[currentPosition + index].classList.contains("taken"))) {
      displayScore.innerHTML = " Game Over!";
      clearInterval(timerId);
    }
  }
})
