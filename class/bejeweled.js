const Screen = require("./screen");
const Cursor = require("./cursor");

class Bejeweled {
  constructor(isTesting = false) {
    this.playerTurn = "O";
    this.grid = [];
    this.score = 0;
    this.gemTypes = ['🍎', '🍋', '🍇', '🍓', '🍊']; // Example gem types
    this.cursor = new Cursor(8, 8);

    if (!isTesting) {
      Screen.initialize(8, 8);
      Screen.setGridlines(false);
      this.cursor.setBackgroundColor();
      this.renderGrid();
      Screen.render();
    }

    this.initializeBoard();
  }

  initializeBoard() {
    // Fill the grid with random gems, avoiding initial match-3s
    for (let row = 0; row < 8; row++) {
      this.grid[row] = [];
      for (let col = 0; col < 8; col++) {
        let gem;
        do {
          gem = this.getRandomGem();
        } while (this.createsInitialMatch(row, col, gem));
        this.grid[row][col] = gem;
      }
    }

    // Render the initialized board
    this.renderGrid();
    Screen.render();
  }

    // Helper method to get a random gem
    getRandomGem() {
      const randomIndex = Math.floor(Math.random() * this.gemTypes.length);
      const randomGem = this.gemTypes[randomIndex];
      return randomGem;
    }

    // Check if placing a gem at (row, col) creates an initial match
    createsInitialMatch(row, col, gem) {
      // Temporarily place the gem to check for a match
      this.grid[row][col] = gem;

      // Check for horizontal match
      if (col >= 2 && this.grid[row][col] === this.grid[row][col - 1] && this.grid[row][col] === this.grid[row][col - 2]) {
        this.grid[row][col] = null; // Reset temporary placement
        return true;
      }

      // Check for vertical match
      if (row >= 2 && this.grid[row][col] === this.grid[row - 1][col] && this.grid[row][col] === this.grid[row - 2][col]) {
        this.grid[row][col] = null; // Reset temporary placement
        return true;
      }

      // Reset temporary placement if no match
      this.grid[row][col] = null;
      return false;
    }

  // Method to update the grid visually
  renderGrid() {
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        Screen.setGrid(row, col, this.grid[row][col]);
      }
    }

    // Display the current score
    Screen.setMessage(`Score: ${this.score}`);
  }

  // Method to swap two gems and check for matches
  swap(row1, col1, row2, col2) {
    // Swap gems
    [this.grid[row1][col1], this.grid[row2][col2]] = [this.grid[row2][col2], this.grid[row1][col1]];

    // Render the swap
    this.renderGrid();
    Screen.render();

    // Check if the swap results in a match
    if (this.isMatchPresent()) {
      return true; // Valid swap, leave as is
    } else {
      // Revert the swap if no match
      [this.grid[row1][col1], this.grid[row2][col2]] = [this.grid[row2][col2], this.grid[row1][col1]];
      this.renderGrid();
      Screen.render();
      return false;
    }
  }

  isMatchPresent() {
    return Bejeweled.checkForMatches(this.grid);
  }

  static checkForMatches(grid) {
    const matches = [];

    // Check for horizontal matches
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col <= grid[row].length - 3; col++) {
        if (grid[row][col] === grid[row][col + 1] && grid[row][col] === grid[row][col + 2] && grid[row][col] !== null) {
          matches.push({ type: 'horizontal', row, col, length: 3 });
        }
      }
    }

    // Check for vertical matches
    for (let col = 0; col < grid[0].length; col++) {
      for (let row = 0; row <= grid.length - 3; row++) {
        if (grid[row][col] === grid[row + 1][col] && grid[row][col] === grid[row + 2][col] && grid[row][col] !== null) {
          matches.push({ type: 'vertical', row, col, length: 3 });
        }
      }
    }

    return matches;

  }

  updateBoard() {
    const matches = Bejeweled.checkForMatches(this.grid);

    if (matches.length > 0) {
      this.removeMatches(matches);
      this.fillEmptySpaces();
      this.updateScore(matches);

      // Render the updated board
      this.renderGrid();
      Screen.render();
    }
  }

  removeMatches(matches) {
    matches.forEach(match => {
      const { type, row, col, length } = match;

      for (let i = 0; i < length; i++) {
        if (type === 'horizontal') {
          this.grid[row][col + i] = null; // Mark for removal
        } else if (type === 'vertical') {
          this.grid[row + i][col] = null; // Mark for removal
        }
      }
    });

    // Render after removing matches
    this.renderGrid();
    Screen.render();
  }

  fillEmptySpaces() {
    for (let col = 0; col < this.grid[0].length; col++) {
      let emptyCount = 0;

      for (let row = this.grid.length - 1; row >= 0; row--) {
        if (this.grid[row][col] === null) {
          emptyCount++;
        } else if (emptyCount > 0) {
          this.grid[row + emptyCount][col] = this.grid[row][col];
          this.grid[row][col] = null;
        }
      }

      // Fill top empty spaces with new random gems
      for (let row = 0; row < emptyCount; row++) {
        this.grid[row][col] = this.getRandomGem();
      }
    }

    // Render after filling empty spaces
    this.renderGrid();
    Screen.render();
  }

  updateScore(matches) {
    this.score += matches.length * 10; // Simple scoring: 10 points per match

    // Update the score display
    Screen.setMessage(`Score: ${this.score}`);
    Screen.render();
  }

    // Method to handle a selection or swap action
    handleSelectOrSwap() {
      if (this.cursor.isSelected) {
        // If a gem is already selected, attempt a swap
        const fromRow = this.cursor.selectedRow;
        const fromCol = this.cursor.selectedCol;
        const toRow = this.cursor.row;
        const toCol = this.cursor.col;

        // Ensure the selected cell is adjacent
        if (this.areAdjacent(fromRow, fromCol, toRow, toCol)) {
          const successfulSwap = this.swap(fromRow, fromCol, toRow, toCol);

          if (successfulSwap) {
            this.updateBoard(); // Update the board after a successful swap
          }
        }

        // Deselect after attempting a swap
        this.cursor.select();
      } else {
        // If no gem is selected, just select the current one
        this.cursor.select();
      }
    }

    // Helper method to check if two cells are adjacent
    areAdjacent(row1, col1, row2, col2) {
      return (
        (Math.abs(row1 - row2) === 1 && col1 === col2) || // Vertically adjacent
        (Math.abs(col1 - col2) === 1 && row1 === row2)    // Horizontally adjacent
      );
    }
}


module.exports = Bejeweled;
