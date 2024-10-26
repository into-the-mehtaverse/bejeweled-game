const Screen = require("/Users/shaanmehta/aa-projects/October/bejeweled-starter/starter/class/screen.js");

const Bejeweled = require("./class/bejeweled");

bejeweled = new Bejeweled();

// Adding commands to interact with the game
Screen.addCommand('w', 'move cursor up', () => bejeweled.cursor.up());
Screen.addCommand('s', 'move cursor down', () => bejeweled.cursor.down());
Screen.addCommand('a', 'move cursor left', () => bejeweled.cursor.left());
Screen.addCommand('d', 'move cursor right', () => bejeweled.cursor.right());
Screen.addCommand('x', 'select or swap gem', () => bejeweled.handleSelectOrSwap());

Screen.printCommands();
