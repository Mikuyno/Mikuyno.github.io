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
            const pawnbase = BABYLON.MeshBuilder.CreateCylinder('pawnBase', { diameter: 1.5, height: 0.5 }, scene);
            const pawnbody = BABYLON.MeshBuilder.CreateSphere('pawnBody', { diameter: 1.5 }, scene);
            pawnbody.position.y = 1.5;
            
            piece = BABYLON.CSG.FromMesh(pawnbase)
                .union(BABYLON.CSG.FromMesh(pawnbody))
                .toMesh('pawn', null, scene);
            
            pawnbase.dispose();
            pawnbody.dispose();
            break;
        case "rook":
            const rookbase = BABYLON.MeshBuilder.CreateCylinder('base', { diameter: 2, height: 0.5 }, scene);
            const rookbody = BABYLON.MeshBuilder.CreateCylinder('body', { diameter: 1.5, height: 3 }, scene);
            rookbody.position.y = 1.75;
            const rooktop = BABYLON.MeshBuilder.CreateCylinder('top', { diameter: 1.7, height: 0.5 }, scene);
            rooktop.position.y = 3.25;

            piece = BABYLON.CSG.FromMesh(rookbase).union(BABYLON.CSG.FromMesh(rookbody)).union(BABYLON.CSG.FromMesh(rooktop)).toMesh('rook', null, scene);

            rookbase.dispose();
            rookbody.dispose();
            rooktop.dispose();
            break;
        case "knight":
            const knightbase = BABYLON.MeshBuilder.CreateCylinder('knightBase', { diameter: 2, height: 0.5 }, scene);
            const knightbody = BABYLON.MeshBuilder.CreateTorus('knightBody', { diameter: 1.5, thickness: 0.3 }, scene);
            const knighthead = BABYLON.MeshBuilder.CreateSphere('knightHead', { diameter: 1.2 }, scene);
            knighthead.position.y = 1.5;


            piece = BABYLON.CSG.FromMesh(knightbase)
                .union(BABYLON.CSG.FromMesh(knightbody))
                .union(BABYLON.CSG.FromMesh(knighthead))
                .toMesh('knight', null, scene);


            knightbase.dispose();
            knightbody.dispose();
            knighthead.dispose();
            break;
        case "bishop":
            const bishopbase = BABYLON.MeshBuilder.CreateCylinder('bishopBase', { diameter: 1, height: 0.5 }, scene);
            const bishopbody = BABYLON.MeshBuilder.CreateCylinder('bishopBody', { diameter: 1, height: 2, tessellation: 4 }, scene);
            bishopbody.position.y = 1.5;

  
            piece = BABYLON.CSG.FromMesh(bishopbase)
                .union(BABYLON.CSG.FromMesh(bishopbody))
                .toMesh('bishop', null, scene);


            bishopbase.dispose();
            bishopbody.dispose();

            break;
        case "queen":
            const queenbase = BABYLON.MeshBuilder.CreateCylinder('queenBase', { diameter: 2, height: 0.5 }, scene);
            const queenbody = BABYLON.MeshBuilder.CreateCylinder('queenBody', { diameter: 1.5, height: 3 }, scene);
            queenbody.position.y = 1.75;
            const queencrown = BABYLON.MeshBuilder.CreateTorus('queenCrown', { diameter: 1.7, thickness: 0.3 }, scene);
            queencrown.position.y = 3.25;

            piece = BABYLON.CSG.FromMesh(queenbase)
                .union(BABYLON.CSG.FromMesh(queenbody))
                .union(BABYLON.CSG.FromMesh(queencrown))
                .toMesh('queen', null, scene);

            queenbase.dispose();
            queenbody.dispose();
            queencrown.dispose();

            break;
        case "king":
            const kingbase = BABYLON.MeshBuilder.CreateCylinder('kingBase', { diameter: 2, height: 0.5 }, scene);
            const kingbody = BABYLON.MeshBuilder.CreateCylinder('kingBody', { diameter: 1.5, height: 3 }, scene);
            kingbody.position.y = 1.75;
            const kingcross = BABYLON.MeshBuilder.CreateBox('kingCross', { size: 0.5 }, scene);
            kingcross.position.y = 3.25;
            
            piece = BABYLON.CSG.FromMesh(kingbase)
                .union(BABYLON.CSG.FromMesh(kingbody))
                .union(BABYLON.CSG.FromMesh(kingcross))
                .toMesh('king', null, scene);
            
            kingbase.dispose();
            kingbody.dispose();
            kingcross.dispose();
            break;
        default:
            piece = BABYLON.MeshBuilder.CreateBox(name, {size: 0.5}, scene);
    }

    piece.scaling = new BABYLON.Vector3(0.4,0.4,0.4)
    piece.position = position;
    const pieceMaterial = new BABYLON.StandardMaterial(name + "Mat", scene);
    pieceMaterial.diffuseColor = color;
    piece.material = pieceMaterial;

    piece.colorName = colorName;

    piece.actionManager = new BABYLON.ActionManager(scene);
    piece.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
        if(turn && piece.colorName === turn )
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

