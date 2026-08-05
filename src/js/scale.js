/**
 * 1920x1080 Auto-Scaling Engine
 * Automatically scales the #app-viewport container to fit the user's screen.
 */

export function initScaler() {
  const viewport = document.getElementById('app-viewport');
  if (!viewport) return;

  const BASE_WIDTH = 1920;
  const BASE_HEIGHT = 1080;

  function updateScale() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const scaleX = windowWidth / BASE_WIDTH;
    const scaleY = windowHeight / BASE_HEIGHT;
    
    // Maintain aspect ratio while fitting within window
    const scale = Math.min(scaleX, scaleY);

    viewport.style.transform = `scale(${scale})`;

    // Center viewport inside window
    const offsetX = (windowWidth - BASE_WIDTH * scale) / 2;
    const offsetY = (windowHeight - BASE_HEIGHT * scale) / 2;
    
    viewport.style.left = `${offsetX}px`;
    viewport.style.top = `${offsetY}px`;
  }

  window.addEventListener('resize', updateScale);
  updateScale();
}
