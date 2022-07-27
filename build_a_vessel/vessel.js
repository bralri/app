const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.outputEncoding = THREE.sRGBEncoding;

window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
})

let modelArray = [];

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const loader = new THREE.GLTFLoader();
for (let i = 0; i < 8; i++) {

    loader.load(
        '../../gltf/build_a_vessel_1/' + i + '.glb',

        function(gltf) {
            model = gltf.scene;

            model.position.x = (Math.random() - 0.5) * 7;
            model.position.y = (Math.random() - 0.5) * 3.5;

            model.rotation.y = Math.random() * 2 * Math.PI;
            

            scene.add(model);
            modelArray.push(model);
        }
    )
}

let controls = new THREE.DragControls(modelArray, camera, renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();