// ============================================
// Pumpkin Bros Highway Racer
// Part 1
// ============================================

// ----------------------------
// Game Objects
// ----------------------------

const road = document.getElementById("road");
const player = document.getElementById("player");
const enemyContainer = document.getElementById("enemyContainer");

const explosion = document.getElementById("explosion");

const scoreText = document.getElementById("scoreValue");
const speedText = document.getElementById("speedValue");

const livesText = document.getElementById("lives");

const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");

// ----------------------------
// Game Variables
// ----------------------------

let score = 0;

let speed = 6;

let lives = 3;

let gameRunning = true;

let keys = {};

let enemies = [];

let spawnTimer = 0;

let speedTimer = 0;

let animationId;

// ----------------------------
// Road
// ----------------------------

const roadWidth = 420;

const roadLeft = 50;

const roadRight = 300;

// ----------------------------
// Player
// ----------------------------

const playerData = {

    x:175,

    y:560,

    width:70,

    height:120,

    speed:8

};

// ----------------------------
// Keyboard
// ----------------------------

document.addEventListener("keydown",e=>{

    keys[e.key]=true;

});

document.addEventListener("keyup",e=>{

    keys[e.key]=false;

});

// ----------------------------
// Player Movement
// ----------------------------

function movePlayer(){

    if(keys["ArrowLeft"]||keys["a"]||keys["A"]){

        playerData.x-=playerData.speed;

    }

    if(keys["ArrowRight"]||keys["d"]||keys["D"]){

        playerData.x+=playerData.speed;

    }

    if(playerData.x<roadLeft){

        playerData.x=roadLeft;

    }

    if(playerData.x>roadRight){

        playerData.x=roadRight;

    }

    player.style.left=playerData.x+"px";

}

// ----------------------------
// Enemy Class
// ----------------------------

class Enemy{

    constructor(){

        this.x=[60,175,290][Math.floor(Math.random()*3)];

        this.y=-150;

        this.width=70;

        this.height=120;

        this.speed=speed;

        this.element=document.createElement("div");

        this.element.className="enemy";

        const cars=["🚙","🚕","🚓","🚐","🚚"];

        this.element.innerHTML=cars[Math.floor(Math.random()*cars.length)];

        this.element.style.left=this.x+"px";

        this.element.style.top=this.y+"px";

        enemyContainer.appendChild(this.element);

    }

    update(){

        this.y+=this.speed;

        this.element.style.top=this.y+"px";

    }

    remove(){

        this.element.remove();

    }

}

// ----------------------------
// Spawn Enemy
// ----------------------------

function spawnEnemy(){

    enemies.push(new Enemy());

}

// ----------------------------
// Collision
// ----------------------------

function isColliding(a,b){

    return !(

        a.x+a.width<b.x ||

        a.x>b.x+b.width ||

        a.y+a.height<b.y ||

        a.y>b.y+b.height

    );

}

// ----------------------------
// Explosion
// ----------------------------

function showExplosion(x,y){

    explosion.style.display="flex";

    explosion.style.left=x+"px";

    explosion.style.top=y+"px";

    explosion.style.animation="none";

    explosion.offsetHeight;

    explosion.style.animation="boom .6s forwards";

    setTimeout(()=>{

        explosion.style.display="none";

    },600);

}

// ----------------------------
// Lose Life
// ----------------------------

function loseLife(){

    lives--;

    if(lives==3){

        livesText.innerHTML="❤️❤️❤️";

    }

    if(lives==2){

        livesText.innerHTML="❤️❤️";

    }

    if(lives==1){

        livesText.innerHTML="❤️";

    }

    if(lives<=0){

        endGame();

    }

}

// ----------------------------
// End Game
// ----------------------------

function endGame(){

    gameRunning=false;

    cancelAnimationFrame(animationId);

    finalScore.innerHTML=score;

    gameOver.style.display="flex";

}
// ============================================
// Pumpkin Bros Highway Racer
// Part 2
// ============================================

// ----------------------------
// Update Enemies
// ----------------------------

function updateEnemies(){

    for(let i=enemies.length-1;i>=0;i--){

        let enemy=enemies[i];

        enemy.speed=speed;

        enemy.update();

        // Enemy passed player
        if(enemy.y>800){

            enemy.remove();

            enemies.splice(i,1);

            score+=10;

            scoreText.innerHTML=score;

            continue;

        }

        // Collision
        if(isColliding(

            playerData,

            {

                x:enemy.x,

                y:enemy.y,

                width:enemy.width,

                height:enemy.height

            }

        )){

            showExplosion(playerData.x-20,playerData.y-20);

            enemy.remove();

            enemies.splice(i,1);

            loseLife();

        }

    }

}

