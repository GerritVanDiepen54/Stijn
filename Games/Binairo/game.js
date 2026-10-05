// game.js
document.getElementById('start-btn').addEventListener('click', initGame);
document.getElementById('check-btn').addEventListener('click', checkPuzzle);

initGame();

function initGame() {
    gridSize = parseInt(document.getElementById('grid-size').value);
    document.getElementById('message').textContent = "";
    generateValidGrid();
    applyDifficulty();
    renderGrid();
}

function applyDifficulty() {
    const difficulty = document.getElementById('difficulty').value;
    let fillPercentage = difficulty === 'easy' ? 0.60 : (difficulty === 'hard' ? 0.30 : 0.45);

    currentGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
    fixedCells = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (Math.random() < fillPercentage) {
                currentGrid[r][c] = solution[r][c];
                fixedCells[r][c] = true;
            }
        }
    }
}

function renderGrid() {
    const gridEl = document.getElementById('binairo-grid');
    gridEl.innerHTML = '';
    gridEl.style.gridTemplateColumns = `repeat(${gridSize}, var(--cell-size))`;

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            
            if ((c + 1) % 2 === 0 && c !== gridSize - 1) cell.classList.add('thick-right');
            if ((r + 1) % 2 === 0 && r !== gridSize - 1) cell.classList.add('thick-bottom');

            if (fixedCells[r][c]) {
                cell.textContent = currentGrid[r][c];
                cell.classList.add('fixed');
            } else {
                cell.textContent = currentGrid[r][c];
                if (currentGrid[r][c] === 0) cell.classList.add('user-0');
                if (currentGrid[r][c] === 1) cell.classList.add('user-1');

                cell.addEventListener('click', () => {
                    if (currentGrid[r][c] === '') {
                        currentGrid[r][c] = 0; cell.textContent = '0'; cell.className = 'cell user-0';
                    } else if (currentGrid[r][c] === 0) {
                        currentGrid[r][c] = 1; cell.textContent = '1'; cell.className = 'cell user-1';
                    } else {
                        currentGrid[r][c] = ''; cell.textContent = ''; cell.className = 'cell';
                    }
                    if ((c + 1) % 2 === 0 && c !== gridSize - 1) cell.classList.add('thick-right');
                    if ((r + 1) % 2 === 0 && r !== gridSize - 1) cell.classList.add('thick-bottom');
                });
            }
            gridEl.appendChild(cell);
        }
    }
}

function checkPuzzle() {
    const msgEl = document.getElementById('message');
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (currentGrid[r][c] === '') {
                msgEl.textContent = "De puzzel is nog niet compleet!";
                msgEl.className = "error";
                return;
            }
        }
    }
    if (validateCurrentGrid()) {
        msgEl.textContent = "Gefeliciteerd! De puzzel is correct opgelost! 🎉";
        msgEl.className = "success";
    } else {
        msgEl.textContent = "Er zitten fouten in de puzzel. Kijk goed naar de regels!";
        msgEl.className = "error";
    }
}

function validateCurrentGrid() {
    const maxCount = gridSize / 2;
    for (let r = 0; r < gridSize; r++) {
        let c0 = 0, c1 = 0;
        for (let c = 0; c < gridSize; c++) {
            if (currentGrid[r][c] === 0) c0++; else c1++;
            if (c >= 2 && currentGrid[r][c] === currentGrid[r][c-1] && currentGrid[r][c] === currentGrid[r][c-2]) return false;
        }
        if (c0 !== maxCount || c1 !== maxCount) return false;
    }
    for (let c = 0; c < gridSize; c++) {
        let c0 = 0, c1 = 0;
        for (let r = 0; r < gridSize; r++) {
            if (currentGrid[r][c] === 0) c0++; else c1++;
            if (r >= 2 && currentGrid[r][c] === currentGrid[r-1][c] && currentGrid[r][c] === currentGrid[r-2][c]) return false;
        }
        if (c0 !== maxCount || c1 !== maxCount) return false;
    }
    return true;
}
