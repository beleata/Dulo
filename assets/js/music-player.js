// Simple Music Player
let audio, toggle, icon;
let isPlaying, attempted;

// Play audio with better error handling
function playAudio() {
    const audioInstance = globalAudio || initGlobalAudio();
    
    // Create a user interaction event to enable audio
    const playPromise = audioInstance.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isPlaying = true;
            isGlobalPlaying = true;
            updateUI();
            saveState();
            console.log('Global music started successfully');
        }).catch(error => {
            console.log('Global play failed:', error);
            isPlaying = false;
            isGlobalPlaying = false;
            updateUI();
            
            // Show user-friendly message
            if (error.name === 'NotAllowedError') {
                showMessage('Браузърът блокира автопуска. Натисни бутона отново!');
            } else if (error.name === 'NotSupportedError') {
                showMessage('Аудио форматът не се поддържа');
            } else {
                showMessage('Грешка при възпроизвеждане: ' + error.message);
            }
        });
    }
}

// Update UI
function updateUI() {
    if (!toggle || !icon) return;
    
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

// Save state to both localStorage and sessionStorage
function saveState() {
    const audioInstance = globalAudio || initGlobalAudio();
    const state = {
        isPlaying: isPlaying,
        attempted: attempted,
        currentTime: audioInstance ? audioInstance.currentTime : 0
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('duloMusicState', JSON.stringify(state));
    
    // Save to sessionStorage for tab sharing
    sessionStorage.setItem('duloMusicState', JSON.stringify(state));
}

// Load state from storage
function loadState() {
    try {
        // Try sessionStorage first (for current tab)
        let state = sessionStorage.getItem('duloMusicState');
        if (state) {
            return JSON.parse(state);
        }
        
        // Fallback to localStorage
        state = localStorage.getItem('duloMusicState');
        if (state) {
            return JSON.parse(state);
        }
    } catch (e) {
        console.error('Error loading music state:', e);
    }
    
    return { isPlaying: false, attempted: false, currentTime: 0 };
}

// Show message
function showMessage(text) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.music-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const message = document.createElement('div');
    message.className = 'music-message';
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
        max-width: 300px;
    `;
    message.textContent = text || 'Натисни отново за музика';
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 4000);
}

// Sync state between tabs
function syncState() {
    const state = loadState();
    isPlaying = state.isPlaying;
    attempted = state.attempted;
    
    const audioInstance = globalAudio || initGlobalAudio();
    if (audioInstance && state.currentTime > 0) {
        audioInstance.currentTime = state.currentTime;
    }
    
    updateUI();
}

// Global audio instance that persists across page loads
let globalAudio = null;
let isGlobalPlaying = false;
let globalCurrentTime = 0;

// Initialize global audio
function initGlobalAudio() {
    if (globalAudio) return globalAudio;
    
    globalAudio = new Audio();
    globalAudio.loop = true;
    globalAudio.volume = 0.3;
    globalAudio.preload = 'auto';
    globalAudio.crossOrigin = 'anonymous';
    
    // Set sources - use the existing MP3 file
    globalAudio.src = 'mix_25m03s (audio-joiner.com).mp3';
    
    // Load the audio
    globalAudio.load();
    
    // Add event listeners
    globalAudio.addEventListener('loadeddata', function() {
        console.log('Global audio loaded successfully');
    });
    
    globalAudio.addEventListener('error', function(e) {
        console.error('Global audio error:', e);
    });
    
    globalAudio.addEventListener('ended', function() {
        if (isGlobalPlaying) {
            globalAudio.currentTime = 0;
            globalAudio.play();
        }
    });
    
    return globalAudio;
}

document.addEventListener('DOMContentLoaded', function() {
    audio = document.getElementById('backgroundMusic');
    toggle = document.getElementById('musicToggle');
    icon = document.getElementById('musicIcon');
    
    if (!toggle || !icon) {
        console.warn('Music player elements not found');
        return;
    }
    
    // Initialize global audio
    const globalAudioInstance = initGlobalAudio();
    
    // Hide the local audio element since we're using global one
    if (audio) {
        audio.style.display = 'none';
    }
    
    // Load saved state
    syncState();
    
    // Toggle music
    toggle.addEventListener('click', function() {
        console.log('Music toggle clicked, isPlaying:', isPlaying, 'attempted:', attempted);
        
        if (!attempted) {
            attempted = true;
            saveState();
            playAudio();
        } else {
            if (isPlaying) {
                const audioInstance = globalAudio || initGlobalAudio();
                audioInstance.pause();
                isPlaying = false;
                isGlobalPlaying = false;
                updateUI();
                saveState();
                console.log('Global music paused');
            } else {
                playAudio();
            }
        }
    });
    
    // Handle music end for global audio
    const audioInstance = globalAudio || initGlobalAudio();
    audioInstance.addEventListener('ended', function() {
        audioInstance.currentTime = 0;
        if (isPlaying) {
            playAudio();
        }
    });
    
    // Handle errors for global audio
    audioInstance.addEventListener('error', function(e) {
        console.error('Global audio error:', e);
        const errorCode = audioInstance.error ? audioInstance.error.code : 'unknown';
        console.error('Global audio error code:', errorCode);
        
        icon.textContent = '❌';
        toggle.title = 'Грешка в зареждането на музиката';
        toggle.style.background = 'linear-gradient(45deg, #ff4444, #cc0000)';
        
        let errorMessage = 'Грешка при зареждане на музиката';
        if (errorCode === 1) errorMessage = 'Аудиото е прекъснато';
        else if (errorCode === 2) errorMessage = 'Грешка в мрежата';
        else if (errorCode === 3) errorMessage = 'Аудио файлът е повреден';
        else if (errorCode === 4) errorMessage = 'Аудио форматът не се поддържа';
        
        showMessage(errorMessage);
    });
    
    // Handle load success for global audio
    audioInstance.addEventListener('loadeddata', function() {
        console.log('Global audio loaded successfully, duration:', audioInstance.duration);
    });
    
    // Save current time periodically
    setInterval(() => {
        if (isPlaying && audioInstance && !audioInstance.paused) {
            saveState();
        }
    }, 1000);
    
    // Save state before unload
    window.addEventListener('beforeunload', saveState);
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', function(e) {
        if (e.key === 'duloMusicState') {
            syncState();
            
            // If music should be playing, try to play it
            if (isPlaying && attempted) {
                setTimeout(() => {
                    playAudio();
                }, 100);
            }
        }
    });
    
    // Initialize UI
    updateUI();
    
    // Try to auto-play if it was playing
    if (isPlaying && attempted) {
        // Add a small delay to ensure page is fully loaded
        setTimeout(() => {
            playAudio();
        }, 500);
    }
    
    // Add keyboard shortcut (Space key to toggle)
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            toggle.click();
        }
    });
    
    console.log('Music player initialized');
});

// Add fade animation
const musicStyle = document.createElement('style');
musicStyle.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-10px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
    }
    
    .music-toggle.playing .music-icon {
        animation: pulse 1.5s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(musicStyle);

// Show initial instruction message if music hasn't been attempted yet
setTimeout(() => {
    const state = loadState();
    if (!state.attempted) {
        // Create instruction message
        const instruction = document.createElement('div');
        instruction.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #00ff88;
            padding: 20px 30px;
            border-radius: 10px;
            border: 2px solid #00ff88;
            font-family: 'Orbitron', sans-serif;
            font-size: 1rem;
            z-index: 2000;
            text-align: center;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
            animation: fadeInOut 5s ease-in-out;
        `;
        instruction.innerHTML = `
            <div style="margin-bottom: 15px; font-size: 1.5rem;">🎵</div>
            <div style="margin-bottom: 10px; font-weight: bold;">ДОБРЕ ДОШЛИ В ДУЛО!</div>
            <div style="margin-bottom: 15px;">За да чуете фонова музика, натиснете бутона 🎵 в горния десен ъгъл</div>
            <div style="font-size: 0.8rem; opacity: 0.8;">(Може да използвате и клавиша Space)</div>
        `;
        document.body.appendChild(instruction);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (instruction.parentNode) {
                instruction.parentNode.removeChild(instruction);
            }
        }, 5000);
    }
}, 1000);