const getTile = (x, z) => {
    const tileName = `tile${x + 3.5}_${z + 3.5}`; 
    const tile = scene.getMeshByName(tileName); 

    return tile || null; 
};


const getPiece = (selected_tile) => {
    for(let piece of pieces){
        if(piece.position.x === selected_tile.position.x && piece.position.z === selected_tile.position.z)
        {
            return piece;
        }
    }
    return null;
}

const pathCheck = (startx, startz, targetx, targetz) =>
{
    const zDir = Math.sign(targetz - startz);
    const xDir = Math.sign(targetx - startx); 

    currentz = startz + zDir;
    currentx = startx + xDir;

    while(currentx !== targetx || currentz !== targetz)
    {
        const tile = getTile(currentx, currentz);
        if(tile && getPiece(tile))
        {
            return false;
        }
        currentx += xDir;
        currentz += zDir;
    }
    return true;
}


const ValidMove = (piece, selected_tile) => {
    const startx = piece.position.x;
    const startz = piece.position.z;
    const targetx = selected_tile.position.x;
    const targetz = selected_tile.position.z;
    const targetPiece = getPiece(selected_tile);

    if(targetPiece)
    {
        if(targetPiece.colorName === piece.colorName || targetPiece === piece)
        {
            return false;
        }
    }
    

    switch(piece.name){
        case "pawn":
            if (piece.colorName === "white")
            {
                if ((targetz === startz - 1 && targetx === startx) || (startz === 2.5 && targetz === startz - 2 && targetx === startx && pathCheck(startx,startz,targetx,targetz))) 
                {
                    if(!targetPiece)
                    {
                        return true;
                    }

                }
                else if(targetz === startz - 1 && Math.abs(targetx - startx) === 1)
                {
                    if (targetPiece)
                    {
                        return true;
                    }
                }
            }
            else if (piece.colorName === "black")
            {
                if((targetz === startz + 1 && targetx === startx) || (startz === -2.5 && targetz === startz + 2 && targetx === startx && pathCheck(startx,startz,targetx,targetz)))
                {
                    if(!targetPiece)
                        {
                            return true;
                        }
                }
                else if(targetz === startz + 1 && Math.abs(targetx - startx) === 1)
                    {
                        if (targetPiece) {
                            return true;
                        }
                    }
            }
            break;
        case "rook":
            if(targetz === startz || targetx === startx)
            {
                return pathCheck(startx,startz,targetx,targetz);
            }
            break;
        case "bishop":
            if((Math.abs(targetz - startz) === Math.abs(targetx - startx)))
            {
                return pathCheck(startx,startz,targetx,targetz);
            }
            break;
        case "king":
            if ((Math.abs(targetz - startz) <= 1) && (Math.abs(targetx - startx) <= 1)) {
                return true;
            }
            break;
        case "queen":
            if((targetz === startz || targetx === startx) || (Math.abs(targetz - startz) === Math.abs(targetx - startx)))
            {
                return pathCheck(startx,startz,targetx,targetz);
            }
            break;
        case "knight":
            if((Math.abs(targetx - startx) === 2 && Math.abs(targetz - startz) === 1) || (Math.abs(targetx - startx) === 1 && Math.abs(targetz - startz) === 2)) 
            {
            return true;
            }
        
    }

}


scene.onPointerDown = (evt, pickResult) => {
    if (selectedPiece) {
        const pickedTile = pickResult.pickedMesh;
        console.log(selectedPiece.position.z, pickedTile.position.z)
        if (pickedTile && pickedTile.name.startsWith("tile")) {
            if(ValidMove(selectedPiece, pickedTile))
            {
                targetPiece = getPiece(pickedTile);
                turn = turn === "white" ? "black" : "white";
                selectedPiece.position.x = pickedTile.position.x;
                selectedPiece.position.z = pickedTile.position.z;
                    if(targetPiece)
                    {
                        if(targetPiece.name === "king")
                        {
                            alert(`${selectedPiece.colorName} Wins`);
                            turn = null;
                        }
                        targetPiece.dispose();
                        const index = pieces.indexOf(targetPiece);
                        if (index > -1) {
                            pieces.splice(index, 1); 
                        }
                    }
                selectedPiece = null;
            }
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