const footerHtml = `
<footer class="bg-gray-800 text-white mt-12 py-8">
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
