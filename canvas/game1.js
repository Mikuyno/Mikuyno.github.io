var myGamePiece;
var myObstacles = [];
var myScore;
var Paused = false;

document.addEventListener("DOMContentLoaded", function() {
    hit_sound = document.getElementById("hit_audio");
    Music = document.getElementById("music");
    start_sound = document.getElementById("start_audio");
});

function startGame() {
    myGamePiece = new gameObject(50, 30, "./game1assets/helicopter.png", 20, 150,"image");
    //myGamePiece.gravity = 0.05;
    myScore = new gameObject("30px", "Consolas", "black", 280, 40, "text");

    Background = new gameObject(700,320,"./game1assets/Background.jpg",0,0,"background")
    myGameArea.start();

    start_sound.play();
    setTimeout(function()
    {
        Music.play();
    },1000)
}

var myGameArea = {

    canvas : document.createElement("canvas"),

    start : function() {

        this.canvas.width = 500;

        this.canvas.height = 320;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener("keydown", function(pressed)
        {
            myGameArea.key = pressed.keyCode;
        });
        window.addEventListener("keyup", function(){
            myGameArea.key = false;
        });
        },

    stopGame : function()
    {
        clearInterval(this.interval);
        Music.pause();
    },

    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

}

function gameObject(width, height, color, x, y, type) {
    this.type = type;
    if (this.type == "image" || this.type == "background")
    {
        this.image = new Image();
        this.image.src = color;
    }
 
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        
        } 
        else if (this.type == "image"|| this.type == "background")
        {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width,
                this.height
            );
            if (this.type == "background")
            {
                ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
            }
        }
        else 
        {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        //this.gravitySpeed += this.gravity;
        if (this.type == "background") {
            if (this.x <= -this.width) {
                this.x = 0; 
            }}
        this.x += this.speedX;
        this.y += this.speedY //+ this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var crash = false;

        
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        if ((mybottom >= othertop) && (mytop <= otherbottom) && (myright >= otherleft) && (myleft <= otherright)) {
            crash = true;
        }
        
    return crash;
    }
}

function updateGameArea() {
  
    if (Paused === true)
    {
        return;
    }
  
    if (myGameArea.key == false)
    {
        myGamePiece.speedX=0;
        myGamePiece.speedY=0;
        myGamePiece.image.src = "./game1assets/helicopter.png";
    }
    else{
    switch (myGameArea.key)
    {
        case 37:
            myGamePiece.speedX = -4;
            myGamePiece.image.src = "./game1assets/helicopter_backwards.png";
            break;
        case 38:
            myGamePiece.speedY = -4;
            break;
        case 39:
            myGamePiece.speedX = 4;
            myGamePiece.image.src = "./game1assets/helicopter.png";
            break;
        case 40:
            myGamePiece.speedY = 4;
            break;
    }
    }
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i]))
        {
            hit_sound.play();
            explosion = new gameObject(200, 200, "./game1assets/explosion.png", myGamePiece.x - 50, myGamePiece.y -60,"image");
            explosion.update();
            setTimeout(function()
        {
            myGameArea.stopGame();
        },200)
            document.getElementById("Pause_Button").style.display = "none";
            document.getElementById("Restart_Button").style.display = "block";
            
            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(50)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
       
        myObstacles.push(new gameObject(10, height, "./game1assets/Pole.png", x, 0,"image"));
        myObstacles.push(new gameObject(10, x - height - gap, "./game1assets/Pole.png", x, height + gap,"image"));
    }

    Background.speedX = -4;
    Background.newPos();
    Background.update();
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -6;
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();  
  
   
}


function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}

function click_start()
{
    startGame();
    document.getElementById("Pause_Button").style.display = "block";
    document.getElementById("Start_Button").style.display = "none";
    
}

function Pause()
{
    Paused = !Paused;
}

function Restart()
{
    myObstacles =[];
    myScore.text = "SCORE: 0"
    myGameArea.frameNo = 0;
    Paused = false;

    document.getElementById("Pause_Button").style.display = "block";
    document.getElementById("Restart_Button").style.display = "none";
    Music.currentTime = 0;
    startGame();

}
