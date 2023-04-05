// Define a function to update the CSS selector displayed in the 'css-selector' paragraph.
function updateCssSelector() {
  // Get the selected values from all the dropdowns and join them with the '>' separator.
  const cssSelector = Array.from(document.querySelectorAll("select"))
    .map((select) => select.options[select.selectedIndex].textContent)
    .join(" > ");

  // Update the text content of the 'css-selector' paragraph.
  document.getElementById("css-selector").textContent = cssSelector;
}

// Query the active tab in the current window.
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  // Send a message to the content script in the active tab requesting the parent elements.
  chrome.tabs.sendMessage(tabs[0].id, { action: "getElements" }, (response) => {
    if (response && response.elements) {
      const container = document.getElementById("elements-container");
      const reversedElements = response.elements.reverse();

      // Iterate through the reversed parent elements.
      reversedElements.forEach((elementInfo) => {
        // Create a div to hold the element's info and dropdown.
        const elementDiv = document.createElement("div");
        elementDiv.className = "flex gap-1 pb-1";

        // Create a paragraph for the element's name.
        const p = document.createElement("p");
        p.textContent = elementInfo.element;
        elementDiv.appendChild(p);

        // Create the select dropdown for the element.
        const select = document.createElement("select");
        select.className = "bg-slate-400 text-gray-900 rounded-sm";

        // Add the element's name as the first option in the dropdown.
        const elementOption = document.createElement("option");
        elementOption.value = "element";
        elementOption.textContent = elementInfo.element;
        select.appendChild(elementOption);

        // If the element has classes, add them as options in the dropdown.
        if (elementInfo.classes.length > 0) {
          elementInfo.classes.forEach((className, index) => {
            if (className.trim() !== "") {
              const classOption = document.createElement("option");
              classOption.value = `class${index + 1}`;
              classOption.textContent = `.${className}`; // Add the dot prefix
              classOption.className = "text-blue-700"; // Add the desired class
              select.appendChild(classOption);
            }
          });
        }

        // If the element has an ID, add it as an option in the dropdown.
        if (elementInfo.id) {
          const idOption = document.createElement("option");
          idOption.value = "id";
          idOption.textContent = `#${elementInfo.id}`; // Add the hash prefix
          idOption.className = "text-orange-400"; // Add the desired class
          select.appendChild(idOption);
        }

        // Add a change event listener to the select element.
        select.addEventListener("change", updateCssSelector);
        elementDiv.appendChild(select);
        container.appendChild(elementDiv);
      });

      // Do an initial update of the 'css-selector' paragraph.
      updateCssSelector();
    }
  });
});

// Add a click event listener to the 'copy-button'.
document.getElementById("copy-button").addEventListener("click", () => {
  // Get the text content of the 'css-selector' paragraph.
  const cssSelectorText = document.getElementById("css-selector").textContent;

  // Copy the text to the clipboard.
  navigator.clipboard
    .writeText(cssSelectorText)
    .then(() => {
      console.log("Copied to clipboard:", cssSelectorText);
    })
    .catch((err) => {
      console.error("Could not copy text: ", err);
    });
});
