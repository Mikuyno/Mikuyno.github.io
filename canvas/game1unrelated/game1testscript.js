
var myGamePiece;
var myObstacles = [];
var myScore;

function startGame() {
    character2 = new gameObject(30, 30, "red", 10, 120);
    myGamePiece = new gameObject(30, 30, "yellow", 20, 150);
    myGamePiece.gravity = 0.05;
    myScore = new gameObject("30px", "Consolas", "black", 280, 40, "text");
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
        }); //Function obtains keycode of the current pressed down key and gives it to myGameArea.key
        window.addEventListener("keyup", function(pressed){
            myGameArea.key = false;
        }); //Function checks if key is no longer pressed down. If no longer pressed down gives myGameArea.key a value of "false"
        },

    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function gameObject(width, height, color, x, y, type) {
    this.type = type;
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
        } else {
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
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    if (myGameArea.key == false) //checks if myGameArea.key is false and if it is sets speed of game object to 0 so gamePiece does not move without input
    {
        myGamePiece.speedX=0;
        myGamePiece.speedY=0;
    }
    else //Switch structure skipped if key is not pressed
    {
        switch (myGameArea.key) //Switch structure reads myGameArea.key and if it reads that an arrow key is pressed, the corresponding case is invoked
        {
            case 37: //left
                myGamePiece.speedX = -2;
                break;
            case 38: //up
                myGamePiece.speedY = -2;
                break;
            case 39: //right
                myGamePiece.speedX = 2;
                break;
            case 40: //down
                myGamePiece.speedY = 2;
                break;
        }
    }
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
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
        myObstacles.push(new gameObject(10, height, "green", x, 0));
        myObstacles.push(new gameObject(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
    character2.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}
