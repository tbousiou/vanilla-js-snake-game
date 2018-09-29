const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");

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

//drawSquare(1, 1, "red")

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

// initiate a piece
let p = new Piece(PIECES[6][0], PIECES[6][1])

// The Object Piece
function Piece(tetromino, color){
	this.tetromino = tetromino;
	this.color = color;

	this.tetrominoN = 0; // starting pattern of tetromino
	this.activeTetromino = this.tetromino[this.tetrominoN];

	// control the pieces
	this.x = 0;
	this.y = 0;
}

Piece.prototype.draw = function(){
	const size = this.activeTetromino.length;
	for(r = 0; r < size; r++){
		for(c = 0; c < size; c++){
			if (this.activeTetromino[r][c]){
				drawSquare(this.x + c, this.y + r, this.color);
			}
		}
	}
}

p.draw();