document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('status-text');
    const resetBtn = document.getElementById('reset-button');
    const pvpModeBtn = document.getElementById('pvp-mode');
    const aiModeBtn = document.getElementById('ai-mode');
    const overlay = document.getElementById('overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    let boardState = ["", "", "", "", "", "", "", "", ""];
    let isGameActive = true;
    let currentPlayer = "X"; // X represents RCB, O represents CSK
    let isAiMode = false;

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
        [0, 4, 8], [2, 4, 6]             // Diagonal
    ];

    // Handle user actions and updates
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (boardState[clickedCellIndex] !== "" || !isGameActive) return;

        makeMove(clickedCell, clickedCellIndex);
        checkGameResult();

        if (isAiMode && isGameActive && currentPlayer === "O") {
            setTimeout(makeAiMove, 400); // Small natural delay for the computer's turn
        }
    }

    function makeMove(cell, index) {
        boardState[index] = currentPlayer;
        cell.innerText = currentPlayer;
        cell.classList.add(currentPlayer === "X" ? "x-piece" : "o-piece");
        
        // Flip turn pointers
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateStatusDisplay();
    }

    function updateStatusDisplay() {
        if (currentPlayer === "X") {
            statusText.innerHTML = `Turn: <span class="rcb-text">RCB (X)</span>`;
        } else {
            statusText.innerHTML = `Turn: <span class="csk-text">CSK (O)</span>`;
        }
    }

    // Computer AI Turn Logic Tracker
    function makeAiMove() {
        let emptyIndexes = [];
        boardState.forEach((val, idx) => {
            if (val === "") emptyIndexes.push(idx);
        });

        if (emptyIndexes.length === 0 || !isGameActive) return;

        // Choose a random cell from available empty spaces
        const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
        const targetCell = document.querySelector(`[data-index="${randomIndex}"]`);

        makeMove(targetCell, randomIndex);
        checkGameResult();
    }

    // Match Evaluation Grid Mechanics
    function checkGameResult() {
        let roundWon = false;
        let winner = "";

        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = boardState[winCondition[0]];
            let b = boardState[winCondition[1]];
            let c = boardState[winCondition[2]];

            if (a === "" || b === "" || c === "") continue;
            if (a === b && b === c) {
                roundWon = true;
                winner = a;
                break;
            }
        }

        if (roundWon) {
            triggerGameOver(winner === "X" ? "RCB Wins!" : "CSK Wins!", winner === "X" ? "🏆 PLAY BOLD" : "💛 WHISTLE PODU");
            isGameActive = false;
            return;
        }

        // Check for Draw
        let roundDraw = !boardState.includes("");
        if (roundDraw) {
            triggerGameOver("Match Tied!", "🤝 GREAT GAME");
            isGameActive = false;
            return;
        }
    }

    function triggerGameOver(title, subtitle) {
        modalTitle.innerText = title;
        modalSubtitle.innerText = subtitle;
        
        // Color customization dynamically matching the winner inside the modal window
        if (title.includes("RCB")) {
            modalTitle.style.color = "var(--rcb-red)";
        } else if (title.includes("CSK")) {
            modalTitle.style.color = "var(--csk-yellow)";
        } else {
            modalTitle.style.color = "var(--text-white)";
        }

        overlay.classList.add('show');
    }

    function resetGame() {
        boardState = ["", "", "", "", "", "", "", "", ""];
        isGameActive = true;
        currentPlayer = "X";
        overlay.classList.remove('show');
        updateStatusDisplay();
        cells.forEach(cell => {
            cell.innerText = "";
            cell.classList.remove("x-piece", "o-piece");
        });
    }

    // Switch Configuration Layout Handles
    pvpModeBtn.addEventListener('click', () => {
        if (isAiMode) {
            isAiMode = false;
            pvpModeBtn.classList.add('active');
            aiModeBtn.classList.remove('active');
            resetGame();
        }
    });

    aiModeBtn.addEventListener('click', () => {
        if (!isAiMode) {
            isAiMode = true;
            aiModeBtn.classList.add('active');
            pvpModeBtn.classList.remove('active');
            resetGame();
        }
    });

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', resetGame);
    modalCloseBtn.addEventListener('click', resetGame);
});