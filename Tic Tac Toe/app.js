const WINS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const $ = id => document.getElementById(id);

const grid = $("grid");
const line = $("line");
const res = $("res");
const board = $("board");

const panels = [
    $("p0"),
    $("p1")
];

const labels = [
    $("l0"),
    $("l1")
];

const vals = [
    $("v0"),
    $("v1")
];

const ins = [
    $("in0"),
    $("in1")
];

let names = [
    "Player 1",
    "Player 2"
];

let state = [];
let turn = 0;
let over = false;
let starter = 0;
let winPattern = null;
let timer = null;

const score = {
    0: 0,
    1: 0,
    d: 0
};

const cells = [...Array(9)].map((_, i) => {

    const cell = document.createElement("button");

    cell.className = "cell";

    cell.setAttribute(
        "aria-label",
        `Cell ${i + 1}`
    );

    cell.onclick = () => play(i);

    grid.appendChild(cell);

    return cell;
});

function msg(text) {
    res.textContent = text;
}

function renderNames() {

    names.forEach((name, i) => {
        labels[i].textContent = `${name} Wins`;
    });
}

function renderScores() {

    vals[0].textContent = score[0];
    vals[1].textContent = score[1];

    $("vd").textContent = score.d;
}

function readNames() {

    names = ins.map(
        (input, i) =>
            input.value.trim() ||
            `Player ${i + 1}`
    );

    if (
        names[0].toLowerCase() ===
        names[1].toLowerCase()
    ) {
        names[1] += " (2)";
    }

    renderNames();

    if (!over) {
        updateUI();
    }
}

ins.forEach((input, index) => {

    input.addEventListener(
        "input",
        readNames
    );

    input.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Enter") {
                return;
            }

            if (index === 0) {
                ins[1].focus();
            } else {
                input.blur();
            }
        }
    );
});

function newRound() {

    clearTimeout(timer);

    state = Array(9).fill(null);

    over = false;

    winPattern = null;

    turn = starter;

    cells.forEach(cell => {

        cell.className = "cell";

        cell.innerHTML = "";

        cell.disabled = false;
    });

    line.classList.remove("show");

    line.style.width = "0px";

    updateUI();
}

function updateUI() {

    panels.forEach((panel, i) => {

        panel.classList.toggle(
            "active",
            !over && turn === i
        );
    });

    if (!over) {
        msg(`${names[turn]}'s turn`);
    }
}

function play(index) {

    if (
        over ||
        state[index] !== null
    ) {
        return;
    }

    state[index] = turn;

    const cell = cells[index];

    const symbol = turn ? "O" : "X";

    const span = document.createElement("span");

    span.textContent = symbol;

    cell.className =
        `cell ${turn ? "o" : "x"}`;

    cell.appendChild(span);

    cell.disabled = true;

    const winner = WINS.find(pattern =>
        pattern.every(
            position =>
                state[position] === turn
        )
    );

    if (winner) {
        finish(winner);
        return;
    }

    if (
        state.every(
            value => value !== null
        )
    ) {
        finish(null);
        return;
    }

    turn = 1 - turn;

    updateUI();
}

function finish(winner) {

    over = true;

    winPattern = winner;

    cells.forEach(cell => {
        cell.disabled = true;
    });

    panels.forEach(panel => {
        panel.classList.remove("active");
    });

    if (winner) {

        winner.forEach(index => {
            cells[index].classList.add("win");
        });

        score[turn]++;

        msg(
            `🏆 ${names[turn]} wins!`
        );

        requestAnimationFrame(() => {
            requestAnimationFrame(drawLine);
        });

    } else {

        score.d++;

        msg("Game draw!");
    }

    renderScores();

    starter = 1 - starter;

    timer = setTimeout(
        newRound,
        2800
    );
}

function drawLine() {

    if (!winPattern) {
        return;
    }

    const first = cells[winPattern[0]];
    const last = cells[winPattern[2]];

    const boardRect =
        grid.getBoundingClientRect();

    const firstRect =
        first.getBoundingClientRect();

    const lastRect =
        last.getBoundingClientRect();

    const x1 =
        firstRect.left +
        firstRect.width / 2 -
        boardRect.left;

    const y1 =
        firstRect.top +
        firstRect.height / 2 -
        boardRect.top;

    const x2 =
        lastRect.left +
        lastRect.width / 2 -
        boardRect.left;

    const y2 =
        lastRect.top +
        lastRect.height / 2 -
        boardRect.top;

    const dx = x2 - x1;
    const dy = y2 - y1;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    const angle =
        Math.atan2(dy, dx) *
        180 /
        Math.PI;

    const extra =
        Math.min(
            boardRect.width,
            boardRect.height
        ) * 0.10;

    const length =
        distance + extra;

    const centerX =
        (x1 + x2) / 2;

    const centerY =
        (y1 + y2) / 2;

    line.style.width =
        `${length}px`;

    line.style.left =
        `${centerX - length / 2}px`;

    line.style.top =
        `${centerY - 3.5}px`;

    line.style.transform =
        `translateZ(70px) rotate(${angle}deg)`;

    line.classList.add("show");
}

window.addEventListener(
    "resize",
    () => {

        if (
            over &&
            winPattern
        ) {
            requestAnimationFrame(
                drawLine
            );
        }
    }
);

board.addEventListener(
    "pointermove",
    event => {

        const rect =
            board.getBoundingClientRect();

        const x =
            (event.clientX - rect.left) /
            rect.width -
            0.5;

        const y =
            (event.clientY - rect.top) /
            rect.height -
            0.5;

        board.style.setProperty(
            "--ry",
            `${x * 14}deg`
        );

        board.style.setProperty(
            "--rx",
            `${10 - y * 14}deg`
        );

        if (
            over &&
            winPattern
        ) {
            requestAnimationFrame(
                drawLine
            );
        }
    }
);

board.addEventListener(
    "pointerleave",
    () => {

        board.style.setProperty(
            "--ry",
            "0deg"
        );

        board.style.setProperty(
            "--rx",
            "10deg"
        );

        if (
            over &&
            winPattern
        ) {
            setTimeout(
                drawLine,
                150
            );
        }
    }
);

$("again").onclick = () => {
    newRound();
};

$("reset").onclick = () => {

    score[0] = 0;
    score[1] = 0;
    score.d = 0;

    starter = 0;

    renderScores();

    newRound();
};

readNames();

renderScores();

newRound();