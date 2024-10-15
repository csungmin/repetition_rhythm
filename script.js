const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gridSize = 130;
const rows = 4;
const cols = 8;
const images = [
    'images/IMG_9254.png',
    'images/IMG_9259.png',
    'images/IMG_9292.png',
    'images/IMG_9509.png',
    'images/IMG_9294.png',
    'images/IMG_9432.png',
    'images/IMG_9599.png',
    'images/IMG_9572.png',
    'images/IMG_9378.png',
    'images/IMG_9382.png',
    'images/IMG_9381.png'
];

const quotes = [
    "“Energy moves in waves. Waves move in patterns. Patterns move in rhythms. A human being is just that energy, waves, patterns, rhythms. Nothing more. Nothing less. A dance.”",
    "Rhythm in art is the visual or auditory pattern created by repeated shapes, elements, colors, sounds, and movements.",
    "Repetition... can also help create texture and bring the project to life",
    "Repetition helps them know exactly what to expect, creating a sense of comfort",
    "Repetition is also an excellent way to highlight specific elements",
    "Repetition lets me be happier with everyday, ordinary things in life and lets me appreciate the extraordinary more when it does happen",
    "Rhythm is essential to dance, poetry, and speech",
    "By creating repetition with both composition and content, artists can successfully create visual rhythms for viewers to appreciate",
    "Life is full of rhythms... We feel deeply the cycles of sun and moon, planting harvest",
    "The human body is replete with rhythmical processes, such as respiration, heartbeat, circadian cycles, and menstrual cycles.",
    "Repetition is a key technique used to create rhythm in art.",
    "Rhythm is an important concept in art. It is used to create a sense of movement, energy, and flow in works of art.",
    "Repetition lets me be happier with everyday, ordinary things in life and lets me appreciate the extraordinary more when it does happen.",
    "“Repetition may not entertain, but it teaches.”",
];

const authors = [
    " Gabrielle Roth",
    " What is Rhythm in Art — Principles, Types & Techniques",
    " Repetition in Graphic Design: Understanding What it Means and How to Use It",
    " Repetition in Graphic Design: Understanding What it Means and How to Use It",
    " Repetition in Graphic Design: Understanding What it Means and How to Use It",
    " Finding Joy in Repetition",
    " The Importance of Rhythm in Everyday Life",
    " What is Rhythm in Art — Principles, Types & Techniques",
    " The Importance of Rhythm in Everyday Life",
    " The Importance of Rhythm in Everyday Life",
    " The Importance of Rhythm in Everyday Life",
    " What is Rhythm in Art — Principles, Types & Techniques",
    " What is Rhythm in Art — Principles, Types & Techniques",
    " Finding Joy in Repetition",
    " Frederic Bastiat",
];

// Initialize variables
let pieces = [];
let currentPieceIndex = null;
let matchingBlocks = [];
let grid = Array.from({ length: rows }, () => Array(cols).fill(null));

// Load images
const loadedImages = images.map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

// Utility: Shuffle array (Fisher-Yates)
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap
    }
    return array;
};

// Initialize pieces (7 images with 3 of each placed randomly)
const initializePieces = () => {
    let imagePool = [];
    const numberOfMatches = 7;

    for (let i = 0; i < numberOfMatches; i++) {
        imagePool.push(i, i, i); // 3 of each image
    }

    shuffleArray(imagePool);
    grid = Array.from({ length: rows }, () => Array(cols).fill(null));
    pieces = [];

    imagePool.forEach((imageIndex) => {
        let x, y;
        do {
            x = Math.floor(Math.random() * cols);
            y = Math.floor(Math.random() * rows);
        } while (grid[y][x] !== null);

        pieces.push({ x, y, imageIndex, isMatched: false });
        grid[y][x] = imageIndex;
    });
};

// Update grid based on pieces
const updateGrid = () => {
    grid = Array.from({ length: rows }, () => Array(cols).fill(null));
    pieces.forEach(piece => {
        if (piece.x < cols && piece.y < rows) {
            grid[piece.y][piece.x] = piece.imageIndex;
        }
    });
};

// Draw game board and pieces
const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all the images
    pieces.forEach((piece, index) => {
        // Set different styles for matched pieces
        if (piece.isMatched) {
            ctx.globalAlpha = 0.4; // Make matched pieces semi-transparent
        }

        ctx.drawImage(
            loadedImages[piece.imageIndex],
            piece.x * gridSize,
            piece.y * gridSize,
            gridSize,
            gridSize
        );

        // Reset styles after drawing
        ctx.globalAlpha = 1.0;
    });

    // If there's a selected piece, draw it on top and highlight it
    if (currentPieceIndex !== null) {
        const selectedPiece = pieces[currentPieceIndex];
        
        // Draw the selected image on top
        ctx.drawImage(
            loadedImages[selectedPiece.imageIndex],
            selectedPiece.x * gridSize,
            selectedPiece.y * gridSize,
            gridSize,
            gridSize
        );

        // Then, highlight it with a border
        ctx.strokeStyle = '#472e15';
        ctx.lineWidth = 4;
        ctx.strokeRect(
            selectedPiece.x * gridSize,
            selectedPiece.y * gridSize,
            gridSize,
            gridSize
        );
    }
};



