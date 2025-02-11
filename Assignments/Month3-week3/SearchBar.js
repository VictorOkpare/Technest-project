export default class SearchBar {
  constructor(onSearch) {
    this.onSearch = onSearch; // Callback function to handle search
    this.searchCategory = "name"; // Default search category
    this.render();
  }

  render() {
    // Create the search bar container
    this.searchBar = document.createElement("div");
    this.searchBar.classList.add("search-bar");

    // Search input field
    this.searchInput = document.createElement("input");
    this.searchInput.type = "text";
    this.searchInput.placeholder = "Search by name (fuzzy)...";
    this.searchInput.classList.add("search-input");

    // Filter button
    this.filterButton = document.createElement("button");
    this.filterButton.textContent = "Filter";
    this.filterButton.classList.add("filter-button");

    // Optional: Clear button
    this.clearButton = document.createElement("button");
    this.clearButton.textContent = "Clear";
    this.clearButton.classList.add("clear-button");
    this.clearButton.disabled = true; // Disabled by default

    this.searchBar.appendChild(this.searchInput);
    this.searchBar.appendChild(this.filterButton);
    this.searchBar.appendChild(this.clearButton);

    this.searchInput.addEventListener("input", () => this.handleSearch());
    this.filterButton.addEventListener("click", () => this.toggleFilter());
    this.clearButton.addEventListener("click", () => this.clearSearch());
  }

  handleSearch() {
    const searchTerm = this.searchInput.value.trim().toLowerCase();
    console.log(
      `Searching for: ${searchTerm} in category: ${this.searchCategory}`
    ); // Debug log
    this.onSearch({ searchTerm, category: this.searchCategory });

    this.clearButton.disabled = !searchTerm;
  }

  toggleFilter() {
    const categories = ["name", "attribute", "type", "level"];
    const currentIndex = categories.indexOf(this.searchCategory);
    this.searchCategory = categories[(currentIndex + 1) % categories.length]; // Cycle through categories

    switch (this.searchCategory) {
      case "name":
        this.searchInput.placeholder = "Search by name (fuzzy)...";
        break;
      case "attribute":
        this.searchInput.placeholder = "Search by attribute (fuzzy)...";
        break;
      case "type":
        this.searchInput.placeholder = "Search by type (fuzzy)...";
        break;
      case "level":
        this.searchInput.placeholder = "Search by level (fuzzy)...";
        break;
    }

    this.searchInput.value = "";
    this.handleSearch();
  }

  clearSearch() {
    this.searchInput.value = "";
    this.handleSearch(); // Trigger search with empty term to reset results
    this.clearButton.disabled = true; // Disable clear button
  }

  appendTo(parentElement) {
    parentElement.appendChild(this.searchBar);
  }
}
