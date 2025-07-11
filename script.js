const gameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  let cellFilled = false;

  const getBoard = () => {
    return [...board];
  };

  const markCell = (index, mark) => {
    if (board[index] === "") {
      board[index] = mark;
      cellFilled = true;
    } else {
      cellFilled = false;
    }
  };

  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
    displayGame.render();
    cellFilled = false;
  };

  return {
    getBoard,
    markCell,
    isCellFilled: () => cellFilled,
    reset,
  };
})();

const createPlayer = (name, mark) => {
  return { name, mark };
};

const gameController = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let gameOver = false;
  let winner = null;

  const getCurrentPlayer = () => players[currentPlayerIndex];

  const init = (player1, player2) => {
    players = [createPlayer(player1, "X"), createPlayer(player2, "O")];
    gameOver = false;
    winner = null;
    currentPlayerIndex = 0;
    gameBoard.reset();
    displayGame.render();
  };

  const checkWin = () => {
    const board = gameBoard.getBoard();
    const winCondition = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const condition of winCondition) {
      const [cell1, cell2, cell3] = condition;
      if (
        board[cell1] !== "" &&
        board[cell1] === board[cell2] &&
        board[cell2] == board[cell3]
      ) {
        // return board[cell1];
        return true;
      }
    }
    return null;
  };

  const checkTie = () => {
    const board = gameBoard.getBoard();
    return board.every((cell) => cell !== "") && !checkWin();
  };

  const playerMove = (index) => {
    if (gameOver) {
      alert(`game over`);
      return;
    }
    const currentPlayer = getCurrentPlayer();
    const playerMark = currentPlayer.mark;

    gameBoard.markCell(index, playerMark);

    if (gameBoard.isCellFilled()) {

      displayGame.render();
      const winMarker = checkWin();

      if (winMarker) {
        winner = playerMark;
        gameOver = true;

        setTimeout(()=>{
          displayGame.clearResult();
          resetGame();
        }, 1000)
        displayGame.renderResult();
        resetGame();
      } else if (checkTie()) {
        winner = null;
        gameOver = true;
        displayGame.renderResult("tie");
        setTimeout(()=>{
          displayGame.clearResult();
          resetGame();
        },1000)
        // alert(`its tie`);
        resetGame();
      } else {
        currentPlayerIndex = 1 - currentPlayerIndex;
        console.log(
          `${getCurrentPlayer().name}'s turn (${getCurrentPlayer().mark})`
        );
      }
    }
  };

  const resetGame = () => {
    init(players[0].name, players[1].name);
    gameOver = false;
    console.log(gameOver);
    displayGame.render();
  };

  return {
    init,
    playerMove,
    getCurrentPlayer,
    getWinner: () => winner,
    isGameOver: () => gameOver,
    resetGame,
  };
})();

const displayGame = (() => {
  const gamecontainer = document.querySelector(".theGame");

  const player1NameDisplay = document.querySelector(".player1H1");
  const player2NameDisplay = document.querySelector(".player2H1");

  const p1gameResult = document.querySelector(".p1-result-message");
  const p2gameResult = document.querySelector(".p2-result-message");

  const render = () => {
    gamecontainer.innerHTML = " ";
    let latestBoard = gameBoard.getBoard();
    latestBoard.forEach((cell, index) => {
      const cellBtn = document.createElement("button");
      cellBtn.textContent = cell;
      cellBtn.dataset.index = index;
      gamecontainer.appendChild(cellBtn);
    });
  };

  const renderName = (player1, player2) => {
    player1NameDisplay.innerHTML = "";
    player1NameDisplay.innerHTML = "";

    player1NameDisplay.textContent = player1;
    player2NameDisplay.textContent = player2;
  };

  const renderResult = (type) => {
    p1gameResult.textContent = "";
    p2gameResult.textContent = "";

    let winnerMark = gameController.getWinner();
    const winnerName = gameController.getCurrentPlayer().name;

    if (type === "tie") {
      p1gameResult.textContent = "It's a Tie!";
      p2gameResult.textContent = "It's a Tie!";
      return;
    }
    if (winnerMark === "X") {
      p1gameResult.textContent = `${winnerName} wins!`;
    }
    if (winnerMark === "O") {
      p2gameResult.textContent = `${winnerName} wins!`;
    }
  };

  const clearResult = () => {
    p1gameResult.textContent = "";
    p2gameResult.textContent = "";
  };

  return {
    render,
    getDisplay: () => gamecontainer,
    renderName,
    renderResult,
    clearResult,
  };
})();

const handleUserInput = (() => {
  const inputDialog = document.querySelector("#userInputDialog");
  const startGameBtn = document.querySelector("#startBtn");
  const resetGameBtn = document.querySelector("#resetBtn");

  const cancelDialogBtn = document.querySelector("#cancelBtn");
  const subitDialogBtn = document.querySelector("#submitBtn");
  const player1Name = document.querySelector("#player1Name");
  const player2Name = document.querySelector("#player2Name");

  const init = () => {
    displayGame.getDisplay().addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        const clickedButton = e.target.dataset.index;
        gameController.playerMove(clickedButton);
      }
    });
  };

  const showDialog = () => {
    startGameBtn.addEventListener("click", () => {
      inputDialog.showModal();
    });
  };

  const cancelDialog = () => {
    cancelDialogBtn.addEventListener("click", () => {
      inputDialog.close();
    });
  };

  const submitBtnClicked = () => {
    subitDialogBtn.addEventListener("click", (e) => {
      e.preventDefault();
      inputDialog.close("submitted");
    });
  };

  const dialogLogic = () => {
    inputDialog.addEventListener("close", () => {
      gameController.init(player1Name.value, player2Name.value);
      displayGame.renderName(player1Name.value, player2Name.value);
    });
  };

  const resetGameCliked = () => {
    resetGameBtn.addEventListener("click", () => {
      gameController.resetGame();
      console.log("reset");
    });
  };
  return {
    init,
    showDialog,
    cancelDialog,
    submitBtnClicked,
    dialogLogic,
    resetGameCliked,
  };
})();

const starGame = () => {
  handleUserInput.init();
  handleUserInput.showDialog();
  handleUserInput.cancelDialog();
  handleUserInput.submitBtnClicked();
  handleUserInput.dialogLogic();
  handleUserInput.resetGameCliked();
};

starGame();
