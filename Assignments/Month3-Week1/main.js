import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.esm.min.js';
import SearchBar from './SearchBar.js';

const API_URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php?archetype=Elemental%20HERO"; // API endpoint to fetch card data
const cardsWrapper = document.getElementById("cardsWrapper"); // Container for card elements
const paginationControls = document.getElementById("paginationControls"); // Container for pagination buttons
const loadMoreButton = document.querySelector(".load-more-button"); // Load More button
const jumpToInput = document.querySelector(".jump-to-input"); // Jump to input
const jumpToButton = document.querySelector(".jump-to-button"); // Jump to button
const CARDS_PER_PAGE = 9; // Number of cards to display per page
let currentPage = 1; // Track the current page
let totalPages = 1; // Total number of pages available
let allCards = []; // Store all fetched cards in memory
let filteredCards = []; // Store filtered cards for search functionality

console.log("Script started"); // Log script execution start

// Initialize IndexedDB
function initializeDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("CardImagesDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("images")) {
                db.createObjectStore("images", { keyPath: "url" });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject("Error opening IndexedDB:", event.target.error);
        };
    });
}

// Save image to IndexedDB
function saveImageToIndexedDB(db, imageUrl, blob) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("images", "readwrite");
        const store = transaction.objectStore("images");
        const request = store.put({ url: imageUrl, blob });

        request.onsuccess = () => {
            console.log(`Image saved to IndexedDB: ${imageUrl}`);
            resolve();
        };

        request.onerror = (event) => {
            console.error("Error saving image to IndexedDB:", event.target.error);
            reject(event.target.error);
        };
    });
}

// Load image from IndexedDB
function loadImageFromIndexedDB(db, imageUrl) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("images", "readonly");
        const store = transaction.objectStore("images");
        const request = store.get(imageUrl);

        request.onsuccess = (event) => {
            const result = event.target.result;
            if (result) {
                console.log(`Image loaded from IndexedDB: ${imageUrl}`);
                resolve(result.blob);
            } else {
                resolve(null);
            }
        };

        request.onerror = (event) => {
            console.error("Error loading image from IndexedDB:", event.target.error);
            reject(event.target.error);
        };
    });
}

// Fetch image as a blob and store it in IndexedDB
async function fetchAndCacheImage(db, imageUrl) {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();
        await saveImageToIndexedDB(db, imageUrl, blob);
        return blob;
    } catch (error) {
        console.error("Error fetching image:", error);
        return null;
    }
}

// Load current page images into IndexedDB
async function loadImagesToIndexedDB(cards) {
    const db = await initializeDB();

    for (const card of cards) {
        const imageUrl = card.card_images[0].image_url_cropped;

        // Check if the image is already cached in IndexedDB
        const cachedImage = await loadImageFromIndexedDB(db, imageUrl);
        if (cachedImage) {
            console.log(`Image already cached: ${imageUrl}`);
            continue;
        }

        // Fetch and cache the image
        await fetchAndCacheImage(db, imageUrl);
    }
}

// Fetch card data from the API
async function fetchAllCards() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        allCards = data.data; // Store all cards in memory
        filteredCards = allCards; // Initialize filteredCards with all cards
        totalPages = Math.ceil(allCards.length / CARDS_PER_PAGE); // Calculate total pages
        renderCards(currentPage); // Render the first page
        updatePaginationControls(currentPage, totalPages); // Update pagination buttons
    } catch (error) {
        console.error("Error fetching cards:", error);
        cardsWrapper.innerHTML = `
            <p class="error-message">Failed to load cards. Please check your internet connection or try again later.</p>
        `;
    }
}

// Render cards for the current page
async function renderCards(page, cards = filteredCards, append = false) {
    const startIndex = (page - 1) * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
    const cardsToRender = cards.slice(startIndex, endIndex); // Get cards for the current page
    const fragment = document.createDocumentFragment();
    const db = await initializeDB();

    for (const card of cardsToRender) {
        const imageUrl = card.card_images[0].image_url_cropped;

        // Try to load the image from IndexedDB
        const cachedImage = await loadImageFromIndexedDB(db, imageUrl);
        const imageSrc = cachedImage ? URL.createObjectURL(cachedImage) : imageUrl;

        const cardElement = document.createElement("div");
        cardElement.classList.add("card-container");
        cardElement.innerHTML = `
            <div class="image-container">
                <img src="${imageSrc}" alt="${card.name}" onerror="this.src='.././assets/images/logo.png'">
            </div>
            <div class="text-container">
                <a href="#">${card.name}</a>
            </div>
        `;
        cardElement.onclick = () => openModal(card.id, cards);
        fragment.appendChild(cardElement);
    }

    if (!append) {
        // Clear existing cards if not appending
        cardsWrapper.innerHTML = "";
    }
    cardsWrapper.appendChild(fragment);

    // Load current page images into IndexedDB
    loadImagesToIndexedDB(cardsToRender);
}

