// game.js

import Breakout from './breakout';
import Brick from './brick';

/** @class Game
  * Represents a breakout game
  */
export default class Game {
  constructor() {
    this.breakout = new Breakout(50, 50, 16);
    this.brick = [];
    this.over = false;
    this.input = {
      direction: 'right'
    }
    // Create the back buffer canvas
    this.backBufferCanvas = document.createElement('canvas');
    this.backBufferCanvas.width = 600;
    this.backBufferCanvas.height = 900;
    this.backBufferContext = this.backBufferCanvas.getContext('2d');
    // Create the screen buffer canvas
    this.screenBufferCanvas = document.createElement('canvas');
    this.screenBufferCanvas.width = 600;
    this.screenBufferCanvas.height = 900;
    document.body.appendChild(this.screenBufferCanvas);
    this.screenBufferContext = this.screenBufferCanvas.getContext('2d');
    // Create HTML UI Elements
    var message = document.createElement('div');
    message.id = "message";
    message.textContent = "";
    document.body.appendChild(message);
    // Bind class functions
    this.gameOver = this.gameOver.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.loop = this.loop.bind(this);
    // Set up event handlers
    window.onkeydown = this.handleKeyDown;
    // Start the game loop
    this.interval = setInterval(this.loop, 500);
  }
  /** @function gameOver
    * Displays a game over message using the DOM
    */
  gameOver() {
    var message = document.getElementById("message");
    message.innerText = "Game Over";
    this.over = true;
  }
  /** @method handleKeyDown
    * register when a key is pressed and change
    * our input object.
    */
  handleKeyDown(event) {
    event.preventDefault();
    switch(event.key){
      case 'a':
      case 'ArrowLeft':
        this.input.direction = 'left';
        break;
      case 'd':
      case 'ArrowRight':
        this.input.direction = 'right';
        break;
    }
  }
  /** @method update
    * Updates the game world.
    */
  update() {

    if(!this.over) {
      // determine if the ball hit bottom wall
      var position = this.ball.getPosition();
      if(position.y < 0) {
         return this.gameOver();
      }
      // Create bricks
      //if(Math.random() < 0.1)
        this.brick.push(new Brick(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)));
      // Update breakout and brick
      this.brick.forEach((brick) => {
        brick.update();
      });
      this.breakout.update(this.input, this.gameOver);
    }
  }
  /** @method render
    * Renders the game world
    */
  render() {
    this.backBufferContext.fillStyle = '#ccc';
    this.backBufferContext.fillRect(0, 0, 100, 100);
    this.brick.forEach((brick) => {
      brick.render(this.backBufferContext);
    })
    this.breakout.render(this.backBufferContext);
    this.screenBufferContext.drawImage(this.backBufferCanvas,0,0);
  }
  loop() {
    this.update();
    this.render();
  }
}
