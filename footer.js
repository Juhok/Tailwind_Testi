const footerHtml = `
<footer class="bg-gray-800 text-white mt-12 py-8">
  <div class="container mx-auto px-4 text-center">
    <p id="footer-text">&copy; 2026 My Website. All rights reserved.</p>
  </div>
</footer>
`;

const footerContainer = document.getElementById('site-footer');
if (footerContainer) {
  footerContainer.innerHTML = footerHtml;

  const footerText = document.getElementById('footer-text');
  if (footerText && window.siteInfo) {
    footerText.innerHTML = `&copy; ${window.siteInfo.year} My Website. All rights reserved. Version ${window.siteInfo.version}`;
  }
}
