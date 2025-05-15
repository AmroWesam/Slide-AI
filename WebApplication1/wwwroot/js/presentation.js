/**
 * Smart Presentation Platform
 * JavaScript for AI-powered gesture control and speech recognition
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            offset: 100,
            once: true
        });
    }

    // Upload functionality
    initializeUpload();

    // Presentation viewer functionality
    if (document.querySelector('.presentation-viewer-body')) {
        initializePresentationViewer();
    }

    // Feedback form functionality
    if (document.querySelector('.feedback-page')) {
        initializeFeedbackForm();
    }
});

/**
 * Initialize file upload functionality
 */
function initializeUpload() {
    const fileUpload = document.getElementById('file-upload');
    const uploadBox = document.querySelector('.upload-box');
    const uploadProgress = document.querySelector('.upload-progress');
    const uploadSuccess = document.querySelector('.upload-success');
    const progressFill = document.querySelector('.progress-fill');
    const fileName = document.querySelector('.file-name');
    const fileSize = document.querySelector('.file-size');
    const cancelUpload = document.querySelector('.cancel-upload');
    const presentNow = document.querySelector('.present-now');

    if (!fileUpload) return;

    // Drag and drop functionality
    uploadBox.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadBox.classList.add('drag-over');
    });

    uploadBox.addEventListener('dragleave', function() {
        uploadBox.classList.remove('drag-over');
    });

    uploadBox.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadBox.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });

    // File input change
    fileUpload.addEventListener('change', function() {
        if (this.files.length) {
            handleFileUpload(this.files[0]);
        }
    });

    // Cancel upload
    if (cancelUpload) {
        cancelUpload.addEventListener('click', function() {
            resetUpload();
        });
    }

    // Present now button
    if (presentNow) {
        presentNow.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/Home/PresentationViewer';
        });
    }

    function handleFileUpload(file) {
        // Check if file is a PowerPoint
        if (!file.name.match(/\.(ppt|pptx)$/i)) {
            alert('Please upload a PowerPoint file (.ppt or .pptx)');
            return;
        }

        // Show progress UI
        uploadBox.classList.add('hidden');
        uploadProgress.classList.remove('hidden');
        
        // Update file info
        fileName.textContent = file.name;
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        fileSize.textContent = `${fileSizeMB} MB`;

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(function() {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Show success message after a small delay
                setTimeout(function() {
                    uploadProgress.classList.add('hidden');
                    uploadSuccess.classList.remove('hidden');
                }, 500);
            }
            progressFill.style.width = `${progress}%`;
        }, 300);
    }

    function resetUpload() {
        uploadProgress.classList.add('hidden');
        uploadSuccess.classList.add('hidden');
        uploadBox.classList.remove('hidden');
        progressFill.style.width = '0%';
        fileUpload.value = '';
    }

    // Presentation item actions
    const presentBtns = document.querySelectorAll('.present-btn');
    const editBtns = document.querySelectorAll('.edit-btn');
    const deleteBtns = document.querySelectorAll('.delete-btn');

    presentBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            window.location.href = '/Home/PresentationViewer';
        });
    });

    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const presentationItem = this.closest('.presentation-item');
            const title = presentationItem.querySelector('.presentation-title').textContent;
            alert(`Edit presentation: ${title}`);
        });
    });

    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const presentationItem = this.closest('.presentation-item');
            const title = presentationItem.querySelector('.presentation-title').textContent;
            
            if (confirm(`Are you sure you want to delete "${title}"?`)) {
                presentationItem.remove();
            }
        });
    });

    // Toggle view (grid/list)
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const presentationsGrid = document.querySelector('.presentations-grid');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const viewType = this.getAttribute('data-view');
            if (presentationsGrid) {
                if (viewType === 'list') {
                    presentationsGrid.classList.add('list-view');
                } else {
                    presentationsGrid.classList.remove('list-view');
                }
            }
        });
    });
}

/**
 * Initialize the presentation viewer with gesture and voice controls
 */
