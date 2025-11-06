// ===== ANIMATIONS AND INTERACTIVE EFFECTS =====

document.addEventListener('DOMContentLoaded', function() {
    // Number counter animation
    const animateNumbers = function() {
        const numberElements = document.querySelectorAll('.animate-number');
        
        numberElements.forEach(element => {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = parseInt(element.getAttribute('data-duration')) || 2000;
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const updateNumber = function() {
                current += increment;
                if (current < target) {
                    element.textContent = Math.floor(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    element.textContent = target;
                }
            };
            
            // Start animation when element is in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateNumber();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    };
    
    // Glitch effect for hover
    const addGlitchEffect = function() {
        const glitchElements = document.querySelectorAll('.glitch-effect');
        
        glitchElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.classList.add('glitch-active');
                
                // Create glitch spans
                const originalText = this.textContent;
                this.innerHTML = `
                    <span class="glitch-layer">${originalText}</span>
                    <span class="glitch-layer">${originalText}</span>
                    <span class="glitch-layer">${originalText}</span>
                `;
                
                // Add random glitch animation
                const layers = this.querySelectorAll('.glitch-layer');
                layers.forEach((layer, index) => {
                    if (index > 0) {
                        layer.style.animation = `glitch-${index + 1} 0.3s infinite`;
                    }
                });
            });
            
            element.addEventListener('mouseleave', function() {
                this.classList.remove('glitch-active');
                this.textContent = this.querySelector('.glitch-layer').textContent;
            });
        });
    };
    
    // Typing effect for hero text
    const typeWriter = function(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        const type = function() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    };
    
    // Initialize typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        // Delay typing effect for dramatic entrance
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 500);
    }
    
    // Particle effect for buttons
    const createParticleEffect = function(button) {
        button.addEventListener('click', function(e) {
            const particles = 15;
            const rect = this.getBoundingClientRect();
            
            for (let i = 0; i < particles; i++) {
                const particle = document.createElement('span');
                particle.className = 'particle';
                particle.style.cssText = `
                    position: fixed;
                    pointer-events: none;
                    width: 4px;
                    height: 4px;
                    background: var(--accent-green);
                    border-radius: 50%;
                    left: ${e.clientX}px;
                    top: ${e.clientY}px;
                    z-index: 9999;
                    animation: particle-float 1s ease-out forwards;
                    animation-delay: ${i * 0.05}s;
                `;
                
                document.body.appendChild(particle);
                
                // Remove particle after animation
                setTimeout(() => {
                    particle.remove();
                }, 1000 + (i * 50));
            }
        });
    };
    
    // Add particle effect to CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        createParticleEffect(button);
    });
    
    // Radar scanning effect
    const createRadarEffect = function() {
        const radarContainer = document.querySelector('.radar-container');
        if (!radarContainer) return;
        
        const radar = document.createElement('div');
        radar.className = 'radar-sweep';
        radar.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            background: conic-gradient(from 0deg, transparent 0deg, var(--accent-green) 30deg, transparent 60deg);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: radar-sweep 3s linear infinite;
            opacity: 0.3;
        `;
        
        radarContainer.appendChild(radar);
    };
    
    // Floating animation for elements
    const addFloatingAnimation = function() {
        const floatingElements = document.querySelectorAll('.floating');
        
        floatingElements.forEach((element, index) => {
            element.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
            element.style.animationDelay = `${index * 0.2}s`;
        });
    };
    
    // Pulse animation for important elements
    const addPulseAnimation = function() {
        const pulseElements = document.querySelectorAll('.pulse');
        
        pulseElements.forEach(element => {
            element.style.animation = 'pulse 2s ease-in-out infinite';
        });
    };
    
    // Scroll reveal animations
    const addScrollReveal = function() {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.1
        });
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    };
    
    // Parallax scrolling for multiple layers
    const addParallaxLayers = function() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-parallax') || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    };
    
    // Digital clock effect
    const createDigitalClock = function() {
        const clockContainer = document.querySelector('.digital-clock');
        if (!clockContainer) return;
        
        const updateClock = function() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            
            clockContainer.innerHTML = `
                <span class="clock-digit">${hours}</span>
                <span class="clock-separator">:</span>
                <span class="clock-digit">${minutes}</span>
                <span class="clock-separator">:</span>
                <span class="clock-digit">${seconds}</span>
            `;
        };
        
        updateClock();
        setInterval(updateClock, 1000);
    };
    
    // Matrix rain effect (optional background effect)
    const createMatrixRain = function() {
        const matrixContainer = document.querySelector('.matrix-rain');
        if (!matrixContainer) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.1;
        `;
        
        matrixContainer.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        const matrixArray = matrix.split("");
        
        const fontSize = 10;
        const columns = canvas.width / fontSize;
        
        const drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        
        const draw = function() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00ff88';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        setInterval(draw, 35);
    };
    
    // Initialize all animations
    animateNumbers();
    addGlitchEffect();
    addFloatingAnimation();
    addPulseAnimation();
    addScrollReveal();
    addParallaxLayers();
    createRadarEffect();
    createDigitalClock();
    
    // Optional: Uncomment to enable matrix rain effect
    // createMatrixRain();
});

// ===== CSS ANIMATION KEYFRAMES =====

// Add dynamic CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes particle-float {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--tx, 0), var(--ty, 0)) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-20px);
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.05);
            opacity: 0.8;
        }
    }
    
    @keyframes radar-sweep {
        0% {
            transform: translate(-50%, -50%) rotate(0deg);
        }
        100% {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }
    
    @keyframes glitch-1 {
        0%, 100% {
            transform: translate(0);
        }
        20% {
            transform: translate(-2px, 2px);
        }
        40% {
            transform: translate(-2px, -2px);
        }
        60% {
            transform: translate(2px, 2px);
        }
        80% {
            transform: translate(2px, -2px);
        }
    }
    
    @keyframes glitch-2 {
        0%, 100% {
            transform: translate(0);
        }
        20% {
            transform: translate(2px, -2px);
        }
        40% {
            transform: translate(2px, 2px);
        }
        60% {
            transform: translate(-2px, -2px);
        }
        80% {
            transform: translate(-2px, 2px);
        }
    }
    
    .glitch-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    
    .glitch-layer:nth-child(1) {
        color: var(--accent-green);
        z-index: 1;
    }
    
    .glitch-layer:nth-child(2) {
        color: var(--accent-blue);
        z-index: 2;
        mix-blend-mode: screen;
    }
    
    .glitch-layer:nth-child(3) {
        color: var(--accent-orange);
        z-index: 3;
        mix-blend-mode: multiply;
    }
    
    .reveal-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .reveal-on-scroll.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    .clock-digit {
        font-family: 'Orbitron', monospace;
        font-size: 2rem;
        color: var(--accent-green);
        text-shadow: var(--neon-glow);
    }
    
    .clock-separator {
        font-family: 'Orbitron', monospace;
        font-size: 2rem;
        color: var(--accent-green);
        text-shadow: var(--neon-glow);
        animation: blink 1s infinite;
    }
    
    @keyframes blink {
        0%, 50% {
            opacity: 1;
        }
        51%, 100% {
            opacity: 0;
        }
    }
    
    .particle {
        --tx: ${Math.random() * 100 - 50}px;
        --ty: ${Math.random() * 100 - 50}px;
    }
`;

document.head.appendChild(style);