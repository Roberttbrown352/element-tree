// Define a function to get the parent elements of a given element.
function getParents(element) {
  let parents = [];
  // Loop through the parent elements until the 'body' element is reached.
  while (element && element.tagName.toLowerCase() !== "body") {
    // Add the current element's information to the parents array.
    parents.push({
      element: element.tagName.toLowerCase(),
      classes: element.className.split(" "),
      id: element.id || null,
    });
    // Move up to the parent element.
    element = element.parentElement;
  }
  // Return the collected parent elements.
  return parents;
}

// Add an event listener for messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Check if the message has the action "getElements".
  if (request.action === "getElements") {
    // Get the selected text node.
    let selectedNode = window.getSelection().anchorNode;
    // Traverse up the DOM tree until an element node is found.
    while (selectedNode && selectedNode.nodeType !== Node.ELEMENT_NODE) {
      selectedNode = selectedNode.parentNode;
    }

    // If a valid element node is found, send the parent elements as a response.
    if (selectedNode) {
      sendResponse({ elements: getParents(selectedNode) });
    } else {
      // Otherwise, send an empty array as a response.
      sendResponse({ elements: [] });
    }
  }
});
