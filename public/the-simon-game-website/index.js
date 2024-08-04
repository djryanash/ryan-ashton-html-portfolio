if (storageAvailable("localStorage")) {
    console.log("'localStorage' available.")
} else {
    console.log("No 'localStorage'.")
}

window.addEventListener("storage", (e) => {
    console.log("something was stored in 'localStorage': " + e)
})

window.addEventListener("load", (event) => {
    //removeLocalStorage()
    showInstructionView()
    //showHighScoreView()
});

var enteringName = false 
var instructing = true 
var playersTurn = false 
var gameStarted = false 
var playersLevel = 0
var green = new Audio("./assets/audio/green.mp3")
var red = new Audio("./assets/audio/red.mp3")
var yellow = new Audio("./assets/audio/yellow.mp3")
var blue = new Audio("./assets/audio/blue.mp3")
var marioDeath = new Audio('./assets/audio/mario-death-sfx.mp3')
var playersMoves = 0 
var highScoreInsertLevel = 100
var simonsChoices = [
    'green',
    'red',
    'yellow',
    'blue'
]
var playerJustPlayed = ''
var totalMoves = []
var speed = 1000


var topPlayers = getTopPlayers()

var preGameInstructionsCounter = 0 
const preGameInstructions = [
    'Simon (the computer) will tap each of the 4 colored buttons in a particular sequence.<br><br>Press spacebar...',
    'You must follow along and pay attention to the order in which he taps the buttons.<br><br>...',
    'Afterwards it will be your turn and you must copy exactly what Simon did.<br><br>...',
    'Press spacebar to START the game.'
    
];

$(document).on('keypress', function (event) {
    const key = event.keyCode
    if (instructing) { 
        if (key === 32) {
            startGame()
        }
    }
    
    if (enteringName) {
        checkNameLength()
        if (key === 13) {
            validateName()
        }
    }
    
    if (playersTurn) {
        
        if (key === 113 || key === 81) {
            playGreen()
        } else if (key === 80 || key === 112) {
            playRed()
        } else if (key === 97 || key === 65) {
            playYellow()
        } else if (key === 108 || key === 76) {
            playBlue()
        }
        
        playerPlayed() 
        
    }
    
});

function playerPlayed() {
    if (playerJustPlayed !== totalMoves[playersMoves]) {
        gameOver();
        return;
    } 
    playersMoves++
    if (playersMoves === totalMoves.length) {
        playersLevel++
        console.log('playersLevel: ' + playersLevel)
        simonsTurn()
    }
    
}

const delay = 100

function playGreen() {
    green.play()
    $('div.green').addClass('light-green');
    setTimeout(function() {
        $('div.green').removeClass('light-green');
    }, delay)
    if (playersTurn) {
        playerJustPlayed = 'green'
    }
}

function playRed() {
    red.play()
    $('div.red').addClass('light-red');
    setTimeout(function() {
        $('div.red').removeClass('light-red');
    }, delay)
    if (playersTurn) {
        playerJustPlayed = 'red'
    }
}

function playYellow() {
    yellow.play()
    $('div.yellow').addClass('light-yellow');
    setTimeout(function() {
        $('div.yellow').removeClass('light-yellow');
    }, delay)
    if (playersTurn) {
        playerJustPlayed = 'yellow'
    }
}

function playBlue() {
    blue.play()
    $('div.blue').addClass('light-blue');
    setTimeout(function() {
        $('div.blue').removeClass('light-blue');
    }, delay)
    if (playersTurn) {
        playerJustPlayed = 'blue'
    }
}

function startGame() {
    if (preGameInstructionsCounter === 100) {
        newGame()
    }
    if (preGameInstructionsCounter < preGameInstructions.length) {
        const text = preGameInstructions[preGameInstructionsCounter];
        $('.pre-game-instructions').html(text)
        preGameInstructionsCounter++
    } else {
        $('div.cover-view').animate({opacity: 0}).css('display', 'none');
        $('div.instruction-view').animate({ opacity: 0 }).css('display', 'none');
        setTimeout(function () {
            switch (playersTurn) {
                case false:
                gameStarted = true; 
                simonsTurn()
                break;
            }
        }, 1000)
        
    }
    
}

