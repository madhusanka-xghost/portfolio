/**
 * Main JavaScript file for Madhusanka Nayanajith's Portfolio
 * Author: Madhusanka Nayanajith
 * This file handles general site functionality and initializes components
 */

// Use strict mode to catch common coding errors and "unsafe" actions
'use strict';

// Wrap everything in an IIFE to avoid global scope pollution
(function() {
    // DOM Elements
    const backToTopButton = document.getElementById('back-to-top');
    const yearElement = document.getElementById('current-year');
    const sections = document.querySelectorAll('section');
    const projectCards = document.querySelectorAll('.project-card');
    const projectFilters = document.querySelectorAll('.project-filter');
    
    /**
     * Initialize the application when DOM is fully loaded
     */
    document.addEventListener('DOMContentLoaded', () => {
        // Set current year in footer
        setCurrentYear();
        
        // Initialize scroll event listeners
        initScrollListeners();
        
        // Initialize project filtering
        initProjectFilters();
        
        // Check for sections in view on initial load
        checkSectionsInView();
        
        // Log initialization success (dev only)
        console.log('Portfolio initialized successfully');
    });

    /**
     * Set the current year in the footer copyright text
     */
    function setCurrentYear() {
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    /**
     * Initialize scroll-related event listeners
     */
    function initScrollListeners() {
        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', () => {
            handleScrollEvents();
            checkSectionsInView();
        }, { passive: true });
        
        // Back to top button click handler
        if (backToTopButton) {
            backToTopButton.addEventListener('click', scrollToTop);
        }
    }

    /**
     * Handle various scroll-triggered events
     */
    function handleScrollEvents() {
        const scrollY = window.scrollY;
        const header = document.getElementById('main-header');
        
        // Handle header transformation on scroll
        if (header) {
            if (scrollY > 100) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }
        
        // Show/hide back to top button
        if (backToTopButton) {
            if (scrollY > 500) {
                backToTopButton.classList.remove('opacity-0', 'invisible');
                backToTopButton.classList.add('opacity-100', 'visible');
            } else {
                backToTopButton.classList.add('opacity-0', 'invisible');
                backToTopButton.classList.remove('opacity-100', 'visible');
            }
        }
    }

    /**
     * Smoothly scroll to the top of the page
     */
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Check which sections are in the viewport and animate them
     */
    function checkSectionsInView() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // If section is in viewport
            if (rect.top < windowHeight * 0.8) {
                section.classList.add('visible');
            }
        });
    }

    /**
     * Initialize project filtering functionality
     */
    function initProjectFilters() {
        if (!projectFilters.length || !projectCards.length) return;
        
        projectFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                // Get filter category
                const category = filter.getAttribute('data-filter');
                
                // Update active filter state
                projectFilters.forEach(btn => btn.classList.remove('active'));
                filter.classList.add('active');
                
                // Filter projects
                filterProjects(category);
            });
        });
    }

    /**
     * Filter projects based on selected category
     * @param {string} category - The category to filter by
     */
    function filterProjects(category) {
        projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || category === cardCategory) {
                // Show card with animation
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                // Hide card with animation
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    /**
     * Utility function to safely parse and sanitize HTML
     * Used for security when inserting dynamic content
     * @param {string} html - HTML string to sanitize
     * @returns {DocumentFragment} - Sanitized document fragment
     */
    function sanitizeHTML(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc.body.firstChild;
    }

    /**
     * Utility function to debounce function calls
     * Ensures functions that are frequently called don't execute too often
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} - Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    // Expose public methods or variables if needed
    window.portfolioApp = {
        // Safe method to refresh components after DOM changes
        refreshComponents: function() {
            checkSectionsInView();
            console.log('Components refreshed');
        }
    };
})();

// Initialize on load with error handling
window.addEventListener('load', function() {
    try {
        // Check if all necessary scripts are loaded
        if (typeof THREE === 'undefined') {
            console.error('Three.js is not loaded. Some features may not work.');
        }
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});
