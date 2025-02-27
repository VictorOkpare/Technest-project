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
        this.searchInput.placeholder = "Enter a card name(partial matches are allowed)"; // Indicate fuzzy search
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

        // Append elements to the search bar
        this.searchBar.appendChild(this.searchInput);
        this.searchBar.appendChild(this.filterButton);
        this.searchBar.appendChild(this.clearButton);

        // Add event listeners
        this.searchInput.addEventListener("input", () => this.handleSearch());
        this.filterButton.addEventListener("click", () => this.toggleFilter());
        this.clearButton.addEventListener("click", () => this.clearSearch());
    }

    // Handle search input
    handleSearch() {
        const searchTerm = this.searchInput.value.trim().toLowerCase();
        console.log(`Searching for: ${searchTerm} in category: ${this.searchCategory}`); // Debug log
        this.onSearch({ searchTerm, category: this.searchCategory });

        // Enable/disable clear button based on input
        this.clearButton.disabled = !searchTerm;
    }

    // Toggle search category
    toggleFilter() {
        const categories = ["name", "attribute", "type", "level"];
        const currentIndex = categories.indexOf(this.searchCategory);
        this.searchCategory = categories[(currentIndex + 1) % categories.length]; // Cycle through categories

        // Update placeholder text to indicate fuzzy search
        switch (this.searchCategory) {
            case "name":
                this.searchInput.placeholder = "Enter a card name (partial matches are allowed)";
                break;
            case "attribute":
                this.searchInput.placeholder = "Enter a card attribute (partial matches are allowed)";
                break;
            case "type":
                this.searchInput.placeholder = "Enter a card type (partial matches are allowed)";
                break;
            case "level":
                this.searchInput.placeholder = "Enter a card level (partial matches are allowed)";
                break;
        }

        // Clear the input and trigger a new search
        this.searchInput.value = "";
        this.handleSearch();
    }

    // Clear search input
    clearSearch() {
        this.searchInput.value = "";
        this.handleSearch(); // Trigger search with empty term to reset results
        this.clearButton.disabled = true; // Disable clear button
    }

    // Method to append the search bar to a parent element
    appendTo(parentElement) {
        parentElement.appendChild(this.searchBar);
    }
}