(function () {
  function getParents(element) {
    let parents = [];
    while (element && element.tagName.toLowerCase() !== "body") {
      parents.push({
        element: element.tagName.toLowerCase(),
        classes: element.className.split(" "),
        id: element.id || null,
      });
      element = element.parentElement;
    }
    return parents;
  }

  let selectedNode = window.getSelection().anchorNode;
  while (selectedNode && selectedNode.nodeType !== Node.ELEMENT_NODE) {
    selectedNode = selectedNode.parentNode;
  }

  if (selectedNode) {
    console.log(getParents(selectedNode));
  } else {
    console.log("No valid element node found.");
  }
})();
