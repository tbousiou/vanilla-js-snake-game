const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20;
const VACANT = "WHITE"; // color of an empty square


// draw a square
function drawSquare(x,y,color) {
	ctx.fillStyle = color;
	ctx.fillRect(x*SQ,y*SQ,SQ,SQ);

	ctx.strokeStyle = "BLACK";
	ctx.strokeRect(x*SQ,y*SQ,SQ,SQ)
}


// initialize the board
let board = [];
for(r = 0; r< ROW; r++){
	board[r] = []
	for(c = 0; c < COL; c++){
		board[r][c] = VACANT;
	}
}

// draw the board
function drawBoard(){
	for(r = 0; r < ROW; r++){
		for(c = 0; c < COL; c++){
			drawSquare(c, r, board[r][c]);
		}
	}
}

drawBoard();

const PIECES = [
	[Z, "red"],
	[S, "green"],
	[T, "yellow"],
	[O, "blue"],
	[L, "purple"],
	[I, "cyan"],
	[J, "orange"]

];

// generate random pieces
function randomPiece(){
	let r = randomN = Math.floor(Math.random() * PIECES.length);
	return new Piece(PIECES[r][0], PIECES[r][1])
}

// initiate a piece
let p = randomPiece();

// The Object Piece
function Piece(tetromino, color){
	this.tetromino = tetromino;
	this.color = color;

	this.tetrominoN = 0; // starting pattern of tetromino
	this.activeTetromino = this.tetromino[this.tetrominoN];

	// control the pieces
	this.x = 3;
	this.y = -2;
}


// helper function to draw a piece to the board
Piece.prototype.fill = function(color){
	const size = this.activeTetromino.length;
	for(r = 0; r < size; r++){
		for(c = 0; c < size; c++){
			if (this.activeTetromino[r][c]){
				drawSquare(this.x + c, this.y + r, color);
			}
		}
	}
}


// draw a piece to the board
Piece.prototype.draw = function(){
	this.fill(this.color);
}

// clear piece before redraw
Piece.prototype.unDraw = function(){
	this.fill(VACANT);
}


// move Down the piece
Piece.prototype.moveDown = function(){
	if(!this.collision(0,1,this.activeTetromino)){
		this.unDraw();
		this.y++;
		this.draw();
	} else {
		// lock the piece
		this.lock();
		p = randomPiece();
	}	
}


// move Left the piece
Piece.prototype.moveLeft = function(){
	if(!this.collision(-1,0,this.activeTetromino)){
		this.unDraw();
		this.x--;
		this.draw();
	}
	
}

// move Right the piece
Piece.prototype.moveRight = function(){
	if(!this.collision(1,0,this.activeTetromino)){
		this.unDraw();
		this.x++;
		this.draw();
	}
}

// rotate the piece
Piece.prototype.rotate = function(){
	let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
	let kick = 0;

	if(this.collision(0,0,nextPattern)){
		if(this.x > COL/2){
			kick = -1;	//right wall collision
		} else {
			kick = 1;	// left wall collision
		}
	}

	if(!this.collision(kick,0,nextPattern)){
		this.unDraw();
		this.x += kick;
		this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
		this.activeTetromino = this.tetromino[this.tetrominoN];
		this.draw();
	}
}
	
let score = 0;

// lock the piece when to the bottom or another piece
Piece.prototype.lock = function(){
	const size = this.activeTetromino.length;
	for(r = 0; r < size; r++){
		for(c = 0; c < size; c++){
			if ( !this.activeTetromino[r][c]){
				continue;
			}
			// pieces to lock on top results to game over
			console.log(this.y+r);
			if(this.y + r < 0){
				alert("Game Over");
				// stop the animation frame
				gameOver = true;
				break;
			}

			// lock the piece
			board[this.y+r][this.x+c] = this.color;
		}
	}
	
	// remove full rows
	for(r = 0; r < ROW; r++) {
		let isRowFull = true;
		for(c = 0; c < COL; c++) {
			if(board[r][c]==VACANT) {
			 	isRowFull = isRowFull && (board[r][c] != VACANT);
			}
		}
		if(isRowFull) {
			console.log("Row " + r + isRowFull);
			for(y = r; y > 0; y--) {
				board[y] = board[y-1];
				//drawBoard();
			}

			board[0].fill(VACANT);

			// update the score
			score += 10;
		}
		
	}
	// update the board
	drawBoard();
	scoreElement.innerHTML = score;

}


// collision detection
Piece.prototype.collision = function(x,y,piece) {
	for(r = 0; r < piece.length; r++){
		for(c = 0; c < piece.length; c++){
			// if the piece square is empty, skip
			if(!piece[r][c]){
				continue;
			}
			// coordinates of the piece after the movement
			let newX = this.x + c + x;
			let newY = this.y + r + y;

			// conditions
			if(newX < 0 || newX >= COL || newY >= ROW){
				return true;
			}
			// skip newY < 0;
			if(newY < 0){
				continue;
			}
			// check if there is a locked piece already
			if(board[newY][newX] != VACANT){
				return true;
			}
		}
	}
	return false;
}


// Control the piece
document.addEventListener("keydown", CONTROL);

function CONTROL(event) {
	if(event.keyCode == 37){
		p.moveLeft();
		dropStart = Date.now() 	// reset timer so it cant go down
	} else if(event.keyCode == 38){
		p.rotate();
		dropStart = Date.now()	// reset timer ...
	}else if(event.keyCode == 39){
		p.moveRight();			// reset timer ...
		dropStart = Date.now()
	}else if(event.keyCode == 40){
		p.moveDown();
	}
}


// Main game loop
let dropStart = Date.now();
let gameOver = false;
function drop(){
	let now = Date.now();
	let delta = now - dropStart;
	if (delta > 1000) { // move every 1 second
		p.moveDown();
		dropStart = Date.now();
	}
	if(!gameOver){
		requestAnimationFrame(drop);
	}
}

drop();