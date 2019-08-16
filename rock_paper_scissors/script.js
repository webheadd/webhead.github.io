var playerScore = 0;
var computerScore = 0;
var dispResult = document.getElementById("display-result");
var btn = document.getElementById("ul").getElementsByTagName("LI");
var score = document.getElementsByTagName("span");
var playerChoice;
var computerChoice;
var picks = ["R", "P", "S"];


//convert to word
function toWord(a) {
    if(a == "R") {
        return "Rock";
    }
    if (a == "P") {
        return "Paper";
    }
    if(a == "S") {
        return "Scissors";
    }
}

// computer picks
function computerPick() {
    var x = Math.floor(Math.random() * 3);
    computerChoice = picks[x];
}

// if win
function win() {
    playerScore++;
    dispResult.innerHTML = "You win! " + toWord(playerChoice) + " > " + toWord(computerChoice);
    score[0].innerHTML = playerScore;
}

// if lose
function lose() {
    computerScore++;
    dispResult.innerHTML = "You lose! " + toWord(computerChoice) + " > " + toWord(playerChoice);
    score[1].innerHTML = computerScore;
}
// if draw
function draw() {
    dispResult.innerHTML = "It's a DRAWWWWW! " + toWord(playerChoice) + " = " + toWord(computerChoice);
}


// player picks
btn[0].addEventListener('click', function () {
    playerChoice = "R";
    computerPick();
    if (computerChoice == "P"){
        lose();
    } else if (computerChoice == "S") {
        win();
    } else {
        draw();
    }
});

btn[1].addEventListener('click', function () {
    playerChoice = "P";
    computerPick();
    if (computerChoice == "R"){
        win();
    } else if (computerChoice == "S") {
        lose();
    } else {
        draw();
    }
});

btn[2].addEventListener('click', function () {
    playerChoice = "S";
    computerPick();
    if (computerChoice == "P"){
        win();
    } else if (computerChoice == "R") {
        lose();
    } else {
        draw();
    }
});



