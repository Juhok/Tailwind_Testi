const footerHtml = `
<footer class="fixed bottom-0 left-0 right-0 z-50 bg-gray-800 text-white py-8 shadow-inner">
  <div class="container mx-auto px-4 text-center">
    <p id="footer-text" class="flex items-center justify-center gap-3 text-sm font-medium">
      <img src="img/logo.svg" alt="PixelVibe Studio logo" class="h-8 w-8" />
      <span>&copy; 2026 PixelVibe Studio. All rights reserved.</span>
    </p>
  </div>
</footer>
`;

const footerContainer = document.getElementById('site-footer');
if (footerContainer) {
  footerContainer.innerHTML = footerHtml;

  const footerText = document.getElementById('footer-text');
  if (footerText && window.siteInfo) {
    const siteName = window.siteInfo.siteName || 'PixelVibe Studio';
    footerText.innerHTML = `
      <img src="img/logo.svg" alt="PixelVibe Studio logo" class="h-8 w-8" />
      <span>&copy; ${window.siteInfo.year} ${siteName}. All rights reserved. Version ${window.siteInfo.version}</span>
    `;
  }
}

const footerStyle = document.createElement('style');
footerStyle.textContent = `
  body {
    padding-bottom: 6rem;
  }
`;
document.head.appendChild(footerStyle);
