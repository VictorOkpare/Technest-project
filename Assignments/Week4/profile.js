const heroDetails = [

  {
    image: "../assets/images/bubbleman.png",
    heroName: "Bubbleman",
    description: "When this is the only card in your hand, you can treat this card's Summon as a Special Summon. When it is Normal Summoned, Flip Summoned, or Special Summoned, if there are no other cards on your side of the field, draw 2 cards from your Deck."

  },

  {
    image: "../assets/images/avian.jpg",
    heroName: "Avian",
    description: "Avian is a Level 4 WIND Attribute Warrior-Type monster . It's a key member of the Elemental HERO archetype, known for its aerial prowess and support for other HERO monsters"

  },

  {
    image: "../assets/images/Clayman.webp",
    heroName: "Clayman",
    description: "An Elemental Hero with a clay body built-to-last. He will preserve his Elemental Hero colleagues at any cost."
  },

  {
    image: "../assets/images/Neos.jpg",
    heroName: "Neos",
    description: "Neos is a powerful Fusion Monster from the Yu-Gi-Oh! series. It's often considered one of the most iconic cards "

  },

  {
    image: "../assets/images/Sparksman.png",
    heroName: "Sparksman",
    description: "An Elemental Hero and a warrior of light who proficiently wields many kinds of armaments. His Shining Surge Flash cuts off the path of villainy",
  },

  {
    image: "../assets/images/ShiningFlareWingman.webp",
    heroName: "Shinning Flare Wingman",
    description: "Shining Flare Wingman is a powerful Fusion Monster. It's a fusion of 'Elemental HERO Flame Wingman' and 'Elemental HERO Sparkman'."
  }

];

// selects the DOM element the profile card will be rendered into
const profileContainer = document.querySelector(".card-ctn")


//retrieves the Hero index and makes sure it is parses as an interger using the parseInt() function
const urlParams = new URLSearchParams(window.location.search);
const heroIndex = parseInt(urlParams.get("index"),10);

//this function renders the heroprofilecard
const heroProfileCard = ()=>{

  const hero = heroDetails[heroIndex];
  
    const cardItem =`
      <div class="card-header-ctn">
        <p> HERO CARD</p>
        <div class="card-image-ctn">
          <img src=${hero.image} alt=${hero.heroName}>
        </div>

        <div class="card-text-ctn">
            <p class="hero-name">${hero.heroName}</p>
            <p class="archetype">Elemental hero</p>
            <p class="description">${hero.description}</p>
        </div>
        </div>

        `;
  

  profileContainer.innerHTML = cardItem
}
// calls the heroProfileCard() Function
heroProfileCard();

