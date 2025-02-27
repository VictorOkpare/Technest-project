// Get modal elements
const settingsModal = document.getElementById("settingsModal");
const settingsButton = document.getElementById("settingsButton");
const closeSettings = document.getElementById("closeSettings");
const autoThemeYes = document.getElementById("autoThemeYes");
const autoThemeNo = document.getElementById("autoThemeNo");
const archetypeSelect = document.getElementById("archetypeSelect");

// Open Settings Modal
settingsButton.addEventListener("click", () => {
    settingsModal.style.display = "flex";
});

// Close Settings Modal
closeSettings.addEventListener("click", () => {
    settingsModal.style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
        settingsModal.style.display = "none";
    }
});

// Function to enable auto theme switching
function enableAutoTheme() {
    const hour = new Date().getHours();
    const isDayTime = hour >= 6 && hour < 18;
    const newTheme = isDayTime ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    // Check every hour to update the theme
    setInterval(() => {
        const hour = new Date().getHours();
        const isDayTime = hour >= 6 && hour < 18;
        const newTheme = isDayTime ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    }, 3600000); // 1 hour
}

// Function to disable auto theme switching
function disableAutoTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
}

// Load user preference for auto theme
const autoThemeEnabled = localStorage.getItem("autoThemeEnabled") === "true";
if (autoThemeEnabled) {
    autoThemeYes.checked = true;
    enableAutoTheme();
} else {
    autoThemeNo.checked = true;
    disableAutoTheme();
}

// Event listeners for theme toggle
autoThemeYes.addEventListener("change", () => {
    if (autoThemeYes.checked) {
        enableAutoTheme();
        localStorage.setItem("autoThemeEnabled", "true");
    }
});

autoThemeNo.addEventListener("change", () => {
    if (autoThemeNo.checked) {
        disableAutoTheme();
        localStorage.setItem("autoThemeEnabled", "false");
    }
});

// Fetch archetypes from API
async function fetchArchetypes() {
    try {
        const response = await fetch("https://db.ygoprodeck.com/api/v7/archetypes.php");
        if (!response.ok) {
            throw new Error("Failed to fetch archetypes");
        }
        const data = await response.json();
        populateArchetypeSelect(data);
    } catch (error) {
        console.error("Error fetching archetypes:", error);
    }
}

// Populate archetype select dropdown
function populateArchetypeSelect(archetypes) {
    archetypes.forEach((archetype) => {
        const option = document.createElement("option");
        option.value = archetype.archetype_name;
        option.textContent = archetype.archetype_name;
        archetypeSelect.appendChild(option);
    });
}

// Save selected archetype in localStorage
archetypeSelect.addEventListener("change", () => {
    const selectedArchetype = archetypeSelect.value;
    localStorage.setItem("selectedArchetype", selectedArchetype);
    window.location.reload(); // Reload the page to apply the new archetype
});

// Initialize settings on page load
function initializeSettings() {
    // Load saved archetype
    const savedArchetype = localStorage.getItem("selectedArchetype") || "Elemental HERO";
    archetypeSelect.value = savedArchetype;

    // Fetch archetypes from API
    fetchArchetypes();
}

document.addEventListener("DOMContentLoaded", initializeSettings);
