// Simple Music Player
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('backgroundMusic');
    const toggle = document.getElementById('musicToggle');
    const icon = document.getElementById('musicIcon');
    
    if (!audio || !toggle || !icon) {
        console.warn('Music player elements not found');
        return;
    }
    
    // Set volume
    audio.volume = 0.3;
    
    // Load saved state
    let isPlaying = localStorage.getItem('duloMusicPlaying') === 'true';
    let attempted = localStorage.getItem('duloMusicAttempted') === 'true';
    
    // Restore current time if available
    const savedTime = localStorage.getItem('duloMusicTime');
    if (savedTime) {
        audio.currentTime = parseFloat(savedTime);
    }
    
    // Update UI
    function updateUI() {
        if (isPlaying) {
            toggle.classList.add('playing');
            icon.textContent = '🔊';
            toggle.title = 'Изключи музика';
        } else {
            toggle.classList.remove('playing');
            icon.textContent = '🎵';
            toggle.title = 'Включи музика';
        }
    }
    
    // Save state
    function saveState() {
        localStorage.setItem('duloMusicPlaying', isPlaying);
        localStorage.setItem('duloMusicAttempted', attempted);
        if (audio) {
            localStorage.setItem('duloMusicTime', audio.currentTime.toString());
        }
    }
    
    // Toggle music
    toggle.addEventListener('click', function() {
        if (!attempted) {
            attempted = true;
            saveState();
            
            audio.play().then(() => {
                isPlaying = true;
                updateUI();
                saveState();
            }).catch(error => {
                console.log('Autoplay prevented:', error);
                showMessage();
            });
        } else {
            if (isPlaying) {
                audio.pause();
                isPlaying = false;
            } else {
                audio.play().then(() => {
                    isPlaying = true;
                }).catch(error => {
                    console.log('Play failed:', error);
                });
            }
            updateUI();
            saveState();
        }
    });
    
    // Handle music end
    audio.addEventListener('ended', function() {
        audio.currentTime = 0;
        audio.play().then(() => {
            isPlaying = true;
            updateUI();
            saveState();
        }).catch(error => {
            console.log('Loop failed:', error);
            isPlaying = false;
            updateUI();
            saveState();
        });
    });
    
    // Handle errors
    audio.addEventListener('error', function(e) {
        console.error('Audio error:', e);
        icon.textContent = '❌';
        toggle.title = 'Грешка в зареждането на музиката';
        toggle.style.background = 'linear-gradient(45deg, #ff4444, #cc0000)';
    });
    
    // Show message
    function showMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(0, 255, 136, 0.9);
            color: #000;
            padding: 10px 15px;
            border-radius: 5px;
            font-family: 'Orbitron', sans-serif;
            font-size: 0.8rem;
            z-index: 1001;
            animation: fadeInOut 3s ease-in-out;
        `;
        message.textContent = 'Натисни отново за музика';
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 3000);
    }
    
    // Save current time periodically
    setInterval(() => {
        if (isPlaying && audio) {
            localStorage.setItem('duloMusicTime', audio.currentTime.toString());
        }
    }, 1000);
    
    // Save state before unload
    window.addEventListener('beforeunload', saveState);
    
    // Initialize UI
    updateUI();
    
    // Try to auto-play if it was playing
    if (isPlaying && attempted) {
        audio.play().then(() => {
            isPlaying = true;
            updateUI();
        }).catch(error => {
            console.log('Auto-play failed:', error);
            isPlaying = false;
            updateUI();
        });
    }
});

// Add fade animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-10px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);
