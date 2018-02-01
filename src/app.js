var rev=require('./reversi.js');

const fs=require('fs');

const readlineSync=require('readline-sync');


if (process.argv[2]) {
	fs.readFile(process.argv[2],'utf8',function(err,data){
		if(err)
			console.log("Error: ", err);
		else{
			const object = JSON.parse(data);
			const player = object.boardPreset.playerLetter;
			const computer = (player === "X") ? "O" : "X";
			const board = [...object.boardPreset.board];
			const playersTurn = (player === "X") ? true: false;
			const scriptedMovesPlayer = [...object.scriptedMoves.player];
			const scriptedMovesComputer = [...object.scriptedMoves.computer];
			playscript(board,player,computer,playersTurn,scriptedMovesPlayer,scriptedMovesComputer);

		}
	});
}

else{

	let board=boardset();
	let computer;
	let player;
	let playyerturn;
	while (true){
			player=readlineSync.question("Pick your letter: X (black) or O (white)");
			if (player==="X" || player==="O"){
				break;
			}
	}
	if (player==='X'){
		computer='O';
	}
	else{
		computer='X';
	}
	if (player==='X'){
		playerturn=true;
	}
	else{
		playerturn=false;
	}

	console.log(rev.boardToString(board));
	console.log("Player 1:"+player);

	board=play(board,player,computer,playerturn);
	if (player==='X'){
		if (rev.getLetterCounts(board).X>rev.getLetterCounts(board).O)
			console.log("You won");
		else{
			console.log("You lost");
		}
	}

	if (player==='O'){
		if (rev.getLetterCounts(board).X<rev.getLetterCounts(board).O)
			console.log("You won");
		else{
			console.log("You lost");
		}
	}
}

function boardset(){
		let board;
		while (true){
			answer1=readlineSync.question("How wide do you want the board to be? (Even numbers between 4 and 26, inclusive.)");
			if (answer1>=4 && answer1<=26 &&answer1%2==0){
				board = rev.generateBoard(answer1, answer1);
				board = rev.setBoardCell(board, "O", (answer1/2)-1, (answer1/2)-1);
				board = rev.setBoardCell(board, "O", (answer1/2), (answer1/2));
				board = rev.setBoardCell(board, "X", (answer1/2) - 1, (answer1/2));
				board = rev.setBoardCell(board, "X", (answer1/2), (answer1/2) - 1);
				return board;	
			}

		}
		
}




function validinput(input){
	const A=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	const B=['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26'];

	if (A.includes(input.charAt(0))===false)
		return false;
	if (B.includes(input.charAt(1)===false))
		return false;
	if (input.length<2)
		return false;
	if (input.length===3){
			if (B.includes(input.charAt(1))===true && B.includes(input.charAt(2))===true && input.charAt(2)<7){
				return true;
			}
			else{
				return false;
			}
	}
	return true;
}

function play(board, player, computer, playersturn){
		console.log("playing");
		comppass=0;
		playerpass=0;
		while(!rev.isBoardFull(board)){
			if (playerpass==2){
					console.log("You lost");
					console.log(rev.boardToString(board));
					break;
			}				
			if (comppass==2){
				console.log("You win");
				console.log(rev.boardToString(board));
				break;
			}

			if (playersturn==true){
				const validMoves = rev.getValidMoves(board, player);
				if(validMoves.length === 0){
					console.log("No valid moves.");
					playerpass++;
				}
				else{
					while (true){
						while (true){
							move = readlineSync.question("What's your move? (in algebraic notation)");
							if (validinput(move)==false)
								console.log("Invalid format");
							else{
								break;
							}
						}	
						if (rev.isValidMoveAlgebraicNotation(board,player,move)==false){
							console.log("Invalid Move. Make sure it's formatted, targets empty space, and flips opponent piece(s)");	
						}
						if (rev.isValidMoveAlgebraicNotation(board,player,move)==true)
							break;
					}
					board = rev.placeLetters(board, player, move);
					board = rev.flipCells(board, rev.getCellsToFlip(board, rev.algebraicToRowCol(move).row, rev.algebraicToRowCol(move).col));
					console.log(rev.boardToString(board));
					playerpass = 0;
				}
			}

			if (playersturn==false){
				compvalidmoves=rev.getValidMoves(board,computer);
				if (compvalidmoves.length==0){
					console.log("No valid moves for computer");
					comppass++;
				}
				else{
					compmove=compvalidmoves[Math.floor(Math.random()*compvalidmoves.length)];
					board = rev.setBoardCell(board, computer, compmove[0], compmove[1]);
					board = rev.flipCells(board, rev.getCellsToFlip(board, compmove[0], compmove[1]));
					console.log(rev.boardToString(board));
					comppass = 0;
				}
			}
			playersturn=!playersturn
		}
		return board;
}

