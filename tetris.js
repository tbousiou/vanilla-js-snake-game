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

drawSquare(1, 1, "red")

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
console.log(board);