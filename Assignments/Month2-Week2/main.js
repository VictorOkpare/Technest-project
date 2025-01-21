const API_URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php"; // API endpoint to fetch card data
const cardsWrapper = document.getElementById("cardsWrapper"); // Container for card elements

// Fetch card data from the API
fetch(API_URL)
    .then(response => {
        if (!response.ok) {
            
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(data => {
        // Extract the first 12 cards from the fetched data
        const cards = data.data.slice(0, 12);

        // Dynamically render card elements on the page
        cards.forEach(card => {
            const cardElement = `
                <div class="card-container" onclick="openModal(${card.id})">
                    <div class="image-container">
                        <img src="${card.card_images[0].image_url_cropped}" alt="${card.name}">
                    </div>
                    <div class="text-container">
                        <a href="#">${card.name}</a>
                    </div>
                </div>
            `;
            cardsWrapper.innerHTML += cardElement; 
        });

        // Stores the fetched cards in a global variable for modal usage
        window.cards = cards;
    })
    .catch(error => {
        // Handles error (e.g., network issues or API failures)
        console.error("Error fetching cards:", error);

        
        cardsWrapper.innerHTML = `
            <p class="error-message">Failed to load cards. Please check your internet connection or try again later.</p>
        `;
    });

const modal = document.getElementById("cardModal");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalType = document.getElementById("modalType");
const modalAttribute = document.getElementById("modalAttribute");
const modalLevel = document.getElementById("modalLevel");
const modalAtkDef = document.getElementById("modalAtkDef");
const modalDesc = document.getElementById("modalDesc");
const closeBtn = document.querySelector(".close-btn");

// Open modal with card details
function openModal(cardId) {
    // Find the card data using its ID
    const card = window.cards.find(c => c.id === cardId);
    if (card) {
        
        modalImage.src = card.card_images[0].image_url_cropped;
        modalName.textContent = card.name;
        modalType.textContent = `Type: ${card.type}`;
        modalAttribute.textContent = `Attribute: ${card.attribute}`;
        modalLevel.textContent = card.level ? `Level: ${card.level}` : "Level: N/A";
        modalAtkDef.textContent = `ATK: ${card.atk || "N/A"} / DEF: ${card.def || "N/A"}`;
        modalDesc.textContent = card.desc;

        // Display the modal
        modal.style.display = "flex";
    } else {
        console.error("Card not found!");
    }
}

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Closes modal when clicking outside the modal content
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Notify user if there’s no network connection
window.addEventListener("offline", () => {
    alert("You are offline. Please check your internet connection.");
});
