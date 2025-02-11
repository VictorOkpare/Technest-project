import SearchBar from "./SearchBar";

describe("SearchBar", () => {
  let searchBar;
  let mockOnSearch;
  let parentElement;

  beforeEach(() => {
    mockOnSearch = jest.fn();

    parentElement = document.createElement("div");
    document.body.appendChild(parentElement);

    searchBar = new SearchBar(mockOnSearch);
    searchBar.appendTo(parentElement);
  });

  afterEach(() => {
    document.body.removeChild(parentElement);
  });

  test("should render the search bar with input, filter button, and clear button", () => {
    const searchInput = parentElement.querySelector(".search-input");
    const filterButton = parentElement.querySelector(".filter-button");
    const clearButton = parentElement.querySelector(".clear-button");

    expect(searchInput).not.toBeNull();
    expect(filterButton).not.toBeNull();
    expect(clearButton).not.toBeNull();
  });

  test("should call onSearch with the correct search term and category when input changes", () => {
    const searchInput = parentElement.querySelector(".search-input");
    searchInput.value = "test search";
    searchInput.dispatchEvent(new Event("input"));

    expect(mockOnSearch).toHaveBeenCalledWith({
      searchTerm: "test search",
      category: "name",
    });
  });

  test("should toggle search category and update placeholder when filter button is clicked", () => {
    const filterButton = parentElement.querySelector(".filter-button");
    const searchInput = parentElement.querySelector(".search-input");

    expect(searchInput.placeholder).toBe("Search by name (fuzzy)...");

    filterButton.click();
    expect(searchInput.placeholder).toBe("Search by attribute (fuzzy)...");

    filterButton.click();
    expect(searchInput.placeholder).toBe("Search by type (fuzzy)...");

    filterButton.click();
    expect(searchInput.placeholder).toBe("Search by level (fuzzy)...");

    filterButton.click();
    expect(searchInput.placeholder).toBe("Search by name (fuzzy)...");
  });

  test("should clear search input and disable clear button when clear button is clicked", () => {
    const searchInput = parentElement.querySelector(".search-input");
    const clearButton = parentElement.querySelector(".clear-button");

    searchInput.value = "test search";
    searchInput.dispatchEvent(new Event("input"));

    expect(clearButton.disabled).toBe(false);

    clearButton.click();

    expect(searchInput.value).toBe("");
    expect(clearButton.disabled).toBe(true);

    expect(mockOnSearch).toHaveBeenCalledWith({
      searchTerm: "",
      category: "name",
    });
  });

  test("should enable/disable clear button based on input value", () => {
    const searchInput = parentElement.querySelector(".search-input");
    const clearButton = parentElement.querySelector(".clear-button");

    expect(clearButton.disabled).toBe(true);

    searchInput.value = "test search";
    searchInput.dispatchEvent(new Event("input"));

    expect(clearButton.disabled).toBe(false);

    searchInput.value = "";
    searchInput.dispatchEvent(new Event("input"));

    expect(clearButton.disabled).toBe(true);
  });
});
