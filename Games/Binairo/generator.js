// generator.js
let gridSize = 12;
let solution = [];
let currentGrid = [];
let fixedCells = [];

function generateValidGrid() {
    solution = Array.from({ length: gridSize }, () => Array(gridSize).fill(-1));
    solve(0, 0);
}

function solve(row, col) {
    if (row === gridSize) return true;
    if (col === gridSize) return solve(row + 1, 0);

    let numbers = [0, 1].sort(() => Math.random() - 0.5);

    for (let num of numbers) {
        if (isValidPlace(row, col, num)) {
            solution[row][col] = num;
            if (solve(row, col + 1)) return true;
            solution[row][col] = -1;
        }
    }
    return false;
}

function isValidPlace(row, col, num) {
    if (col >= 2 && solution[row][col-1] === num && solution[row][col-2] === num) return false;
    if (row >= 2 && solution[row-1][col] === num && solution[row-2][col] === num) return false;

    let maxCount = gridSize / 2;
    let rowCount = solution[row].slice(0, col).filter(x => x === num).length;
    if (rowCount >= maxCount) return false;

    let colCount = 0;
    for (let r = 0; r < row; r++) {
        if (solution[r][col] === num) colCount++;
    }
    if (colCount >= maxCount) return false;

    if (col === gridSize - 1) {
        let currentRowStr = solution[row].slice(0, col).join('') + num;
        for (let r = 0; r < row; r++) {
            if (solution[r].join('') === currentRowStr) return false;
        }
    }
    return true;
}
