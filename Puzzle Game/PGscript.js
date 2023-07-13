document.addEventListener('DOMContentLoaded', function() {
    const easyButton = document.getElementById('easy');
    const intermediateButton = document.getElementById('intermediate');
    const hardButton = document.getElementById('hard');
    const expertButton = document.getElementById('expert');
        
    easyButton.addEventListener('click', function(){
      gridInfo.size = 3;
      gridInfo.diff = 'Easy';
      buttonPressed();
    });
    intermediateButton.addEventListener('click', function(){
      gridInfo.size = 5;
      gridInfo.diff = 'Intermediate';
      buttonPressed();
    });
    hardButton.addEventListener('click', function(){
      gridInfo.size = 7;
      gridInfo.diff = 'Hard';
      buttonPressed();
    });
    expertButton.addEventListener('click', function(){
      gridInfo.size = 9;
      gridInfo.diff = 'Expert';
      buttonPressed();
    });

    const clicked = new Event('click');

    let gridInfo = {size: 0, diff: 'none'};   // (Dimensions-of-Grid, Difficulty)
    const cells = [];                         // Grid display as a matrix
    const solution = [];                      // Order of cells clicked to generate starting position. Helps with resetting board and giving hints
    const gridContainer = document.createElement('div');  // Grid container
    gridContainer.className = 'gridContainer';


    function buttonPressed(){
      // Delete buttons
      var buttons = document.getElementById("buttonContainer");
      buttons.parentNode.removeChild(buttons);    

      // Generate grid
      makeGrid();
      
      // Display selected difficulty
      const difficulty = document.createElement('h1');
      difficulty.textContent = gridInfo.diff;
      difficulty.style.position = 'relative';
      gridContainer.insertAdjacentElement('beforebegin', difficulty);
      if(gridInfo.diff === 'Hard' || gridInfo.diff === 'Expert'){
        difficulty.style.marginBottom = '1px';
        const extendMsg = document.createElement('p');
        extendMsg.textContent = 'The + is extended for Hard and Expert games';
        extendMsg.style.position = 'relative';
        extendMsg.style.marginTop = '1px';
        difficulty.insertAdjacentElement('afterend', extendMsg);
      }

      // Button to reselect difficulty
      const refreshButton = document.createElement('button');
      refreshButton.textContent = 'Reselect Difficulty';

      refreshButton.addEventListener('click', function() {
        location.reload();
      });

      gridContainer.insertAdjacentElement('beforebegin', refreshButton);


      // Button to reset the starting position of the grid
      // reset timer & click count once added
      const resetButton = document.createElement('button');
      resetButton.textContent = 'Reset Starting Position';

      resetButton.addEventListener('click', function() {
        for(let i = 0; i < gridInfo.size; i++){
          for(let j = 0; j < gridInfo.size; j++){
            if(!cells[i][j].classList.contains('clicked-color')){
              cells[i][j].classList.toggle('clicked-color');
            }
          }
        }
        for(let k = gridInfo.size - 1; k >= 0; k--){
          cells[solution[k][0]][solution[k][1]].dispatchEvent(clicked);
        }
      });
      
      gridContainer.insertAdjacentElement('beforebegin', resetButton);


      // Set the random starting position of the grid
      setGrid(gridInfo);
      console.log(solution);
    }

    
    function makeGrid() {
      
      for (let i = 0; i < gridInfo.size; i++) {
        const row = document.createElement('div');  // Create new row for the grid
        row.className = 'row';

        cells.push([]); // Create an empty array for each row
      
        for (let j = 0; j < gridInfo.size; j++) {
          const cell = document.createElement('div');
          cell.className = 'cell';

          cell.addEventListener('mouseenter', function() {
            cell.classList.add('hover-color');
          });
          
          cell.addEventListener('mouseleave', function() {
            cell.classList.remove('hover-color');
          });

          // Add event listener to each cell for each click
          cell.addEventListener('click', function() {
            // Flip the clicked cell

            cell.classList.toggle('clicked-color');

            // Flip the surrounding cells
            const directions = [
              [i - 1, j], // Top
              [i + 1, j], // Bottom
              [i, j - 1], // Left
              [i, j + 1]  // Right
            ];

            // If hard/expert, extend flipped points
            if(gridInfo.diff === 'Hard' || gridInfo.diff === 'Expert'){
              directions.push(
                [i, j + 2],
                [i, j - 2],
                [i + 2, j],
                [i - 2, j]
              );
            }
            

            directions.forEach(([x, y]) => {
              if (x >= 0 && x < gridInfo.size && y >= 0 && y < gridInfo.size) {
                const touchingCell = cells[x][y];
                touchingCell.classList.toggle('clicked-color');
              }
            });

            // Check if changed position wins the game
            checkWin();
          });

          cell.classList.toggle('clicked-color'); // Grid starts with all cells lit
          row.appendChild(cell);  // Append cell to its row
          cells[i].push(cell); // Store the cell in the corresponding row array
        }
      
        gridContainer.appendChild(row);
      }
      
      // Update gridContainer CSS grid properties
      gridContainer.style.gridTemplateColumns = `repeat(${gridInfo.size}, 1fr)`;
      gridContainer.style.gridTemplateRows = `repeat(${gridInfo.size}, 1fr)`;
      
      document.body.appendChild(gridContainer);

    }

    function setGrid(){
      const numClicks = gridInfo.size;
      let prevI = -1;
      let prevJ = -1;

      // Grid is currently all activated cells
      // Randomly 'click' cells to get starting position
      for(let i = 0; i < numClicks; i++){
        const randI = Math.floor(Math.random() * (numClicks));
        const randJ = Math.floor(Math.random() * (numClicks));
        const temp = [randI, randJ];
        if(solution.some(arr => arr[0] === randI && arr[1] === randJ)){
          i--;
          continue;
        }
        else{
          cells[randI][randJ].dispatchEvent(clicked);
          prevI = randI;
          prevJ = randJ;
          solution[i] = [randI, randJ];   // randI from the leftmost column, randJ from the topmost row
        }
      }
    }

    function checkWin(){
      let win = true;
      for(let i = 0; i < gridInfo.size; i++){
        for(let j = 0; j < gridInfo.size; j++){
          if(!cells[i][j].classList.contains('clicked-color')){
            win = false;
          }
        }
      }
      if(win){
        // Do a little animation or something
        // Message the user that they won, suggest trying to beat it within gridsize amount of clicks if not already done so
        // Make grid unclickable until reset
        console.log('you win!');
      }
    }
});