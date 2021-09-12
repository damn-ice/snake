let grid = document.querySelector(".grid") 
let popup = document.querySelector(".popup"); 
let playAgain = document.querySelector(".playAgain"); 
let scoreDisplay = document.querySelector(".scoreDisplay") 
let highScore = document.querySelector(".highscore") 
let left = document.querySelector(".left") 
let bottom = document.querySelector(".bottom") 
let right = document.querySelector(".right") 
let up = document.querySelector(".top")
let state = document.querySelector(".state")
let width=20; 
let appleIndex=0 
let currentSnake=[2,1,0] 
let direction =1 
let score = 0;
let high = JSON.parse(localStorage.getItem('highscore')) ?
    parseInt(JSON.parse(localStorage.getItem('highscore'))): 0; 
let speed = 0.85;
let intervalTime =0 
let interval =0
let active = true;

document.addEventListener("DOMContentLoaded", function(){ 
    document.addEventListener("keyup", control);
    createBoard();
    startGame();
    playAgain.addEventListener("click", replay); 
})

function createBoard () {
    popup.style.display = 'none';
    for (let i=0 ; i< 400; i++){
        let div = document.createElement('div');
        grid.appendChild(div);
    }
}

function startGame () {
    let squares = document.querySelectorAll('.grid div');
    randomApple(squares);
    direction = 1;
    scoreDisplay.innerHTML = `Score: ${score}`;
    highScore.innerHTML = `HighScore: ${high}`;
    intervalTime = 1000;
    currentSnake = [2, 1, 0];
    currentSnake.forEach(index => squares[index].classList.add('snake'));
    interval  = setInterval(moveOutcome, intervalTime);
}

function moveOutcome () {
    let squares = document.querySelectorAll('.grid div');
    if (checkForHits(squares)) {
        alert('You hit a Wall!');
        popup.style.display = 'flex';
        return clearInterval(interval);
    } else {
        if (active)moveSnake(squares);   
    }
}

function moveSnake(squares) {
    let tail = currentSnake.pop();
    squares[tail].classList.remove('snake');
    
    currentSnake.unshift(currentSnake[0]+direction);
    eatApples(squares, tail);
    squares[currentSnake[0]].classList.add("snake");
}

function checkForHits(squares) {
    if (
        // At the last row and moved down...
        (currentSnake[0] + width >= (width * width) && direction === width) ||
        // At the last column and moved right...
        (currentSnake[0] % width ===width -1 && direction ===1) || 
        // At the first column and moved left...
        (currentSnake[0] % width === 0 && direction === -1) ||   
        // At the first row and moved up
        (currentSnake[0] - width < 0 && direction === -width) ||
        // hits it's tail
        squares[currentSnake[0] + direction].classList.contains("snake")   
    ){
        return true;
    }else {
        return false;
    }
}

function eatApples(squares, tail){
    if (squares[currentSnake[0]].classList.contains('apple')){
        squares[currentSnake[0]].classList.remove("apple") 
        squares[tail].classList.add("snake") 
        currentSnake.push(tail)
        randomApple(squares) 
        score +=5;
        scoreDisplay.innerHTML = `Score: ${score}`;
        setHighScore(score);
        // SEt the highscore if current score > highscore...
        clearInterval(interval) 
        intervalTime *=speed;
        interval = setInterval(moveOutcome,intervalTime)
     }
}

function randomApple(squares) {
    do{
        appleIndex = Math.floor(Math.random() * squares.length);
    }while (squares[appleIndex].classList.contains("snake"));
    squares[appleIndex].classList.add('apple');
}

function control(e){  
    if (e.keyCode===39){
    direction = 1 // right 
    }else if (e.keyCode===38){ 
    direction = -width //if we press the up arrow, the snake will go ten divs up
    }else if (e.keyCode===37){ 
    direction = -1 // left, the snake will go left one div
    }else if (e.keyCode===40){
    direction = +width // down the snake head will instantly appear 20 divs below from the current div 
    }else if (e.keyCode === 32){
        if (active) {
            active = false;
            state.style.display = 'block';
        }else {
            active = true;
            state.style.display = 'none';
        }
        
    }
} 


up.addEventListener("click",()=>direction= -width ) 
bottom.addEventListener("click",()=>direction= +width ) 
left.addEventListener("click",()=>direction= -1 ) 
right.addEventListener("click",()=>direction= 1 ) 

function replay() { 
    grid.innerHTML="" 
    createBoard()   
    startGame()  
    score = 0;
    scoreDisplay.innerHTML = `Score: ${score}`;
    popup.style.display = "none"; 
}  

function setHighScore(score) {
    if (score > high) {
        // set high == score...
        high = score;
        // display on UI
        highScore.innerHTML = `HighScore: ${high}`;
        // Save to localStorage...
        localStorage.setItem('highscore', JSON.stringify(high));
    }
}