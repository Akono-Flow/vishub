 document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const fileInput = document.getElementById('fileInput');
            const uploadIcon = document.getElementById('uploadIcon');
            const dropZone = document.getElementById('dropZone');
            const imagesContainer = document.getElementById('imagesContainer');
            const generateButton = document.getElementById('generateButton');
            const emptyState = document.getElementById('emptyState');
            const autoAdvanceButton = document.getElementById('autoAdvanceButton');
            const autoAdvanceDelay = document.getElementById('autoAdvanceDelay');
            const knowledgeFilter = document.getElementById('knowledgeFilter');
            const allCount = document.getElementById('allCount');
            const knownCount = document.getElementById('knownCount');
            const unknownCount = document.getElementById('unknownCount');
            const notInteractedCount = document.getElementById('notInteractedCount');
            
            // Quiz Elements
            const quizButton = document.getElementById('quizButton');
            const quizPanel = document.getElementById('quizPanel');
            const closeQuiz = document.getElementById('closeQuiz');
            const quizShuffleButton = document.getElementById('quizShuffleButton');
            const quizTimerButton = document.getElementById('quizTimerButton');
            const quizFullscreenButton = document.getElementById('quizFullscreenButton');
            const quizSlide = document.getElementById('quizSlide');
            const quizImage = document.getElementById('quizImage');
            const quizTimer = document.getElementById('quizTimer');
            const prevQuizSlide = document.getElementById('prevQuizSlide');
            const nextQuizSlide = document.getElementById('nextQuizSlide');
            const addScoreButton = document.getElementById('addScoreButton');
            const quizPlayers = document.getElementById('quizPlayers');
            const newPlayerName = document.getElementById('newPlayerName');
            const addPlayerButton = document.getElementById('addPlayerButton');
            const leaderboardTable = document.getElementById('leaderboardTable');
            const leaderboardBody = document.getElementById('leaderboardBody');
            const timerDuration = document.getElementById('timerDuration');
            const maxScore = document.getElementById('maxScore');
            const gameOverModal = document.getElementById('gameOverModal');
            const gameOverWinner = document.getElementById('gameOverWinner');
            const restartQuizButton = document.getElementById('restartQuizButton');
            
            // Settings Panel
            const settingsButton = document.getElementById('settingsButton');
            const settingsPanel = document.getElementById('settingsPanel');
            const closeSettings = document.getElementById('closeSettings');
            
            // Modal
            const modalOverlay = document.getElementById('modalOverlay');
            const closeModal = document.getElementById('closeModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalMessage = document.getElementById('modalMessage');
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');
            
            // Preview Panel
            const previewButton = document.getElementById('previewButton');
            const previewPanel = document.getElementById('previewPanel');
            const closePreview = document.getElementById('closePreview');
            const prevSlide = document.getElementById('prevSlide');
            const nextSlide = document.getElementById('nextSlide');
            const previewSlide = document.getElementById('previewSlide');
            const previewImage = document.getElementById('previewImage');
            const previewText = document.getElementById('previewText');
            const slideIndicator = document.getElementById('slideIndicator');
            const fullscreenButton = document.getElementById('fullscreenButton');
            const exportJsonButton = document.getElementById('exportJsonButton');
            const importJsonButton = document.getElementById('importJsonButton');
            
            // Help Button
            const helpButton = document.getElementById('helpButton');
            
            // Storage for images
            let images = [];
            let filteredImages = [];
            let currentPreviewIndex = 0;
            let autoAdvanceTimer = null;
            let isAutoAdvancing = false;
            let countdownValue = 0;
            let knowledgeCheckbox = document.getElementById('knowledgeCheckbox');
            let activeKnowledgeFilter = 'all';
            
            // Quiz variables
            let quizImages = [];
            let currentQuizIndex = 0;
            let quizTimerInterval = null;
            let isQuizTimerRunning = false;
            let quizPlayersList = [];
            let activePlayer = null;
            let quizTimerValue = 30;
            
            // Settings
            const settings = {
                slideSize: '4:3',
                slideTheme: 'light',
                titleSlide: true,
                textFont: 'Helvetica',
                textSize: 24,
                boldText: false,
                imageSize: 'custom',
                imageBorder: false,
                imageShadow: true
            };
            
            // Initialize
            init();
            
            function init() {
                // Check if browser supports FileReader API
                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    setupEventListeners();
                    updateEmptyState();
                    updateKnowledgeFilterCounts();
                    initializeSettings(); // Add this line
                } else {
                    alert('Your browser does not support the File APIs needed for this app.');
                }
            }
            
            // Add this new function
            function initializeSettings() {
                // Initialize all form elements with the default settings values
                Object.entries(settings).forEach(([key, value]) => {
                    const element = document.getElementById(key);
                    if (element) {
                        if (element.type === 'checkbox') {
                            element.checked = value;
                        } else if (element.type === 'range') {
                            element.value = value;
                        } else {
                            element.value = value;
                        }
                    }
                });
            }
            
            function setupEventListeners() {
                // File input events
                uploadIcon.addEventListener('click', () => fileInput.click());
                fileInput.addEventListener('change', handleFileSelect);
                
                // Drag and drop events
                dropZone.addEventListener('dragover', handleDragOver);
                dropZone.addEventListener('dragleave', handleDragLeave);
                dropZone.addEventListener('drop', handleDrop);
                
                // Generate button
                generateButton.addEventListener('click', handleGenerate);
                
                // Settings panel
                settingsButton.addEventListener('click', () => settingsPanel.classList.add('active'));
                closeSettings.addEventListener('click', () => settingsPanel.classList.remove('active'));
                
                // Modal
                closeModal.addEventListener('click', () => {
                    modalOverlay.classList.remove('active');
                });
                
                // Preview panel
                previewButton.addEventListener('click', openPreview);
                closePreview.addEventListener('click', closePreviewPanel);
                previewSlide.addEventListener('click', togglePreviewText);
                prevSlide.addEventListener('click', showPreviousSlide);
                nextSlide.addEventListener('click', showNextSlide);
                fullscreenButton.addEventListener('click', toggleFullscreen);
                
                // Quiz panel
                quizButton.addEventListener('click', openQuiz);
                closeQuiz.addEventListener('click', closeQuizPanel);
                quizShuffleButton.addEventListener('click', shuffleQuizImages);
                quizTimerButton.addEventListener('click', toggleQuizTimer);
                quizFullscreenButton.addEventListener('click', toggleQuizFullscreen);
                quizImportButton.addEventListener('click', importQuizState);
                quizExportButton.addEventListener('click', exportQuizState);
                prevQuizSlide.addEventListener('click', showPreviousQuizSlide);
                nextQuizSlide.addEventListener('click', showNextQuizSlide);
                addScoreButton.addEventListener('click', addScore);
                addPlayerButton.addEventListener('click', addNewPlayer);
                restartQuizButton.addEventListener('click', restartQuiz);
                
                // Knowledge checkbox
                knowledgeCheckbox.addEventListener('change', handleKnowledgeChange);
                
                // Knowledge filter options
                document.querySelectorAll('.knowledge-filter-option').forEach(option => {
                    option.addEventListener('click', function() {
                        const state = this.dataset.state;
                        setActiveKnowledgeFilter(state);
                    });
                });
                
                // Keyboard navigation for preview
                document.addEventListener('keydown', handleKeyboardNavigation);
                
                // Help button
                helpButton.addEventListener('click', showHelp);
                
                // Set up drag and drop for image reordering
                imagesContainer.addEventListener('dragstart', handleDragStart);
                imagesContainer.addEventListener('dragover', handleImageDragOver);
                imagesContainer.addEventListener('drop', handleImageDrop);
                imagesContainer.addEventListener('dragend', handleDragEnd);
                
                // Settings change events
                document.querySelectorAll('#settingsPanel select, #settingsPanel input').forEach(element => {
                    element.addEventListener('change', updateSettings);
                });
                
                // Export buttons
                exportJsonButton.addEventListener('click', exportAsJson);
                
                // Import button
                importJsonButton.addEventListener('click', () => {
                    // Create a hidden file input for JSON import
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.json';
                    input.style.display = 'none';
                    document.body.appendChild(input);
                    
                    input.addEventListener('change', handleJsonImport);
                    input.click();
                    
                    // Cleanup
                    setTimeout(() => {
                        document.body.removeChild(input);
                    }, 100);
                });
                
                // Auto-advance button
                autoAdvanceButton.addEventListener('click', toggleAutoAdvance);

                // Add keyboard event listener for quiz mode
                document.addEventListener('keydown', function(e) {
                    if (quizPanel.classList.contains('active')) {
                        switch(e.key.toLowerCase()) {
                            case 'b':
                                e.preventDefault();
                                toggleQuizBlackscreen();
                                break;
                            case 'w':
                                e.preventDefault();
                                toggleQuizWhitescreen();
                                break;
                            case ' ':
                                e.preventDefault();
                                toggleQuizText();
                                break;
                        }
                    }
                });
            }
            
            // Quiz functions
            function openQuiz() {
                if (images.length === 0) {
                    showModal('No Images', 'Please add some images before starting the quiz.', false);
                    return;
                }
                quizPanel.classList.add('active');
                document.body.style.overflow = 'hidden';
                quizImages = [...images];
                currentQuizIndex = 0;
                showCurrentQuizSlide();
                updateLeaderboard();
                // Enable whitescreen by default
                const currentSlide = document.querySelector('.quiz-slide');
                if (currentSlide) {
                    currentSlide.classList.add('overlay-white');
                }
            }
            
            function closeQuizPanel() {
                quizPanel.classList.remove('active');
                
                // Stop timer if running
                if (isQuizTimerRunning) {
                    toggleQuizTimer();
                }
            }
            
            function showCurrentQuizSlide() {
                const currentImage = quizImages[currentQuizIndex];
                const quizImage = document.getElementById('quizImage');
                const quizText = document.getElementById('quizText');
                
                quizImage.src = currentImage.src;
                quizImage.alt = currentImage.name;
                
                // Update text content to include description if it exists
                quizText.innerHTML = `
                    <div class="quiz-name">${currentImage.name}</div>
                    ${currentImage.description ? `<div class="quiz-description">${currentImage.description}</div>` : ''}
                `;
                
                // Update timer display
                updateQuizTimerDisplay();
            }
            
            function showNextQuizSlide() {
                if (currentQuizIndex < quizImages.length - 1) {
                    currentQuizIndex++;
                } else {
                    currentQuizIndex = 0;
                }
                showCurrentQuizSlide();
                
                // Reset timer
                resetQuizTimer();
            }
            
            function showPreviousQuizSlide() {
                if (currentQuizIndex > 0) {
                    currentQuizIndex--;
                } else {
                    currentQuizIndex = quizImages.length - 1;
                }
                showCurrentQuizSlide();
                
                // Reset timer
                resetQuizTimer();
            }
            
            function shuffleQuizImages() {
                // Create a copy of the quiz images array
                const shuffledImages = [...quizImages];
                
                // Fisher-Yates shuffle algorithm
                for (let i = shuffledImages.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
                }
                
                // Update the quiz images array with the shuffled version
                quizImages = shuffledImages;
                
                // Reset to first image and update the quiz
                currentQuizIndex = 0;
                showCurrentQuizSlide();
                
                // Reset timer
                resetQuizTimer();
            }
            
            function toggleQuizTimer() {
                isQuizTimerRunning = !isQuizTimerRunning;
                
                if (isQuizTimerRunning) {
                    startQuizTimer();
                    quizTimerButton.classList.remove('fa-play');
                    quizTimerButton.classList.add('fa-pause');
                } else {
                    stopQuizTimer();
                    quizTimerButton.classList.remove('fa-pause');
                    quizTimerButton.classList.add('fa-play');
                }
            }
            
            function startQuizTimer() {
                if (quizTimerInterval) {
                    clearInterval(quizTimerInterval);
                }
                
                quizTimerValue = parseInt(timerDuration.value);
                updateQuizTimerDisplay();
                quizTimer.classList.add('active');
                
                quizTimerInterval = setInterval(() => {
                    quizTimerValue--;
                    updateQuizTimerDisplay();
                    
                    if (quizTimerValue <= 0) {
                        stopQuizTimer();
                        quizTimerButton.classList.remove('fa-pause');
                        quizTimerButton.classList.add('fa-play');
                    }
                }, 1000);
            }
            
            function stopQuizTimer() {
                if (quizTimerInterval) {
                    clearInterval(quizTimerInterval);
                    quizTimerInterval = null;
                }
                
                isQuizTimerRunning = false;
            }
            
            function resetQuizTimer() {
                stopQuizTimer();
                quizTimerValue = parseInt(timerDuration.value);
                updateQuizTimerDisplay();
                quizTimer.classList.remove('active', 'warning', 'danger');
                quizTimerButton.classList.remove('fa-pause');
                quizTimerButton.classList.add('fa-play');
            }
            
            function updateQuizTimerDisplay() {
                quizTimer.textContent = quizTimerValue;
                
                // Update timer color based on remaining time
                quizTimer.classList.remove('warning', 'danger');
                
                if (quizTimerValue <= 5) {
                    quizTimer.classList.add('danger');
                } else if (quizTimerValue <= 10) {
                    quizTimer.classList.add('warning');
                }
            }
            
            function toggleQuizFullscreen() {
                if (!document.fullscreenElement) {
                    quizPanel.requestFullscreen().catch(err => {
                        console.error('Error attempting to enable fullscreen:', err);
                    });
                } else {
                    document.exitFullscreen();
                }
            }
            
            function addNewPlayer() {
                const playerName = newPlayerName.value.trim();
                
                if (playerName === '') {
                    return;
                }
                
                // Check if player already exists
                if (quizPlayersList.some(player => player.name === playerName)) {
                    showModal('Player Exists', 'A player with this name already exists.', false);
                    return;
                }
                
                // Add new player
                const newPlayer = {
                    id: generateUniqueId(),
                    name: playerName,
                    score: 0
                };
                
                quizPlayersList.push(newPlayer);
                
                // Clear input
                newPlayerName.value = '';
                
                // Update UI
                renderQuizPlayers();
                updateLeaderboard();
            }
            
            function renderQuizPlayers() {
                quizPlayers.innerHTML = '';
                
                quizPlayersList.forEach(player => {
                    const playerElement = document.createElement('div');
                    playerElement.className = 'quiz-player';
                    playerElement.id = `player-${player.id}`;
                    
                    if (activePlayer && activePlayer.id === player.id) {
                        playerElement.classList.add('active');
                    }
                    
                    playerElement.innerHTML = `
                        <span>${player.name}</span>
                        <span class="quiz-player-score">${player.score}</span>
                    `;
                    
                    playerElement.addEventListener('click', () => {
                        selectPlayer(player);
                    });
                    
                    quizPlayers.appendChild(playerElement);
                });
                
                // Update add score button state
                addScoreButton.disabled = !activePlayer;
            }
            
            function selectPlayer(player) {
                activePlayer = player;
                
                // Update UI
                document.querySelectorAll('.quiz-player').forEach(el => {
                    el.classList.remove('active');
                });
                
                document.getElementById(`player-${player.id}`).classList.add('active');
                
                // Enable add score button
                addScoreButton.disabled = false;
            }
            
            function addScore() {
                if (!activePlayer) {
                    return;
                }
                
                // Increment player score
                activePlayer.score++;
                
                // Update UI
                renderQuizPlayers();
                updateLeaderboard();
                
                // Check if player has reached max score
                const maxScoreValue = parseInt(maxScore.value);
                if (activePlayer.score >= maxScoreValue) {
                    showGameOver(activePlayer);
                }
            }
            
            function updateLeaderboard() {
                // Sort players by score (descending)
                const sortedPlayers = [...quizPlayersList].sort((a, b) => b.score - a.score);
                
                // Clear leaderboard
                leaderboardBody.innerHTML = '';
                
                // Add players to leaderboard
                sortedPlayers.forEach((player, index) => {
                    const row = document.createElement('tr');
                    
                    // Add winner class if player has reached max score
                    if (player.score >= parseInt(maxScore.value)) {
                        row.classList.add('winner');
                    }
                    
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${player.name}</td>
                        <td>${player.score}</td>
                    `;
                    
                    leaderboardBody.appendChild(row);
                });
            }
            
            function showGameOver(winner) {
                gameOverWinner.textContent = `${winner.name} wins with ${winner.score} points!`;
                gameOverModal.classList.add('active');
                
                // Stop timer if running
                if (isQuizTimerRunning) {
                    toggleQuizTimer();
                }
            }
            
            function restartQuiz() {
                // Reset game over modal
                gameOverModal.classList.remove('active');
                
                // Reset player scores
                quizPlayersList.forEach(player => {
                    player.score = 0;
                });
                
                // Reset active player
                activePlayer = null;
                
                // Update UI
                renderQuizPlayers();
                updateLeaderboard();
                
                // Reset quiz state
                currentQuizIndex = 0;
                showCurrentQuizSlide();
                resetQuizTimer();
            }
            
            // Set active knowledge filter
            function setActiveKnowledgeFilter(state) {
                // Update active filter
                activeKnowledgeFilter = state;
                
                // Update UI
                document.querySelectorAll('.knowledge-filter-option').forEach(option => {
                    option.classList.remove('active');
                    if (option.dataset.state === state) {
                        option.classList.add('active');
                    }
                });
                
                // Filter images
                filterImages();
                
                // Update UI
                renderFilteredImages();
                updateEmptyState();
                updateGenerateButton();
            }
            
            function filterImages() {
                if (activeKnowledgeFilter === 'all') {
                    filteredImages = [...images];
                } else {
                    const state = parseInt(activeKnowledgeFilter);
                    filteredImages = images.filter(image => image.knowledge === state);
                }
            }
            
            function updateKnowledgeFilterCounts() {
                const known = images.filter(img => img.knowledge === 1).length;
                const unknown = images.filter(img => img.knowledge === 0).length;
                const notInteracted = images.filter(img => img.knowledge === -1).length;
                const all = images.length;
                
                knownCount.textContent = known;
                unknownCount.textContent = unknown;
                notInteractedCount.textContent = notInteracted;
                allCount.textContent = all;
            }
            
            function renderFilteredImages() {
                // Clear container
                imagesContainer.innerHTML = '';
                
                // Render filtered images
                filteredImages.forEach(image => {
                    renderImageCard(image);
                });
            }
            
            function handleFileSelect(event) {
                const files = event.target.files;
                processFiles(files);
            }
            
            function handleDragOver(event) {
                event.preventDefault();
                event.stopPropagation();
                dropZone.classList.add('dragover');
            }
            
            function handleDragLeave(event) {
                event.preventDefault();
                event.stopPropagation();
                dropZone.classList.remove('dragover');
            }
            
            function handleDrop(event) {
                event.preventDefault();
                event.stopPropagation();
                dropZone.classList.remove('dragover');
                
                const dt = event.dataTransfer;
                const files = dt.files;
                
                processFiles(files);
            }
            
            function processFiles(files) {
                const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
                
                if (validFiles.length === 0) {
                    showModal('Error', 'No valid image files found. Please upload images only.', false);
                    return;
                }
                
                // Process each file
                validFiles.forEach(file => {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        const image = {
                            id: generateUniqueId(),
                            name: getFilenameWithoutExtension(file.name),
                            file: file,
                            src: e.target.result,
                            size: formatFileSize(file.size),
                            knowledge: -1 // Default state: not interacted with
                        };
                        
                        images.push(image);
                        filterImages();
                        renderFilteredImages();
                        updateEmptyState();
                        updateGenerateButton();
                        updateKnowledgeFilterCounts();
                    };
                    
                    reader.readAsDataURL(file);
                });
            }
            
            function getFilenameWithoutExtension(filename) {
                return filename.replace(/\.[^/.]+$/, "");
            }
            
            function formatFileSize(bytes) {
                if (bytes < 1024) return bytes + ' bytes';
                else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
                else return (bytes / 1048576).toFixed(1) + ' MB';
            }
            
            function generateUniqueId() {
                return 'img-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            }

            // Add these helper functions for knowledge state
            function getKnowledgeClass(knowledge) {
                switch (knowledge) {
                    case 1:
                        return 'known';
                    case 0:
                        return 'unknown';
                    default:
                        return 'not-interacted';
                }
            }

            function getKnowledgeIcon(knowledge) {
                switch (knowledge) {
                    case 1:
                        return 'fa-check-circle';
                    case 0:
                        return 'fa-times-circle';
                    default:
                        return 'fa-question-circle';
                }
            }
            
            function renderImageCard(image) {
                const card = document.createElement('div');
                card.className = 'image-card';
                card.id = image.id;
                card.draggable = true;
                
                card.innerHTML = `
                    <div class="image-preview">
                        <img src="${image.src}" alt="${image.name}">
                        <div class="image-overlay">
                            <div class="image-actions">
                                <div class="image-action-icon delete" title="Delete Image">
                                    <i class="fas fa-trash"></i>
                                </div>
                                <div class="image-action-icon edit" title="${image.description ? 'Edit Description' : 'Add Description'}">
                                    <i class="fas fa-pencil-alt"></i>
                                </div>
                            </div>
                        </div>
                        <div class="knowledge-indicator ${getKnowledgeClass(image.knowledge)}">
                            <i class="fas ${getKnowledgeIcon(image.knowledge)}"></i>
                        </div>
                    </div>
                    <div class="image-info">
                        <div class="image-name">${image.name}</div>
                        ${image.description ? `<div class="image-description">${image.description}</div>` : ''}
                        <div class="image-size">${image.size || ''}</div>
                    </div>
                `;
                
                // Add event listeners
                card.querySelector('.delete').addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteImage(image.id);
                });
                
                card.querySelector('.edit').addEventListener('click', (e) => {
                    e.stopPropagation();
                    showDescriptionModal(image);
                });
                
                // Add drag and drop event listeners
                card.addEventListener('dragstart', handleDragStart);
                card.addEventListener('dragend', handleDragEnd);
                
                // Add the card to the container
                imagesContainer.appendChild(card);
                
                return card;
            }
            
            function deleteImage(id) {
                images = images.filter(image => image.id !== id);
                filterImages();
                renderFilteredImages();
                updateEmptyState();
                updateGenerateButton();
                updateKnowledgeFilterCounts();
            }
            
            function updateEmptyState() {
                if (images.length === 0) {
                    emptyState.style.display = 'block';
                    imagesContainer.style.display = 'none';
                } else {
                    emptyState.style.display = 'none';
                    imagesContainer.style.display = 'grid';
                }
            }
            
            function updateGenerateButton() {
                if (images.length > 0) {
                    generateButton.classList.remove('disabled');
                } else {
                    generateButton.classList.add('disabled');
                }
            }
            
            // Drag and drop reordering
            let draggedItem = null;
            
            function handleDragStart(event) {
                if (!event.target.classList.contains('image-card')) return;
                
                draggedItem = event.target;
                event.target.classList.add('dragging');
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/html', event.target.innerHTML);
            }
            
            function handleImageDragOver(event) {
                event.preventDefault();
                if (!event.target.closest('.image-card')) return;
                
                const targetCard = event.target.closest('.image-card');
                const boundingRect = targetCard.getBoundingClientRect();
                const mouseX = event.clientX;
                const cardCenterX = boundingRect.left + (boundingRect.width / 2);
                
                if (draggedItem !== targetCard) {
                    if (mouseX < cardCenterX) {
                        imagesContainer.insertBefore(draggedItem, targetCard);
                    } else {
                        imagesContainer.insertBefore(draggedItem, targetCard.nextSibling);
                    }
                }
            }
            
            function handleImageDrop(event) {
                event.preventDefault();
                updateImagesOrder();
            }
            
            function handleDragEnd() {
                if (draggedItem) {
                    draggedItem.classList.remove('dragging');
                    draggedItem = null;
                    updateImagesOrder();
                }
            }
            
            function updateImagesOrder() {
                const imageCards = Array.from(document.querySelectorAll('.image-card'));
                const newOrder = [];
                
                imageCards.forEach((card, index) => {
                    card.dataset.index = index;
                    const imageId = card.id;
                    const image = images.find(img => img.id === imageId);
                    if (image) {
                        newOrder.push(image);
                    }
                });
                
                // Update the filtered images order
                const filteredIds = filteredImages.map(img => img.id);
                const newFilteredOrder = newOrder.filter(img => filteredIds.includes(img.id));
                
                // Update the main images array
                images = newOrder;
                
                // Update the filtered images array
                filteredImages = newFilteredOrder;
            }
            
            // Settings functions
            function updateSettings(event) {
                const element = event.target;
                const setting = element.id;
                
                if (element.type === 'checkbox') {
                    settings[setting] = element.checked;
                } else if (element.type === 'range') {
                    settings[setting] = parseInt(element.value);
                } else {
                    settings[setting] = element.value;
                }
            }
            
            // Variable to track progress interval
            let progressInterval;

            // Add timestamp generation function
            function generateTimestamp() {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');
                
                return `${year}${month}${day}_${hours}${minutes}${seconds}`;
            }
            // -------------------------------------------------------------------------------------------------------------
            // Generate PowerPoint
            // function handleGenerate() {
            //     if (images.length === 0 || generateButton.classList.contains('disabled')) {
            //         return;
            //     }
                
            //     showModal('Generating Presentation', 'Please wait while we generate your presentation...', true);
                
            //     // Get the filtered images based on current knowledge filter
            //     const imagesToUse = activeKnowledgeFilter === 'all' ? images : filteredImages;
                
            //     // Simulate progress
            //     let progress = 0;
            //     const totalSteps = imagesToUse.length + 2; // images + title slide + finalizing
            //     progressInterval = setInterval(() => {
            //         progress++;
            //         updateProgress(progress, totalSteps);
                    
            //         if (progress === totalSteps) {
            //             clearInterval(progressInterval);
            //         }
            //     }, 1000);
                
            //     // Start generating PowerPoint
            //     setTimeout(() => {
            //         // Create new PowerPoint presentation
            //         const pptx = new window.PptxGenJS();
                    
            //         // Set slide size
            //         if (settings.slideSize === '16:9') {
            //             pptx.layout = 'LAYOUT_16x9';
            //         } else {
            //             pptx.layout = 'LAYOUT_4x3';
            //         }
                    
            //         // Create title slide if enabled
            //         if (settings.titleSlide) {
            //             const titleSlide = pptx.addSlide();
                        
            //             // Set background based on theme
            //             if (settings.slideTheme === 'dark') {
            //                 titleSlide.background = { color: '121212' };
            //             } else if (settings.slideTheme === 'light') {
            //                 titleSlide.background = { color: 'FFFFFF' };
            //             } else if (settings.slideTheme === 'gradient') {
            //                 titleSlide.background = { 
            //                     type: 'gradient',
            //                     color: '121212',
            //                     color2: '3D3D3D',
            //                     angle: 45
            //                 };
            //             }
                        
            //             // Add title
            //             titleSlide.addText('Image Presentation', {
            //                 x: '10%',
            //                 y: '40%',
            //                 w: '80%',
            //                 h: '20%',
            //                 fontSize: 44,
            //                 color: settings.slideTheme === 'light' ? '121212' : 'FFFFFF',
            //                 fontFace: settings.textFont,
            //                 bold: true,
            //                 align: 'center'
            //             });
                        
            //             // Add subtitle with current date and filter info
            //             const today = new Date();
            //             const dateStr = today.toLocaleDateString();
            //             let filterInfo = '';
            //             if (activeKnowledgeFilter !== 'all') {
            //                 filterInfo = `\nFiltered: ${activeKnowledgeFilter === '1' ? 'Known Images' : 
            //                               activeKnowledgeFilter === '0' ? 'Unknown Images' : 
            //                               'Not Interacted Images'}`;
            //             }
            //             titleSlide.addText(`Created on ${dateStr}${filterInfo}`, {
            //                 x: '10%',
            //                 y: '60%',
            //                 w: '80%',
            //                 h: '10%',
            //                 fontSize: 20,
            //                 color: settings.slideTheme === 'light' ? '333333' : 'CCCCCC',
            //                 fontFace: settings.textFont,
            //                 align: 'center'
            //             });
            //         }
                    
            //         // Create slides for filtered images
            //         imagesToUse.forEach((image, index) => {
            //             const slide = pptx.addSlide();
                        
            //             // Set background based on theme
            //             if (settings.slideTheme === 'dark') {
            //                 slide.background = { color: '121212' };
            //             } else if (settings.slideTheme === 'light') {
            //                 slide.background = { color: 'FFFFFF' };
            //             } else if (settings.slideTheme === 'gradient') {
            //                 slide.background = { 
            //                     type: 'gradient',
            //                     color: '121212',
            //                     color2: '3D3D3D',
            //                     angle: 45
            //                 };
            //             }
                        
            //             // Add image with options
            //             const imageOptions = {
            //                 data: image.src,
            //                 x: '15%',
            //                 y: '15%',
            //                 w: '70%',
            //                 h: '60%'
            //             };
                        
            //             if (settings.imageSize === 'fill') {
            //                 imageOptions.sizing = { type: 'cover' };
            //             } else if (settings.imageSize === 'fit') {
            //                 imageOptions.sizing = { type: 'contain' };
            //             }
                        
            //             // Add border if enabled
            //             if (settings.imageBorder) {
            //                 imageOptions.line = { color: 'FF1493', width: 2 };
            //             }
                        
            //             // Add shadow if enabled
            //             if (settings.imageShadow) {
            //                 imageOptions.shadow = {
            //                     type: 'outer',
            //                     angle: 45,
            //                     blur: 5,
            //                     offset: 3,
            //                     color: '000000',
            //                     opacity: 0.5
            //                 };
            //             }
                        
            //             slide.addImage(imageOptions);
                        
            //             // Add textbox with image name
            //             slide.addText(image.name, {
            //                 x: '15%',
            //                 y: '75%',
            //                 w: '70%',
            //                 h: '10%',
            //                 fontSize: settings.textSize,
            //                 fontFace: settings.textFont,
            //                 color: settings.slideTheme === 'light' ? '121212' : 'FFFFFF',
            //                 bold: settings.boldText,
            //                 align: 'center',
            //                 valign: 'middle',
            //                 line: { color: 'FF1493', width: 1 },
            //                 fill: { color: settings.slideTheme === 'light' ? 'F0F0F0' : '252525' },
            //                 shadow: { type: 'outer', angle: 45, blur: 3, offset: 2, color: '000000', opacity: 0.3 }
            //             });

            //             // Add description if it exists
            //             if (image.description) {
            //                 slide.addText(image.description, {
            //                     x: '15%',
            //                     y: '85%',
            //                     w: '70%',
            //                     h: '10%',
            //                     fontSize: settings.textSize * 0.8,
            //                     fontFace: settings.textFont,
            //                     color: settings.slideTheme === 'light' ? '666666' : 'CCCCCC',
            //                     align: 'center',
            //                     valign: 'middle',
            //                     line: { color: 'FF1493', width: 1 },
            //                     fill: { color: settings.slideTheme === 'light' ? 'F0F0F0' : '252525' },
            //                     shadow: { type: 'outer', angle: 45, blur: 3, offset: 2, color: '000000', opacity: 0.3 }
            //                 });
            //             }
            //         });
                    
            //         // Generate the PowerPoint file
            //         const timestamp = generateTimestamp();
            //         const fileName = `presentation_${timestamp}.pptx`;
                    
            //         pptx.writeFile({ fileName: fileName })
            //             .then(() => {
            //                 finalizePPT(fileName);
            //             })
            //             .catch(error => {
            //                 console.error('Error generating PowerPoint:', error);
            //                 showModal('Generation Error', 'Failed to generate the presentation. Please try again.', false);
            //             });
            //     }, 1000);
            // }
            // ------------------------------------------------------------------------------------------------------------------------------

            // ============================================================================================
            function handleGenerate() {
    if (images.length === 0 || generateButton.classList.contains('disabled')) {
        return;
    }
    
    showModal('Generating Presentation', 'Please wait while we generate your presentation...', true);
    
    // Get the filtered images based on current knowledge filter
    const imagesToUse = activeKnowledgeFilter === 'all' ? images : filteredImages;
    
    // Simulate progress
    let progress = 0;
    const totalSteps = imagesToUse.length + 2; // images + title slide + finalizing
    progressInterval = setInterval(() => {
        progress++;
        updateProgress(progress, totalSteps);
        
        if (progress === totalSteps) {
            clearInterval(progressInterval);
        }
    }, 1000);
    
    // Start generating PowerPoint
    setTimeout(() => {
        // Helper function to calculate image dimensions while preserving aspect ratio
        function getImageDimensions(imgSrc) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = function() {
                    resolve({
                        width: this.width,
                        height: this.height,
                        aspectRatio: this.width / this.height
                    });
                };
                img.src = imgSrc;
            });
        }
        
        // Create new PowerPoint presentation
        const pptx = new window.PptxGenJS();
        
        // Set slide size
        if (settings.slideSize === '16:9') {
            pptx.layout = 'LAYOUT_16x9';
        } else {
            pptx.layout = 'LAYOUT_4x3';
        }
        
        // Create title slide if enabled
        if (settings.titleSlide) {
            const titleSlide = pptx.addSlide();
            
            // Set background based on theme
            if (settings.slideTheme === 'dark') {
                titleSlide.background = { color: '121212' };
            } else if (settings.slideTheme === 'light') {
                titleSlide.background = { color: 'FFFFFF' };
            } else if (settings.slideTheme === 'gradient') {
                titleSlide.background = { 
                    type: 'gradient',
                    color: '121212',
                    color2: '3D3D3D',
                    angle: 45
                };
            }
            
            // Add title
            titleSlide.addText('Image Presentation', {
                x: '10%',
                y: '40%',
                w: '80%',
                h: '20%',
                fontSize: 44,
                color: settings.slideTheme === 'light' ? '121212' : 'FFFFFF',
                fontFace: settings.textFont,
                bold: true,
                align: 'center'
            });
            
            // Add subtitle with current date and filter info
            const today = new Date();
            const dateStr = today.toLocaleDateString();
            let filterInfo = '';
            if (activeKnowledgeFilter !== 'all') {
                filterInfo = `\nFiltered: ${activeKnowledgeFilter === '1' ? 'Known Images' : 
                              activeKnowledgeFilter === '0' ? 'Unknown Images' : 
                              'Not Interacted Images'}`;
            }
            titleSlide.addText(`Created on ${dateStr}${filterInfo}`, {
                x: '10%',
                y: '60%',
                w: '80%',
                h: '10%',
                fontSize: 20,
                color: settings.slideTheme === 'light' ? '333333' : 'CCCCCC',
                fontFace: settings.textFont,
                align: 'center'
            });
        }
        
        // Using Promise.all to process all images
        Promise.all(imagesToUse.map(image => getImageDimensions(image.src)))
            .then(imageDimensions => {
                // Now we have dimensions for all images
                imagesToUse.forEach((image, index) => {
                    const slide = pptx.addSlide();
                    
                    // Set background based on theme
                    if (settings.slideTheme === 'dark') {
                        slide.background = { color: '121212' };
                    } else if (settings.slideTheme === 'light') {
                        slide.background = { color: 'FFFFFF' };
                    } else if (settings.slideTheme === 'gradient') {
                        slide.background = { 
                            type: 'gradient',
                            color: '121212',
                            color2: '3D3D3D',
                            angle: 45
                        };
                    }
                    
                    // Define the available area for the image
                    const availableArea = {
                        x: '5%',   
                        y: '5%',   
                        w: '90%',  
                        h: '70%'   
                    };
                    
                    // Get the original dimensions for this image
                    const imgDimensions = imageDimensions[index];
                    
                    // Prepare image options with proper sizing and positioning
                    let imageOptions = {
                        data: image.src
                    };
                    
                    if (settings.imageSize === 'fill') {
                        // Fill the available area while maintaining aspect ratio
                        imageOptions = {
                            ...imageOptions,
                            x: availableArea.x,
                            y: availableArea.y,
                            w: availableArea.w,
                            h: availableArea.h,
                            sizing: { type: 'cover' }
                        };
                    } else if (settings.imageSize === 'fit') {
                        // Fit the entire image within the available area
                        imageOptions = {
                            ...imageOptions,
                            x: availableArea.x,
                            y: availableArea.y,
                            w: availableArea.w,
                            h: availableArea.h,
                            sizing: { type: 'contain' }
                        };
                    } else {
                        // Custom/default - calculate dimensions to preserve aspect ratio
                        const maxWidth = 8;  
                        const maxHeight = 6; 
                        
                        let width, height;
                        
                        if (imgDimensions.width > imgDimensions.height) {
                            // Landscape image
                            width = maxWidth;
                            height = width / imgDimensions.aspectRatio;
                            
                            // Make sure height doesn't exceed maxHeight
                            if (height > maxHeight) {
                                height = maxHeight;
                                width = height * imgDimensions.aspectRatio;
                            }
                        } else {
                            // Portrait or square image
                            height = maxHeight;
                            width = height * imgDimensions.aspectRatio;
                            
                            // Make sure width doesn't exceed maxWidth
                            if (width > maxWidth) {
                                width = maxWidth;
                                height = width / imgDimensions.aspectRatio;
                            }
                        }
                        
                        // Convert to percentages
                        // For a standard 10" wide PowerPoint slide
                        const widthPct = (width / 10) * 100;
                        // For a standard 7.5" tall PowerPoint slide
                        const heightPct = (height / 7.5) * 100;
                        
                        // Center the image in the available area
                        const xPct = (100 - widthPct) / 2;
                        const yPct = (75 - heightPct) / 2; // Leave room for text at bottom
                        
                        imageOptions = {
                            ...imageOptions,
                            x: `${Math.max(5, xPct)}%`,  // Ensure at least 5% margin
                            y: `${Math.max(5, yPct)}%`,  // Ensure at least 5% margin
                            w: `${widthPct}%`,
                            h: `${heightPct}%`
                        };
                    }
                    
                    // Add border if enabled
                    if (settings.imageBorder) {
                        imageOptions.line = { color: 'FF1493', width: 2 };
                    }
                    
                    // Add shadow if enabled
                    if (settings.imageShadow) {
                        imageOptions.shadow = {
                            type: 'outer',
                            angle: 45,
                            blur: 5,
                            offset: 3,
                            color: '000000',
                            opacity: 0.5
                        };
                    }
                    
                    slide.addImage(imageOptions);
                    
                    // Store the calculated width and x position from image for text alignment
                    const textX = imageOptions.x; 
                    const textW = imageOptions.w; 
                    
                    // Add textbox with image name
                    slide.addText(image.name, {
                        x: textX,
                        y: '80%', 
                        w: textW, 
                        h: '10%',
                        fontSize: settings.textSize,
                        fontFace: settings.textFont,
                        color: settings.slideTheme === 'light' ? '121212' : 'FFFFFF',
                        bold: settings.boldText,
                        align: 'center',
                        valign: 'middle',
                        line: { color: 'FF1493', width: 1 },
                        fill: { color: settings.slideTheme === 'light' ? 'F0F0F0' : '252525' },
                        shadow: { type: 'outer', angle: 45, blur: 3, offset: 2, color: '000000', opacity: 0.3 }
                    });

                    // Add description if it exists
                    if (image.description) {
                        slide.addText(image.description, {
                            x: textX,
                            y: '90%',
                            w: textW,
                            h: '8%',
                            fontSize: settings.textSize * 0.8,
                            fontFace: settings.textFont,
                            color: settings.slideTheme === 'light' ? '666666' : 'CCCCCC',
                            align: 'center',
                            valign: 'middle',
                            line: { color: 'FF1493', width: 1 },
                            fill: { color: settings.slideTheme === 'light' ? 'F0F0F0' : '252525' },
                            shadow: { type: 'outer', angle: 45, blur: 3, offset: 2, color: '000000', opacity: 0.3 }
                        });
                    }
                });
                
                // Generate the PowerPoint file
                const timestamp = generateTimestamp();
                const fileName = `presentation_${timestamp}.pptx`;
                
                pptx.writeFile({ fileName: fileName })
                    .then(() => {
                        finalizePPT(fileName);
                    })
                    .catch(error => {
                        console.error('Error generating PowerPoint:', error);
                        showModal('Generation Error', 'Failed to generate the presentation. Please try again.', false);
                    });
            })
            .catch(error => {
                console.error('Error getting image dimensions:', error);
                showModal('Generation Error', 'Failed to process image dimensions. Please try again.', false);
                if (progressInterval) {
                    clearInterval(progressInterval);
                }
            });
    }, 1000);
}

            // ============================================================================================

            function finalizePPT(fileName) {
                // Update modal when finished
                modalTitle.textContent = 'Presentation Generated';
                modalMessage.textContent = `Your presentation "${fileName}" has been created successfully and is ready to download.`;
                document.querySelector('.loading').style.display = 'none';
                document.querySelector('.modal-progress').style.display = 'none';
                progressText.style.display = 'none';
            }

            function updateProgress(current, total) {
                const percentage = (current / total) * 100;
                progressBar.style.width = percentage + '%';
                
                if (current === 0) {
                    progressText.textContent = 'Initializing presentation...';
                } else if (current === 1 && settings.titleSlide) {
                    progressText.textContent = 'Creating title slide...';
                } else if (current === total) {
                    progressText.textContent = 'Finalizing presentation...';
                } else {
                    const imageIndex = settings.titleSlide ? current - 1 : current;
                    progressText.textContent = `Processing image ${imageIndex} of ${images.length}`;
                }
            }

            // Preview Functions
            function openPreview() {
                if (images.length === 0) {
                    showModal('No Images', 'Please upload at least one image to preview.', false);
                    return;
                }
                
                // Initialize filtered images
                filterImages();
                
                // Check if we have any images to preview
                if (filteredImages.length === 0) {
                    showModal('No Images', 'No images match the current filter. Please adjust your filter or add more images.', false);
                    return;
                }
                
                previewPanel.classList.add('active');
                currentPreviewIndex = 0;
                showCurrentPreview();
                
                // Start with black screen by default
                const slide = document.getElementById('previewSlide');
                slide.classList.add('overlay-black');
            }
            
            function closePreviewPanel() {
                previewPanel.classList.remove('active');
                // Remove black screen overlay when closing
                const slide = document.getElementById('previewSlide');
                slide.classList.remove('overlay-black');
                // Stop auto-advance when closing preview
                if (isAutoAdvancing) {
                    toggleAutoAdvance();
                }
            }
            
            function showCurrentPreview() {
                if (!filteredImages || filteredImages.length === 0) {
                    closePreviewPanel();
                    return;
                }
                
                const currentImage = filteredImages[currentPreviewIndex];
                if (!currentImage) {
                    closePreviewPanel();
                    return;
                }
                
                const previewImage = document.getElementById('previewImage');
                const previewText = document.getElementById('previewText');
                
                previewImage.src = currentImage.src;
                previewImage.alt = currentImage.name;
                
                // Update text content to include description if it exists
                previewText.innerHTML = `
                    <div class="preview-name">${currentImage.name}</div>
                    ${currentImage.description ? `<div class="preview-description">${currentImage.description}</div>` : ''}
                `;
                
                // Update slide indicator
                document.getElementById('slideIndicator').textContent = `${currentPreviewIndex + 1} / ${filteredImages.length}`;
                
                // Update knowledge checkbox state
                updateKnowledgeCheckbox(currentImage);
            }
            
            function updateKnowledgeCheckbox(image) {
                // Reset checkbox state
                knowledgeCheckbox.checked = false;
                knowledgeCheckbox.indeterminate = false;
                
                // Set appropriate state based on knowledge value
                if (image.knowledge === 1) {
                    knowledgeCheckbox.checked = true;
                } else if (image.knowledge === 0) {
                    knowledgeCheckbox.checked = false;
                } else {
                    knowledgeCheckbox.indeterminate = true;
                }
            }
            
            function showNextSlide() {
                // Use filtered images for preview if a filter is active
                const currentImages = activeKnowledgeFilter === 'all' ? images : filteredImages;
                
                if (currentPreviewIndex < currentImages.length - 1) {
                    currentPreviewIndex++;
                } else {
                    currentPreviewIndex = 0;
                }
                showCurrentPreview();
            }
            
            function showPreviousSlide() {
                // Use filtered images for preview if a filter is active
                const currentImages = activeKnowledgeFilter === 'all' ? images : filteredImages;
                
                if (currentPreviewIndex > 0) {
                    currentPreviewIndex--;
                } else {
                    currentPreviewIndex = currentImages.length - 1;
                }
                showCurrentPreview();
            }
            
            function togglePreviewText() {
                previewSlide.classList.toggle('show-text');
            }
            
            function toggleFullscreen() {
                if (!document.fullscreenElement) {
                    previewPanel.requestFullscreen().catch(err => {
                        console.error('Error attempting to enable fullscreen:', err);
                    });
                } else {
                    document.exitFullscreen();
                }
            }
            
            // Help function
            function showHelp() {
                const helpContent = `
                    <div class="help-content">
                        <div class="help-tabs">
                            <button class="help-tab active" data-tab="basics">Basics</button>
                            <button class="help-tab" data-tab="quiz">Quiz Mode</button>
                            <button class="help-tab" data-tab="features">Advanced Features</button>
                        </div>

                        <div class="help-tab-content active" data-tab="basics">
                            <div class="help-section">
                                <div class="help-section-title">
                                    <i class="fas fa-upload"></i>
                                    Getting Started
                                </div>
                                <ul class="help-list">
                                    <li>Upload images by clicking the upload icon or by dragging and dropping images</li>
                                    <li>Arrange images by dragging them in the desired order</li>
                                    <li>Configure presentation settings by clicking the settings icon</li>
                                    <li>Preview your slides with the eye icon</li>
                                    <li>Click "Generate Presentation" when ready</li>
                                </ul>
                            </div>

                            <div class="help-section">
                                <div class="help-section-title">
                                    <i class="fas fa-keyboard"></i>
                                    Basic Keyboard Shortcuts
                                </div>
                                <div class="help-shortcuts">
                                    <span class="shortcut-key">←</span>
                                    <span class="shortcut-description">Previous slide</span>
                                    <span class="shortcut-key">→</span>
                                    <span class="shortcut-description">Next slide</span>
                                    <span class="shortcut-key">Space</span>
                                    <span class="shortcut-description">Toggle image name</span>
                                    <span class="shortcut-key">B</span>
                                    <span class="shortcut-description">Toggle black screen</span>
                                    <span class="shortcut-key">W</span>
                                    <span class="shortcut-description">Toggle white screen</span>
                                    <span class="shortcut-key">Esc</span>
                                    <span class="shortcut-description">Close preview</span>
                                </div>
                            </div>

                            <div class="help-section">
                                <div class="help-section-title">
                                    <i class="fas fa-file-export"></i>
                                    Export Options
                                </div>
                                <ul class="help-list">
                                    <li>JSON Export: Exports image data in JSON format for future reference</li>
                                    <li>Import JSON: Restore previously exported image collections</li>
                                </ul>
                                <div class="help-note">
                                    <i class="fas fa-lightbulb"></i>
                                    Tip: Use JSON export/import to save and restore your image collections for future use.
                                </div>
                            </div>
                        </div>

                        <div class="help-tab-content" data-tab="quiz">
                            <div class="help-section">
                                <div class="help-section-title">
                                    <i class="fas fa-gamepad"></i>
                                    Quiz Mode Overview
                                </div>
                                <ul class="help-list">
                                    <li>Click the gamepad icon to enter Quiz Mode</li>
                                    <li>Add players using the input field in the sidebar</li>
                                    <li>Use the timer to add time pressure to the quiz</li>
                                    <li>Track scores on the leaderboard</li>
                                    <li>First player to reach the maximum score wins!</li>
                                </ul>
                            </div>

                            <div class="help-section">
                                <div class="help-section-title">
                                    <i class="fas fa-keyboard"></i>
                                    Quiz Mode Shortcuts
                                </div>
                                <div class="help-shortcuts">
                                    <span class="shortcut-key">Q</span>
                                    <span class="shortcut-description">Toggle quiz mode</span>
                                    <span class="shortcut-key">T</span>
                                    <span class="shortcut-description">Toggle timer</span>
                                    <span class="shortcut-key">S</span>
                                    <span class="shortcut-description">Shuffle slides</span>
                                    <span class="shortcut-key">F</span>
                                    <span class="shortcut-description">Toggle fullscreen</span>
                                    <span class="shortcut-key">+</span>
                                    <span class="shortcut-description">Add score for current player</span>
                                </div>
                            </div>

                            <div class="help-section">
                                <div class="help-section-title">
                                    <i class="fas fa-cog"></i>
                                    Quiz Settings
                                </div>
                                <ul class="help-list">
                                    <li>Adjust timer duration (5-60 seconds)</li>
                                    <li>Set maximum score to win</li>
                                    <li>Customize player names and scores</li>
                                    <li>Reset game at any time</li>
                                </ul>
                            </div>
                        </div>

                        <div class="help-tab-content" data-tab="features">
                            <div class="help-section">
                                <div class="help-section-title">
                                    <i class="fas fa-brain"></i>
                                    Knowledge Filter
                                </div>
                                <ul class="help-list">
                                    <li>Filter images based on your knowledge level</li>
                                    <li>Mark images as Known, Unknown, or Not Interacted</li>
                                    <li>Track your progress with the knowledge counter</li>
                                    <li>Use filters to focus on specific image sets</li>
                                </ul>
                            </div>

                            <div class="help-section">
                                <div class="help-section-title">
                                    <i class="fas fa-comment-alt"></i>
                                    Image Descriptions
                                </div>
                                <ul class="help-list">
                                    <li>Add detailed descriptions to your images</li>
                                    <li>Access descriptions through the image info panel</li>
                                    <li>Edit descriptions at any time</li>
                                    <li>Descriptions are included in JSON exports</li>
                                </ul>
                            </div>

                            <div class="help-section">
                                <div class="help-section-title">
                                    <i class="fas fa-forward"></i>
                                    Auto-Advance
                                </div>
                                <ul class="help-list">
                                    <li>Enable automatic slide advancement</li>
                                    <li>Customize delay between slides (1-60 seconds)</li>
                                    <li>Use in both preview and quiz modes</li>
                                    <li>Pause/resume at any time</li>
                                </ul>
                            </div>

                            <div class="help-section">
                                <div class="help-section-title">
                                    <i class="fas fa-expand"></i>
                                    Fullscreen Mode
                                </div>
                                <ul class="help-list">
                                    <li>Toggle fullscreen in preview mode (F)</li>
                                    <li>Toggle fullscreen in quiz mode (F)</li>
                                    <li>Exit fullscreen with Esc key</li>
                                    <li>Perfect for presentations and quizzes</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
                
                showModal('How to Use', helpContent, false);

                // Add tab switching functionality
                const tabs = document.querySelectorAll('.help-tab');
                tabs.forEach(tab => {
                    tab.addEventListener('click', () => {
                        // Remove active class from all tabs and contents
                        document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active'));
                        document.querySelectorAll('.help-tab-content').forEach(c => c.classList.remove('active'));
                        
                        // Add active class to clicked tab and corresponding content
                        tab.classList.add('active');
                        document.querySelector(`.help-tab-content[data-tab="${tab.dataset.tab}"]`).classList.add('active');
                    });
                });
            }
            
            function showModal(title, message, showProgress) {
                modalTitle.textContent = title;
                
                // Check if message is HTML content
                if (message.includes('<div class="help-content">')) {
                    modalMessage.innerHTML = message;
                } else {
                    modalMessage.textContent = message;
                }
                
                if (showProgress) {
                    document.querySelector('.modal-progress').style.display = 'block';
                    document.querySelector('.loading').style.display = 'block';
                    progressText.style.display = 'block';
                } else {
                    document.querySelector('.modal-progress').style.display = 'none';
                    document.querySelector('.loading').style.display = 'none';
                    progressText.style.display = 'none';
                }
                
                modalOverlay.classList.add('active');
            }

            // Add new keyboard navigation function
            function handleKeyboardNavigation(event) {
                // Only handle keyboard events when preview panel is active
                if (!previewPanel.classList.contains('active')) return;

                switch(event.key) {
                    case 'ArrowLeft':
                        showPreviousSlide();
                        break;
                    case 'ArrowRight':
                        showNextSlide();
                        break;
                    case ' ':  // Space bar
                        event.preventDefault();  // Prevent page scroll
                        togglePreviewText();
                        break;
                    case 'Escape':
                        closePreviewPanel();
                        break;
                    case 'b':  // 'b' key for black screen
                        event.preventDefault();
                        toggleBlackScreen();
                        break;
                    case 'w':  // 'w' key for white screen
                        event.preventDefault();
                        toggleWhiteScreen();
                        break;
                }
            }

            // Add black/white screen toggle functions
            function toggleBlackScreen() {
                const slide = document.getElementById('previewSlide');
                if (slide.classList.contains('overlay-black')) {
                    slide.classList.remove('overlay-black');
                } else {
                    slide.classList.remove('overlay-white');
                    slide.classList.add('overlay-black');
                }
            }

            function toggleWhiteScreen() {
                const slide = document.getElementById('previewSlide');
                if (slide.classList.contains('overlay-white')) {
                    slide.classList.remove('overlay-white');
                } else {
                    slide.classList.remove('overlay-black');
                    slide.classList.add('overlay-white');
                }
            }

            // Export functions
            function exportAsJson() {
                try {
                    // Create export data with descriptions and sizes
                    const exportData = images.map(image => ({
                        id: image.id,
                        name: image.name,
                        description: image.description || '',
                        knowledge: image.knowledge,
                        src: image.src,
                        size: image.size || formatFileSize(image.file?.size || 0)
                    }));
                    
                    // Create and trigger download
                    const dataStr = JSON.stringify(exportData, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'image_data.json';
                    document.body.appendChild(a);
                    a.click();
                    
                    setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        modalOverlay.classList.remove('active');
                    }, 100);

                    // Show success message
                    showModal('Export Complete', 'Your image data has been exported successfully.', false);
                } catch (error) {
                    console.error('Error exporting JSON:', error);
                    showModal('Export Error', 'An error occurred while exporting the data. Please try again.', false);
                }
            }

            function handleJsonImport(event) {
                const file = event.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        
                        // Clear existing images
                        images = [];
                        imagesContainer.innerHTML = '';
                        
                        // Import new images with descriptions and sizes
                        importedData.forEach(item => {
                            const image = {
                                id: item.id || generateUniqueId(),
                                name: item.name,
                                description: item.description || '',
                                knowledge: item.knowledge !== undefined ? item.knowledge : -1,
                                src: item.src,
                                size: item.size || '' // Use imported size or empty string as fallback
                            };
                            images.push(image);
                            renderImageCard(image);
                        });
                        
                        // Update UI
                        updateEmptyState();
                        updateGenerateButton();
                        updateKnowledgeFilterCounts();
                        
                        showModal('Import Complete', 'Images have been successfully imported.', false);
                    } catch (error) {
                        console.error('Error importing JSON:', error);
                        showModal('Import Error', 'Failed to import images. Please make sure the file is valid.', false);
                    }
                };
                
                reader.readAsText(file);
            }

            function generatePPT() {
                if (images.length === 0) {
                    showModal('No Images', 'Please add some images before generating the presentation.', false);
                    return;
                }
                
                // Show loading modal
                showModal('Generating Presentation', 'Please wait while we generate your presentation...', true);
                
                // Create a new presentation
                const pptx = new pptxgen();
                
                // Set presentation properties
                pptx.author = 'PPT Generator';
                pptx.title = 'Image Presentation';
                pptx.subject = 'Image Slideshow';
                
                // Add title slide if enabled
                if (settings.titleSlide) {
                    const titleSlide = pptx.addSlide();
                    titleSlide.addText('Image Presentation', {
                        x: '10%',
                        y: '40%',
                        w: '80%',
                        h: '20%',
                        fontSize: 44,
                        color: '363636',
                        bold: true,
                        align: 'center'
                    });
                }
                
                // Process each image
                let currentSlide = 0;
                const totalSlides = settings.titleSlide ? images.length + 1 : images.length;
                
                images.forEach((image, index) => {
                    currentSlide = settings.titleSlide ? index + 1 : index;
                    updateProgress(currentSlide, totalSlides);
                    
                    const slide = pptx.addSlide();
                    
                    // Add image
                    slide.addImage({
                        data: image.src,
                        x: '10%',
                        y: '10%',
                        w: '80%',
                        h: '60%'
                    });
                    
                    // Add image name
                    slide.addText(image.name, {
                        x: '10%',
                        y: '75%',
                        w: '80%',
                        h: '10%',
                        fontSize: 24,
                        color: '363636',
                        bold: true,
                        align: 'center'
                    });

                    // Add description if it exists
                    if (image.description) {
                        slide.addText(image.description, {
                            x: '10%',
                            y: '85%',
                            w: '80%',
                            h: '10%',
                            fontSize: 18,
                            color: '666666',
                            align: 'center'
                        });
                    }
                });
                
                // Generate the file name
                const fileName = 'presentation.pptx';
                
                // Save the presentation
                setTimeout(() => {
                    pptx.writeFile({ fileName: fileName })
                        .then(() => {
                            finalizePPT(fileName);
                        })
                        .catch(error => {
                            console.error('Error generating PowerPoint:', error);
                            showModal('Generation Error', 'Failed to generate the presentation. Please try again.', false);
                        });
                }, 1000);
            }
            
            // Add shuffleButton to the DOM Elements section
            const shuffleButton = document.getElementById('shuffleButton');
            
            // Add shuffleImages function
            function shuffleImages() {
                if (images.length === 0) {
                    showModal('No Images', 'Please add some images before shuffling.', false);
                    return;
                }
                
                // Shuffle the images array
                for (let i = images.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [images[i], images[j]] = [images[j], images[i]];
                }
                
                // Update filtered images if a filter is active
                if (activeKnowledgeFilter !== 'all') {
                    filterImages();
                } else {
                    filteredImages = [...images];
                }
                
                // Re-render the image cards
                renderFilteredImages();
                
                // If in preview mode, update the current preview
                if (previewPanel.classList.contains('active')) {
                    currentPreviewIndex = 0;
                    showCurrentPreview();
                }
                
                // If in quiz mode, update the quiz
                if (quizPanel.classList.contains('active')) {
                    currentQuizIndex = 0;
                    showCurrentQuizSlide();
                }
            }

            function renderImageCard(image) {
                const card = document.createElement('div');
                card.className = 'image-card';
                card.id = image.id;
                card.draggable = true;
                
                card.innerHTML = `
                    <div class="image-preview">
                        <img src="${image.src}" alt="${image.name}">
                        <div class="image-overlay">
                            <div class="image-actions">
                                <div class="image-action-icon delete" title="Delete Image">
                                    <i class="fas fa-trash"></i>
                                </div>
                                <div class="image-action-icon edit" title="${image.description ? 'Edit Description' : 'Add Description'}">
                                    <i class="fas fa-pencil-alt"></i>
                                </div>
                            </div>
                        </div>
                        <div class="knowledge-indicator ${getKnowledgeClass(image.knowledge)}">
                            <i class="fas ${getKnowledgeIcon(image.knowledge)}"></i>
                        </div>
                    </div>
                    <div class="image-info">
                        <div class="image-name">${image.name}</div>
                        ${image.description ? `<div class="image-description">${image.description}</div>` : ''}
                        <div class="image-size">${image.size || ''}</div>
                    </div>
                `;
                
                // Add event listeners
                card.querySelector('.delete').addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteImage(image.id);
                });
                
                card.querySelector('.edit').addEventListener('click', (e) => {
                    e.stopPropagation();
                    showDescriptionModal(image);
                });
                
                // Add drag and drop event listeners
                card.addEventListener('dragstart', handleDragStart);
                card.addEventListener('dragend', handleDragEnd);
                
                // Add the card to the container
                imagesContainer.appendChild(card);
                
                return card;
            }

            function handleJsonImport(event) {
                const file = event.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        
                        // Clear existing images
                        images = [];
                        imagesContainer.innerHTML = '';
                        
                        // Import new images with descriptions and sizes
                        importedData.forEach(item => {
                            const image = {
                                id: item.id || generateUniqueId(),
                                name: item.name,
                                description: item.description || '',
                                knowledge: item.knowledge !== undefined ? item.knowledge : -1,
                                src: item.src,
                                size: item.size || '' // Use imported size or empty string as fallback
                            };
                            images.push(image);
                            renderImageCard(image);
                        });
                        
                        // Update UI
                        updateEmptyState();
                        updateGenerateButton();
                        updateKnowledgeFilterCounts();
                        
                        showModal('Import Complete', 'Images have been successfully imported.', false);
                    } catch (error) {
                        console.error('Error importing JSON:', error);
                        showModal('Import Error', 'Failed to import images. Please make sure the file is valid.', false);
                    }
                };
                
                reader.readAsText(file);
            }

            // Add event listener for shuffle button in setupEventListeners
            shuffleButton.addEventListener('click', shuffleImages);

            // Add auto-advance functions
            function toggleAutoAdvance() {
                isAutoAdvancing = !isAutoAdvancing;
                autoAdvanceButton.classList.toggle('active');
                autoAdvanceButton.classList.toggle('fa-play');
                autoAdvanceButton.classList.toggle('fa-pause');
                
                if (isAutoAdvancing) {
                    startAutoAdvance();
                } else {
                    stopAutoAdvance();
                }
            }
            
            function startAutoAdvance() {
                if (autoAdvanceTimer) {
                    clearInterval(autoAdvanceTimer);
                }
                
                const delay = parseInt(autoAdvanceDelay.value) * 1000;
                countdownValue = parseInt(autoAdvanceDelay.value);
                updateTimerDisplay();
                document.getElementById('timerContainer').classList.add('active');
                
                // Start the countdown for the first slide
                startCountdown(delay);
                
                // Set up the auto-advance timer
                autoAdvanceTimer = setInterval(() => {
                    showNextSlide();
                    // Reset and start countdown for the new slide
                    countdownValue = parseInt(autoAdvanceDelay.value);
                    updateTimerDisplay();
                    startCountdown(delay);
                }, delay);
            }
            
            function startCountdown(delay) {
                // Clear any existing countdown timer
                if (window.countdownTimer) {
                    clearInterval(window.countdownTimer);
                }
                
                // Update timer every second
                window.countdownTimer = setInterval(() => {
                    countdownValue--;
                    updateTimerDisplay();
                    
                    if (countdownValue <= 0) {
                        clearInterval(window.countdownTimer);
                    }
                }, 1000);
            }
            
            function stopAutoAdvance() {
                if (autoAdvanceTimer) {
                    clearInterval(autoAdvanceTimer);
                    autoAdvanceTimer = null;
                }
                
                // Clear the countdown timer as well
                if (window.countdownTimer) {
                    clearInterval(window.countdownTimer);
                    window.countdownTimer = null;
                }
                
                document.getElementById('timerContainer').classList.remove('active');
            }
            
            function updateTimerDisplay() {
                document.getElementById('timerValue').textContent = countdownValue;
            }

            function handleKnowledgeChange() {
                const currentImage = images[currentPreviewIndex];
                
                if (knowledgeCheckbox.checked) {
                    // User knows the image name
                    currentImage.knowledge = 1;
                } else if (knowledgeCheckbox.indeterminate) {
                    // User hasn't interacted with this image
                    currentImage.knowledge = -1;
                } else {
                    // User doesn't know the image name
                    currentImage.knowledge = 0;
                }
                
                // Update the image card in the main view
                const imageCard = document.getElementById(currentImage.id);
                if (imageCard) {
                    // Remove the card and re-render it to update the knowledge indicator
                    imageCard.remove();
                    renderImageCard(currentImage);
                }
                
                // Update knowledge filter counts
                updateKnowledgeFilterCounts();
                
                // If we're filtering by knowledge state, update the filtered images
                if (activeKnowledgeFilter !== 'all') {
                    filterImages();
                    renderFilteredImages();
                }
            }

            // Knowledge checkbox
            knowledgeCheckbox.addEventListener('change', handleKnowledgeChange);
            
            // Add click event to the checkbox container for better interaction
            const knowledgeCheckboxContainer = document.getElementById('knowledgeCheckboxContainer');
            knowledgeCheckboxContainer.addEventListener('click', function(event) {
                // Prevent the click from propagating to other elements
                event.stopPropagation();
                
                // Toggle between the three states
                if (knowledgeCheckbox.checked) {
                    // If checked, make it unchecked (user doesn't know)
                    knowledgeCheckbox.checked = false;
                    knowledgeCheckbox.indeterminate = false;
                } else if (knowledgeCheckbox.indeterminate) {
                    // If indeterminate, make it checked (user knows)
                    knowledgeCheckbox.checked = true;
                    knowledgeCheckbox.indeterminate = false;
                } else {
                    // If unchecked, make it indeterminate (not interacted)
                    knowledgeCheckbox.checked = false;
                    knowledgeCheckbox.indeterminate = true;
                }
                
                // Trigger the change event to update the image knowledge
                handleKnowledgeChange();
            });

            // Add these new functions for quiz state import/export
            function exportQuizState() {
                const gameState = {
                    players: quizPlayersList,
                    currentIndex: currentQuizIndex,
                    timerValue: quizTimerValue,
                    isTimerRunning: isQuizTimerRunning,
                    activePlayer: activePlayer ? activePlayer.id : null,
                    settings: {
                        timerDuration: timerDuration.value,
                        maxScore: maxScore.value
                    }
                };

                const blob = new Blob([JSON.stringify(gameState, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'quiz-game-state.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }

            function importQuizState() {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.style.display = 'none';
                document.body.appendChild(input);

                input.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = function(e) {
                        try {
                            const gameState = JSON.parse(e.target.result);
                            
                            // Validate the game state structure
                            if (!gameState.players || !Array.isArray(gameState.players)) {
                                throw new Error('Invalid game state format');
                            }

                            // Restore game state
                            quizPlayersList = gameState.players;
                            currentQuizIndex = gameState.currentIndex || 0;
                            quizTimerValue = gameState.timerValue || parseInt(timerDuration.value);
                            isQuizTimerRunning = gameState.isTimerRunning || false;
                            
                            // Restore active player
                            if (gameState.activePlayer) {
                                activePlayer = quizPlayersList.find(p => p.id === gameState.activePlayer) || null;
                            } else {
                                activePlayer = null;
                            }

                            // Restore settings
                            if (gameState.settings) {
                                timerDuration.value = gameState.settings.timerDuration || 30;
                                maxScore.value = gameState.settings.maxScore || 10;
                            }

                            // Update UI
                            renderQuizPlayers();
                            updateLeaderboard();
                            showCurrentQuizSlide();
                            updateQuizTimerDisplay();

                            // Update timer button state
                            if (isQuizTimerRunning) {
                                quizTimerButton.classList.remove('fa-play');
                                quizTimerButton.classList.add('fa-pause');
                            } else {
                                quizTimerButton.classList.remove('fa-pause');
                                quizTimerButton.classList.add('fa-play');
                            }

                            showModal('Import Complete', 'Game state has been successfully imported.', false);
                        } catch (error) {
                            showModal('Import Error', 'Failed to import game state. Please make sure the file is valid.', false);
                            console.error('Error importing game state:', error);
                        }
                    };

                    reader.readAsText(file);
                    document.body.removeChild(input);
                });

                input.click();
            }

            function toggleQuizBlackscreen() {
                const currentSlide = document.querySelector('.quiz-slide');
                if (currentSlide) {
                    if (currentSlide.classList.contains('overlay-black')) {
                        currentSlide.classList.remove('overlay-black');
                    } else {
                        currentSlide.classList.remove('overlay-white');
                        currentSlide.classList.add('overlay-black');
                    }
                }
            }

            function toggleQuizWhitescreen() {
                const currentSlide = document.querySelector('.quiz-slide');
                if (currentSlide) {
                    if (currentSlide.classList.contains('overlay-white')) {
                        currentSlide.classList.remove('overlay-white');
                    } else {
                        currentSlide.classList.remove('overlay-black');
                        currentSlide.classList.add('overlay-white');
                    }
                }
            }

            function toggleQuizOverlay() {
                const currentSlide = document.querySelector('.quiz-slide');
                if (currentSlide) {
                    if (currentSlide.classList.contains('overlay-white')) {
                        currentSlide.classList.remove('overlay-white');
                    } else if (currentSlide.classList.contains('overlay-black')) {
                        currentSlide.classList.remove('overlay-black');
                    } else {
                        currentSlide.classList.add('overlay-white');
                    }
                }
            }

            function toggleQuizText() {
                const currentSlide = document.querySelector('.quiz-slide');
                if (currentSlide) {
                    currentSlide.classList.toggle('show-text');
                }
            }

            // Description Modal Functions
            let currentDescriptionImage = null;

            function showDescriptionModal(image) {
                currentDescriptionImage = image;
                const modal = document.getElementById('descriptionModal');
                const previewImage = document.getElementById('descriptionPreviewImage');
                const descriptionTextarea = document.getElementById('imageDescription');
                
                // Update modal content
                previewImage.src = image.src;
                previewImage.alt = image.name;
                descriptionTextarea.value = image.description || '';
                
                // Show modal
                modal.classList.add('active');
            }

            function closeDescriptionModal() {
                const modal = document.getElementById('descriptionModal');
                modal.classList.remove('active');
                currentDescriptionImage = null;
            }

            function saveDescription() {
                if (!currentDescriptionImage) return;
                
                const descriptionTextarea = document.getElementById('imageDescription');
                const description = descriptionTextarea.value.trim();
                
                // Update the image object
                currentDescriptionImage.description = description;
                
                // Update the image card
                const imageCard = document.getElementById(currentDescriptionImage.id);
                if (imageCard) {
                    const descriptionElement = imageCard.querySelector('.image-description');
                    if (description) {
                        if (!descriptionElement) {
                            const imageInfo = imageCard.querySelector('.image-info');
                            const newDescription = document.createElement('div');
                            newDescription.className = 'image-description';
                            newDescription.textContent = description;
                            imageInfo.insertBefore(newDescription, imageInfo.querySelector('.image-size'));
                        } else {
                            descriptionElement.textContent = description;
                        }
                    } else if (descriptionElement) {
                        descriptionElement.remove();
                    }
                }
                
                closeDescriptionModal();
            }

            // Add event listeners for the description modal
            document.getElementById('closeDescriptionModal').addEventListener('click', closeDescriptionModal);
            document.getElementById('cancelDescription').addEventListener('click', closeDescriptionModal);
            document.getElementById('saveDescription').addEventListener('click', saveDescription);
        });
