const navHtml = `
<nav class="bg-white shadow-lg p-4">
  <div class="container mx-auto flex justify-between items-center">
    <h1 class="text-2xl font-bold text-gray-800">My Website</h1>
    <div class="flex space-x-6">
      <a href="index.html" class="text-gray-600 hover:text-gray-900 transition duration-300">Home</a>
      <a href="about.html" class="text-gray-600 hover:text-gray-900 transition duration-300">About</a>
      <a href="health.html" class="text-gray-600 hover:text-gray-900 transition duration-300">Health</a>
      <a href="games.html" class="text-gray-600 hover:text-gray-900 transition duration-300">Games</a>
      <a href="tietovisa.html" class="text-gray-600 hover:text-gray-900 transition duration-300">Tietovisa</a>
    </div>
  </div>
</nav>
`;

const navContainer = document.getElementById('site-nav');
if (navContainer) {
  navContainer.innerHTML = navHtml;
}
