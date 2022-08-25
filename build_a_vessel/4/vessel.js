//GLTFExporter
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

//

let modelArray = [];

let scene, camera, renderer, dragControls, orbitControls;
let ambientLight;
let loader, manager;
let width = window.innerWidth;
let height = window.innerHeight;

//

init();
animate();

//

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        width/height,
        0.1,
        2000
    );
    camera.position.z = 4.5;

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true 
    });
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    renderer.outputEncoding = THREE.sRGBEncoding;

    window.addEventListener('resize', function() {
        renderer.setSize(width, height);
        camera.aspect = width/height;
        camera.updateProjectionMatrix();
    })

    ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    manager = new THREE.LoadingManager(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        loadingScreen.addEventListener('transitionend', onTransitionEnd);
    });

    loader = new THREE.GLTFLoader(manager);
    for (let i = 0; i < 16; i++) {

        loader.load(

            '../../gltf/build_a_vessel/4/' + i + '.glb',

            function(gltf) {
                model = gltf.scene;

                model.position.x = (Math.random() - 0.5) * 8.5;
                model.position.y = (Math.random() - 0.5) * 3;
                //model.position.z = (Math.random() - 0.5) * 1;

                model.rotation.y = Math.random() * 4 * Math.PI;
                
                scene.add(model);
                modelArray.push(model);
            }
        )
    }

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.maxDistance = 10;
    orbitControls.enablePan = true;
    orbitControls.panSpeed = 0.5;

    // reset controls
    document.body.addEventListener('keydown', onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        const keyCode = event.which;
        if (keyCode == 82) {
            orbitControls.reset();
        }
    }

    dragControls = new THREE.DragControls(modelArray, camera, renderer.domElement);
    dragControls.addEventListener('dragstart', function() {
        orbitControls.enabled = false;
    });
    dragControls.addEventListener('dragend', function() {
        orbitControls.enabled = true;
    });
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}

function onTransitionEnd(transition) {
    transition.target.remove();
}