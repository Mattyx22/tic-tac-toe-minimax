let array = [];

let ai = 'X';
let human = 'O';

let currentPlayer = null;

let gridSize = 3



function printGrid() {
    for (i = 0; i < gridSize * gridSize; i++) {
        array.push(i)
        document.getElementById("board").innerHTML += `<div class="cell" id="${i}"></div>`;
    }


    document.getElementById("board").style.setProperty('--gridSizeCSS', gridSize)
    document.getElementById("settings").remove();
    document.getElementById("settingsContainer").innerHTML += '<button onclick=window.location.reload(); class="btn btn-reset">Reset</button>';

    document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', turnClick));

}



function startGameAI() {
    printGrid();
    currentPlayer = ai;
    turn(bestSpot(), ai)
}

function startGameHuman() {
    printGrid();
    currentPlayer = human;
}

function turnClick(square) {
    if (typeof array[square.target.id] == 'number') {
        turn(square.target.id, human)
        if (!checkWin(array, human) && !checkTie()) turn(bestSpot(), ai);
    }
}

function turn(clickIndex, currentPlayer) {
    array[clickIndex] = currentPlayer;
    

    document.getElementById(clickIndex).innerHTML = currentPlayer;
    let gameWon = checkWin(array, currentPlayer);
    if (gameWon) {
        gameOver(gameWon);
    }
}

function emptyCells() {
    return array.filter(s => typeof s == 'number');
}

function checkTie() {
    if (emptyCells().length == 0) {
        document.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', turnClick));
        declareWinner('Remis!')
    }
}

function declareWinner(who) {
    document.getElementById('title').innerHTML = who;
}

function gameOver(gameWon) {
    for (let index of winSets[gameWon.index]) {
        // document.getElementById(index).style.backgroundColor =
        //     gameWon.player == human ? "blue" : "red";
        document.getElementById(index).classList.add(gameWon.player == human ? "playerWin" : "aiWin")
    }
    document.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', turnClick));
    declareWinner(gameWon.player + ' wygrywa!')
}

const winSets = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

function checkWin(board, player){
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winSets.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}


function bestSpot() {
    return minimax(array, ai).index;
}

function minimax(newBoard, player) {
    var availSpots = emptyCells();

    if (checkWin(newBoard, human)) {
        return { score: -10 };
    } else if (checkWin(newBoard, ai)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == ai) {
            var result = minimax(newBoard, human);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, ai);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if (player === ai) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}
