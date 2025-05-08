document.addEventListener("DOMContentLoaded", () => {
    const zoomToggle = document.getElementById("zoom-toggle");
    const zoomPopup = document.getElementById("zoom-popup");
    const zoomInBtn = document.getElementById("zoom-in");
    const zoomOutBtn = document.getElementById("zoom-out");
  
    let currentZoom = 1;
  
    zoomToggle.addEventListener("click", () => {
      zoomPopup.classList.toggle("hidden");
    });
  
    zoomInBtn.addEventListener("click", () => {
      currentZoom = Math.min(currentZoom + 0.1, 2); // Max zoom 200%
      document.body.style.zoom = currentZoom;
    });
  
    zoomOutBtn.addEventListener("click", () => {
      currentZoom = Math.max(currentZoom - 0.1, 0.5); // Min zoom 50%
      document.body.style.zoom = currentZoom;
    });
  });
  