const Screen = require("./screen");

class Cursor {
  constructor(numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;

    this.row = 0;
    this.col = 0;

    this.gridColor = 'black';
    this.cursorColor = 'yellow';
    this.selectedColor = 'green'; // Color to show when a gem is selected

    this.isSelected = false; // Track if a gem is selected
    this.selectedRow = null;
    this.selectedCol = null;
  }

  resetBackgroundColor() {
    Screen.setBackgroundColor(this.row, this.col, this.gridColor);
  }

  setBackgroundColor() {
    const color = this.isSelected ? this.selectedColor : this.cursorColor;
    Screen.setBackgroundColor(this.row, this.col, color);
  }

  select() {
    if (this.isSelected) {
      // Deselect if already selected
      this.isSelected = false;
      this.resetBackgroundColor();
    } else {
      // Select current cell
      this.isSelected = true;
      this.selectedRow = this.row;
      this.selectedCol = this.col;
      this.setBackgroundColor();
    }
    Screen.render();

    Screen.printCommands();
  }

  up() {
    if (this.row > 0) {
      this.resetBackgroundColor();
      this.row -= 1;
      this.setBackgroundColor();
      Screen.render();
      Screen.printCommands();
    }
  }

  down() {
    if (this.row < this.numRows - 1) {
      this.resetBackgroundColor();
      this.row += 1;
      this.setBackgroundColor();
      Screen.render();
      Screen.printCommands();
    }
  }

  left() {
    if (this.col > 0) {
      this.resetBackgroundColor();
      this.col -= 1;
      this.setBackgroundColor();
      Screen.render();
      Screen.printCommands();
    }
  }

  right() {
    if (this.col < this.numCols - 1) {
      this.resetBackgroundColor();
      this.col += 1;
      this.setBackgroundColor();
      Screen.render();
      Screen.printCommands();
    }
  }
}


module.exports = Cursor;