// Handle search functionality with fuzzy search
function handleSearch({ searchTerm, category }) {
    if (!searchTerm) {
        // If the search term is empty, show all cards
        filteredCards = allCards;
    } else {
        // Configure Fuse.js options for fuzzy search
        const fuseOptions = {
            keys: [category], // Search in the specified category (e.g., "name", "attribute")
            threshold: 0.3, // Adjust the threshold for fuzzy matching (0 = exact match, 1 = very loose)
            includeScore: true, // Include the match score in the results
            ignoreLocation: true, // Allow matches anywhere in the string
            minMatchCharLength: 2, // Minimum number of characters that must match
        };

        // Initialize Fuse.js with the cards and options
        const fuse = new Fuse(allCards, fuseOptions);

        // Perform the fuzzy search
        const results = fuse.search(searchTerm);

        // Extract the matched cards from the results
        filteredCards = results.map((result) => result.item);
    }

    currentPage = 1; // Reset to the first page when a new search is performed
    totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE); // Update total pages
    renderCards(currentPage, filteredCards);
    updatePaginationControls(currentPage, totalPages); // Update pagination controls
}

// Update pagination controls
function updatePaginationControls(currentPage, totalPages) {
    // Clear existing pagination controls
    paginationControls.innerHTML = "";

    // Helper function to create a pagination button
    const createButton = (page, text, isActive = false, isDisabled = false) => {
        const button = document.createElement("button");
        button.textContent = text;
        button.onclick = () => changePage(page);
        if (isActive) button.classList.add("active");
        if (isDisabled) button.disabled = true;
        return button;
    };

    // Previous button
    paginationControls.appendChild(createButton(currentPage - 1, "Previous", false, currentPage === 1));

    // Always show the first page
    paginationControls.appendChild(createButton(1, "1", currentPage === 1));

    // Show ellipsis if currentPage is far from the start
    if (currentPage > 3) {
        const ellipsis = document.createElement("span");
        ellipsis.textContent = "...";
        paginationControls.appendChild(ellipsis);
    }

    // Show pages around the current page
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        paginationControls.appendChild(createButton(i, i.toString(), i === currentPage));
    }

    // Show ellipsis if currentPage is far from the end
    if (currentPage < totalPages - 2) {
        const ellipsis = document.createElement("span");
        ellipsis.textContent = "...";
        paginationControls.appendChild(ellipsis);
    }

    // Always show the last page
    if (totalPages > 1) {
        paginationControls.appendChild(createButton(totalPages, totalPages.toString(), currentPage === totalPages));
    }

    // Next button
    paginationControls.appendChild(createButton(currentPage + 1, "Next", false, currentPage === totalPages));
}

// Change page
function changePage(newPage) {
    if (newPage < 1 || newPage > totalPages) return;
    currentPage = newPage;
    renderCards(currentPage); // Render cards for the new page
    updatePaginationControls(currentPage, totalPages); // Update pagination controls
}

// Attach changePage to the window object for global access
window.changePage = changePage;

// Attach renderCards, currentPage, and totalPages to the window object for global access
window.renderCards = renderCards;
window.currentPage = currentPage;
window.totalPages = totalPages;

// Initialize the search bar
const searchBar = new SearchBar(handleSearch);
searchBar.appendTo(document.getElementById("searchContainer"));

// Initial fetch and render
fetchAllCards();

// Modal functionality
const modal = document.getElementById("cardModal");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalType = document.getElementById("modalType");
const modalAttribute = document.getElementById("modalAttribute");
const modalLevel = document.getElementById("modalLevel");
const modalAtkDef = document.getElementById("modalAtkDef");
const modalDesc = document.getElementById("modalDesc");
const closeBtn = document.querySelector(".close-btn");

async function openModal(cardId, cards = allCards) {
    const card = cards.find((c) => c.id === cardId);
    if (card) {
        const imageUrl = card.card_images[0].image_url_cropped;
        const db = await initializeDB();
        const cachedImage = await loadImageFromIndexedDB(db, imageUrl);
        modalImage.src = cachedImage ? URL.createObjectURL(cachedImage) : imageUrl; // Use cached image if available
        modalName.textContent = card.name;
        modalType.textContent = `Type: ${card.type}`;
        modalAttribute.textContent = `Attribute: ${card.attribute}`;
        modalLevel.textContent = card.level ? `Level: ${card.level}` : "Level: N/A";
        modalAtkDef.textContent = `ATK: ${card.atk || "N/A"} / DEF: ${card.def || "N/A"}`;
        modalDesc.textContent = card.desc;
        modal.style.display = "flex";
    } else {
        console.error("Card not found!");
    }
}

function closeModal() {
    modal.style.display = "none";
}

closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeModal();
    }
});

// Notify user if there’s no network connection
window.addEventListener("offline", () => {
    const alertBox = document.getElementById("offline-alert");
    alertBox.style.opacity = "1";
    setTimeout(() => {
        alertBox.style.opacity = "0";
    }, 3000);
});

window.addEventListener("online", () => {
    const alertBox = document.getElementById("online-alert");
    alertBox.style.opacity = "1";
    setTimeout(() => {
        alertBox.style.opacity = "0";
    }, 3000);
});

// Event listeners for Load More and Jump to buttons
loadMoreButton.addEventListener("click", () => {
    currentPage++;
    renderCards(currentPage, filteredCards, true); // Append cards instead of replacing
    updatePaginationControls(currentPage, totalPages); // Update pagination controls
});

jumpToButton.addEventListener("click", () => {
    const page = parseInt(jumpToInput.value);
    if (page >= 1 && page <= totalPages) {
        changePage(page);
    } else {
        alert(`Please enter a valid page number between 1 and ${totalPages}.`);
    }
});