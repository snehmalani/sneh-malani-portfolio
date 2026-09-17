(function () {
  "use strict";

  function isEditableTarget(target) {
    if (!target || !target.closest) {
      return false;
    }
    return Boolean(target.closest("input, textarea, .allow-copy"));
  }

  document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });

  document.addEventListener("selectstart", function (event) {
    if (!isEditableTarget(event.target)) {
      event.preventDefault();
    }
  });

  document.addEventListener("dragstart", function (event) {
    event.preventDefault();
  });

  document.addEventListener("copy", function (event) {
    if (!isEditableTarget(event.target)) {
      event.preventDefault();
    }
  });

  document.addEventListener("keydown", function (event) {
    var key = event.key;
    var upper = key ? key.toUpperCase() : "";
    var lower = key ? key.toLowerCase() : "";
    var cmd = event.metaKey || event.ctrlKey;

    var blocked =
      key === "F12" ||
      key === "PrintScreen" ||
      (cmd && event.shiftKey && (upper === "I" || upper === "J" || upper === "C" || upper === "K")) ||
      (event.metaKey && event.altKey && (upper === "I" || upper === "J" || upper === "C")) ||
      (cmd && lower === "u") ||
      (cmd && lower === "s") ||
      (cmd && lower === "p");

    if (blocked) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  document.addEventListener("keyup", function (event) {
    if (event.key !== "PrintScreen") {
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText("").catch(function () {
        return undefined;
      });
    }
  });
})();