// ----------------------------
// Spawn Timer
// ----------------------------

function updateSpawner(){

    spawnTimer++;

    if(spawnTimer>55){

        spawnEnemy();

        spawnTimer=0;

    }

}

// ----------------------------
// Increase Speed
// ----------------------------

function updateDifficulty(){

    speedTimer++;

    if(speedTimer>600){

        speed++;

        speedTimer=0;

        speedText.innerHTML=speed-5+"x";

    }

}

// ----------------------------
// Road Animation Speed
// ----------------------------

function updateRoad(){

    const roadLines=document.getElementById("roadLines");

    let duration=0.45-(speed*0.02);

    if(duration<0.12){

        duration=0.12;

    }

    roadLines.style.animationDuration=

        duration+"s";

}

// ----------------------------
// Score Counter
// ----------------------------

function updateScore(){

    score++;

    scoreText.innerHTML=score;

}

// ----------------------------
// Main Game Loop
// ----------------------------

function gameLoop(){

    if(!gameRunning){

        return;

    }

    movePlayer();

    updateEnemies();

    updateSpawner();

    updateDifficulty();

    updateRoad();

    updateScore();

    animationId=requestAnimationFrame(gameLoop);

}

// ----------------------------
// Countdown
// ----------------------------

function startGame(){

    gameRunning=true;

    score=0;

    speed=6;

    lives=3;

    enemies=[];

    scoreText.innerHTML="0";

    speedText.innerHTML="1x";

    livesText.innerHTML="❤️❤️❤️";

    gameLoop();

}

// ----------------------------
// Restart Button
// ----------------------------

const restartBtn=document.querySelector("#gameOver button");

if(restartBtn){

    restartBtn.onclick=function(){

        location.reload();

    }

}

// ----------------------------
// Prevent Double Spawn
// ----------------------------

road.innerHTML+=``;

// ----------------------------
// Start
// ----------------------------

startGame();
// ============================================
// Pumpkin Bros Highway Racer
// Part 3
// ============================================

// ----------------------------
// High Score
// ----------------------------

let highScore = localStorage.getItem("pbHighScore") || 0;

if(score > highScore){
    highScore = score;
    localStorage.setItem("pbHighScore", highScore);
}

// ----------------------------
// Pause
// ----------------------------

let paused = false;

document.addEventListener("keydown",e=>{

    if(e.key==="p"||e.key==="P"){

        paused=!paused;

        if(paused){

            cancelAnimationFrame(animationId);

        }else{

            gameLoop();

        }

    }

});

// ----------------------------
// Screen Shake
// ----------------------------

function shakeScreen(){

    road.style.animation="none";

    road.offsetHeight;

    road.animate([

        {transform:"translate(5px,0)"},
        {transform:"translate(-5px,0)"},
        {transform:"translate(5px,0)"},
        {transform:"translate(-5px,0)"},
        {transform:"translate(0,0)"}

    ],{

        duration:350

    });

}

// ----------------------------
// Better Explosion
// ----------------------------

function explode(){

    showExplosion(playerData.x-30,playerData.y-30);

    shakeScreen();

}

// ----------------------------
// Flash Player
// ----------------------------

function flashPlayer(){

    player.style.opacity="0";

    let flashes=0;

    const timer=setInterval(()=>{

        player.style.opacity=

        player.style.opacity=="0"?"1":"0";

        flashes++;

        if(flashes>6){

            clearInterval(timer);

            player.style.opacity="1";

        }

    },100);

}

// ----------------------------
// Invincibility
// ----------------------------

let invincible=false;

function hitPlayer(){

    if(invincible) return;

    invincible=true;

    explode();

    flashPlayer();

    loseLife();

    setTimeout(()=>{

        invincible=false;

    },1500);

}

// ----------------------------
// Replace Collision
// ----------------------------

function checkEnemyCollision(enemy,index){

    if(invincible) return;

    if(isColliding(

        playerData,

        {

            x:enemy.x,

            y:enemy.y,

            width:enemy.width,

            height:enemy.height

        }

    )){

        enemy.remove();

        enemies.splice(index,1);

        hitPlayer();

    }

}

// ----------------------------
// Better Enemy Update
// ----------------------------

function updateEnemiesBetter(){

    for(let i=enemies.length-1;i>=0;i--){

        let enemy=enemies[i];

        enemy.speed=speed;

        enemy.update();

        if(enemy.y>800){

            enemy.remove();

            enemies.splice(i,1);

            score+=20;

            scoreText.innerHTML=score;

            continue;

        }

        checkEnemyCollision(enemy,i);

    }

}

