let modelArray = [];
let vessel;
let i = 0;

let scene, camera, renderer, dragControls, orbitControls;
let ambientLight;
let loader;
let width = window.innerWidth;
let height = window.innerHeight;
let aspect = width/height;

let fov = 75;
let near = 0.1;
let far = 2000;
let CAMERA_Z_POS = 4.5;

let manager;

//

init();
update();

//

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        fov,
        width/height,
        near,
        far
    );
    camera.position.z = CAMERA_Z_POS;

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true 
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

    ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.maxDistance = 10;
    orbitControls.enablePan = true;
    orbitControls.panSpeed = 0.5;

    dragControls = new THREE.DragControls(modelArray, camera, renderer.domElement);
    dragControls.addEventListener('dragstart', function() {
        orbitControls.enabled = false;
    });
    dragControls.addEventListener('dragend', function() {
        orbitControls.enabled = true;
    });

    document.body.addEventListener('keydown', onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        const keyCode = event.which;
        if (keyCode == 82) {
            orbitControls.reset();
        }
    }

    
    loadingManager();
    exportGLB();
}

function loadingManager() {
    manager = new THREE.LoadingManager( () => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        loadingScreen.addEventListener('transitionend', onTransitionEnd);
    });
    loader = new THREE.GLTFLoader(manager);
    for (i; i < 15; i++) {

        loader.load(

            '../../gltf/build_a_vessel/1/' + i + '.glb',

            function(gltf) {
                gltf.scene.traverse(function(node) {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                })
                vessel = gltf.scene;

                vessel.position.x = (Math.random() - 0.5) * 8.5;
                vessel.position.y = (Math.random() - 0.5) * 3;

                vessel.rotation.y = Math.random() * 4 * Math.PI;

                scene.add(vessel);
                modelArray.push(vessel);
            }
            
        )
    }
}

function exportGLB() {
    const btn = document.getElementById('download-glb');
    btn.addEventListener('click', download);

    function download() {
        const exporter = new THREE.GLTFExporter();
        exporter.parse(
            scene,
            function(result) {
                saveArrayBuffer(result, 'Vessel.glb')
            },
            {
                binary: true
            }
        )
    }

    function saveArrayBuffer(buffer, fileName) {
        save(new Blob([buffer], {type: 'application/octet-stream'}), fileName);
    }

    const link = document.createElement('a');
    document.body.appendChild(link);

    function save(blob, fileName) {
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }
}

function update() {
    requestAnimationFrame(update);
    render();
}

function render() {
    renderer.render(scene, camera);
}

function onTransitionEnd(transition) {
    transition.target.remove();
}