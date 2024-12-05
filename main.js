import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';
import { ARButton } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/webxr/ARButton.js';

import { moveCamera } from './cameraMovement.js';

window.addEventListener('keydown', (event) => {
    if (event.key === 'q') moveCamera(camera, 'up', moveDistance);
    if (event.key === 'e') moveCamera(camera, 'down', moveDistance);
});

let camera, scene, renderer;
let controller;

let moveDistance = 0.5; // Default distance to move per key press
const speedIncrement = 0.1; // How much the speed changes per scroll

// Initialize the scene and camera
init();
animate();

function init() {
    // Create Scene and Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // AR Button
    document.body.appendChild(ARButton.createButton(renderer));

    // Lighting
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // 3D Model - Info Panel
    const loader = new GLTFLoader();
    loader.load('./assets/models/info-panel.glb', (gltf) => {
        const infoPanel = gltf.scene;
        infoPanel.position.set(0, 0, -1); // Positioned in front of the user
        scene.add(infoPanel);
    });

    // Social Media Links
    createSocialButtons();

    // Controller for interaction
    controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    // Listen for mouse wheel to adjust speed
    window.addEventListener('wheel', handleScroll);
}

// Function to create social media buttons
function createSocialButtons() {
    const buttonData = [
        { label: 'GitHub', link: 'https://github.com/yourusername' },
        { label: 'LinkedIn', link: 'https://linkedin.com/in/yourprofile' },
        { label: 'Twitter', link: 'https://twitter.com/yourhandle' },
    ];

    buttonData.forEach((data, index) => {
        const button = create3DButton(data.label);
        button.position.set(0, 0.2 * index - 0.2, -1.5);
        button.userData.link = data.link;
        scene.add(button);
    });
}

// Function to create 3D buttons
function create3DButton(label) {
    const geometry = new THREE.PlaneGeometry(0.3, 0.1);
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
    const button = new THREE.Mesh(geometry, material);

    const loader = new THREE.FontLoader();
    loader.load('path/to/font.json', (font) => {
        const textGeometry = new THREE.TextGeometry(label, {
            font: font,
            size: 0.05,
            height: 0.01,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(-0.15, 0, 0.01);
        button.add(textMesh);
    });

    return button;
}

// Function for selecting links on button press
function onSelect() {
    const intersection = controller.intersectObject(scene.children, true)[0];
    if (intersection && intersection.object.userData.link) {
        window.open(intersection.object.userData.link, '_blank');
    }
}

// Handle scroll input to adjust speed
function handleScroll(event) {
    if (event.deltaY > 0) {
        // Scroll down (decrease move distance)
        moveDistance = Math.max(0.1, moveDistance - speedIncrement); // Prevent moveDistance from going below 0.1
    } else {
        // Scroll up (increase move distance)
        moveDistance += speedIncrement;
    }
    console.log(`Move Distance: ${moveDistance}`); // Output the current move distance to the console for debugging
}

// Smoothly animate the scene (render loop)
function animate() {
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
}
