(function() {
  let TARGET_WIDTH = 0;
  let TARGET_HEIGHT = 0;
  let wrapper = null;

  function initWrapper() {
    wrapper = document.getElementById('zoom-to-fit-wrapper');
    if (wrapper) return;

    // --- SLIMME ONAFHANKELIJKE METING ---
    const elements = document.body.querySelectorAll('*');
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let foundVisibleElement = false;

    // We pakken de breedte van het venster om elementen te herkennen die onbedoeld 100% breed zijn
    const currentWindowWidth = window.innerWidth;

    elements.forEach(el => {
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'LINK') return;

      const rect = el.getBoundingClientRect();

      if (rect.width > 0 && rect.height > 0) {
        // FILTER: Als een element de volledige schermbreedte claimt, negeren we de breedte hiervan
        if (rect.width >= currentWindowWidth - 10 && el.id !== 'zoom-to-fit-wrapper') {
          const scrollY = window.scrollY || window.pageYOffset;
          const top = rect.top + scrollY;
          const bottom = rect.bottom + scrollY;
          if (top < minY) minY = top;
          if (bottom > maxY) maxY = bottom;
          foundVisibleElement = true;
          return;
        }

        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        const left = rect.left + scrollX;
        const top = rect.top + scrollY;
        const right = rect.right + scrollX;
        const bottom = rect.bottom + scrollY;

        if (left < minX) minX = left;
        if (top < minY) minY = top;
        if (right > maxX) maxX = right;
        if (bottom > maxY) maxY = bottom;
        foundVisibleElement = true;
      }
    });

    if (foundVisibleElement) {
      const padding = 20; // Marge rondom het spel

      TARGET_WIDTH = (maxX !== -Infinity && minX !== Infinity) ? (maxX - minX) + (padding * 2) : (maxY - minY) + (padding * 2);
      TARGET_HEIGHT = (maxY - minY) + (padding * 2);
    } else {
      TARGET_WIDTH = window.innerWidth;
      TARGET_HEIGHT = window.innerHeight;
    }
    // --------------------------------------------

    wrapper = document.createElement('div');
    wrapper.id = 'zoom-to-fit-wrapper';

    while (document.body.firstChild) {
      wrapper.appendChild(document.body.firstChild);
    }
    document.body.appendChild(wrapper);

    const root = document.documentElement;
    root.style.width = '100%';
    root.style.height = '100%';
    root.style.overflow = 'hidden';
    root.style.margin = '0';
    root.style.padding = '0';

    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.position = 'relative';

    wrapper.style.width = TARGET_WIDTH + 'px';
    wrapper.style.height = TARGET_HEIGHT + 'px';
    wrapper.style.transformOrigin = 'center center';
    wrapper.style.position = 'absolute';
    wrapper.style.top = '50%';
    wrapper.style.left = '50%';
  }

  function doZoomToFit() {
    if (!wrapper) {
      initWrapper();
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const scaleX = viewportWidth / TARGET_WIDTH;
    const scaleY = viewportHeight / TARGET_HEIGHT;
    const scale = Math.min(scaleX, scaleY);

    wrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  window.triggerZoomToFit = function() {
    const existing = document.getElementById('zoom-to-fit-wrapper');
    if (existing) {
      while (existing.firstChild) {
        document.body.appendChild(existing.firstChild);
      }
      existing.remove();
      wrapper = null;
    }
    doZoomToFit();
  };

  window.addEventListener('resize', function() {
    if (wrapper) {
      doZoomToFit();
    }
  });
})();
