const footerSiteName = (window.siteInfo && window.siteInfo.siteName) || 'PixelVibe Studio';
const footerYear = (window.siteInfo && window.siteInfo.year) || '2026';
const footerVersion = window.siteInfo && window.siteInfo.version;

const footerCopy = footerVersion
  ? `&copy; ${footerYear} <span class="site-logo-text font-bold">${footerSiteName}</span>. All rights reserved. Version ${footerVersion}`
  : `&copy; ${footerYear} <span class="site-logo-text font-bold">${footerSiteName}</span>. All rights reserved.`;

const footerHtml = `
<footer class="fixed bottom-0 left-0 right-0 z-50 bg-gray-800 text-white py-8 shadow-inner">
  <div class="container mx-auto px-4 text-center">
    <p id="footer-text" class="flex items-center justify-center gap-3 text-sm font-medium">
      <img src="img/logo.svg" alt="PixelVibe Studio logo" class="h-8 w-8" />
      <span>${footerCopy}</span>
    </p>
  </div>
</footer>
`;

const footerContainer = document.getElementById('site-footer');
if (footerContainer) {
  footerContainer.innerHTML = footerHtml;
}

const footerStyle = document.createElement('style');
footerStyle.textContent = `
  body {
    padding-bottom: 6rem;
  }
`;
document.head.appendChild(footerStyle);
