var myGamePiece;
var myObstacles = [];
var myScore;
var Paused = false;

document.addEventListener("DOMContentLoaded", function() {
    hit_sound = document.getElementById("hit_audio");
});

function startGame() {
    myGamePiece = new gameObject(30, 30, "./game1assets/no-arrow.png", 20, 150,"image",true);
    //myGamePiece.gravity = 0.05;
    myScore = new gameObject("30px", "Consolas", "black", 280, 40, "text", false);
    myGameArea.start();
}

var myGameArea = {

    canvas : document.createElement("canvas"),

    start : function() {

        this.canvas.width = 480;

        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener("keydown", function(pressed)
        {
            myGameArea.key = pressed.keyCode;
        });
        window.addEventListener("keyup", function(pressed){
            myGameArea.key = false;
        });
        },

    stopGame : function()
    {
        clearInterval(this.interval);
    },

    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

}

function gameObject(width, height, color, x, y, type, isCircle) {
    this.type = type;
    if (this.type == "image")
    {
        this.image = new Image();
        this.image.src = color;
    }
 
    this.isCircle = isCircle;
    this.radius = width/2;

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
        else if (this.type == "image")
        {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
        else 
        {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        //this.gravitySpeed += this.gravity;
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
        if (this.isCircle == true)
        {
            var CenterX = this.radius + this.x;
            var CenterY = this.radius + this.y;

            var closeX = Math.max(otherobj.x, Math.min(CenterX, otherobj.x + otherobj.width));
            var closeY = Math.max(otherobj.y, Math.min(CenterY,otherobj.y + otherobj.height));

            var distanceX = CenterX - closeX;
            var distanceY = CenterY - closeY;

            var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (distance < this.radius)
            {
                crash = true;
            }
        }
        else
        {
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
        myGamePiece.image.src = "./game1assets/no-arrow.png";
    }
    else{
    switch (myGameArea.key)
    {
        case 37:
            myGamePiece.speedX = -2;
            myGamePiece.image.src = "./game1assets/left-arrow.png";
            break;
        case 38:
            myGamePiece.speedY = -2;
            myGamePiece.image.src = "./game1assets/up-arrow.png";
            break;
        case 39:
            myGamePiece.speedX = 2;
            myGamePiece.image.src = "./game1assets/right-arrow.png";
            break;
        case 40:
            myGamePiece.speedY = 2;
            myGamePiece.image.src = "./game1assets/down-arrow.png";
            break;
    }

    }
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i]))
        {
            hit_sound.play();
            myGameArea.stopGame();
            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new gameObject(10, height, "./game1assets/Pole.png", x, 0,"image", false));
        myObstacles.push(new gameObject(10, x - height - gap, "./game1assets/Pole.png", x, height + gap,"image", false));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
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
    const start_sound = document.getElementById("start_audio");
    start_sound.play();
    startGame();
}

function Pause()
{
    Paused = !Paused;
}

function Pause()
{
    Paused = !Paused;
}