// ----------------------------
// Replace old update
// ----------------------------

updateEnemies=updateEnemiesBetter;

// ----------------------------
// Distance
// ----------------------------

let distance=0;

function updateDistance(){

    distance+=speed;

}

// ----------------------------
// Random Traffic Speed
// ----------------------------

function randomizeEnemySpeed(){

    enemies.forEach(enemy=>{

        enemy.speed=speed+(Math.random()*2-1);

    });

}

// ----------------------------
// Glow Effect
// ----------------------------

player.animate([

    {

        filter:"drop-shadow(0 0 8px orange)"

    },

    {

        filter:"drop-shadow(0 0 20px yellow)"

    },

    {

        filter:"drop-shadow(0 0 8px orange)"

    }

],{

    duration:1200,

    iterations:Infinity

});

// ----------------------------
// Better Difficulty
// ----------------------------

function updateDifficulty(){

    speedTimer++;

    if(speedTimer>500){

        speed+=0.5;

        speedTimer=0;

        speedText.innerHTML=speed.toFixed(1)+"x";

    }

}

// ----------------------------
// FPS Counter (Debug)
// ----------------------------

let fps=0;

let frames=0;

setInterval(()=>{

    fps=frames;

    frames=0;

},1000);

// ----------------------------
// Improved Game Loop
// ----------------------------

const oldLoop=gameLoop;

gameLoop=function(){

    if(!gameRunning||paused){

        return;

    }

    frames++;

    movePlayer();

    updateEnemies();

    updateSpawner();

    updateDifficulty();

    updateRoad();

    updateDistance();

    updateScore();

    randomizeEnemySpeed();

    animationId=requestAnimationFrame(gameLoop);

};
// ============================================
// Pumpkin Bros Highway Racer
// Part 4 (Final)
// ============================================

// ----------------------------
// Save High Score
// ----------------------------

function saveHighScore(){

    if(score>highScore){

        highScore=score;

        localStorage.setItem("pbHighScore",highScore);

    }

}

// ----------------------------
// Game Over
// ----------------------------

function endGame(){

    gameRunning=false;

    saveHighScore();

    cancelAnimationFrame(animationId);

    finalScore.innerHTML=score;

    gameOver.style.display="flex";

}

// ----------------------------
// HUD Update
// ----------------------------

function updateHUD(){

    scoreText.innerHTML=score;

    speedText.innerHTML=speed.toFixed(1)+"x";

    switch(lives){

        case 3:
            livesText.innerHTML="❤️❤️❤️";
            break;

        case 2:
            livesText.innerHTML="❤️❤️";
            break;

        case 1:
            livesText.innerHTML="❤️";
            break;

        default:
            livesText.innerHTML="";
            break;

    }

}

// ----------------------------
// Prevent Enemy Overflow
// ----------------------------

function cleanEnemies(){

    if(enemies.length>12){

        enemies[0].remove();

        enemies.shift();

    }

}

// ----------------------------
// Random Background Color
// ----------------------------

let roadColors=[

"#444",

"#3d3d3d",

"#555"

];

setInterval(()=>{

    road.style.background=

    roadColors[Math.floor(Math.random()*roadColors.length)];

},7000);

// ----------------------------
// Player Bounce Animation
// ----------------------------

player.animate([

{transform:"translateY(0px)"},

{transform:"translateY(-3px)"},

{transform:"translateY(0px)"}

],{

duration:250,

iterations:Infinity

});

// ----------------------------
// FPS Friendly Loop
// ----------------------------

function gameLoop(){

    if(!gameRunning||paused){

        return;

    }

    movePlayer();

    updateEnemies();

    updateSpawner();

    updateDifficulty();

    updateRoad();

    cleanEnemies();

    score++;

    updateHUD();

    animationId=requestAnimationFrame(gameLoop);

}

// ----------------------------
// Restart
// ----------------------------

document.querySelector("#gameOver button")

.addEventListener("click",()=>{

location.reload();

});

// ----------------------------
// Start
// ----------------------------

updateHUD();

gameLoop();
// ============================================
// Pumpkin Bros Highway Racer
// Part 5
// ============================================

// ----------------------------
// Coin System
// ----------------------------

let coins = 0;

function addCoin(){

    coins++;

    console.log("Coins:",coins);

}

// ----------------------------
// Coin Class
// ----------------------------

class Coin{

