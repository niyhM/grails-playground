var player = 1;
var depth = 0;

function setBoard() {
	boardArray = new Array(3);
	for (var i = 0; i < 3; i++) {
		boardArray[i] = new Array(3);
	}
	
	possibleMoves = [];
	
	var gameSpace = document.getElementById("box")
	
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			gameSpace.innerHTML += "<input type=\"button\" id=\"btn" + i + j
					+ "\" onClick=\"clickBtn(btn" + i + j + ")\" />";
			possibleMoves.push([i,j]);
		}
	}
	gameSpace.innerHTML += "<button id=\"reset\" onClick=\"reset()\">Reset!</button>";
	
	
}

function clickBtn(btn) {
	var x = btn.id.charAt(3);
	var y = btn.id.charAt(4);
	if (player == 1) {
		document.getElementById(btn.id).value = "X";
		document.getElementById(btn.id).disabled = "disabled";
		player--;
		boardArray[x][y] = "X";
	} 

	var hasWon = winner(boardArray, x, y)
	if(hasWon != null){
		confirm(boardArray[x][y] + " has won the game!");
		return;
	}
	
	var temp = [parseInt(x) ,parseInt(y)];

	for(var i = 0; i < possibleMoves.length; i++){
		if(possibleMoves[i][0] == temp[0] && possibleMoves[i][1] == temp[1]){
			possibleMoves.splice(i, 1);
		}
	}

	var newArray = new Array(3);
	for (var i = 0; i < 3; i++) {
		newArray[i] = new Array(3);
	}
	for (var i = 0; i < boardArray.length; i++){
		for(var j = 0; j < boardArray.length; j++){
			if(boardArray[i][j] != null){
				newArray[i][j] = boardArray[i][j];
			}
		}
	}
	console.log("\n")
	var choice = minimax(newArray, possibleMoves.slice(0), "O", null, 0);
	//REMOVE...:
	//return;

	var id = "btn" + possibleMoves[choice][0] + possibleMoves[choice][1];
	document.getElementById(id).value = "O";
	document.getElementById(id).disabled = "disabled";
	player++;
	boardArray[possibleMoves[choice][0]][possibleMoves[choice][1]] = "O";	
	
	var hasWon = winner(boardArray, possibleMoves[choice][0], possibleMoves[choice][1])
	if(hasWon != null){
		confirm(boardArray[possibleMoves[choice][0]][possibleMoves[choice][1]] + " has won the game!");
	}
	
	possibleMoves.splice(choice,1);


	
}

function winner(board, x, y) {
	
	
	var winner = null;	
	for (var i = 0; i < 3; i++) {
		if (board[x][i] != board[x][y]) {
			break;
		}
		if (i == 2) {
			winner = board[x][y];
		}
	}

	for (var i = 0; i < 3; i++) {
		if (board[i][y] != board[x][y]) {
			break;
		}
		if (i == 2) {
			winner = board[x][y];
		}
	}

	// check diag **only** if either x and y != 1 (barring middle square)
	if (x == 1 && y == 1 || x != 1 && y != 1) {
		for (var i = 0; i < 3; i++) {
			if (board[i][i] != board[x][y]) {
				break;
			}
			if (i == 2) {
				winner = board[x][y];
			}
		}

		for (var i = 0; i < 3; i++) {
			if (board[i][2 - i] != board[x][y]) {
				break;
			}
			if (i == 2) {
				winner = board[x][y];
			}
		}
	}
	
	return winner;
	}
	
	function reset() {
		player = 1;
		document.getElementById("box").innerHTML = "";
		setBoard();
	}
	
	
	
	function minimax(board, moves, turn, lastMove, depth){
		
		var lowestValue = 10;
		var highestValue = -10;
		var lowestIndex = 0;
		var highestIndex = 0;
		
		if(lastMove != null){
			var boardScore = score(board, lastMove[0], lastMove[1]);
			if(boardScore != 0 ){
				return boardScore;
			}
		}


		for(var i = 0; i < moves.length;i++){
			
			var move = moves[i].slice(0);
			var x = move[0];
			var y = move[1];
			
			//Create a clone (deep clone) of board.
			var newBoard = [];
			for (var j = 0; j < 3; j++)
			    newBoard[j] = board[j].slice(0);
			
			//Create a clone (deep clone) of possible moves.
			var newMoves = [];
			for (var j = 0; j < moves.length; j++)
				newMoves[j] = moves[j].slice(0);
			
			//delete the move we are going to try:
			newMoves.splice(i, 1);
			
			
			var zz = move.slice(0);
			//console.log(zz);
			
			
			newBoard[x][y] = turn;
			
			if(turn == "X"){
				var boardScore = minimax(newBoard, newMoves, "Y", move, depth + 1);
				if(depth == 1){
					console.log(boardScore)
					console.log("with move: " + move)

				}
				if(boardScore < lowestValue){
					lowestValue = boardScore;
					lowestIndex = i;
				}
			}
			else{
				var boardScore = minimax(newBoard, newMoves, "X", move, depth + 1);
				if(depth == 2){
					console.log(boardScore)
					console.log("with move: " + move)
				}
				if(boardScore > highestValue){
					highestValue = boardScore;
					highestIndex = i;
				}
			}
			//var z = score(newBoard, x, y);
			//console.log(z);
			
			
		}
		
		if(lastMove == null){
			return highestIndex;
		}
		else{
			if(turn == "O"){
				return highestValue;
			}
			else{
				return lowestValue;
			}
		}
		
	}
	
	
	function score(board, x, y){
		var hasWon = winner(board, x, y);
		if(hasWon != null){
			if(hasWon == "O"){
				return 10;
			}
			else if (x == 1 && y == 1){
				return 5;
			}
			else return -10;
		}

		
		return 0;
	}