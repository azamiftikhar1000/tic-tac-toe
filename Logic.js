var currentsate;  
const HP = 'O';   
const aiP = 'X'; 
const boxs = document.querySelectorAll('.box'); 

const startGame = () => {
    document.querySelector(".endgame").style.display = "none"
    currentsate = Array.from(Array(9).keys()) 
    for (var i=0; i< 9; i++) {
        boxs[i].innerText = ''; 
        boxs[i].style.removeProperty('background-color'); 
        boxs[i].addEventListener('click', clicked, false); 
    }
} 
const winstate = [  
    [0, 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],[2, 5, 8],[0, 4, 8], [6, 4, 2]
]; 


const clicked  = (square) => {
    if (typeof currentsate[square.target.id] === 'number') { 
        turn(square.target.id, HP) 
        if (!checkTie()) turn(bestSpot(), aiP); 
    }   
} 
const turn = (squareId, p) => {
    currentsate[squareId] = p;
    document.getElementById(squareId).innerText = p; 
    let gamew = checkWin(currentsate, p)
    if (gamew) gameOver(gamew) 
} 
const checkWin = (board, p) => {
    let plays = board.reduce((a, e, i) => 
    (e === p) ? a.concat(i) : a, []); 
    let gamew = null;
    for (let [index, win] of winstate.entries()) { 
        if (win.every(elem => plays.indexOf(elem) > -1)) { 
           gamew = {index: index, p: p};  
           break;
    } 
} 
return gamew;
} 
const gameOver = (gamew) => {
    for (let index of winstate[gamew.index]) { 
        document.getElementById(index).style.backgroundColor = 
        gamew.p === HP ? "#4da6ff" : "#ff0000"; 
    }
    for (var i= 0; i < boxs.length; i++ ) { 
        boxs[i].removeEventListener('click', clicked, false);
    }
    declareWinner(gamew.p === HP ? "You win!" : "You lose."); 
} 
const declareWinner = (who) => {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}
const emptySquares = () =>{
    return currentsate.filter(s => typeof s === 'number'); 
}
const bestSpot = () => {
    return minimax(currentsate, aiP).index; 
}
const checkTie = () => {
    if (emptySquares().length === 0) { 
        for (var i = 0; i < boxs.length; i++) { 
            boxs[i].style.backgroundColor = "#66ff66"; 
            boxs[i].removeEventListener('click', clicked, false); 
        }
        declareWinner("Tie Game!")
        return true; 
    }
    return false;
}
const minimax = (newBoard, p) => {
    var availSpots = emptySquares(newBoard); 

    if(checkWin(newBoard, p)) { 
        return {score: -10}; 
    } else if (checkWin(newBoard, aiP)) {
        return {score: 10} 
    } else if (availSpots.length === 0) {
        return {score: 0} 
    }
    var moves = []; 
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]]; 
        newBoard[availSpots[i]] = p; 

        if (p === aiP) { 
            var result = minimax(newBoard, HP);
            move.score = result.score; 
        } else {
            var result = minimax(newBoard, aiP);
            move.score = result.score; 
        }

        newBoard[availSpots[i]] = move.index; 
        
        moves.push(move);
        }

        var bestMove; 
        if(p === aiP) {  
            var bestScore = -10000; 
            for (var i = 0; i < moves.length; i++) { 
                if (moves[i].score > bestScore) { 
                    bestScore = moves[i].score;
                    bestMove = i; 
                }
            }
        } else { 
            var bestScore = 10000;
            for(var i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) { 
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove]; 
    }
    startGame(); 
