const boxes = [
    document.getElementById("b1"),
    document.getElementById("b2"),
    document.getElementById("b3"),
    document.getElementById("b4"),
    document.getElementById("b5"),
    document.getElementById("b6"),
    document.getElementById("b7"),
    document.getElementById("b8"),
    document.getElementById("b9")
];

const result = document.querySelector(".res p");

let board = ["", "", "", "", "", "", "", "",];
let currentPlayer = "X";
let gameOver = false;

const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (board[index] !== "" || gameOver) {
            return;
        }

        board[index] = currentPlayer;
        box.querySelector("h1").textContent = currentPlayer;

        const winner = checkWinner();

        if (winner) {
            result.textContent = `${currentPlayer} WINS!`;
            gameOver = true;
            drawWinningLine(winner);
            return;
        }

        if (!board.includes("")) {
            result.textContent = "DRAW!";
            gameOver = true;
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        result.textContent = `${currentPlayer}'S TURN`;
    });
});

function checkWinner() {
    for (const pattern of winningPatterns) {
        const [a, b, c] = pattern;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            return pattern;
        }
    }

    return null;
}

function drawWinningLine(pattern) {
    boxes.forEach(box => {
        box.classList.remove(
            "winning",
            "vertical",
            "diagonal",
            "diagonal-reverse"
        );
    });

    const [a, b, c] = pattern;

    if (
        (a === 0 && b === 1 && c === 2) ||
        (a === 3 && b === 4 && c === 5) ||
        (a === 6 && b === 7 && c === 8)
    ) {
        boxes[a].classList.add("winning");
    }

    if (
        (a === 0 && b === 3 && c === 6) ||
        (a === 1 && b === 4 && c === 7) ||
        (a === 2 && b === 5 && c === 8)
    ) {
        boxes[a].classList.add("winning", "vertical");
    }

    if (a === 0 && b === 4 && c === 8) {
        boxes[a].classList.add("winning", "diagonal");
    }

    if (a === 2 && b === 4 && c === 6) {
        boxes[a].classList.add("winning", "diagonal-reverse");
    }
}

document.querySelector(".res").addEventListener("click", () => {
    board = ["", "", "", "", "", "", "", "",];
    currentPlayer = "X";
    gameOver = false;

    boxes.forEach(box => {
        box.querySelector("h1").textContent = "";
        box.classList.remove(
            "winning",
            "vertical",
            "diagonal",
            "diagonal-reverse"
        );
    });

    result.textContent = "DISPLAY WINNER";
});