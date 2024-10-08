const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gridSize = 130;
const rows = 4;
const cols = 8;
const images = [
    'images/IMG_9254.jpg',
    'images/IMG_9259.jpg',
    'images/IMG_9292.jpg',
    'images/IMG_9509.jpg',
    'images/IMG_9294.jpg',
    'images/IMG_9432.jpg',
    'images/IMG_9599.jpg',
    'images/IMG_9572.jpg',
    'images/IMG_9378.jpg',
    'images/IMG_9382.jpg',
    'images/IMG_9381.jpg'
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
    pieces.forEach((piece, index) => {
        ctx.drawImage(
            loadedImages[piece.imageIndex],
            piece.x * gridSize,
            piece.y * gridSize,
            gridSize,
            gridSize
        );

        // Highlight selected piece
        if (index === currentPieceIndex) {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                piece.x * gridSize,
                piece.y * gridSize,
                gridSize,
                gridSize
            );
        }
    });
};

// Check for matches
const checkForMatch = () => {
    matchingBlocks = [];
    console.log('Checking for matches...');

    // Check for horizontal matches across all rows
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols - 2; col++) { // Ensure we don't go out of bounds
            if (
                grid[row][col] !== null &&
                grid[row][col] === grid[row][col + 1] &&
                grid[row][col] === grid[row][col + 2]
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
        for (let row = 0; row < rows - 2; row++) { // Ensure we don't go out of bounds
            if (
                grid[row][col] !== null &&
                grid[row][col] === grid[row + 1][col] &&
                grid[row][col] === grid[row + 2][col]
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





// Mark blocks as matched
// Mark blocks as matched
const markAsMatched = (matches) => {
    matches.forEach(([x, y]) => {
        pieces.forEach(piece => {
            if (piece.x === y && piece.y === x) { // Check coordinates correctly
                piece.isMatched = true;
                matchingBlocks.push(piece);
                console.log(`Matched piece: (${piece.x}, ${piece.y})`); // Log matched pieces
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
    console.log(`Key pressed: ${event.key}`); // Debugging line
    if (currentPieceIndex !== null) {
        const currentPiece = pieces[currentPieceIndex];
        switch (event.key) {
            case 'ArrowLeft':
                if (currentPiece.x > 0) currentPiece.x--;
                break;
            case 'ArrowRight':
                if (currentPiece.x < cols - 1) currentPiece.x++;
                break;
            case 'ArrowDown':
                if (currentPiece.y < rows - 1) currentPiece.y++;
                break;
            case 'ArrowUp':
                if (currentPiece.y > 0) currentPiece.y--;
                break;
        }
        updateGrid();
        checkForMatch(); // Check for matches after moving
        draw();
    }
};

// Open and close modal
const openModal = () => {
    const modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "block"; // Show modal
        console.log('Modal opened'); // Debugging line
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

// Shuffle pieces
const shufflePieces = () => {
    pieces.forEach(piece => {
        let x, y;
        do {
            x = Math.floor(Math.random() * cols);
            y = Math.floor(Math.random() * rows);
        } while (grid[y][x] !== null);

        grid[piece.y][piece.x] = null;
        piece.x = x;
        piece.y = y;
        grid[y][x] = piece.imageIndex;
    });
    draw();
};

// Event listeners
canvas.addEventListener('click', handleClick);
document.addEventListener('keydown', handleKeyboardMovement);
document.getElementById('shuffle-btn').addEventListener('click', shufflePieces);

// Initialize game
initializePieces();
draw();
