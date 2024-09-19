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

const speed = 5;
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            tank.y(tank.y() - speed);
            break;
        case 'ArrowDown':
            tank.y(tank.y() + speed);
            break;
        case 'ArrowLeft':
            tank.x(tank.x() - speed);
            break;
        case 'ArrowRight':
            tank.x(tank.x() + speed);
            break;
    }
    layer.batchDraw();
});