const b = document.querySelectorAll(".box");
const n = document.querySelectorAll(".name");
const res = document.querySelector(".res");

console.dir(n);

let p1 = prompt("Enter Player01 Name");
let p2 = prompt("Enter Player02 Name");

p1 = p1 || "Player 01";
p2 = p2 || "Player 02";

n[0].innerHTML = `<p>${p1}</p>`;
n[1].innerHTML = `<p>${p2}</p>`;

let ans = false; // false = X, true = O
let gameOver = false;

const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

for (let i = 0; i < 9; i++) {

    b[i].addEventListener("click", () => {


        if (b[i].innerText !== "" || gameOver) {
            return;
        }

        if (ans === false) {

            b[i].innerHTML = "<h1>X</h1>";
            b[i].style.background = "red";

            ans = true;

        } 
        else {

            b[i].innerHTML = "<h1>O</h1>";
            b[i].style.background = "yellow";

            ans = false;
        }

        checkWinner();
    });
}


function checkWinner() {

    for (let pattern of winPatterns) {

        let a = pattern[0];
        let c = pattern[1];
        let d = pattern[2];

        let value1 = b[a].innerText;
        let value2 = b[c].innerText;
        let value3 = b[d].innerText;

        if (
            value1 !== "" &&
            value1 === value2 &&
            value2 === value3
        ) {

            let winner;

            if (value1 === "X") {
                winner = p1;
            } else {
                winner = p2;
            }

            res.innerHTML = `<p><b>${winner} is Winner!</b></p>`;

            gameOver = true;

            // Restart after 2 seconds
            setTimeout(restartGame, 2000);

            return;
        }
    }

    let allFilled = true;

    for (let box of b) {

        if (box.innerText === "") {
            allFilled = false;
            break;
        }
    }

    if (allFilled) {

        res.innerHTML = "<p><b>Game Draw!</b></p>";

        gameOver = true;

        // Restart after 2 seconds
        setTimeout(restartGame, 2000);
    }
}


function restartGame() {

    for (let box of b) {

        box.innerHTML = "";
        box.style.background = "";
    }

    ans = false;

    gameOver = false;

    res.innerHTML = "<p><b>New Game!</b></p>";
}