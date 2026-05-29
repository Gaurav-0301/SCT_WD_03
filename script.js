document.addEventListener('DOMContentLoaded', () => {
    // DOM Element Node Pointers
    const pvpModeBtn = document.getElementById('pvp-mode');
    const aiModeBtn = document.getElementById('ai-mode');
    const nameForm = document.getElementById('name-form');
    const playArea = document.getElementById('play-area');
    const p1Group = document.getElementById('p1-group');
    const p2Group = document.getElementById('p2-group');
    const p1Input = document.getElementById('p1-name');
    const p2Input = document.getElementById('p2-name');
    const startGameBtn = document.getElementById('start-game-btn');
    
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('status-text');
    const resetBtn = document.getElementById('reset-button');
    const overlay = document.getElementById('overlay');
    const modalIcon = document.getElementById('modal-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // Engine Core Settings Registers
    let boardState = ["", "", "", "", "", "", "", "", ""];
    let isGameActive = false;
    let currentPlayer = "X"; 
    let isAiMode = false;
    
    let player1Name = "Player 1";
    let player2Name = "Player 2";

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    // High Performance Dual Side Celebration Engine Trigger
    function launchCelebrationConfetti() {
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            // Left flank spray burst
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.8 }
            });
            // Right flank spray burst
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.8 }
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    // Toggle Game Type Setting Forms Setup
    pvpModeBtn.addEventListener('click', () => {
        isAiMode = false;
        pvpModeBtn.classList.add('active');
        aiModeBtn.classList.remove('active');
        p2Group.classList.remove('hidden');
        p1Group.querySelector('label').innerText = "Player 1 (X)";
        resetToSetup();
    });

    aiModeBtn.addEventListener('click', () => {
        isAiMode = true;
        aiModeBtn.classList.add('active');
        pvpModeBtn.classList.remove('active');
        p2Group.classList.add('hidden');
        p1Group.querySelector('label').innerText = "Your Name (X)";
        resetToSetup();
    });

    // Form submission processing interface
    startGameBtn.addEventListener('click', () => {
        player1Name = p1Input.value.trim() || (isAiMode ? "You" : "Player 1");
        player2Name = isAiMode ? "Computer" : (p2Input.value.trim() || "Player 2");

        nameForm.classList.add('hidden');
        playArea.classList.remove('hidden');
        isGameActive = true;
        updateStatusDisplay();
    });

    function handleCellClick(e) {
        const cell = e.target;
        const index = parseInt(cell.getAttribute('data-index'));

        if (boardState[index] !== "" || !isGameActive || (isAiMode && currentPlayer === "O")) return;

        makeMove(cell, index);
        if (isGameActive && isAiMode && currentPlayer === "O") {
            setTimeout(makeAiMove, 500);
        }
    }

    function makeMove(cell, index) {
        boardState[index] = currentPlayer;
        cell.innerText = currentPlayer;
        cell.classList.add(currentPlayer === "X" ? "x-piece" : "o-piece");
        
        checkGameResult();
        
        if (isGameActive) {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            updateStatusDisplay();
        }
    }

    function updateStatusDisplay() {
        statusText.innerText = `Turn: ${currentPlayer === "X" ? player1Name : player2Name}`;
    }

    // Smart Computer Decision Maker Routine
    function makeAiMove() {
        if (!isGameActive) return;
        let emptyIndexes = [];
        boardState.forEach((val, idx) => { if (val === "") emptyIndexes.push(idx); });

        if (emptyIndexes.length === 0) return;

        // Simple Random Selection Engine 
        const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
        const cell = document.querySelector(`[data-index="${randomIndex}"]`);
        makeMove(cell, randomIndex);
    }

    function checkGameResult() {
        let roundWon = false;
        let winnerPiece = "";

        for (let i = 0; i < winningConditions.length; i++) {
            const condition = winningConditions[i];
            let a = boardState[condition[0]];
            let b = boardState[condition[1]];
            let c = boardState[condition[2]];

            if (a === "" || b === "" || c === "") continue;
            if (a === b && b === c) {
                roundWon = true;
                winnerPiece = a;
                break;
            }
        }

        if (roundWon) {
            isGameActive = false;
            if (isAiMode) {
                if (winnerPiece === "X") {
                    triggerGameOver("🏆", `${player1Name} Won!`, "Flawless victory against the machine.");
                    launchCelebrationConfetti();
                } else {
                    triggerGameOver("😢", "You Lost", "Better luck next time!");
                }
            } else {
                const winnerName = winnerPiece === "X" ? player1Name : player2Name;
                triggerGameOver("🏆", `${winnerName} Won!`, "Brilliant tactical play.");
                launchCelebrationConfetti();
            }
            return;
        }

        if (!boardState.includes("")) {
            isGameActive = false;
            triggerGameOver("🤝", "Match Tied", "Both players displayed equal tactical mastery.");
        }
    }

    function triggerGameOver(icon, title, subtitle) {
        modalIcon.innerText = icon;
        modalTitle.innerText = title;
        modalSubtitle.innerText = subtitle;
        overlay.classList.add('show');
    }

    function resetToSetup() {
        boardState = ["", "", "", "", "", "", "", "", ""];
        isGameActive = false;
        currentPlayer = "X";
        playArea.classList.add('hidden');
        nameForm.classList.remove('hidden');
        overlay.classList.remove('show');
        cells.forEach(cell => {
            cell.innerText = "";
            cell.classList.remove("x-piece", "o-piece");
        });
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', resetToSetup);
    modalCloseBtn.addEventListener('click', resetToSetup);
});