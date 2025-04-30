/**
 * Three.js Animated Background for Madhusanka Nayanajith's Portfolio
 * Author: Madhusanka Nayanajith
 * 
 * This script creates an animated, interactive tech-themed background
 * using Three.js, optimized for performance across devices.
 */

'use strict';

// IIFE to avoid global scope pollution
(function() {
    // Configuration variables
    const config = {
        particleCount: getParticleCountByDevice(),
        particleSize: 0.3,
        particleColor: 0x00f0ff,
        lineColor: 0x00f0ff,
        lineOpacity: 0.1,
        connectionDistance: 150,
        motionFactor: 0.05,
        responsive: true,
        mouseInteraction: true,
        performance: {
            throttleMS: 50  // Throttle mouse move events
        }
    };

    // Three.js variables
    let scene, camera, renderer;
    let particles, geometry, material;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    let canvas = document.getElementById('bg-canvas');
    let animationFrameId = null;
    let isInitialized = false;

    // Initialize the scene
    function init() {
        // Check if canvas exists first
        canvas = document.getElementById('bg-canvas');
        
        if (!canvas || isInitialized) return;
        
        // Mark as initialized to prevent duplicate initialization
        isInitialized = true;

        // Create scene
        scene = new THREE.Scene();
        
        // Create camera with adjusted FOV for better performance
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.z = 500;

        // Initialize renderer with canvas and set pixel ratio for best performance
        renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
        
        // Create geometry and particle system
        createParticles();
        
        // Event listeners
        if (config.responsive) {
            window.addEventListener('resize', onWindowResize, false);
        }
        
        if (config.mouseInteraction) {
            document.addEventListener('mousemove', throttle(onDocumentMouseMove, config.performance.throttleMS), false);
            document.addEventListener('touchmove', throttle(onDocumentTouchMove, config.performance.throttleMS), { passive: true });
        }
        
        // Start animation loop
        animate();
        
        // Log initialization
        console.log('Three.js background initialized with particle count:', config.particleCount);
    }

    /**
     * Create particles for the background
     */
    function createParticles() {
        // Create particle geometry
        geometry = new THREE.BufferGeometry();
        
        // Create particle positions and velocities
        const particleCount = config.particleCount;
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        
        // Set random positions and velocities
        for (let i = 0; i < positions.length; i += 3) {
            // Positions - spread particles across the scene
            positions[i]     = Math.random() * 2000 - 1000; // x
            positions[i + 1] = Math.random() * 1000 - 500;  // y
            positions[i + 2] = Math.random() * 500 - 250;   // z
            
            // Velocities - random slow movement
            velocities[i]     = (Math.random() - 0.5) * 0.2; // vx
            velocities[i + 1] = (Math.random() - 0.5) * 0.1; // vy
            velocities[i + 2] = (Math.random() - 0.5) * 0.1; // vz
        }
        
        // Set geometry attributes
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        
        // Create particle material
        material = new THREE.PointsMaterial({
            size: config.particleSize,
            color: config.particleColor,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        // Create particle system
        particles = new THREE.Points(geometry, material);
        scene.add(particles);
    }

    /**
     * Animation loop
     */
    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        render();
    }

    /**
     * Render the scene and update particle positions
     */
    function render() {
        // Rotate the entire particle system slightly based on mouse position
        if (config.mouseInteraction && particles) {
            particles.rotation.x += (mouseY * 0.00005 - particles.rotation.x) * 0.01;
            particles.rotation.y += (mouseX * 0.00005 - particles.rotation.y) * 0.01;
        }
        
        // Update particles positions based on their velocities
        if (geometry) {
            const positions = geometry.attributes.position.array;
            const velocities = geometry.attributes.velocity.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Update position based on velocity
                positions[i]     += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];
                
                // Boundary check and wrap around if particles go too far
                if (positions[i] < -1000 || positions[i] > 1000) velocities[i] = -velocities[i];
                if (positions[i + 1] < -500 || positions[i + 1] > 500) velocities[i + 1] = -velocities[i + 1];
                if (positions[i + 2] < -250 || positions[i + 2] > 250) velocities[i + 2] = -velocities[i + 2];
            }
            
            // Tell Three.js that positions have been updated
            geometry.attributes.position.needsUpdate = true;
        }
        
        // Render the scene
        renderer.render(scene, camera);
    }

    /**
     * Handle window resize
     */
    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * Handle mouse movement
     * @param {Event} event - Mouse move event
     */
    function onDocumentMouseMove(event) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }

    /**
     * Handle touch movement
     * @param {Event} event - Touch move event
     */
    function onDocumentTouchMove(event) {
        if (event.touches.length === 1) {
            mouseX = event.touches[0].pageX - windowHalfX;
            mouseY = event.touches[0].pageY - windowHalfY;
        }
    }

    /**
     * Throttle function to limit how often a function is called
     * @param {Function} func - Function to throttle
     * @param {number} limit - Throttle time in milliseconds
     * @returns {Function} - Throttled function
     */
    function throttle(func, limit) {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall < limit) return;
            lastCall = now;
            return func.apply(this, args);
        };
    }

    /**
     * Determine particle count based on device capabilities
     * @returns {number} - Appropriate particle count
     */
    function getParticleCountByDevice() {
        // Check if we're on a mobile device by screen size or user agent
        const isMobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
        const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        
        if (isMobile || isLowEnd) {
            return 50; // Low count for mobile/low-end devices
        } else if (window.innerWidth < 1200) {
            return 100; // Medium count for tablets/smaller screens
        } else {
            return 150; // Higher count for desktops
        }
    }

    /**
     * Safely clean up Three.js resources
     */
    function dispose() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        
        if (geometry) {
            geometry.dispose();
        }
        
        if (material) {
            material.dispose();
        }
        
        if (renderer) {
            renderer.dispose();
        }
        
        // Remove event listeners
        window.removeEventListener('resize', onWindowResize);
        document.removeEventListener('mousemove', onDocumentMouseMove);
        document.removeEventListener('touchmove', onDocumentTouchMove);
        
        // Reset variables
        scene = null;
        camera = null;
        renderer = null;
        particles = null;
        geometry = null;
        material = null;
        
        isInitialized = false;
        console.log('Three.js background disposed');
    }

    // Initialize on document load
    document.addEventListener('DOMContentLoaded', init);
    
    // Expose public methods
    window.threeBackground = {
        init: init,
        dispose: dispose,
        // Allow updating config after initialization
        updateConfig: function(newConfig) {
            Object.assign(config, newConfig);
            console.log('Three.js background config updated');
        }
    };
})();
