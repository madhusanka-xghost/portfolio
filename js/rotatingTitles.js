/**
 * Rotating Titles for Madhusanka Nayanajith's Portfolio
 * Author: Madhusanka Nayanajith
 * 
 * This script handles the rotating titles in the hero section
 * with typewriter effects and smooth transitions.
 */

'use strict';

// IIFE to avoid global scope pollution
(function() {
    // DOM elements
    const titleElement = document.getElementById('rotating-title');
    
    // Configuration
    const config = {
        titles: [
            'Cybersecurity Expert',
            'Tech Enthusiast',
            'Web Developer',
            'SOC Analyst',
            'Content Creator',
            'Security Consulting'
        ],
        typeSpeed: 100,      // Speed of typing in ms
        deleteSpeed: 50,     // Speed of deleting in ms
        pauseDelay: 2000,    // Delay between typing and deleting
        nextDelay: 500,      // Delay before typing next title
        loop: true           // Whether to loop through titles
    };
    
    // State variables
    let currentTitleIndex = 0;
    let isDeleting = false;
    let currentText = '';
    let typingTimeout = null;

    /**
     * Initialize the rotating titles
     */
    function init() {
        if (!titleElement) {
            console.error('Title element not found');
            return;
        }
        
        // Start the animation
        animateTitle();
        
        // Log initialization
        console.log('Rotating titles initialized with', config.titles.length, 'titles');
    }

    /**
     * Animate the title with typewriter effect
     */
    function animateTitle() {
        // Clear any existing timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        
        // Get the current title
        const fullTitle = config.titles[currentTitleIndex];
        
        // Calculate next typing interval
        // Randomize slightly for more natural effect
        let typingInterval = isDeleting ? 
            config.deleteSpeed + Math.random() * 20 : 
            config.typeSpeed + Math.random() * 50;
        
        // If we're deleting, remove the last character
        // If we're typing, add the next character
        if (isDeleting) {
            currentText = fullTitle.substring(0, currentText.length - 1);
        } else {
            currentText = fullTitle.substring(0, currentText.length + 1);
        }
        
        // Safely update the DOM
        updateTitleText(currentText);
        
        // State transitions
        if (!isDeleting && currentText === fullTitle) {
            // Finished typing the full title
            // Pause before starting to delete
            isDeleting = true;
            typingInterval = config.pauseDelay;
        } else if (isDeleting && currentText === '') {
            // Finished deleting
            isDeleting = false;
            
            // Move to next title
            currentTitleIndex = (currentTitleIndex + 1) % config.titles.length;
            
            // Pause before starting to type next title
            typingInterval = config.nextDelay;
        }
        
        // Schedule the next animation step
        typingTimeout = setTimeout(animateTitle, typingInterval);
    }

    /**
     * Safely update the title text with XSS protection
     * @param {string} text - Text to display
     */
    function updateTitleText(text) {
        if (titleElement) {
            // Use textContent for safe update without XSS risk
            titleElement.textContent = text;
            
            // Add blinking cursor effect when not deleting
            if (!isDeleting && text.length > 0) {
                titleElement.classList.add('typewriter');
            } else if (text.length === 0) {
                titleElement.classList.remove('typewriter');
            }
        }
    }

    /**
     * Clean up resources when unloading
     */
    function dispose() {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
            typingTimeout = null;
        }
        console.log('Rotating titles disposed');
    }

    // Initialize on document load
    document.addEventListener('DOMContentLoaded', init);
    
    // Handle cleanup on page unload
    window.addEventListener('beforeunload', dispose);
    
    // Expose public methods
    window.rotatingTitles = {
        updateTitles: function(newTitles) {
            if (Array.isArray(newTitles) && newTitles.length > 0) {
                config.titles = newTitles;
                currentTitleIndex = 0;
                isDeleting = false;
                currentText = '';
                console.log('Rotating titles updated');
            } else {
                console.error('Invalid titles format');
            }
        },
        pause: function() {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
                typingTimeout = null;
            }
        },
        resume: function() {
            if (!typingTimeout) {
                animateTitle();
            }
        }
    };
})();
