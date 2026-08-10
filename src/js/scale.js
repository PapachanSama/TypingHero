/**
 * 1920x1080 Auto-Scaling Engine (Pixel-Perfect Centering)
 * Automatically scales the #app-viewport container to fit the user's screen perfectly.
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
    
    // Maintain 16:9 aspect ratio while fitting within window
    const scale = Math.min(scaleX, scaleY);

    // Calculate exact pixel offset for perfect centering
    const offsetX = (windowWidth - BASE_WIDTH * scale) / 2;
    const offsetY = (windowHeight - BASE_HEIGHT * scale) / 2;
    
    viewport.style.transformOrigin = '0 0';
    viewport.style.left = '0px';
    viewport.style.top = '0px';
    viewport.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  }

  window.addEventListener('resize', updateScale);
  updateScale();
}
