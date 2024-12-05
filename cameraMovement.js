// Get the camera element
const camera = document.getElementById('camera');

// Define movement variables
const moveDistance = 0.5; // Distance to move per key press
const speed = 0.1; // Speed of smooth movement (0 to 1)

let targetPosition = camera.getAttribute('position'); // Current target position

// Listen for keydown events to move the camera
window.addEventListener('keydown', function(event) {
    let position = camera.getAttribute('position');

    if (event.key === 'q') {
        targetPosition.y += moveDistance; // Move up with Q key
    }

    if (event.key === 'e') {
        targetPosition.y -= moveDistance; // Move down with E key
    }
});

// Smoothly update the camera position
function smoothMove() {
    let currentPosition = camera.getAttribute('position');

    // Interpolate between current position and target position
    currentPosition.y = AFRAME.utils.math.linearInterpolant(
        currentPosition.y, targetPosition.y, speed
    );

    camera.setAttribute('position', currentPosition);

    // Continue smooth movement on each frame
    requestAnimationFrame(smoothMove);
}

// Start smooth movement loop
smoothMove();