function playersIsPlaying() {
    setTimeout(function () {
        $('div.box').css('background-color', 'blanchedalmond');
    }, 200)
    playersTurn = true
    playersMoves = 0 
}

function simonsTurn() {
    playersTurn = false
    setTimeout(function () {
        $('div.box').css('background-color', 'rgb(255, 165, 129)');
    }, (speed - 100));
    $('div.box').addClass('simons-turn')
    const n = Math.floor(Math.random() * 4)
    totalMoves.push(simonsChoices[n])
    var i = 0
    if (speed > 250) { 
        speed = speed - 50
    }
    function looper() {
        setTimeout(function () {
            $('.title').text('Level ' + (playersLevel))
            switch (totalMoves[i]) {
                case 'green':
                playGreen()
                break;
                case 'red':
                playRed()
                break;
                case 'yellow':
                playYellow()
                break;
                case 'blue':
                playBlue()
                break;
            }
            i++
            if (i < totalMoves.length) {
                looper();
            } else {
                playersIsPlaying();
            }
        }, speed)
    }
    looper()
    
}

function playerScoreAndLevel(playersLevel) {
    for (let i = 0; i < topPlayers.length ; i++) {
        const player = topPlayers[i];
        const level = player[1]; 
        if (playersLevel >= level) {
            return [true, i]
        } 
    }
    return [false, 6] 
}

function gameOver() {
    marioDeath.play() 
    playersTurn = false
    preGameInstructionsCounter = 100
    const scoreAndLevel = playerScoreAndLevel(playersLevel)
    const isInTopFive = scoreAndLevel[0]
    highScoreInsertLevel = scoreAndLevel[1]
    if (isInTopFive) {
        topPlayers = getTopPlayers()
        setUpHighScoreParagraphs(topPlayers)
        reconfigureHighScoreSheet(highScoreInsertLevel)
        showHighScoreView()
    } else {
        showNewGameView()
    }
}

function reconfigureHighScoreSheet(highScoreInsertLevel) {
    if (highScoreInsertLevel > 5) { return }
    for (let i = 4; i >= highScoreInsertLevel; i--) {
        let moveFrom = ("topPlayer0" + i)
        let moveTo = ("topPlayer0" + (i + 1))
        let itemToMove = localStorage.getItem(moveFrom)
        localStorage.setItem(moveTo, itemToMove)
    }
    localStorage.setItem("topPlayer05", "-;0");
}

function showNewGameView() {
    setTimeout(function () {
        $('div.cover-view').css('display', 'flex').animate({opacity: 0.9});
        $('div.instruction-view').css('display', 'flex').animate({opacity: 1});
        $('.instruction-h1').text('GAME OVER!')
        $('.pre-game-instructions').html('You got to level ' + playersLevel + '<br><br>' + '<br><br>' + 'Spacebar to play again...')
    }, 0)
}

function newGame() {
    gameStarted = false 
    playersLevel = 0
    playersMoves = 0 
    highScoreInsertLevel = 0
    totalMoves = []
    speed = 1000
    
}

function removeLocalStorage() {
    localStorage.clear()
}

