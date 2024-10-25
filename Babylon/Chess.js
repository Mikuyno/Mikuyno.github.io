const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
let turn = "white";

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // Camera
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Light
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Chessboard
    const boardSize = 8;
    const tileSize = 1;

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const tile = BABYLON.MeshBuilder.CreateBox(`tile${row}_${col}`, {size: tileSize}, scene);
            tile.position = new BABYLON.Vector3(row - boardSize / 2 + 0.5, 0, col - boardSize / 2 + 0.5);
            const tileMaterial = new BABYLON.StandardMaterial(`tileMat${row}_${col}`, scene);
            tileMaterial.diffuseColor = (row + col) % 2 === 0 ? new BABYLON.Color3(255, 1, 2) : new BABYLON.Color3(0, 1, 2);
            tile.material = tileMaterial;
        }
    }

    return scene;
};

const scene = createScene();

const createPiece = (name, position, color, colorName) => {
    let piece;
    switch (name) {
        case "pawn":
            piece = BABYLON.MeshBuilder.CreateSphere(name, {diameter: 0.5}, scene);
            break;
        case "rook":
            piece = BABYLON.MeshBuilder.CreateBox(name, {size: 0.5}, scene);
            break;
        case "knight":
            piece = BABYLON.MeshBuilder.CreateCylinder(name, {diameter: 0.5, height: 1}, scene);
            break;
        case "bishop":
            piece = BABYLON.MeshBuilder.CreateTorus(name, {diameter: 0.5, thickness: 0.15}, scene);
            break;
        case "queen":
            piece = BABYLON.MeshBuilder.CreateCylinder(name, {diameter: 0.6, height: 1.2}, scene);
            break;
        case "king":
            piece = BABYLON.MeshBuilder.CreateCylinder(name, {diameter: 0.6, height: 1.3}, scene);
            break;
        default:
            piece = BABYLON.MeshBuilder.CreateBox(name, {size: 0.5}, scene);
    }

    piece.position = position;
    const pieceMaterial = new BABYLON.StandardMaterial(name + "Mat", scene);
    pieceMaterial.diffuseColor = color;
    piece.material = pieceMaterial;

    piece.colorName = colorName;

    piece.actionManager = new BABYLON.ActionManager(scene);
    piece.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
        if(piece.colorName === turn)
        {
            selectedPiece = piece;
        }

    }));
    return piece;
};

const pieces = [];
// Place pawns
for (let i = 0; i < 8; i++) {
    pieces.push(createPiece("pawn", new BABYLON.Vector3(i - 3.5, 0.5, 2.5), new BABYLON.Color3(1, 1, 1), "white"));
    pieces.push(createPiece("pawn", new BABYLON.Vector3(i - 3.5, 0.5, -2.5), new BABYLON.Color3(0, 0, 0), "black"));
}

// Place rooks
pieces.push(createPiece("rook", new BABYLON.Vector3(-3.5, 0.5, 3.5), new BABYLON.Color3(1, 1, 1), "white"));
pieces.push(createPiece("rook", new BABYLON.Vector3(3.5, 0.5, 3.5), new BABYLON.Color3(1, 1, 1), "white"));
pieces.push(createPiece("rook", new BABYLON.Vector3(-3.5, 0.5, -3.5), new BABYLON.Color3(0, 0, 0), "black"));
pieces.push(createPiece("rook", new BABYLON.Vector3(3.5, 0.5, -3.5), new BABYLON.Color3(0, 0, 0), "black"));

// Place knights
pieces.push(createPiece("knight", new BABYLON.Vector3(-2.5, 0.5, 3.5), new BABYLON.Color3(1, 1, 1), "white"));
pieces.push(createPiece("knight", new BABYLON.Vector3(2.5, 0.5, 3.5), new BABYLON.Color3(1, 1, 1), "white"));
pieces.push(createPiece("knight", new BABYLON.Vector3(-2.5, 0.5, -3.5), new BABYLON.Color3(0, 0, 0), "black"));
pieces.push(createPiece("knight", new BABYLON.Vector3(2.5, 0.5, -3.5), new BABYLON.Color3(0, 0, 0), "black"));

// Place bishops
pieces.push(createPiece("bishop", new BABYLON.Vector3(-1.5, 0.5, 3.5), new BABYLON.Color3(1, 1, 1), "white"));
pieces.push(createPiece("bishop", new BABYLON.Vector3(1.5, 0.5, 3.5), new BABYLON.Color3(1, 1, 1), "white"));
pieces.push(createPiece("bishop", new BABYLON.Vector3(-1.5, 0.5, -3.5), new BABYLON.Color3(0, 0, 0), "black"));
pieces.push(createPiece("bishop", new BABYLON.Vector3(1.5, 0.5, -3.5), new BABYLON.Color3(0, 0, 0), "black"));

// Place queens
pieces.push(createPiece("queen", new BABYLON.Vector3(-0.5, 0.5, 3.5), new BABYLON.Color3(1, 1, 1), "white"));
pieces.push(createPiece("queen", new BABYLON.Vector3(-0.5, 0.5, -3.5), new BABYLON.Color3(0, 0, 0), "black"));

// Place kings
pieces.push(createPiece("king", new BABYLON.Vector3(0.5, 0.5, 3.5), new BABYLON.Color3(1, 1, 1), "white"));
pieces.push(createPiece("king", new BABYLON.Vector3(0.5, 0.5, -3.5), new BABYLON.Color3(0, 0, 0), "black"));

let selectedPiece = null;

scene.onPointerDown = (evt, pickResult) => {
    if (selectedPiece) {
        const pickedTile = pickResult.pickedMesh;
        if (pickedTile && pickedTile.name.startsWith("tile")) {
            selectedPiece.position.x = pickedTile.position.x;
            selectedPiece.position.z = pickedTile.position.z;
            console.log("deselecting piece")
            selectedPiece = null;
            turn = turn === "white" ? "black" : "white";
            console.log(selectedPiece);
        }
    }
};

document.getElementById("exportButton").addEventListener("click", () => {
    pieces.forEach(piece => {
        const stlString = BABYLON.STLExport.CreateSTL(scene, false, piece);
        const blob = new Blob([stlString], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${piece.name}.stl`;
        link.click();
    });
});

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});