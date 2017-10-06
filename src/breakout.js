 function Breakout() {
  this.cellSize = 10;
  this.width = 100;
  this.height = 15;
  this.paddle = [{x:600, y:800}];
  this.over = false;
  // Create game canvas and context
  var canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 900;
  document.body.appendChild(canvas);
  this.ctx = canvas.getContext('2d');
  
  this.handleKeyDown = this.handleKeyDown.bind(this);
  window.addEventListener('keydown', this.handleKeyDown);
  this.handleKeyUp = this.handleKeyUp.bind(this);
  window.addEventListener('keyup', this.handleKeyUp);

  this.interval = setInterval(()=>this.loop(), 20);
  ballDX = -4;
  ballDY = -2;
}

Breakout.prototype.animate = function(){
	this.drawPaddle();
	this.drawBall();
}

Breakout.prototype.handleKeyDown = function(event) {
  switch(event.key){
    case 'a':
    case 'ArrowLeft':
      this.direction = 'left';
      break;
    case 'd':
    case 'ArrowRight':
      this.direction = 'right';
	  break;
  }
}

Breakout.prototype.handleKeyUp = function(event) {
	this.direction = 'none';
}

Breakout.prototype.gameOver = function() {
  clearInterval(this.interval);
  window.removeEventListener('keydown', this.handleKeyDown);
  window.addEventListener('keydown', ()=>{
    score = 0;
	new Breakout();
  }, {once: true})
  this.over = true;
}

Breakout.prototype.drawBackground = function(){
	this.ctx.fillStyle = "#000";
	this.ctx.fillRect(0, 0, 1200, 900);
}

var paddleX = 600;
var paddleY = 800;
var paddleWidth = 100;
var paddleHeight = 15;
var paddleDX;
var paddleSX = 10;

Breakout.prototype.drawPaddle = function(){
	this.ctx.fillStyle = "#FFF";
	this.ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
}

var ballX = 600;
var ballY = 750;
var ballRadius = 10;

Breakout.prototype.drawBall = function(){
	this.ctx.fillStyle = "#FFF";
	this.ctx.beginPath();
	this.ctx.arc(ballX,ballY,ballRadius,0,Math.PI*2,true);
	this.ctx.fill();
}

var brickHeight = 25;
var brickWidth = 60;

var bricks =[
[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

Breakout.prototype.createBricks = function(){
	for(var i = 0; i < 8; i++){
	  for(var j = 0; j < 20; j++){
		  this.drawBricks(j,i,bricks[i][j]);
	  }
  } 
}

Breakout.prototype.drawBricks = function(x,y,color){
	switch(color){
		case 2:
			this.ctx.fillStyle = "#BFFFA5";
			break;
		case 3:
			this.ctx.fillStyle = "#FFCBA5";
			break;
		case 4:
			this.ctx.fillStyle = "#D82800";
			break;
		case 1:
			this.ctx.fillStyle = "#FFF7A5";
			break;
	}
	if(color){
		this.ctx.fillRect(x*brickWidth,y*brickHeight,brickWidth,brickHeight);
		this.ctx.strokeRect(x*brickWidth+1,y*brickHeight+1,brickWidth-2,brickHeight-2);
	}
}

var score = 0;

Breakout.prototype.displayScore = function(){
  this.ctx.fillStyle = "#FFF";
  this.ctx.font = "20px Times New Roman";
  
  //this.ctx.clearRect(0,870,600,30);
  this.ctx.fillText('Score: '+score,10,895);
}

Breakout.prototype.render = function() {
  this.ctx.clearRect(0,0,1200,900);
  if(this.over) {
    this.ctx.fillStyle = 'rgba(255,0,0,0.25)';
    this.ctx.fillRect(0,0,
      1200,
      900);
    this.ctx.fillStyle = "white";
    this.ctx.font = '64px sans-serif';
    this.ctx.fillText("Game Over", 450, 200);
    this.ctx.fillText("Score: " + score, 450, 400);
    this.ctx.font = '40px sans-serif';
    this.ctx.fillText("Press any key for new game", 350, 600);
    return;
  }
  this.drawBackground();
  this.drawPaddle();
  this.drawBall();
  this.createBricks();
  this.displayScore();
}

var bounceSound = new Audio("bounce.wav");
var breakSound = new Audio("break.wav");

Breakout.prototype.hitBrick = function(x,y){
	bricks[x][y] = 0;
	score++;
	breakSound.play();
}

Breakout.prototype.collisionX = function(){
	var hit = false;
	for (var i = 7; i >= 0; i--) {
		for(var j = 0; j < bricks[i].length; j++){
			if(bricks[i][j]){
				var brickX = j * brickWidth;
				var brickY = i * brickHeight;
				if((ballX + ballDX +ballRadius >= brickX) && (ballX + ballRadius <= brickX)
					|| ((ballX + ballDX - ballRadius <= brickX + brickWidth) && (ballX - ballRadius >= brickX + brickWidth))){
						if((ballY + ballDY - ballRadius <= brickY + brickHeight) && (ballY + ballDY + ballRadius >= brickY)){
							this.hitBrick(i,j);
							hit = true;
						}
				}
			}
		}
	}
	return hit;
}

Breakout.prototype.collisionY = function(){
	var hit = false;
	for (var i = 7; i >= 0; i--) {
		for(var j = 0; j < bricks[i].length; j++){
			if(bricks[i][j]){
				var brickX = j * brickWidth;
				var brickY = i * brickHeight;
				if((ballY + ballDY - ballRadius <= brickY + brickHeight) && (ballY - ballRadius >= brickY + brickHeight)
					|| ((ballY + ballDY + ballRadius >= brickY) && (ballY + ballRadius <= brickY))){
						if((ballX + ballDX + ballRadius >= brickX) && (ballX + ballDX - ballRadius <= brickX)){
							this.hitBrick(i,j);
							hit = true;
						}
				}
			}
		}
	}
	return hit;
}

var ballDX;
var ballDY;

/** @method update
  * Updates the breakout, moving it forward
  */
Breakout.prototype.update = function() {
  //Ball Update
  if(ballY + ballDY - ballRadius < 0 || this.collisionY()){
	  ballDY = -ballDY;
	  bounceSound.play();
  }
  if(ballY + ballDY + ballRadius > 900){
	  this.gameOver();
  }
  if((ballX + ballDX - ballRadius < 0) || (ballX + ballDX + ballRadius > 1200) || this.collisionX()) {
	  ballDX = -ballDX;
	  bounceSound.play();
  }
  if(ballY + ballDY + ballRadius >= paddleY){
	  if (ballX + ballDX > paddleX && ballX + ballDX < paddleX + 100){
		  ballDY = -ballDY;
		  bounceSound.play();
	  } else if (ballX + ballDX === paddleX || ballX + ballDX === paddleX + 100){
		  ballDX = -ballDX;
		  ballDY = -ballDY;
		  bounceSound.play();
	  }
  }
  ballX = ballX + (ballDX*3);
  ballY = ballY + (ballDY*3);
  
  //Paddle Update
  if (this.direction === 'left'){
	  paddleDX = -paddleSX;
  } else if (this.direction === 'right'){
	  paddleDX = paddleSX;
  } else {
	  paddleDX = 0;
  }
  if(paddleX + paddleDX < 0 || paddleX + paddleDX + 100 > 1200){
	  paddleDX = 0;
  }
  paddleX = paddleX + paddleDX;
}

Breakout.prototype.loop = function() {
  this.update();
  this.render();
}

new Breakout();

 