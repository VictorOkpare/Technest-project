async function fetchData() {
  
    const res = await fetch("../assets/data/heroDetails.json");
    const data = await res.json()
    
    return data;
  } 


const container = document.querySelector(".card-container");

const createHeroCards = async () => {
  try {
    const heroDetails = await fetchData();

    if (heroDetails.length === 0) {
      container.innerHTML = `<p>No hero card available. Please try again later.</p>`;
      return;
    }

    const cardItems = heroDetails
      .map((hero, index) => {
        return `<button onclick="window.location.href = './profileCard.html?index=${index}'">
          <div class="card-items">
            <img src="${hero.image}" alt="${hero.heroName}" />
            <h3>${hero.heroName}</h3>
          </div>
        </button>`;
      })
      .join("");

    container.innerHTML = cardItems;
  } catch (error) {
    console.error("Error creating hero cards:", error.message);
    container.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
  }
};

createHeroCards();