function getTopPlayers() {
    const playedBefore = localStorage.getItem("playedBefore");
    setTimeout(function () {
        if (playedBefore !== 'true') {
            localStorage.setItem("playedBefore", "true");
            localStorage.setItem("topPlayer00", "-;0");
            localStorage.setItem("topPlayer01", "-;0");
            localStorage.setItem("topPlayer02", "-;0");
            localStorage.setItem("topPlayer03", "-;0");
            localStorage.setItem("topPlayer04", "-;0");
        }
    }, 10)
    
    
    const topPlayer00 = localStorage.getItem("topPlayer00").split(';').map(item => item.trim());
    const topPlayer01 = localStorage.getItem("topPlayer01").split(';').map(item => item.trim());
    const topPlayer02 = localStorage.getItem("topPlayer02").split(';').map(item => item.trim());
    const topPlayer03 = localStorage.getItem("topPlayer03").split(';').map(item => item.trim());
    const topPlayer04 = localStorage.getItem("topPlayer04").split(';').map(item => item.trim());
    
    //$('p.name0').text(topPlayer00[0]); $('p.level0').text(topPlayer00[1]); 
    //$('p.name1').text(topPlayer01[0]); $('p.level1').text(topPlayer01[1]); 
    //$('p.name2').text(topPlayer02[0]); $('p.level2').text(topPlayer02[1]); 
    //$('p.name3').text(topPlayer03[0]); $('p.level3').text(topPlayer03[1]); 
    //$('p.name4').text(topPlayer04[0]); $('p.level4').text(topPlayer04[1]); 
    
    return ([
        topPlayer00,
        topPlayer01,
        topPlayer02,
        topPlayer03,
        topPlayer04
    ])
    
}

function setUpHighScoreParagraphs(topPlayers) {
    for (let i = 0; i < topPlayers.length; i++) {
        const player = topPlayers[i];
        const playerName = player[0]
        const playerLevel = player[1]
        $('p.name' + i).text(playerName);
        $('p.level' + i).text(playerLevel); 
    }
    $('p.name' + highScoreInsertLevel).text('');
    $('p.level' + highScoreInsertLevel).text(playersLevel); 
    
}

function showHighScoreView() {
    instructing = false 
    enteringName = true 
    $('div.instruction-view').css('display', 'none').animate({opacity: 0});
    setTimeout(function () {
        $('div.cover-view').css('display', 'flex').animate({opacity: 0.9});
        $('div.high-score-view').css('display', 'flex').animate({ opacity: 1 });
        $('h1.high-score-h1').html('WELL DONE!<br>New High Score!')
        $('h1.high-score').text('HIGH SCORES')
        focusInput()
    }, 500)
    
}

function hideHighScoreView() {
    enteringName = false 
    instructing = true 
    $('input#input-box').text('')
    $('div.cover-view').css('display', 'none')
    $('div.high-score-view').css('display', 'none')
    $('h1.high-score-h1').html('')
    $('h1.high-score').text('')
    
}

function focusInput() {
    document.getElementById("input-box").focus();
}

function showInstructionView() {
    instructing = true 
    enteringName = false 
    $('div.high-score-view').css('display', 'none').css('opacity', 0);
    setTimeout(function () {
        $('div.cover-view').css('display', 'flex').animate({opacity: 0.9});
        $('div.instruction-view').css('display', 'flex').animate({opacity: 1});
    }, 500)
    
}

function validateName() {
    const input = $('input#input-box').val()
    setTimeout(function () {  
        if (input.length === 3) {
            const newName = $('p.name' + highScoreInsertLevel).text()
            const key = ('topPlayer0' + highScoreInsertLevel)
            const value = (newName + ';' + playersLevel)
            localStorage.setItem(key, value)
            $('p#three-character-warning').css('display', 'none')
            $('.pre-game-instructions').html('Spacebar to play again...')
            $('.instruction-h1').text('GAME OVER!')
            instructing = true 
            hideHighScoreView()
            showInstructionView()
        } else {
            $('p#three-character-warning').css('display', 'block')
            focusInput()
        }
    }, 10)
    
}

function checkNameLength() {
    setTimeout(function () {
        const inputValue = $('input#input-box').val()
        $('p.name' + highScoreInsertLevel).text(inputValue)
        $('p.level' + highScoreInsertLevel).text(playersLevel)
    }, 10)
}

function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            e.name === "QuotaExceededError" &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
        );
    }
}
