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
		const A=rev.repeat(initialCellValue,(rows*columns));
		return A;	
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
		if (A.includes(algebraicNotation.charAt(0))==false || algebraicNotation.charAt(1)==undefined){
			return undefined;
		}
		if (algebraicNotation.length>3)
			return undefined;
		if (B.includes(algebraicNotation.charAt(1))==false)
			return undefined;
		var b="";
		if (algebraicNotation.length==3){
			if (B.includes(algebraicNotation.charAt(1))==true && B.includes(algebraicNotation.charAt(2))==true){
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
	}
}

module.exports = rev;



