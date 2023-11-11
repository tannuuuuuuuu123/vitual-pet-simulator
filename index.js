const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 750;
const CANVAS_HEIGHT = canvas.height = 400;

const playerImage = new Image();
playerImage.src = "idle.png";
let spriteWidth = 547
let spriteHeight = 481

let state_num = 0
let spriteStates = [
    {
        "src": "idle.png",
        "frames": 9,
        "width": 547,
        "height": 481,
    }, 
    {
        "src": "hurt.png",
        "frames": 8,
        "width": 547,
        "height": 481,
    },
    {
        "src": "dead.png",
        "frames": 6,
        "width" : 580,
        "height": 510,
    }
]

let frameX = 0;
let gameFrame = 0;
let staggerFrames = 8;

function animate(){
    ctx.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT)
    // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    ctx.drawImage(playerImage, frameX * spriteWidth, 0, spriteWidth, spriteHeight, 180, 50, spriteWidth/1.5, spriteHeight/1.5);
    if (gameFrame % staggerFrames == 0) {        
        if (frameX < spriteStates[state_num].frames) {
            frameX ++;
        } else {
            frameX =0;
        }
    }
    gameFrame++;
    requestAnimationFrame(animate);
}
animate()



let welcomeScreen = document.querySelector("#welcome_screen");
let userPetName = document.getElementById("pet_name_input");
let petName = document.getElementById("pet_name");
let characterContainer = document.querySelector("#character_container");
let gameControlsContainer = document.querySelector("#game_controls_container");
let resetButton = document.querySelector("#btn_reset");
let petAge = document.getElementById("pet_age");
let gameOverScreen = document.querySelector("#game_over_screen")
let isGameOver = false;
let endGamePetName = document.getElementById("end_game_pet_name");
let endGameAge = document.getElementById("end_game_age");

function beginGame() {
    if (userPetName.value == "") {
        alert("Please provide a pet name.")
    } else {
        petName.innerHTML = userPetName.value;
        welcomeScreen.style.display = "none";
        characterContainer.style.display = "flex";
        gameControlsContainer.style.display = "flex";
        resetButton.style.display = "inline";
        setUpStats();
        updateStats();
    }
}

function endGame() {
    characterContainer.style.display = "none";
    gameControlsContainer.style.display = "none";
    welcomeScreen.style.display = "none";
    gameOverScreen.style.display = "flex";
    resetButton.style.display = "inline";
    endGamePetName.innerHTML = "R.I.P. " + petName.innerHTML;
    endGameAge.innerHTML = age + " days old";
}

function resetGame () {
    window.location.reload();
}

// starting stats 
let statsHealth = document.querySelector("#stats_health");
let statsHunger = document.querySelector("#stats_hunger");
let statsHappiness = document.querySelector("#stats_happiness");
let statsBar = [statsHealth, statsHunger, statsHappiness];
let age = 0;
let health = 100; 
let hunger = 0;
let happiness = 100;
let upperLimitStats = [100, 0, 100];
let lowerLimitStats = [0, 100, 0];


function setUpStats() {
    statsBar.forEach(function(stat, index) {
        stat.style.display = "block";
        stat.style.width = upperLimitStats[index] + "%";
        stat.innerHTML = upperLimitStats[index] + "%";        
    });
}


function colorThreshold(health, hunger, happiness) {
    if (health < 50) {
        statsHealth.style.backgroundColor = "red";
    } else {
        statsHealth.style.backgroundColor = "blue";
    };
    if (hunger > 50) {
        statsHunger.style.backgroundColor = "red";
    } else {
        statsHunger.style.backgroundColor = "green";
    };
    if (happiness < 50) {
        statsHappiness.style.backgroundColor = "red";
    } else {
        statsHappiness.style.backgroundColor = "orange";
    };
}


function updateStats() {
    /* at each pet day
        hunger ++
        health --
        happiness -- by random number
    */
    setInterval(function () {
        if (health > 0 ) {
            health --;
        }; 
        if (hunger < 100 ) {
            hunger ++;
        };
        if (happiness > 0) {
            let happinessDec = Math.floor(Math.random()*10);
            if (happiness - happinessDec < 0) {
                happiness = 0;
            } else {
            happiness = happiness - happinessDec;
            };
        }
        let stats = [health, hunger, happiness];
        statsBar.forEach( function(stat, index) {
            stat.style.width = stats[index] + "%";
            stat.innerHTML = stats[index] + "%";
        });
        if (health === 0 && hunger === 100 && happiness === 0) {
            endGame();
        } else {
            age ++;
            petAge.innerHTML = age + " days old";
        };

        colorThreshold(health, hunger, happiness);

        if (happiness < 50 | hunger > 50) {
            state_num = 1;
        };

        if (health < 50) {
            state_num = 2;
        };

        if (happiness >= 50 && health >= 50 && hunger < 50) {
            state_num = 0;
        };

        playerImage.src = spriteStates[state_num].src;
        spriteWidth = spriteStates[state_num].width;
        spriteHeight = spriteStates[state_num].height;

    }, 1000);
}


/* game control
    clean: health ++
    feed: hunger--
    play: happiness ++
*/
function clean() {
    if (health < 100) {
        health++;
    } else {
        health = 100;
    };
    statsHealth.width = health + "%";
    statsHealth.innerHTML = health + "%";
}

function feed() {
    if (hunger > 0) {
        hunger --;
    } else {
        hunger = 0;
    }
    statsHunger.width = hunger + "%";
    statsHunger.innerHTML = hunger + "%";
}

function play() {
    if (happiness < 100) {
        let happinessInc = Math.floor(Math.random()*10)
        if (happiness + happinessInc < 100) {
            happiness = happiness + happinessInc;
        } else {
            happiness = 100;
        }
    }
    statsHappiness.width = happiness + "%";
    statsHappiness.innerHTML = happiness + "%";
}