function initializePresentationViewer() {
    // Elements
    const exitBtn = document.getElementById('exit-presentation');
    const prevSlide = document.getElementById('prev-slide');
    const nextSlide = document.getElementById('next-slide');
    const toggleGesture = document.getElementById('toggle-gesture');
    const toggleVoice = document.getElementById('toggle-voice');
    const toggleFullscreen = document.getElementById('toggle-fullscreen');
    const gestureTutorialModal = document.getElementById('gesture-tutorial-modal');
    const presentationEndModal = document.getElementById('presentation-end-modal');
    const slideContainer = document.getElementById('slide-container');
    const cameraFeed = document.getElementById('camera-feed');
    const slides = document.querySelectorAll('.slide');
    const currentSlideNum = document.getElementById('current-slide');
    const totalSlides = document.getElementById('total-slides');
    const lastCommand = document.getElementById('last-command');
    const gestureIndicator = document.getElementById('gesture-indicator');
    const voiceIndicator = document.getElementById('voice-indicator');
    const pointerHighlight = document.getElementById('pointer-highlight');

    // Tutorial elements
    const tutorialSteps = document.querySelectorAll('.tutorial-step');
    const tutorialPrev = document.querySelector('.tutorial-nav.prev');
    const tutorialNext = document.querySelector('.tutorial-nav.next');
    const tutorialIndicators = document.querySelectorAll('.tutorial-indicators .indicator');
    const startPresentationBtn = document.querySelector('.start-presentation');
    const skipTutorialBtn = document.querySelector('.skip-tutorial');
    const closeModalBtns = document.querySelectorAll('.close-modal');

    // Set up
    let currentSlide = 0;
    let gestureEnabled = true;
    let voiceEnabled = true;
    let currentTutorialStep = 0;
    let zoomLevel = 1;
    
    // Update total slides count
    if (totalSlides) {
        totalSlides.textContent = slides.length;
    }

    // Initialize camera if available
    if (cameraFeed) {
        initializeCamera();
    }

    // Initialize speech recognition if available
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        initializeSpeechRecognition();
    }
    
    // Show tutorial modal (in a real implementation, check if user has seen it before)
    if (gestureTutorialModal) {
        // For demo purposes, setTimeout to show the modal after a brief delay
        setTimeout(() => {
            gestureTutorialModal.classList.remove('hidden');
        }, 1000);
    }

    // Event listeners
    if (exitBtn) {
        exitBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to exit the presentation?')) {
                window.location.href = '/Home/Presentations';
            }
        });
    }

    if (prevSlide) {
        prevSlide.addEventListener('click', () => {
            navigateSlides('prev');
        });
    }

    if (nextSlide) {
        nextSlide.addEventListener('click', () => {
            navigateSlides('next');
        });
    }

    if (toggleGesture) {
        toggleGesture.addEventListener('click', () => {
            gestureEnabled = !gestureEnabled;
            toggleGesture.classList.toggle('active');
            gestureIndicator.classList.toggle('active');
            
            showCommandFeedback(gestureEnabled ? 'Gesture control enabled' : 'Gesture control disabled');
        });
    }

    if (toggleVoice) {
        toggleVoice.addEventListener('click', () => {
            voiceEnabled = !voiceEnabled;
            toggleVoice.classList.toggle('active');
            voiceIndicator.classList.toggle('active');
            
            showCommandFeedback(voiceEnabled ? 'Voice control enabled' : 'Voice control disabled');
        });
    }

    if (toggleFullscreen) {
        toggleFullscreen.addEventListener('click', toggleFullScreenMode);
    }

    // Tutorial navigation
    if (tutorialPrev) {
        tutorialPrev.addEventListener('click', () => {
            if (currentTutorialStep > 0) {
                updateTutorialStep(currentTutorialStep - 1);
            }
        });
    }

    if (tutorialNext) {
        tutorialNext.addEventListener('click', () => {
            if (currentTutorialStep < tutorialSteps.length - 1) {
                updateTutorialStep(currentTutorialStep + 1);
            }
        });
    }

    if (startPresentationBtn) {
        startPresentationBtn.addEventListener('click', () => {
            gestureTutorialModal.classList.add('hidden');
        });
    }

    if (skipTutorialBtn) {
        skipTutorialBtn.addEventListener('click', () => {
            gestureTutorialModal.classList.add('hidden');
        });
    }

    // Close modal buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.add('hidden');
        });
    });

    // End presentation button in end modal
    const returnToDashboardBtn = document.querySelector('.return-to-dashboard');
    if (returnToDashboardBtn) {
        returnToDashboardBtn.addEventListener('click', () => {
            window.location.href = '/Home/Presentations';
        });
    }

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowRight':
            case ' ':
                navigateSlides('next');
                break;
            case 'ArrowLeft':
                navigateSlides('prev');
                break;
            case 'f':
                toggleFullScreenMode();
                break;
            case 'Escape':
                // If in fullscreen, exit fullscreen
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
                break;
        }
    });

    /**
     * Navigate between slides
     */
    function navigateSlides(direction) {
        // Hide current slide
        slides[currentSlide].classList.remove('current-slide');
        
        // Update current slide index
        if (direction === 'next') {
            currentSlide = (currentSlide + 1) % slides.length;
            showCommandFeedback('Next slide');
        } else if (direction === 'prev') {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showCommandFeedback('Previous slide');
        } else if (typeof direction === 'number') {
            if (direction >= 0 && direction < slides.length) {
                currentSlide = direction;
                showCommandFeedback(`Jumped to slide ${direction + 1}`);
            }
        }
        
        // Show new current slide
        slides[currentSlide].classList.add('current-slide');
        
        // Update slide counter
        if (currentSlideNum) {
            currentSlideNum.textContent = currentSlide + 1;
        }
        
        // If last slide reached, show end presentation modal
        if (currentSlide === slides.length - 1) {
            // In real app, maybe wait a few seconds or for user action
            setTimeout(() => {
                if (presentationEndModal) {
                    presentationEndModal.classList.remove('hidden');
                }
            }, 1500);
        }
    }

    /**
     * Show command feedback to the user
     */
    function showCommandFeedback(command) {
        if (!lastCommand) return;
        
        lastCommand.textContent = command;
        lastCommand.parentElement.classList.add('active');
        
        // Clear feedback after a delay
        setTimeout(() => {
            lastCommand.parentElement.classList.remove('active');
        }, 3000);
    }

    /**
     * Update tutorial step
     */
    function updateTutorialStep(step) {
        // Hide all steps
        tutorialSteps.forEach(s => s.classList.remove('active'));
        tutorialIndicators.forEach(i => i.classList.remove('active'));
        
        // Show current step
        tutorialSteps[step].classList.add('active');
        tutorialIndicators[step].classList.add('active');
        
        // Update current step
        currentTutorialStep = step;
        
        // Update navigation buttons
        tutorialPrev.classList.toggle('disabled', step === 0);
        tutorialNext.classList.toggle('disabled', step === tutorialSteps.length - 1);
    }

    /**
     * Toggle fullscreen mode
     */
    function toggleFullScreenMode() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    /**
     * Initialize webcam for gesture detection
     */
    function initializeCamera() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    cameraFeed.srcObject = stream;
                    
                    // In a real implementation, we would initialize the gesture detection here
                    simulateGestureDetection();
                })
                .catch(err => {
                    console.error('Error accessing webcam:', err);
                    gestureEnabled = false;
                    if (toggleGesture) {
                        toggleGesture.classList.remove('active');
                    }
                    if (gestureIndicator) {
                        gestureIndicator.classList.remove('active');
                    }
                    showCommandFeedback('Camera access denied. Gesture control disabled.');
                });
        } else {
            console.error('getUserMedia not supported in this browser');
            gestureEnabled = false;
            if (toggleGesture) {
                toggleGesture.classList.remove('active');
            }
            if (gestureIndicator) {
                gestureIndicator.classList.remove('active');
            }
        }
    }

    /**
     * Initialize speech recognition
     */
    function initializeSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = false;
        
        recognition.onstart = () => {
            if (voiceIndicator) {
                voiceIndicator.classList.add('active');
            }
        };
        
        recognition.onend = () => {
            // Restart if voice control is enabled
            if (voiceEnabled) {
                recognition.start();
            } else {
                if (voiceIndicator) {
                    voiceIndicator.classList.remove('active');
                }
            }
        };
        
        recognition.onresult = (event) => {
            if (!voiceEnabled) return;
            
            const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
            processVoiceCommand(transcript);
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                voiceEnabled = false;
                if (toggleVoice) {
                    toggleVoice.classList.remove('active');
                }
                if (voiceIndicator) {
                    voiceIndicator.classList.remove('active');
                }
                showCommandFeedback('Microphone access denied. Voice control disabled.');
            }
        };
        
        // Start recognition if voice control is enabled
        if (voiceEnabled) {
            try {
                recognition.start();
            } catch (err) {
                console.error('Speech recognition error on start:', err);
            }
        }
    }

    /**
     * Process voice commands
     */
    function processVoiceCommand(command) {
        showCommandFeedback(`Voice: "${command}"`);
        
        if (command.includes('next') || command.includes('forward')) {
            navigateSlides('next');
        } else if (command.includes('previous') || command.includes('back')) {
            navigateSlides('prev');
        } else if (command.includes('first slide')) {
            navigateSlides(0);
        } else if (command.includes('last slide')) {
            navigateSlides(slides.length - 1);
        } else if (command.match(/slide\s+(\d+)/)) {
            const slideNum = parseInt(command.match(/slide\s+(\d+)/)[1]);
            if (slideNum > 0 && slideNum <= slides.length) {
                navigateSlides(slideNum - 1);
            }
        } else if (command.includes('zoom in')) {
            zoomIn();
        } else if (command.includes('zoom out')) {
            zoomOut();
        } else if (command.includes('reset zoom')) {
            resetZoom();
        } else if (command.includes('end') || command.includes('exit')) {
            if (confirm('Are you sure you want to end the presentation?')) {
                window.location.href = '/Home/Presentations';
            }
        }
    }

    /**
     * Zoom functions
     */
    function zoomIn() {
        if (zoomLevel < 2) {
            zoomLevel += 0.1;
            updateZoom();
            showCommandFeedback('Zooming in');
        }
    }
    
    function zoomOut() {
        if (zoomLevel > 0.5) {
            zoomLevel -= 0.1;
            updateZoom();
            showCommandFeedback('Zooming out');
        }
    }
    
    function resetZoom() {
        zoomLevel = 1;
        updateZoom();
        showCommandFeedback('Zoom reset');
    }
    
    function updateZoom() {
        const currentSlideElement = slides[currentSlide];
        if (currentSlideElement) {
            const img = currentSlideElement.querySelector('img');
            if (img) {
                img.style.transform = `scale(${zoomLevel})`;
            }
        }
    }

    /**
     * Simulate gesture detection (for demo purposes)
     * In a real implementation, this would use a computer vision library
     */
    function simulateGestureDetection() {
        // This is a placeholder for actual gesture detection
        // In a real implementation, we would use MediaPipe, TensorFlow.js or similar
        
        // For demonstration purposes, simulate random gestures occasionally
        let lastGestureTime = 0;
        
        function simulateRandomGesture() {
            if (!gestureEnabled) return;
            
            const now = Date.now();
            // Don't simulate gestures too frequently
            if (now - lastGestureTime < 8000) return;
            
            // Only simulate a gesture occasionally
            if (Math.random() > 0.3) return;
            
            lastGestureTime = now;
            
            const gesture = ['swipe-left', 'swipe-right', 'pinch', 'point'][Math.floor(Math.random() * 4)];
            
            switch (gesture) {
                case 'swipe-left':
                    navigateSlides('next');
                    showCommandFeedback('Gesture: Swipe Left (Next Slide)');
                    break;
                case 'swipe-right':
                    navigateSlides('prev');
                    showCommandFeedback('Gesture: Swipe Right (Previous Slide)');
                    break;
                case 'pinch':
                    if (Math.random() > 0.5) {
                        zoomIn();
                        showCommandFeedback('Gesture: Pinch Out (Zoom In)');
                    } else {
                        zoomOut();
                        showCommandFeedback('Gesture: Pinch In (Zoom Out)');
                    }
                    break;
                case 'point':
                    simulatePointerHighlight();
                    showCommandFeedback('Gesture: Pointing');
                    break;
            }
        }
        
        // Periodically check if we should simulate a gesture
        setInterval(simulateRandomGesture, 2000);
    }
    
    /**
     * Simulate pointer highlight effect
     */
    function simulatePointerHighlight() {
        if (!pointerHighlight || !slideContainer) return;
        
        pointerHighlight.classList.remove('hidden');
        
        // Random position within the slide container
        const containerRect = slideContainer.getBoundingClientRect();
        const x = Math.random() * (containerRect.width - 100) + 50;
        const y = Math.random() * (containerRect.height - 100) + 50;
        
        pointerHighlight.style.left = `${x}px`;
        pointerHighlight.style.top = `${y}px`;
        
        // Hide after a few seconds
        setTimeout(() => {
            pointerHighlight.classList.add('hidden');
        }, 3000);
    }
}

