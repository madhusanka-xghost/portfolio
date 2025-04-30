/**
 * Navigation Functionality for Madhusanka Nayanajith's Portfolio
 * Author: Madhusanka Nayanajith
 * 
 * This script handles navigation functionality, including:
 * - Mobile menu toggling
 * - Smooth scrolling to sections
 * - Active navigation highlighting
 */

'use strict';

// IIFE to avoid global scope pollution
(function() {
    // DOM Elements
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
    
    // State variables
    let isMenuOpen = false;
    let isScrolling = false;
    let scrollTimeout = null;

    /**
     * Initialize the navigation functionality
     */
    function init() {
        // Initialize mobile menu toggle
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', toggleMobileMenu);
        }
        
        // Initialize smooth scroll behavior
        initSmoothScroll();
        
        // Initialize scroll spy
        window.addEventListener('scroll', throttle(handleScrollSpy, 100), { passive: true });
        
        // Close mobile menu when clicking outside of it
        document.addEventListener('click', handleOutsideClick);
        
        // Initial check for active section
        handleScrollSpy();
        
        console.log('Navigation initialized');
    }

    /**
     * Toggle the mobile menu
     */
    function toggleMobileMenu() {
        if (!mobileMenu) return;
        
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            // Allow transition to take effect
            setTimeout(() => {
                mobileMenu.classList.add('opacity-100');
                mobileMenu.classList.remove('opacity-0');
            }, 10);
        } else {
            mobileMenu.classList.remove('opacity-100');
            mobileMenu.classList.add('opacity-0');
            // Wait for transition before hiding
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        }
    }

    /**
     * Close the mobile menu
     */
    function closeMobileMenu() {
        if (isMenuOpen && mobileMenu) {
            isMenuOpen = false;
            mobileMenu.classList.remove('opacity-100');
            mobileMenu.classList.add('opacity-0');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        }
    }

    /**
     * Handle clicks outside the mobile menu to close it
     * @param {Event} event - Click event
     */
    function handleOutsideClick(event) {
        if (isMenuOpen && 
            mobileMenu && 
            !mobileMenu.contains(event.target) && 
            !mobileMenuButton.contains(event.target)) {
            closeMobileMenu();
        }
    }

    /**
     * Initialize smooth scrolling for navigation links
     */
    function initSmoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                
                // Get the target section id from href
                const targetId = link.getAttribute('href');
                if (!targetId || targetId === '#') return;
                
                // Find the target element
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;
                
                // Close mobile menu if it's open
                closeMobileMenu();
                
                // Set scrolling state
                isScrolling = true;
                
                // Clear any existing scroll timeout
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }
                
                // Calculate scroll position with offset for fixed header
                const headerHeight = document.getElementById('main-header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                // Scroll to the target position
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Reset scrolling state after animation
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                    // Update active links after scrolling
                    handleScrollSpy();
                }, 1000);
            });
        });
    }

    /**
     * Handle scroll spy functionality to highlight active section in nav
     */
    function handleScrollSpy() {
        // Skip if we're currently animating a scroll
        if (isScrolling) return;
        
        // Get current scroll position
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        // Get all sections
        const sections = document.querySelectorAll('section');
        
        // Find the current active section
        let currentSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section;
            }
        });
        
        // Update active navigation links
        if (currentSection) {
            const sectionId = currentSection.getAttribute('id');
            updateActiveNavLinks(sectionId);
        }
    }

    /**
     * Update the active state of navigation links
     * @param {string} sectionId - The ID of the active section
     */
    function updateActiveNavLinks(sectionId) {
        if (!sectionId) return;
        
        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('text-neon-blue');
            link.classList.add('text-cyber-light');
        });
        
        // Add active class to matching nav links
        const activeLinks = document.querySelectorAll(`.nav-link[href="#${sectionId}"], .nav-link-mobile[href="#${sectionId}"]`);
        activeLinks.forEach(link => {
            link.classList.remove('text-cyber-light');
            link.classList.add('text-neon-blue');
        });
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

    // Initialize on document load
    document.addEventListener('DOMContentLoaded', init);
    
    // Expose public methods
    window.navigation = {
        closeMenu: closeMobileMenu,
        updateActiveSection: function(sectionId) {
            updateActiveNavLinks(sectionId);
        }
    };
})();
