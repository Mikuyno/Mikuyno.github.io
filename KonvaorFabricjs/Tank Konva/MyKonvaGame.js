let tank_direction = "up";
let isShooting = false;

function shoot()
{
    const bullet = new Konva.Rect({
        x: tank.x() + tank.width() / 2 -5,
        y: tank.y() + tank.height() / 2 -5,
        width: 10,
        height: 10,
        fill: "red",
    })
    layer.add(bullet);
    layer.batchDraw();

    MovementBullet(bullet);
}

function MovementBullet(bullet){
    const bulletspeed = 10;
    function move(){
    switch (tank_direction) {
        case 'up':
            bullet.y(bullet.y() - bulletspeed);
            break;
        case 'down':
            bullet.y(bullet.y() + bulletspeed);
            break;
        case 'left':
            bullet.x(bullet.x() - bulletspeed);
            break;
        case 'right':
            bullet.x(bullet.x() + bulletspeed);
            break;
    }

    layer.batchDraw();

    if(bullet.x() > 0 && bullet.x() < stage.width() && bullet.y() > 0 && bullet.y() < stage.height())
    {
        requestAnimationFrame(move);
    }
   else
    {
        bullet.destroy();
        layer.batchDraw();
    }
    }
    move();
}

const stage = new Konva.Stage({
    container: "konva_container",
    width: window.innerWidth,
    height: window.innerHeight
});

const layer = new Konva.Layer();
stage.add(layer);

const tank = new Konva.Rect({
    x: stage.width() / 2 - 25,
    y: stage.height() / 2 - 100, 
    width: 50,
    height: 50,
    fill: "green",
});



layer.add(tank);

document.addEventListener("keyup", (e) =>{
    if(e.key === " ")
    {
        isShooting = false;
    }
})


const speed = 5;
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            tank.y(tank.y() - speed);
            tank_direction = "up"
            break;
        case 'ArrowDown':
            tank.y(tank.y() + speed);
            tank_direction = "down"
            break;
        case 'ArrowLeft':
            tank.x(tank.x() - speed);
            tank_direction="left"
            break;
        case 'ArrowRight':
            tank.x(tank.x() + speed);
            tank_direction="right"
            break;
        case " ":
            if(isShooting == false)
            {
                shoot();
                isShooting =true;
                break;
            }
    }
    layer.batchDraw();
});








