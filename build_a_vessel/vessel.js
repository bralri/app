let modelArray = [];

let scene, camera, renderer, controls;
let ambientLight;
let loader;
let width = window.innerWidth;
let height = window.innerHeight;

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

    loader = new THREE.GLTFLoader();
    for (let i = 0; i < 15; i++) {

        loader.load(

            '../../gltf/build_a_vessel_1/' + i + '.glb',

            function(gltf) {
                model = gltf.scene;

                model.position.x = (Math.random() - 0.5) * 8.5;
                model.position.y = (Math.random() - 0.5) * 3;
                model.position.z = (Math.random() - 0.5) * 1;

                model.rotation.y = Math.random() * 4 * Math.PI;
                
                scene.add(model);
                modelArray.push(model);
            }
        )
    }

    controls = new THREE.DragControls(modelArray, camera, renderer.domElement);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();
animate();