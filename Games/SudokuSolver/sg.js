const grid = document.getElementById('grid');

function start(){
for (let i = 0; i < 81; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1;
    input.classList.add('sudoku-cell');

    // Validatie: Alleen 0-9 toestaan
    input.addEventListener('input', function() {
        if (!/^[0-9]$/.test(this.value)) {
            this.value = '';
        }
    });

    grid.appendChild(input);
}
}