function playscript(board, player, computer, playersTurn,playerscriptedmoves,computerscriptedmoves){
	console.log(rev.boardToString);
	let playerpass=0;
	let computerpass=0;
	if (playersTurn){
		while (playerscriptedmoves.length!=0&&computerscriptedmoves.length!=0){
			if (playerscript(board,player,playerscriptedmoves[0])===-1){
				const validMoves = rev.getValidMoves(board, player);
				if(validMoves.length === 0){
					console.log("No valid moves.");
					playerpass++;
				}
				else{
					while (true){
						while (true){
							move = readlineSync.question("What's your move? (in algebraic notation)");
							if (validinput(move)==false)
								console.log("Invalid format");
							else{
								break;
							}
						}	
						if (rev.isValidMoveAlgebraicNotation(board,player,move)==false){
							console.log("Invalid Move. Make sure it's formatted, targets empty space, and flips opponent piece(s)");	
						}
						if (rev.isValidMoveAlgebraicNotation(board,player,move)==true)
							break;
					}
					board = rev.placeLetters(board, player, move);
					board = rev.flipCells(board, rev.getCellsToFlip(board, rev.algebraicToRowCol(move).row, rev.algebraicToRowCol(move).col));
					console.log(rev.boardToString(board));
					playerscriptedmoves.shift();

				}
			}
			else{
				board=playerscript(board,player,playerscriptedmoves[0])
				playerscriptedmoves.shift();
			}
			if (computerscript(board,player,computerscriptedmoves[0])===-1){
				compvalidmoves=rev.getValidMoves(board,computer);
				if (compvalidmoves.length==0){
					console.log("No valid moves for computer");
					comppass++;
				}
				else{
					compmove=compvalidmoves[Math.floor(Math.random()*compvalidmoves.length)];
					board = rev.setBoardCell(board, computer, compmove[0], compmove[1]);
					board = rev.flipCells(board, rev.getCellsToFlip(board, compmove[0], compmove[1]));
					console.log(rev.boardToString(board));
					comppass = 0;
					computerscriptedmoves.shift();
				}

			}
			else{
				board=computerscript(board,computer,computerscriptedmoves[0]);
				computerscriptedmoves.shift();
			}
		}
	}
	if (!playersTurn){
		while (playerscriptedmoves.length!=0&&computerscriptedmoves.length!=0){
			if (computerscript(board,player,computerscriptedmoves[0])===-1){
				compvalidmoves=rev.getValidMoves(board,computer);
				if (compvalidmoves.length==0){
					console.log("No valid moves for computer");
					comppass++;
				}
				else{
					compmove=compvalidmoves[Math.floor(Math.random()*compvalidmoves.length)];
					board = rev.setBoardCell(board, computer, compmove[0], compmove[1]);
					board = rev.flipCells(board, rev.getCellsToFlip(board, compmove[0], compmove[1]));
					console.log(rev.boardToString(board));
					comppass = 0;
					computerscriptedmoves.shift();
				}

			}
			else{
				board=computerscript(board,computer,computerscriptedmoves[0]);
				computerscriptedmoves.shift();
			}
			if (playerscript(board,player,playerscriptedmoves[0])===-1){
				const validMoves = rev.getValidMoves(board, player);
				if(validMoves.length === 0){
					console.log("No valid moves.");
					playerpass++;
				}
				else{
					while (true){
						while (true){
							move = readlineSync.question("What's your move? (in algebraic notation)");
							if (validinput(move)==false)
								console.log("Invalid format");
							else{
								break;
							}
						}	
						if (rev.isValidMoveAlgebraicNotation(board,player,move)==false){
							console.log("Invalid Move. Make sure it's formatted, targets empty space, and flips opponent piece(s)");	
						}
						if (rev.isValidMoveAlgebraicNotation(board,player,move)==true)
							break;
					}
					board = rev.placeLetters(board, player, move);
					board = rev.flipCells(board, rev.getCellsToFlip(board, rev.algebraicToRowCol(move).row, rev.algebraicToRowCol(move).col));
					console.log(rev.boardToString(board));
					playerscriptedmoves.shift();

				}
			}
			else{
				board=playerscript(board,player,playerscriptedmoves[0])
				playerscriptedmoves.shift();
			}
		}
	}
	board=play(board,player,computer,playerturn);
	if (player==='X'){
		if (rev.getLetterCounts(board).X>rev.getLetterCounts(board).O)
			console.log("You won");
		else{
			console.log("You lost");
		}
	}

	if (player==='O'){
		if (rev.getLetterCounts(board).X<rev.getLetterCounts(board).O)
			console.log("You won");
		else{
			console.log("You lost");
		}
	}
}

function playerscript(board, player, playermove){
	const move=rev.algebraicToRowCol(playermove);
	if (rev.isValidMoveAlgebraicNotation(playermove)){
		board=rev.setBoardCell(board,player,move.row,move.col);
		board=rev.flipCells(board, rev.getCellsToFlip(board,move.row,move.col));
		console.log(rev.boardToString(board))
		return board;
	}
	return -1;
}

function computerscript(board,computer,computermove){
	const move=rev.algebraicToRowCol(computermove);
	if (rev.isValidMoveAlgebraicNotation(computermove)){
		board=rev.setBoardCell(board,computer,move.row,move.col);
		board=rev.flipCells(board, rev.getCellsToFlip(board,move.row,move.col));
		console.log(rev.boardToString(board))
		return board;
	}
	return -1;
}






