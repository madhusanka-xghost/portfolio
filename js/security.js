/**
 * Security Protection Module
 * Author: Madhusanka Nayanajith
 */

(function () {
    'use strict';

    // Security configuration
    const securityConfig = {
        enableCSP: true,
        enableXSSProtection: true,
        enableClickjacking: true,
        maxRequestSize: 1024 * 1024, // 1MB
    };

    // CSP violation reporting
    document.addEventListener('securitypolicyviolation', (e) => {
        console.error('CSP violation:', {
            violatedDirective: e.violatedDirective,
            sourceFile: e.sourceFile,
            lineNumber: e.lineNumber,
            columnNumber: e.columnNumber
        });
        // You can implement reporting to your server here
    });

    // Input sanitization function
    function sanitizeInput(input) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;',
        };
        const reg = /[&<>"'/]/ig;
        return input.replace(reg, (match) => (map[match]));
    }

    // Add security headers dynamically
    function addSecurityHeaders() {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'X-XSS-Protection';
        meta.content = '1; mode=block';
        document.head.appendChild(meta);
    }

    // Prevent clickjacking
    if (securityConfig.enableClickjacking && window.self !== window.top) {
        window.top.location = window.self.location;
    }

    // Expose safe methods
    window.securityUtils = {
        sanitizeInput: sanitizeInput,
        validateURL: function (url) {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        }
    };

    // Initialize security measures
    addSecurityHeaders();
})();

(function () {
    'use strict';

    // Disable right-click
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        return false;
    });

    // Disable cut, copy, paste
    document.addEventListener('cut', function (e) {
        e.preventDefault();
        return false;
    });

    document.addEventListener('copy', function (e) {
        e.preventDefault();
        return false;
    });

    document.addEventListener('paste', function (e) {
        e.preventDefault();
        return false;
    });

    // Disable text selection
    document.addEventListener('selectstart', function (e) {
        e.preventDefault();
        return false;
    });

    // Disable keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        // Disable viewing source - Ctrl+U
        if (e.ctrlKey && e.keyCode == 85) {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl + Shift + I (inspect element)
        if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl + Shift + C (inspect element)
        if (e.ctrlKey && e.shiftKey && e.keyCode == 67) {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl + S (save page)
        if (e.ctrlKey && e.keyCode == 83) {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl + Shift + J (console)
        if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
            e.preventDefault();
            return false;
        }

        // Disable F12
        if (e.keyCode == 123) {
            e.preventDefault();
            return false;
        }
    });

    // Anti-iframe clickjacking protection
    if (window.self !== window.top) {
        window.top.location = window.self.location;
    }

    // Disable developer tools
    function disableDevTools() {
        const devToolsTimeout = function () {
            if (window.devtools.isOpen) {
                window.location.reload();
            }
        };

        // Create devtools trap
        const devtools = {
            isOpen: false,
            orientation: undefined
        };

        const threshold = 160;

        const emitEvent = function (isOpen, orientation) {
            window.dispatchEvent(new CustomEvent('devtoolschange', {
                detail: {
                    isOpen: isOpen,
                    orientation: orientation
                }
            }));
        };

        setInterval(function () {
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            const orientation = widthThreshold ? 'vertical' : 'horizontal';

            if (
                !(heightThreshold && widthThreshold) &&
                ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) ||
                    widthThreshold ||
                    heightThreshold)
            ) {
                if (!devtools.isOpen || devtools.orientation !== orientation) {
                    emitEvent(true, orientation);
                }
                devtools.isOpen = true;
                devtools.orientation = orientation;
            } else {
                if (devtools.isOpen) {
                    emitEvent(false, undefined);
                }
                devtools.isOpen = false;
                devtools.orientation = undefined;
            }
        }, 500);

        window.devtools = devtools;
        window.addEventListener('devtoolschange', devToolsTimeout);
    }

    // Initialize protection on load
    window.addEventListener('load', function () {
        disableDevTools();

        // Add console warning
        console.log(
            '%cStop!',
            'color: red; font-size: 30px; font-weight: bold;'
        );
        console.log(
            '%cThis is a protected website. Viewing source code or attempting to modify content is prohibited.',
            'color: red; font-size: 16px;'
        );
    });
})();


// Simple Screen Protection for Static Portfolio


(function () {
    'use strict';

    class ScreenProtection {
        constructor() {
            this.watermark = null;
            this.blurOverlay = null;
        }

        init() {
            this.createWatermark();
            this.initializeProtection();
            this.handleVisibilityChange();
        }

        createWatermark() {
            this.watermark = document.createElement('div');
            this.watermark.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 10000;
                opacity: 0.1;
                user-select: none;
                overflow: hidden;
            `;

            // Create watermark pattern
            const pattern = document.createElement('div');
            pattern.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 200%;
                height: 200%;
                transform: rotate(-45deg);
                font-family: Arial, sans-serif;
                font-size: 14px;
                line-height: 3em;
                color: #000;
                white-space: nowrap;
            `;

            // Simple watermark text
            const watermarkText = `© Portfolio - Do Not Copy`;

            for (let i = 0; i < 100; i++) {
                const textLine = document.createElement('div');
                textLine.textContent = watermarkText;
                pattern.appendChild(textLine);
            }

            this.watermark.appendChild(pattern);
            document.body.appendChild(this.watermark);
        }

        initializeProtection() {
            // Prevent screen capture shortcuts
            window.addEventListener('keydown', (e) => {
                if ((e.key === 'PrtScr' ||
                    (e.ctrlKey && e.key === 'p') ||
                    (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'j' || e.key === 'c')))) {
                    e.preventDefault();
                    return false;
                }
            });

            // Prevent context menu
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                return false;
            });

            // Prevent drag and selection
            document.addEventListener('dragstart', (e) => {
                e.preventDefault();
                return false;
            });

            // Prevent selection
            document.addEventListener('selectstart', (e) => {
                e.preventDefault();
                return false;
            });
        }

        handleVisibilityChange() {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    document.body.style.filter = 'blur(8px)';
                } else {
                    document.body.style.filter = 'none';
                }
            });
        }
    }

    // Initialize protection on load
    window.addEventListener('load', () => {
        const protection = new ScreenProtection();
        protection.init();

        // Add basic CSS protection
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                -webkit-user-drag: none;
                -webkit-touch-callout: none;
            }
            
            img, video {
                pointer-events: none;
                -webkit-user-drag: none;
            }
        `;
        document.head.appendChild(style);
    });
})();