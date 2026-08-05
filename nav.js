const siteName = (window.siteInfo && window.siteInfo.siteName) || 'PixelVibe Studio';
const navHtml = `
<nav class="bg-white shadow-lg">
  <div class="container mx-auto px-4 py-4 flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-800">${siteName}</h1>

    <button id="nav-toggle" type="button" class="md:hidden inline-flex items-center justify-center rounded-md border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label="Open navigation menu">
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <div id="nav-links" class="hidden md:flex md:items-center md:space-x-6">
      <a href="index.html" class="text-gray-600 hover:text-gray-900 transition duration-300">Home</a>
      <a href="about.html" class="text-gray-600 hover:text-gray-900 transition duration-300">About</a>
      <a href="health.html" class="text-gray-600 hover:text-gray-900 transition duration-300">Health</a>
      <a href="games.html" class="text-gray-600 hover:text-gray-900 transition duration-300">Games</a>
      <a href="tietovisa.html" class="text-gray-600 hover:text-gray-900 transition duration-300">Quiz</a>
    </div>
  </div>

  <div id="mobile-nav" class="hidden border-t border-gray-100 px-4 pb-4 md:hidden">
    <div class="flex flex-col space-y-3 pt-4">
      <a href="index.html" class="text-gray-600 hover:text-gray-900 transition duration-300">Home</a>
      <a href="about.html" class="text-gray-600 hover:text-gray-900 transition duration-300">About</a>
      <a href="health.html" class="text-gray-600 hover:text-gray-900 transition duration-300">Health</a>
      <a href="games.html" class="text-gray-600 hover:text-gray-900 transition duration-300">Games</a>
      <a href="tietovisa.html" class="text-gray-600 hover:text-gray-900 transition duration-300">Quiz</a>
    </div>
  </div>
</nav>
`;

const navContainer = document.getElementById('site-nav');
if (navContainer) {
  navContainer.innerHTML = navHtml;

  const toggleButton = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (toggleButton && mobileNav) {
    toggleButton.addEventListener('click', () => {
      const isHidden = mobileNav.classList.contains('hidden');
      if (isHidden) {
        mobileNav.classList.remove('hidden');
      } else {
        mobileNav.classList.add('hidden');
      }
    });
  }
}