// Check for matches
const checkForMatch = () => {
    matchingBlocks = [];
    console.log('Checking for matches...');

    // Check for horizontal matches across all rows
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols - 2; col++) { 
            if (
                grid[row][col] !== null &&
                grid[row][col] === grid[row][col + 1] &&
                grid[row][col] === grid[row][col + 2] &&
                !isPieceMatched(row, col) &&
                !isPieceMatched(row, col + 1) &&
                !isPieceMatched(row, col + 2)
            ) {
                markAsMatched([
                    [row, col],
                    [row, col + 1],
                    [row, col + 2]
                ]);
                console.log(`Horizontal match found at row ${row}, starting col ${col}`);
            }
        }
    }

    // Check for vertical matches across all columns
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows - 2; row++) { 
            if (
                grid[row][col] !== null &&
                grid[row][col] === grid[row + 1][col] &&
                grid[row][col] === grid[row + 2][col] &&
                !isPieceMatched(row, col) &&
                !isPieceMatched(row + 1, col) &&
                !isPieceMatched(row + 2, col)
            ) {
                markAsMatched([
                    [row, col],
                    [row + 1, col],
                    [row + 2, col]
                ]);
                console.log(`Vertical match found at col ${col}, starting row ${row}`);
            }
        }
    }

    // Open the modal if matches were found
    if (matchingBlocks.length > 0) {
        openModal();
        console.log('Modal should open now!'); 
    }

    return matchingBlocks.length > 0; // Return true if matches were found
};

// Utility function to check if a piece is already matched
const isPieceMatched = (row, col) => {
    const piece = pieces.find(p => p.x === col && p.y === row);
    return piece ? piece.isMatched : false;
};

// Mark blocks as matched
const markAsMatched = (matches) => {
    matches.forEach(([x, y]) => {
        pieces.forEach(piece => {
            if (piece.x === y && piece.y === x && !piece.isMatched) {
                piece.isMatched = true;
                matchingBlocks.push(piece);
                console.log(`Matched piece: (${piece.x}, ${piece.y})`); 
            }
        });
    });
};

// Handle piece selection and movement
const handleClick = (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    pieces.forEach((piece, index) => {
        if (
            mouseX >= piece.x * gridSize &&
            mouseX < (piece.x + 1) * gridSize &&
            mouseY >= piece.y * gridSize &&
            mouseY < (piece.y + 1) * gridSize
        ) {
            currentPieceIndex = index;
        }
    });
    draw();
};

const handleKeyboardMovement = (event) => {
    if (currentPieceIndex !== null) {
        const currentPiece = pieces[currentPieceIndex];
        const { x, y } = currentPiece; // Current coordinates of the piece
        let newX = x;
        let newY = y;

        switch (event.key) {
            case 'ArrowLeft':
                if (x > 0 && grid[y][x - 1] === null) {
                    newX = x - 1;
                }
                break;
            case 'ArrowRight':
                if (x < cols - 1 && grid[y][x + 1] === null) {
                    newX = x + 1;
                }
                break;
            case 'ArrowUp':
                if (y > 0 && grid[y - 1][x] === null) {
                    newY = y - 1;
                }
                break;
            case 'ArrowDown':
                if (y < rows - 1 && grid[y + 1][x] === null) {
                    newY = y + 1;
                }
                break;
        }

        // If the piece moves, update the grid and piece position
        if (newX !== x || newY !== y) {
            // Clear current position in the grid
            grid[y][x] = null;

            // Update piece coordinates
            currentPiece.x = newX;
            currentPiece.y = newY;

            // Mark new position in the grid
            grid[newY][newX] = currentPiece.imageIndex;

            // Redraw the grid and check for matches after movement
            updateGrid();
            checkForMatch();
            draw();
        }
    }
};


// Open and close modal
const openModal = () => {
    const modal = document.getElementById("modal");
    if (modal) {
        // Select a random index
        const randomIndex = Math.floor(Math.random() * quotes.length);

        // Update modal content with a random quote and its author
        modal.querySelector("p#quote").innerText = quotes[randomIndex];
        modal.querySelector("p#author").innerText = `- ${authors[randomIndex]}`;

        modal.style.display = "block"; // Show modal
        console.log('Modal opened with random quote'); // Debugging line
    } else {
        console.error('Modal element not found!'); // Log error if not found
    }
};



const closeModal = () => {
    const modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "none"; // Hide modal
        console.log('Modal closed'); // Debugging line
    }
};

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') { // Check if spacebar was pressed
        closeModal(); // Close the modal
    }
});

// Shuffle pieces
const shufflePieces = () => {
    // Reset the grid and pieces
    pieces.forEach(piece => piece.isMatched = false); // Reset all matched status
    initializePieces();
    updateGrid();
    draw();
    closeModal();
    console.log('Game reset and shuffled.');
};

// Event listeners
canvas.addEventListener('click', handleClick);
document.addEventListener('keydown', handleKeyboardMovement);
document.getElementById('shuffle-btn').addEventListener('click', shufflePieces);

// Initialize game
initializePieces();
draw();
