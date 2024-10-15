import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { UltraHDRLoader } from 'jsm/loaders/UltraHDRLoader.js';
import { TeapotGeometry } from 'jsm/geometries/TeapotGeometry.js';
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const hdrLoader = new UltraHDRLoader();
hdrLoader.load('envs/moonless_golf_1k.jpg', (hdr) => {
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = hdr;
  scene.environment = hdr;
});

const geometry = new THREE.TorusKnotGeometry(1, 0.4, 128, 64);
const material = new THREE.MeshPhysicalMaterial({
  roughness: 0.0,
  // metalness: 1.0,
  transmission: 1.0,
  thickness: 1.0,
  // color: 0x0099ff,
  side: THREE.DoubleSide,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function animate(t = 0) {
  requestAnimationFrame(animate);
  cube.rotation.x += Math.sin(t * 0.0005) * 0.001;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
  controls.update();
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);