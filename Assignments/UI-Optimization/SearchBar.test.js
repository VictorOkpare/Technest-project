import SearchBar from './SearchBar';

describe('SearchBar', () => {
    let searchBar;
    let mockOnSearch;
    let parentElement;

    beforeEach(() => {
        // Create a mock callback function for onSearch
        mockOnSearch = jest.fn();

        // Create a parent element to append the search bar
        parentElement = document.createElement('div');
        document.body.appendChild(parentElement);

        // Initialize the SearchBar instance
        searchBar = new SearchBar(mockOnSearch);
        searchBar.appendTo(parentElement);
    });

    afterEach(() => {
        // Clean up the DOM after each test
        document.body.removeChild(parentElement);
    });

    test('should render the search bar with input, filter button, and clear button', () => {
        const searchInput = parentElement.querySelector('.search-input');
        const filterButton = parentElement.querySelector('.filter-button');
        const clearButton = parentElement.querySelector('.clear-button');

        expect(searchInput).not.toBeNull();
        expect(filterButton).not.toBeNull();
        expect(clearButton).not.toBeNull();
    });

    test('should call onSearch with the correct search term and category when input changes', () => {
        const searchInput = parentElement.querySelector('.search-input');
        searchInput.value = 'test search';
        searchInput.dispatchEvent(new Event('input'));

        expect(mockOnSearch).toHaveBeenCalledWith({
            searchTerm: 'test search',
            category: 'name',
        });
    });

    test('should toggle search category and update placeholder when filter button is clicked', () => {
        const filterButton = parentElement.querySelector('.filter-button');
        const searchInput = parentElement.querySelector('.search-input');

        // Initial placeholder
        expect(searchInput.placeholder).toBe('Search by name (fuzzy)...');

        // Click the filter button to toggle the category
        filterButton.click();
        expect(searchInput.placeholder).toBe('Search by attribute (fuzzy)...');

        // Click again to toggle to the next category
        filterButton.click();
        expect(searchInput.placeholder).toBe('Search by type (fuzzy)...');

        // Click again to toggle to the next category
        filterButton.click();
        expect(searchInput.placeholder).toBe('Search by level (fuzzy)...');

        // Click again to cycle back to the first category
        filterButton.click();
        expect(searchInput.placeholder).toBe('Search by name (fuzzy)...');
    });

    test('should clear search input and disable clear button when clear button is clicked', () => {
        const searchInput = parentElement.querySelector('.search-input');
        const clearButton = parentElement.querySelector('.clear-button');

        // Set a value in the search input
        searchInput.value = 'test search';
        searchInput.dispatchEvent(new Event('input'));

        // Ensure the clear button is enabled
        expect(clearButton.disabled).toBe(false);

        // Click the clear button
        clearButton.click();

        // Ensure the input is cleared and the clear button is disabled
        expect(searchInput.value).toBe('');
        expect(clearButton.disabled).toBe(true);

        // Ensure onSearch is called with an empty search term
        expect(mockOnSearch).toHaveBeenCalledWith({
            searchTerm: '',
            category: 'name',
        });
    });

    test('should enable/disable clear button based on input value', () => {
        const searchInput = parentElement.querySelector('.search-input');
        const clearButton = parentElement.querySelector('.clear-button');

        // Initially, the clear button should be disabled
        expect(clearButton.disabled).toBe(true);

        // Set a value in the search input
        searchInput.value = 'test search';
        searchInput.dispatchEvent(new Event('input'));

        // Ensure the clear button is enabled
        expect(clearButton.disabled).toBe(false);

        // Clear the input
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));

        // Ensure the clear button is disabled again
        expect(clearButton.disabled).toBe(true);
    });
});