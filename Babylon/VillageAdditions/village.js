var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);


const createScene = function () {
    
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 1.5, Math.PI / 2.2, 15, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    camera.upperBetaLimit = Math.PI / 2.2;
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

    

    BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "valleyvillage.glb");

    
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

    const animCar = new BABYLON.Animation("carAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    
    const carKeys = [
        { frame: 0, value: new BABYLON.Vector3(-3, 0.16, 8) },  
        { frame: 50, value: new BABYLON.Vector3(-3, 0.16, 3) }, 
        { frame: 100, value: new BABYLON.Vector3(-3, 0.16, 3) }, 
        { frame: 150, value: new BABYLON.Vector3(-3, 0.16, 3) }, 
        { frame: 200, value: new BABYLON.Vector3(5, 0.16, 1) }  
    ];
    animCar.setKeys(carKeys);

    //Change 3 car turn
    const animCarRotation = new BABYLON.Animation("carRotationAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    const rotationKeys = [
        { frame: 0, value: 0 },  
        { frame: 100, value: 0},
        { frame: 150, value: Math.PI / -2.5 },  
        { frame: 200, value: Math.PI / -2.5 }
    ];

    animCarRotation.setKeys(rotationKeys);
    car.animations = [animCar, animCarRotation];
    //end change 3


    scene.beginAnimation(car, 0, 200, true);
  
    const wheelRB = scene.getMeshByName("wheelRB");
    const wheelRF = scene.getMeshByName("wheelRF");
    const wheelLB = scene.getMeshByName("wheelLB");
    const wheelLF = scene.getMeshByName("wheelLF");
  
    scene.beginAnimation(wheelRB, 0, 30, true);
    scene.beginAnimation(wheelRF, 0, 30, true);
    scene.beginAnimation(wheelLB, 0, 30, true);
    scene.beginAnimation(wheelLF, 0, 30, true);
});
//End Change 1

//Change 2 Ground
const groundMat = new BABYLON.StandardMaterial("groundMat");
groundMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/villagegreen.png");
groundMat.diffuseTexture.hasAlpha = true;

const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:24, height:24});
ground.material = groundMat;

const largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");
largeGroundMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/valleygrass.png");

const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", "https://assets.babylonjs.com/environments/villageheightmap.png" /* url to height map */, 
    {width:150, height:150, subdivisions: 20, minHeight:0, maxHeight: 4});
largeGround.material = largeGroundMat;
largeGround.position.y = -0.01;
//End Change 2

//Change 4: skybox
const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:150}, scene);
const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
skyboxMaterial.backFaceCulling = false;
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("backgroundSkybox.dds", scene);
skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
skybox.material = skyboxMaterial;
    //End change 4

//Change 5: Rain
var particleSystem = new BABYLON.ParticleSystem("particles", 5000, scene);

particleSystem.particleTexture = new BABYLON.Texture("Rain.png", scene);

particleSystem.emitter = new BABYLON.Vector3(0, 10, 0); // the starting object, the emitter
particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

particleSystem.minSize = 0.09;
particleSystem.maxSize = 0.15;

particleSystem.minLifeTime = 2;
particleSystem.maxLifeTime = 3.5;

particleSystem.emitRate = 1500;

particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

particleSystem.direction1 = new BABYLON.Vector3(-2, 8, 2);
particleSystem.direction2 = new BABYLON.Vector3(2, 8, -2);

particleSystem.minEmitPower = 1;
particleSystem.maxEmitPower = 3;
particleSystem.updateSpeed = 0.025;

particleSystem.start();
//End Change 5
    
    return scene;
};

var scene = createScene();

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});

