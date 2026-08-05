const siteName = (window.siteInfo && window.siteInfo.siteName) || 'PixelVibe Studio';
const navHtml = `
<nav class="fixed top-0 left-0 right-0 z-50 bg-white/95 shadow-lg backdrop-blur dark:bg-[#0f172a]/95" style="background-color: #ffffff;">
  <div class="container mx-auto px-4 py-4 flex items-center justify-between">
    <a href="index.html" class="flex items-center gap-3 no-underline">
      <img src="img/logo.svg" alt="PixelVibe Studio logo" class="h-10 w-10 self-center" />
      <span class="text-2xl font-bold text-gray-800 leading-none dark:text-white">${siteName}</span>
    </a>

    <button id="nav-toggle" type="button" class="md:hidden inline-flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-[#243244] dark:bg-[#0f172a] dark:text-slate-200 dark:hover:bg-[#111827]" aria-label="Open navigation menu">
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <div id="nav-links" class="hidden md:flex md:items-center md:space-x-6">
      <a href="index.html" class="text-gray-600 hover:text-gray-900 transition duration-300 dark:text-slate-200 dark:hover:text-white">Home</a>
      <a href="about.html" class="text-gray-600 hover:text-gray-900 transition duration-300 dark:text-slate-200 dark:hover:text-white">About</a>
      <a href="health.html" class="text-gray-600 hover:text-gray-900 transition duration-300 dark:text-slate-200 dark:hover:text-white">Health</a>
      <a href="games.html" class="text-gray-600 hover:text-gray-900 transition duration-300 dark:text-slate-200 dark:hover:text-white">Games</a>
      <a href="tietovisa.html" class="text-gray-600 hover:text-gray-900 transition duration-300 dark:text-slate-200 dark:hover:text-white">Quiz</a>
      <label class="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 transition duration-300 hover:bg-gray-50 dark:border-[#243244] dark:bg-[#0f172a] dark:text-slate-200 dark:hover:bg-[#111827] cursor-pointer">
        <input class="theme-toggle-checkbox sr-only" type="checkbox" />
        <span class="theme-toggle-track relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full bg-slate-300 transition-colors duration-300">
          <span class="theme-toggle-thumb absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300"></span>
        </span>
        <span class="text-sm">Dark Mode</span>
      </label>
    </div>
  </div>

  <div id="mobile-nav" class="hidden border-t border-gray-100 px-4 pb-4 md:hidden dark:border-[#243244]">
    <div class="flex flex-col space-y-3 pt-4">
      <a href="index.html" class="text-gray-600 hover:text-gray-900 transition duration-300 dark:text-slate-200 dark:hover:text-white">Home</a>
      <a href="about.html" class="text-gray-600 hover:text-gray-900 transition duration-300 dark:text-slate-200 dark:hover:text-white">About</a>
      <a href="health.html" class="text-gray-600 hover:text-gray-900 transition duration-300 dark:text-slate-200 dark:hover:text-white">Health</a>
      <a href="games.html" class="text-gray-600 hover:text-gray-900 transition duration-300 dark:text-slate-200 dark:hover:text-white">Games</a>
      <a href="tietovisa.html" class="text-gray-600 hover:text-gray-900 transition duration-300 dark:text-slate-200 dark:hover:text-white">Quiz</a>
      <label class="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 transition duration-300 hover:bg-gray-50 dark:border-[#243244] dark:bg-[#0f172a] dark:text-slate-200 dark:hover:bg-[#111827] cursor-pointer">
        <input class="theme-toggle-checkbox sr-only" type="checkbox" />
        <span class="theme-toggle-track relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full bg-slate-300 transition-colors duration-300">
          <span class="theme-toggle-thumb absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300"></span>
        </span>
        <span class="text-sm">Dark Mode</span>
      </label>
    </div>
  </div>
</nav>
`;

const navContainer = document.getElementById('site-nav');
if (navContainer) {
  navContainer.innerHTML = navHtml;

  const toggleButton = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const themeSwitches = navContainer.querySelectorAll('.theme-toggle-checkbox');
  const themeTracks = navContainer.querySelectorAll('.theme-toggle-track');
  const themeThumbs = navContainer.querySelectorAll('.theme-toggle-thumb');

  function addThemeStyles() {
    if (document.getElementById('theme-mode-styles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'theme-mode-styles';
    styleEl.textContent = `
      :root.dark {
        color-scheme: dark;
        background-color: #020617;
      }
      :root.dark body {
        background-color: #020617 !important;
        color: #f8fafc;
      }
      :root.dark .bg-white,
      :root.dark .bg-gray-100,
      :root.dark .bg-gray-50,
      :root.dark .bg-slate-900,
      :root.dark .bg-slate-800,
      :root.dark .bg-slate-700,
      :root.dark [class*="dark:bg-slate-900"],
      :root.dark [class*="dark:bg-slate-800"],
      :root.dark [class*="dark:bg-slate-700"],
      :root.dark nav {
        background-color: #0f172a !important;
      }
      :root.dark [class*="dark:bg-slate-800"] {
        background-color: #111827 !important;
      }
      :root.dark .text-gray-900 { color: #f8fafc !important; }
      :root.dark .text-gray-800 { color: #f8fafc !important; }
      :root.dark .text-gray-700 { color: #e2e8f0 !important; }
      :root.dark .text-gray-600 { color: #cbd5e1 !important; }
      :root.dark .text-slate-300 { color: #cbd5e1 !important; }
      :root.dark .border-gray-200,
      :root.dark .border-gray-100,
      :root.dark [class*="dark:border-slate-700"],
      :root.dark [class*="dark:border-[#243244]"] {
        border-color: #243244 !important;
      }
      :root.dark .hover\:bg-gray-50:hover { background-color: #111827 !important; }
      :root.dark .shadow-sm { box-shadow: 0 1px 2px rgba(2, 6, 23, 0.75) !important; }
      :root.dark .shadow-md { box-shadow: 0 8px 20px rgba(2, 6, 23, 0.8) !important; }
      :root.dark .shadow-lg { box-shadow: 0 12px 28px rgba(2, 6, 23, 0.9) !important; }
    `;
    document.head.appendChild(styleEl);
  }

  addThemeStyles();

  function setTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
    themeSwitches.forEach((input) => {
      input.checked = isDark;
    });
    themeTracks.forEach((track) => {
      track.classList.toggle('bg-indigo-600', isDark);
      track.classList.toggle('bg-slate-300', !isDark);
    });
    themeThumbs.forEach((thumb) => {
      thumb.classList.toggle('translate-x-5', isDark);
    });
  }

  function applyStoredTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(theme);
  }

  themeSwitches.forEach((input) => {
    input.addEventListener('change', () => {
      setTheme(input.checked ? 'dark' : 'light');
    });
  });

  applyStoredTheme();

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
