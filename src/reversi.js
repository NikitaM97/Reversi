// reversi.js

const rev = {

	repeat: function(value,n){
		const A= new Array(n);
		for (i=0;i<n;i++){
			A[i]=value;
		}
		return A;
	},

	generateBoard: function(rows,columns,initialCellValue){
		if(initialCellValue)
			{return rev.repeat(initialCellVaue, rows * columns);}
		else
			{return rev.repeat(" ", rows * columns);}
	},

	rowColToIndex: function(board, rowNumber, columnNumber){
		var og=Math.sqrt(board.length);
		return (og*rowNumber)+columnNumber;
	},

	indexToRowCol: function(board,i){
		const A={row:0,col:0};
		var og=Math.sqrt(board.length);
		count=0
		for (index=0;index<board.length;index++){
			count+=1;
			if (index==i)
				break;
			if (count==3){
				A.row+=1;
				A.col=0;
				continue;
			}
			A.col+=1;
		}
		return A;
	},

	setBoardCell: function(board, letter, row, col){
		const A=[...board];
		var index=rev.rowColToIndex(A,row,col);
		for (i=0;i<A.length;i++){
			if (i==index){
				A[i]=letter;
				break;
			}
		}
		return A;
	},

	algebraicToRowCol: function(algebraicNotation){
		const index={row:0,col:0};
		const A=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
		const B=['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26'];
		var b;
		if (A.includes(algebraicNotation.charAt(0))===false || algebraicNotation.charAt(1)===undefined){
			return undefined;
		}
		if (algebraicNotation.length>3)
			return undefined;
		if (B.includes(algebraicNotation.charAt(1))===false)
			return undefined;
		var b="";
		if (algebraicNotation.length===3){
			if (B.includes(algebraicNotation.charAt(1))===true && B.includes(algebraicNotation.charAt(2))===true){
				b=algebraicNotation.charAt(1)+algebraicNotation.charAt(2);
			}
			else{
				return undefined;
			}
		}
		if (algebraicNotation.length==2){
			b=algebraicNotation.charAt(1);
		}
		var a=algebraicNotation.charAt(0);
		index.row=parseInt(b)-1;

		for (i=0;i<A.length;i++){
			if (a==A[i]){
				index.col=i;
				break;
			}
		}
		return index;
	},

	placeLetters: function(board,letter,...algebraicNotation){
		var A=[...board];
		for (const arg of algebraicNotation){
			const input=rev.algebraicToRowCol(arg);
			A=rev.setBoardCell(A,letter,input.row,input.col);
		}
		return A;
	},

	boardToString: function(board) {
    	const og = Math.sqrt(board.length);
    	bs = "     ";
    	for (i=0; i<og-1; i++) {
    		bs+= String.fromCharCode(65+i);
    		bs+= "   ";
    	} 

    	bs += String.fromCharCode(65+og-1)
    	bs += "  ";
    	numrow = Math.floor(board.length/og);
    	pl = "+---";
		for (i=0; i<board.length; i++) {

			if (i%og === 0) {
				bs += "\n   ";
				bs += pl.repeat(og);
				bs += "+\n";

				numrow = String(Math.floor(i/og)+1);
				bs += " "+numrow+" ";
			} 

			if (board[i] === " ") {
				bs += "|   ";
			} 
			else {
				if (board[i] === "X") 
					bs += "| X ";
				else if (board[i] === "O")
					bs += "| O ";
			}

			if (i%og === og-1) {
				bs += "|";
			}
		}

		bs += "\n   ";
		bs += pl.repeat(og);
		bs += "+\n";
		return bs;
	},

	isBoardFull: function(board){
		for(i=0;i<board.length;i++){
			if (board[i]==" ")
				return false;
		}
		return true; 
	},

	flip: function(board,row,col){
		var index=rev.rowColToIndex(board,row,col);
		if (board[index]=='X'){
			board.splice(index,1);
			board.splice(index,0,'O');
			return board;
		}
		if (board[index]=='O'){
			board.splice(index,1);
			board.splice(index,0,'X');
			return board;
		}
		return board;
	},

	flipCells: function(board,cellsToFlip){
		for (i=0;i<cellsToFlip.length;i++){
			for (arg of cellsToFlip[i]){
				rev.flip(board,arg[0],arg[1]);
			}
		}
		return board; 
	},


    getCellsToFlip: function(board, lastRow, lastCol) {
    	position = board[rev.rowColToIndex(board, lastRow, lastCol)];

		if (typeof(position) === "undefined") return [];

		opposite = position === "X" ? "O" : "X";

		ToFlip = [];
		directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]]

		for (i = 0; i < directions.length; i++) {
			rowDirection = directions[i][0];
			colDirection = directions[i][1];
			currentRow = lastRow + rowDirection;
			currentCol = lastCol + colDirection;
			currentIndex = rev.rowColToIndex(board, currentRow, currentCol)
			currentCell = board[currentIndex];
			cellsLine = [];

			while (rev.inbounds(board, currentRow, currentCol) && currentCell === opposite) {
				cellsLine.push([currentRow, currentCol]);
				currentRow += rowDirection;
				currentCol += colDirection;
				currentIndex = rev.rowColToIndex(board, currentRow, currentCol);
				currentCell = board[currentIndex];
			}

			if (currentCell === position && cellsLine.length !== 0)
				ToFlip.push(cellsLine);
		}

		return ToFlip;
	},

	inbounds: function(board, row, col) {
    	og = Math.sqrt(board.length);
    	if(row < og && row >= 0 && col < og && col >= 0) {
        	return true;
    	}
    	else {
        	return false;
    	}
	},

	isValidMove: function(board, letter, row,col){
		if (board[rev.rowColToIndex(board,row,col)]!=" ")
			return false;
		if (rev.inbounds(board,row,col)==false)
			return false;
		board[rev.rowColToIndex(board,row,col)]=letter;
		const og=rev.getCellsToFlip(board,row,col);
		board[rev.rowColToIndex(board,row,col)]=" ";
		if (og.length<1){
			return false;
		}

		return true;
	},

	isValidMoveAlgebraicNotation: function(board, letter, algebraicNotation){
		const og=rev.algebraicToRowCol(algebraicNotation);
		return rev.isValidMove(board,letter,og.row,og.col);
	},

	getValidMoves: function(board, letter){
    	results= [];
    	og = Math.sqrt(board.length);

    	for(row=0; row< og; row++){
        	for(col =0; col< og; col++){
            	if(rev.isValidMove(board, letter, row, col)){
                	results.push([row, col]);
            	}
        	}
    	}
    	return results;
	},

	getLetterCounts: function(board){
		obj={X:0,O:0};
		for(i=0;i<board.length;i++){
			if (board[i]=='X')
				obj.X+=1;
			if (board[i]=='O')
				obj.O+=1;
		}
		return obj;
	}
}


module.exports = rev;