    constructor(){

        this.x=[60,175,290][Math.floor(Math.random()*3)];

        this.y=-80;

        this.size=45;

        this.element=document.createElement("div");

        this.element.innerHTML="🪙";

        this.element.style.position="absolute";

        this.element.style.left=this.x+"px";

        this.element.style.top=this.y+"px";

        this.element.style.fontSize="45px";

        enemyContainer.appendChild(this.element);

    }

    update(){

        this.y+=speed;

        this.element.style.top=this.y+"px";

    }

    remove(){

        this.element.remove();

    }

}

let coinList=[];

// ----------------------------
// Spawn Coins
// ----------------------------

function spawnCoin(){

    coinList.push(new Coin());

}

setInterval(()=>{

    if(gameRunning){

        spawnCoin();

    }

},5000);

// ----------------------------
// Update Coins
// ----------------------------

function updateCoins(){

    for(let i=coinList.length-1;i>=0;i--){

        let coin=coinList[i];

        coin.update();

        if(isColliding(

            playerData,

            {

                x:coin.x,

                y:coin.y,

                width:40,

                height:40

            }

        )){

            addCoin();

            coin.remove();

            coinList.splice(i,1);

            continue;

        }

        if(coin.y>800){

            coin.remove();

            coinList.splice(i,1);

        }

    }

}

// ----------------------------
// Nitro
// ----------------------------

let nitro=false;

document.addEventListener("keydown",e=>{

    if(e.key==="Shift"){

        nitro=true;

        speed+=4;

    }

});

document.addEventListener("keyup",e=>{

    if(e.key==="Shift"){

        nitro=false;

        speed-=4;

    }

});

// ----------------------------
// Road Glow
// ----------------------------

road.animate([

{

boxShadow:"0 0 20px orange"

},

{

boxShadow:"0 0 50px yellow"

},

{

boxShadow:"0 0 20px orange"

}

],{

duration:1500,

iterations:Infinity

});

// ----------------------------
// Improved Loop Hook
// ----------------------------

const oldGameLoop=gameLoop;

gameLoop=function(){

    if(!gameRunning||paused){

        return;

    }

    movePlayer();

    updateEnemies();

    updateCoins();

    updateSpawner();

    updateDifficulty();

    updateRoad();

    updateScore();

    animationId=requestAnimationFrame(gameLoop);

};
// ============================================
// Pumpkin Bros Highway Racer
// Part 6D - Bonus Features
// ============================================

// ----------------------------
// Achievement System
// ----------------------------

let achievements=[];

function unlockAchievement(name){

    if(achievements.includes(name)) return;

    achievements.push(name);

    console.log("🏆 Achievement Unlocked:",name);

}

// ----------------------------
// Achievement Checks
// ----------------------------

setInterval(()=>{

    if(score>=500){

        unlockAchievement("Road Rookie");

    }

    if(score>=2000){

        unlockAchievement("Speed Demon");

    }

    if(coins>=25){

        unlockAchievement("Coin Collector");

    }

},1000);

// ----------------------------
// Police Car Event
// ----------------------------

function spawnPolice(){

    const police=new Enemy();

    police.element.innerHTML="🚓";

    police.speed=speed+4;

    enemies.push(police);

}

setInterval(()=>{

    if(gameRunning && Math.random()<0.3){

        spawnPolice();

    }

},12000);

// ----------------------------
// Lucky Coin Rain
// ----------------------------

function coinRain(){

    for(let i=0;i<10;i++){

        setTimeout(()=>{

            spawnCoin();

        },i*200);

    }

}

setInterval(()=>{

    if(gameRunning){

        coinRain();

    }

},30000);

// ----------------------------
// Random Road Events
// ----------------------------

const events=[

"🌧 Rain Storm",

"🌫 Fog",

"☀ Sunny",

"⚡ Speed Zone"

];

function randomEvent(){

    const event=

    events[Math.floor(Math.random()*events.length)];

    console.log("EVENT:",event);

    if(event==="⚡ Speed Zone"){

        speed+=2;

        setTimeout(()=>{

            speed-=2;

        },5000);

    }

}

setInterval(()=>{

    if(gameRunning){

        randomEvent();

    }

},20000);

// ----------------------------
// Pumpkin Mode
// ----------------------------

function pumpkinMode(){

    player.innerHTML="🎃";

}

if(score>1000){

    pumpkinMode();

}

// ----------------------------
// Victory Message
// ----------------------------

function checkVictory(){

    if(score>=10000){

        alert("👑 Pumpkin Champion!");

    }

}

setInterval(checkVictory,3000);

// ----------------------------
// End of Part 6D
// ----------------------------

console.log(
"🎃 Pumpkin Bros Highway Racer - Bonus Pack Loaded"
);
