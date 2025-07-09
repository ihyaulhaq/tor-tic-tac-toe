const gameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getIndex = function (row, col) {
    return row * 3 + col;
  };

  let cellFilled = false;

  const getBoard = () => {
    return [...board];
  };

  const markCell = (row, col, mark) => {
    const index = getIndex(row, col);

    if (board[index] === "") {
      board[index] = mark;
      cellFilled = true;
    } else {
      cellFilled = false;
    }
  };

  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
    cellFilled = false;
  };

  return {
    getIndex,
    getBoard,
    markCell,
    isCellFilled: () => cellFilled,
    reset,
  };
})();

const createPlayer = (name, mark) => {
  return { name, mark };
};

const GameController = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let gameOver = false;
  let winner = null;

  const init = (player1, player2) => {
    players = [createPlayer(player1, "X"), createPlayer(player2, "O")];
    gameOver = false;
    winner = null;
    gameBoard.reset();

    console.log(gameBoard.getBoard());
    console.log(
      getCurrentPlayer().name + " mark is " + getCurrentPlayer().mark
    );
  };

  const getCurrentPlayer = () => players[currentPlayerIndex];

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
        return board[cell1];
      }
    }
    return null;
  };
  const checkTie = () => {
    const board = gameBoard.getBoard();

    return board.every((cell) => cell !== "") && !checkWin();
  };

  const playerMove = (row, col) => {
    if (gameOver) {
      console.log("game over");
      return;
    }
    const currentPlayer = getCurrentPlayer();
    const playerMark = getCurrentPlayer().mark;

    gameBoard.markCell(row, col, playerMark);
    if (gameBoard.isCellFilled()) {
      console.log(gameBoard.getBoard());
      const winMarker = checkWin();
      if (winMarker) {
        winner = currentPlayer;
        gameOver = true;
        console.log("win");
      } else if (checkTie()) {
        gameOver = true;
        console.log("It's a tie!");
      } else {
        currentPlayerIndex = 1 - currentPlayerIndex; 
        console.log(
          `${getCurrentPlayer().name}'s turn (${getCurrentPlayer().mark})`
        );
      }
    } else {
      console.log("cell filled");
    }
  };

  const resetGame = () => {
    init(players[0].name, players[1].name);
    console.log("game reset");
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

const displayGame =(()=>{
  const render = ()=>{

  }
})();