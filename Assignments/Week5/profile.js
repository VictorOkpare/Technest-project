async function fetchData() {
  const res = await fetch("../assets/data/heroDetails.json")
  const data = await res.json()

  return data
};



// selects the DOM element the profile card will be rendered into
const profileContainer = document.querySelector(".card-ctn")


//retrieves the Hero index and makes sure it is parses as an interger using the parseInt() function
const urlParams = new URLSearchParams(window.location.search);
const heroIndex = parseInt(urlParams.get("index"),10);

//this function renders the heroprofilecard
const heroProfileCard = async ()=>{

try{

  heroDetails= await fetchData()

  const hero = heroDetails[heroIndex];
  
  if (isNaN(heroIndex) || heroIndex >= heroDetails.length || heroIndex === undefined || heroIndex === null){
    container.innerHTML =`<p> Error Fetching Hero Profile Card. Try again <p>`
  }
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
} catch{
 console.error("invalid inex")
}
}
// calls the heroProfileCard() Function
heroProfileCard();




