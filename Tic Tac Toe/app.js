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
const overlay = $("overlay");

const panels = [
    $("p0"),
    $("p1")
];

const nameEls = [
    $("n0"),
    $("n1")
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

const startBtn = $("start");
const againBtn = $("again");
const resetBtn = $("reset");
const changeBtn = $("change");
const drawScore = $("vd");

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
    cell.setAttribute("aria-label", `Cell ${i + 1}`);

    cell.onclick = () => play(i);

    grid.appendChild(cell);

    return cell;
});

function msg(text) {
    res.textContent = text;
}

function renderNames() {

    names.forEach((name, i) => {
        nameEls[i].textContent = name;
        labels[i].textContent = `${name} Wins`;
    });
}

function renderScores() {

    vals[0].textContent = score[0];
    vals[1].textContent = score[1];
    drawScore.textContent = score.d;
}

function openModal() {

    clearTimeout(timer);

    ins[0].value =
        names[0] === "Player 1"
            ? ""
            : names[0];

    ins[1].value =
        names[1] === "Player 2"
            ? ""
            : names[1];

    overlay.classList.remove("hide");

    ins[0].focus();
}

function startGame() {

    const player1 = ins[0].value.trim();
    const player2 = ins[1].value.trim();

    const newNames = [
        player1 || "Player 1",
        player2 || "Player 2"
    ];

    const changed =
        newNames[0] !== names[0] ||
        newNames[1] !== names[1];

    names = newNames;

    if (
        names[0].toLowerCase() ===
        names[1].toLowerCase()
    ) {
        names[1] += " (2)";
    }

    overlay.classList.add("hide");

    renderNames();

    if (changed) {
        score[0] = 0;
        score[1] = 0;
        score.d = 0;
        starter = 0;

        renderScores();
    }

    newRound();
}

startBtn.onclick = startGame;

ins.forEach((input, index) => {

    input.addEventListener("keydown", event => {

        if (event.key !== "Enter") {
            return;
        }

        if (index === 0) {
            ins[1].focus();
        } else {
            startGame();
        }
    });
});

function newRound() {

    clearTimeout(timer);

    state = Array(9).fill(null);
    over = false;
    winPattern = null;
    turn = starter;

    cells.forEach(cell => {

        cell.className = "cell";
        cell.textContent = "";
        cell.disabled = false;
    });

    line.classList.remove("show");

    line.style.width = "";
    line.style.left = "";
    line.style.top = "";
    line.style.transform = "";

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

function play(i) {

    if (over || state[i] !== null) {
        return;
    }

    state[i] = turn;

    const cell = cells[i];
    const symbol = turn ? "O" : "X";

    const span = document.createElement("span");

    span.textContent = symbol;

    cell.className = `cell ${turn ? "o" : "x"}`;

    cell.appendChild(span);

    cell.disabled = true;

    const winner = WINS.find(pattern =>
        pattern.every(index =>
            state[index] === turn
        )
    );

    if (winner) {
        finish(winner);
        return;
    }

    const draw = state.every(
        value => value !== null
    );

    if (draw) {
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

        msg(`🏆 ${names[turn]} wins!`);

        drawLine();

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

    const center = index => {

        const cell = cells[index];

        return [
            cell.offsetLeft +
            cell.offsetWidth / 2,

            cell.offsetTop +
            cell.offsetHeight / 2
        ];
    };

    const [x1, y1] = center(
        winPattern[0]
    );

    const [x2, y2] = center(
        winPattern[2]
    );

    const cellWidth =
        cells[0].offsetWidth;

    const length =
        Math.hypot(
            x2 - x1,
            y2 - y1
        ) +
        cellWidth * 0.6;

    const angle =
        Math.atan2(
            y2 - y1,
            x2 - x1
        ) * 180 / Math.PI;

    const centerX =
        (x1 + x2) / 2;

    const centerY =
        (y1 + y2) / 2;

    Object.assign(line.style, {
        width: `${length}px`,
        left: `${centerX - length / 2}px`,
        top: `${centerY - 3.5}px`,
        transform:
            `translateZ(60px) rotate(${angle}deg)`
    });

    line.classList.add("show");
}

window.addEventListener("resize", () => {

    if (over && winPattern) {
        drawLine();
    }
});

board.addEventListener(
    "pointermove",
    event => {

        const rect =
            board.getBoundingClientRect();

        const x =
            (event.clientX - rect.left) /
            rect.width - 0.5;

        const y =
            (event.clientY - rect.top) /
            rect.height - 0.5;

        board.style.setProperty(
            "--ry",
            `${x * 14}deg`
        );

        board.style.setProperty(
            "--rx",
            `${10 - y * 14}deg`
        );
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
    }
);

againBtn.onclick = newRound;

resetBtn.onclick = () => {

    score[0] = 0;
    score[1] = 0;
    score.d = 0;

    starter = 0;

    renderScores();

    newRound();
};

changeBtn.onclick = openModal;

renderNames();
renderScores();
newRound();
openModal();