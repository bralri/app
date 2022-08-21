let scene, camera, renderer, orbitControls;

let modelPaths = [
    './1/0.glb', 
    './1/1.glb', 
    './1/2.glb', 
    './1/3.glb', 
    './1/4.glb', 
    './1/5.glb', 
    './1/6.glb', 
    './1/7.glb', 
    './1/8.glb', 
    './1/9.glb', 
    './1/10.glb', 
    './1/11.glb', 
    './1/12.glb', 
    './1/13.glb', 
    './1/14.glb'
];
let i = 0;
let currentModel;

let modelNmb = 1;
let totalModelNmb = modelPaths.length;
document.getElementById("total-model-number").innerHTML = totalModelNmb;

let prevBtn, nextBtn;

let ambientLight;
let GLBLoader, manager;

let width = window.innerWidth;
let height = window.innerHeight;
let aspect = width/height;
let fov = 75;
let near = 0.1;
let far = 2000;
let cameraPOS = 2.5;

//

init();
update();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        fov,
        aspect,
        near,
        far
    );
    camera.position.z = cameraPOS;

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialiad: true
    });
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    renderer.outputEncoding = THREE.sRGBEncoding;

    window.addEventListener('resize', function() {
        let width = window.innerWidth;
        let height = window.innerHeight;
        let aspect = width/height;
        renderer.setSize(width, height);
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
    })

    ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.maxDistance = 3.5;
    orbitControls.minDistance = 0.5;
    orbitControls.enablePan = false;

    loading_Manager();
    next_Button();
    prev_Button();
}

function loading_Manager() {
    manager = new THREE.LoadingManager(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        loadingScreen.addEventListener('transitionend', onTransitionEnd);
    });
}

function next_Button() {
    nextBtn = document.getElementById('next-button');
    nextBtn.addEventListener('click', next);

    function load_Model(index) {
        if (currentModel) {
            scene.remove(currentModel);
        }
        GLBLoader = new THREE.GLTFLoader(manager);
        GLBLoader.load(
            modelPaths[index], 
            
            function(gltf) {
                currentModel = gltf.scene;
                currentModel.position.y = 0;
                scene.add(currentModel);
        });
    }

    function next() {
        i++;
        load_Model(i);

        if (i == 14) {
            nextBtn.style.visibility = "hidden";
        }
        
        prevBtn.style.visibility = "visible";

        modelNmb += 1;
        document.getElementById("model-number").innerHTML = modelNmb;

        orbitControls.reset();
    }

    load_Model(i);
}

function prev_Button() {
    prevBtn = document.getElementById('prev-button');
    prevBtn.addEventListener('click', prev);

    function load_Model(index) {
        if (currentModel) {
            scene.remove(currentModel);
        }
        GLBLoader = new THREE.GLTFLoader(manager);
        GLBLoader.load(
            modelPaths[index], 
            
            function(gltf) {
                currentModel = gltf.scene;
                scene.add(currentModel);
        });
    }

    function prev() {
        i--;
        load_Model(i);

        if (i == 0) {
            prevBtn.style.visibility = "hidden";
        }

        nextBtn.style.visibility = "visible";

        modelNmb -= 1;
        document.getElementById("model-number").innerHTML = modelNmb;

        orbitControls.reset();
    }
}

function update() {
    requestAnimationFrame(update);
    render();

    if (currentModel) {
        currentModel.rotation.y += 0.002;
    }
}

function render() {
    renderer.render(scene, camera);
}

function onTransitionEnd(transition) {
    transition.target.remove();
}