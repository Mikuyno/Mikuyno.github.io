var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);


const createScene = function () {
    
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 1.5, Math.PI / 2.2, 15, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

    

    BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "village.glb");

    
    const walk = function (turn, dist) {
        this.turn = turn;
        this.dist = dist;
    }
    
    const track = [];
    track.push(new walk(86, 7));
    track.push(new walk(-85, 14.8));
    track.push(new walk(-93, 16.5));
    track.push(new walk(48, 25.5));
    track.push(new walk(-112, 30.5));
    track.push(new walk(-72, 33.2));
    track.push(new walk(42, 37.5));
    track.push(new walk(-98, 45.2));
    track.push(new walk(0, 47))

    // Dude
    BABYLON.SceneLoader.ImportMeshAsync("him", "./", "Dude3.babylon", scene).then((result) => {
        var dude = result.meshes[0];
        dude.scaling = new BABYLON.Vector3(0.012, 0.012, 0.012);
            
        dude.position = new BABYLON.Vector3(-6, 0, 0);
        dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-95), BABYLON.Space.LOCAL);
        const startRotation = dude.rotationQuaternion.clone();    
            
        scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

        let distance = 0;
        let step = 0.015;
        let p = 0;

        scene.onBeforeRenderObservable.add(() => {
            dude.movePOV(0, 0, step);
            distance += step;
              
            if (distance > track[p].dist) {
                
                dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(track[p].turn), BABYLON.Space.LOCAL);
                p +=1;
                p %= track.length; 
                if (p === 0) {
                    distance = 0;
                    dude.position = new BABYLON.Vector3(-6, 0, 0);
                    dude.rotationQuaternion = startRotation.clone();
                }
            }
            
        })
    });

//Change 1, Car
BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "car.glb").then(() => {
    const car = scene.getMeshByName("car");
    car.rotation = new BABYLON.Vector3(Math.PI / 2, 0, -Math.PI / 2);
    car.position.y = 0.16;
    car.position.x = -3;
    car.position.z = 8;

    const animCar = new BABYLON.Animation("carAnimation", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    const carKeys = []; 

    carKeys.push({
        frame: 0,
        value: 8
    });

    carKeys.push({
        frame: 150,
        value: -7
    });

    carKeys.push({
        frame: 200,
        value: -7
    });

    animCar.setKeys(carKeys);

    car.animations = [];
    car.animations.push(animCar);

    scene.beginAnimation(car, 0, 200, true);
  
    //wheel animation
    const wheelRB = scene.getMeshByName("wheelRB");
    const wheelRF = scene.getMeshByName("wheelRF");
    const wheelLB = scene.getMeshByName("wheelLB");
    const wheelLF = scene.getMeshByName("wheelLF");
  
    scene.beginAnimation(wheelRB, 0, 30, true);
    scene.beginAnimation(wheelRF, 0, 30, true);
    scene.beginAnimation(wheelLB, 0, 30, true);
    scene.beginAnimation(wheelLF, 0, 30, true);
});

    // Create the sphere
var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
diameter: 0.5, // diameter of the sphere
segments: 32, // number of segments
}, scene);

// Position the sphere
sphere.position = new BABYLON.Vector3(0, 0, 6);
var material = new BABYLON.StandardMaterial("material", scene); 
material.diffuseColor = new BABYLON.Color3(1, 0.5, 0.5); // red color // Create red material
sphere.material = material;// Assign material to sphere

    // Define sphere properties
var sphereProperties = {
diameter: 2,
segments: 32,
};

// Define materials
var materials = [
new BABYLON.StandardMaterial("material1", scene),
new BABYLON.StandardMaterial("material2", scene),
new BABYLON.StandardMaterial("material3", scene)
];

materials[0].diffuseColor = new BABYLON.Color3(1, 0, 0); // Red
materials[1].diffuseColor = new BABYLON.Color3(0, 1, 0); // Green
materials[2].diffuseColor = new BABYLON.Color3(0, 0, 1); // Blue

// Define positions
var positions = [
new BABYLON.Vector3(0, 0, 0),
new BABYLON.Vector3(0, 2, 0),
new BABYLON.Vector3(2, 0, 0)
];

// Create spheres
for (var i = 0; i < 3; i++) {
var sphere = BABYLON.MeshBuilder.CreateSphere("sphere" + i, sphereProperties, scene);
sphere.position = positions[i];
sphere.material = materials[i];
}
    
    return scene;
};



var scene = createScene();

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});

// Function to export as GLB
function exportToGLB() {
    BABYLON.GLTF2Export.GLBAsync(scene, "stickman.glb").then((glb) => {
        glb.downloadFiles();
    });
}

// Attach export function to the download button
document.getElementById("downloadButton").addEventListener("click", exportToGLB);