/**
 * Initialize feedback form
 */
function initializeFeedbackForm() {
    const feedbackForm = document.getElementById('feedback-form');
    const feedbackSuccess = document.getElementById('feedback-success');
    
    if (!feedbackForm) return;
    
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real implementation, we would validate and send the data
        // For demo purposes, just show success message
        feedbackForm.classList.add('hidden');
        if (feedbackSuccess) {
            feedbackSuccess.classList.remove('hidden');
        }
    });
    
    // Initialize star ratings
    const ratingGroups = document.querySelectorAll('.rating-stars');
    
    ratingGroups.forEach(group => {
        const labels = group.querySelectorAll('label');
        
        labels.forEach(label => {
            label.addEventListener('mouseover', function() {
                // Reset all stars
                labels.forEach(l => l.classList.remove('active'));
                
                // Highlight stars up to current
                let sibling = this;
                while (sibling) {
                    sibling.classList.add('active');
                    sibling = sibling.nextElementSibling;
                }
            });
            
            group.addEventListener('mouseleave', function() {
                // Remove highlight effect
                labels.forEach(l => l.classList.remove('active'));
                
                // Re-apply based on selected rating
                const checkedInput = group.querySelector('input:checked');
                if (checkedInput) {
                    let sibling = checkedInput.nextElementSibling;
                    while (sibling) {
                        sibling.classList.add('active');
                        sibling = sibling.nextElementSibling;
                    }
                }
            });
        });
    });
}
