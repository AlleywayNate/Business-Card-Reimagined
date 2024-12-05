try {
    export function moveCamera(camera, direction, distance) {
        let position = camera.position;
        if (direction === 'up') {
            position.y += distance; // Move up
        }
        if (direction === 'down') {
            position.y -= distance; // Move down
        }
        camera.position.set(position.x, position.y, position.z); // Update camera position
    }

// Get the camera element
    const camera = document.getElementById('camera');

// Define movement variables
    let moveDistance = 0.5; // Default distance to move per key press
    const speedIncrement = 0.1; // How much the speed changes per scroll
    let speed = 0.1; // Default speed for smooth movement (0 to 1)

// Update speed based on mouse wheel scroll
    window.addEventListener('wheel', function (event) {
        if (event.deltaY > 0) {
            // Scroll down (move speed decreases)
            moveDistance = Math.max(0.1, moveDistance - speedIncrement); // Prevent moveDistance from going below 0.1
        } else {
            // Scroll up (move speed increases)
            moveDistance += speedIncrement;
        }
        console.log(`Move Distance: ${moveDistance}`); // Output the current move distance to the console for debugging
    });
// Testing Event Listeners
    window.addEventListener('keydown', (event) => {
        console.log('Key pressed:', event.key);
        if (event.key === 'q') moveCamera(camera, 'up', moveDistance);
        if (event.key === 'e') moveCamera(camera, 'down', moveDistance);
    });
    window.addEventListener('wheel', (event) => {
        console.log('Wheel event:', event.deltaY);
    });

// Listen for keydown events to move the camera
    window.addEventListener('keydown', function (event) {
        let position = camera.getAttribute('position');

        if (event.key === 'q') {
            position.y += moveDistance; // Move up with Q key
        }

        if (event.key === 'e') {
            position.y -= moveDistance; // Move down with E key
        }

        camera.setAttribute('position', position); // Update camera position
    });

// Smoothly update the camera position
    function smoothMove() {
        let currentPosition = camera.getAttribute('position');
        let targetPosition = {...currentPosition}; // Assuming target position can be directly derived

        // Smooth movement based on a simple lerp (linear interpolation) for the Y-axis
        currentPosition.y = AFRAME.utils.math.linearInterpolant(currentPosition.y, targetPosition.y, speed);

        camera.setAttribute('position', currentPosition);

        // Continue smooth movement on each frame
        requestAnimationFrame(smoothMove);
    }

// Start smooth movement loop
    smoothMove();

} catch (error) {
    console.error('Error Movement:', error);
}
