// gameMode.js
const GAME_ARCHETYPES = {
    ELEMENTAL_HERO: "https://db.ygoprodeck.com/api/v7/cardinfo.php?archetype=Elemental%20HERO",
    DESTINY_HERO: "https://db.ygoprodeck.com/api/v7/cardinfo.php?archetype=Destiny%20HERO"
  };
  
  let gameCards = [];
  let player1Life = 4000;
  let player2Life = 4000;
  let player1Cards = [];
  let player2Cards = [];
  let currentPlayer = 1;
  
  // Initialize IndexedDB for game mode
  const initializeGameDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("GameCardImagesDB", 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("gameImages")) {
          db.createObjectStore("gameImages", { keyPath: "url" });
        }
      };
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };
  
  const saveGameImage = async (db, imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const transaction = db.transaction("gameImages", "readwrite");
      const store = transaction.objectStore("gameImages");
      await store.put({ url: imageUrl, blob });
      console.log("Small game image saved:", imageUrl);
    } catch (error) {
      console.error("Error saving small game image:", error);
    }
  };
  
  const loadGameImage = async (db, imageUrl) => {
    return new Promise((resolve) => {
      const transaction = db.transaction("gameImages", "readonly");
      const store = transaction.objectStore("gameImages");
      const request = store.get(imageUrl);
  
      request.onsuccess = () => resolve(request.result?.blob);
      request.onerror = () => resolve(null);
    });
  };
  
  // Fetch game-specific cards
  const fetchGameCards = async () => {
    try {
      const [elementalResponse, destinyResponse] = await Promise.all([
        fetch(GAME_ARCHETYPES.ELEMENTAL_HERO),
        fetch(GAME_ARCHETYPES.DESTINY_HERO)
      ]);
  
      const elementalData = await elementalResponse.json();
      const destinyData = await destinyResponse.json();
  
      // Combine and filter valid cards
      gameCards = [
        ...(elementalData.data || []),
        ...(destinyData.data || [])
      ].filter(card => {
        // Ensure the card has the required properties
        return card?.card_images?.[0]?.image_url_small && card?.name && card?.type;
      });
  
      // Cache small images
      const db = await initializeGameDB();
      await Promise.all(
        gameCards.map(card => 
          saveGameImage(db, card.card_images[0].image_url_small) // Cache small images
        )
      );
  
      console.log("Game cards loaded with small images:", gameCards);
      return true;
    } catch (error) {
      console.error("Error loading game cards:", error);
      return false;
    }
  };
  
  // Modified game initialization
  const initializeGame = async () => {
    const success = await fetchGameCards();
    if (!success || gameCards.length === 0) {
      alert("Failed to load game cards. Please try again.");
      return;
    }
  
    player1Life = 4000;
    player2Life = 4000;
    currentPlayer = 1;
    player1Cards = getRandomCards(2);
    player2Cards = getRandomCards(2);
  
    updateGameInterface();
  };
  
  // Modified card rendering with cached images
  const renderCards = async (containerId, cards) => {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error("Container not found:", containerId);
      return;
    }
  
    container.innerHTML = "";
    const db = await initializeGameDB();
  
    for (const card of cards) {
      if (!card?.card_images?.[0]?.image_url_small) {
        console.warn("Skipping invalid card:", card);
        continue; // Skip if no small image
      }
  
      const cardElement = document.createElement("div");
      cardElement.className = "game-card";
  
      // Try to load cached small image
      const cachedImage = await loadGameImage(db, card.card_images[0].image_url_small);
      const imageUrl = cachedImage ? 
        URL.createObjectURL(cachedImage) : 
        card.card_images[0].image_url_small; // Use small image URL
  
      cardElement.innerHTML = `
        <img src="${imageUrl}" alt="${card.name}" 
             onerror="this.src='../assets/images/fallback-card.png'">
        <div class="card-stats">
          <p>${card.name}</p>
          <p>ATK: ${card.atk || 'N/A'}</p>
          <p>DEF: ${card.def || 'N/A'}</p>
        </div>
      `;
  
      cardElement.addEventListener("click", () => handleCardClick(card));
      container.appendChild(cardElement);
    }
  };
  
  // Modified card selection logic
  const getRandomCards = (count) => {
    const shuffled = [...gameCards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).filter(card => 
      card.type && !card.type.includes("Spell") && !card.type.includes("Trap") &&
      card.card_images?.[0]?.image_url_small // Ensure small image exists
    );
  };
  
  // Modified playCard function
  const playCard = async (card) => {
    if (!card) return;
  
    // Handle spell/trap cards
    if (card.type.includes("Spell") || card.type.includes("Trap")) {
      const newCards = getRandomCards(card.type.includes("Spell") ? 1 : 2);
      if (currentPlayer === 1) {
        player1Cards = [...player1Cards, ...newCards];
      } else {
        player2Cards = [...player2Cards, ...newCards];
      }
      await updateGameInterface();
      return;
    }
  
    // Battle logic
    const opponent = currentPlayer === 1 ? 2 : 1;
    const opponentCards = opponent === 1 ? player1Cards : player2Cards;
  
    if (opponentCards.length === 0) {
      // Direct attack
      const damage = card.atk || 0;
      if (opponent === 1) player1Life -= damage;
      else player2Life -= damage;
    } else {
      // Card battle
      const opponentCard = opponentCards[0];
      const attack = card.atk || 0;
      const defense = opponentCard.def || 0;
  
      if (attack > defense) {
        opponentCards.shift();
        const damage = attack - defense;
        if (opponent === 1) player1Life -= damage;
        else player2Life -= damage;
      } else {
        const damage = defense - attack;
        if (currentPlayer === 1) player1Life -= damage;
        else player2Life -= damage;
  
        // Remove attacking card
        if (currentPlayer === 1) {
          player1Cards = player1Cards.filter(c => c.id !== card.id);
        } else {
          player2Cards = player2Cards.filter(c => c.id !== card.id);
        }
      }
    }
  
    checkGameOver();
    await updateGameInterface();
  };
  
  // Start game handler
  document.getElementById("singlePlayer").addEventListener("click", async () => {
    showLoadingSpinner();
    await initializeGame();
    hideLoadingSpinner();
  });
  
  // Initial fetch when game mode is accessed
  window.addEventListener("game-mode-init", async () => {
    await fetchGameCards();
  });