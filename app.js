document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  updateCartBadge();
  window.addEventListener('cartUpdated', updateCartBadge);
  window.addEventListener('authUpdated', updateAuthUI);
});

function renderHeader() {
  const headerHtml = `
    <nav class="bg-pink-100 p-4 shadow-sm">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <a href="index.html" class="text-2xl font-bold text-gray-800 tracking-tighter">BabyBoutique<span class="text-pink-500">.</span></a>
        
        <div class="hidden md:flex space-x-6">
          <a href="products.html?category=Clothing" class="text-gray-600 hover:text-pink-600 font-medium">Clothing</a>
          <a href="products.html?category=Toys" class="text-gray-600 hover:text-pink-600 font-medium">Toys</a>
          <a href="products.html?category=Feeding" class="text-gray-600 hover:text-pink-600 font-medium">Feeding</a>
          <a href="products.html?category=Diapers" class="text-gray-600 hover:text-pink-600 font-medium">Diapers</a>
          <a href="products.html?category=Skincare" class="text-gray-600 hover:text-pink-600 font-medium">Skincare</a>
        </div>

        <div class="flex items-center space-x-4">
          <a href="auth.html" id="auth-link" class="text-gray-600 hover:text-pink-600">Login</a>
          <a href="orders.html" id="orders-link" class="text-gray-600 hover:text-pink-600 hidden">My Orders</a>
          <a href="cart.html" class="relative text-gray-600 hover:text-pink-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span id="cart-badge" class="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hidden">0</span>
          </a>
        </div>
      </div>
    </nav>
  `;
  document.body.insertAdjacentHTML('afterbegin', headerHtml);
  updateAuthUI();
}

function renderFooter() {
  const footerHtml = `
    <footer class="bg-gray-50 pt-10 pb-6 mt-20 border-t border-gray-200">
      <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-xl font-bold text-gray-800 mb-4">BabyBoutique<span class="text-pink-500">.</span></h3>
          <p class="text-gray-500 text-sm">Providing the best, safest, and softest products for your little ones. We care about baby comfort and happiness.</p>
        </div>
        <div>
          <h4 class="font-bold text-gray-800 mb-4">Links</h4>
          <ul class="space-y-2 text-sm text-gray-500">
            <li><a href="products.html" class="hover:text-pink-600">All Products</a></li>
            <li><a href="#" class="hover:text-pink-600">About Us</a></li>
            <li><a href="#" class="hover:text-pink-600">Contact Support</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-gray-800 mb-4">Newsletter</h4>
          <form class="flex" onsubmit="event.preventDefault(); alert('Subscribed!')">
            <input type="email" placeholder="Email address" class="px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:border-pink-400 w-full" required>
            <button type="submit" class="bg-pink-500 text-white px-4 py-2 rounded-r hover:bg-pink-600">Join</button>
          </form>
        </div>
      </div>
      <div class="text-center text-gray-400 text-xs mt-10">
        &copy; ${new Date().getFullYear()} BabyBoutique. All rights reserved. Not a real store.
      </div>
    </footer>
  `;
  document.body.insertAdjacentHTML('beforeend', footerHtml);
}

function updateCartBadge() {
  const cart = window.state.getCart();
  const badge = document.getElementById('cart-badge');
  if(!badge) return;
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (totalItems > 0) {
    badge.textContent = totalItems;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function updateAuthUI() {
  const user = window.state.getUser();
  const authLink = document.getElementById('auth-link');
  const ordersLink = document.getElementById('orders-link');
  
  if (user) {
    authLink.textContent = "Logout";
    authLink.onclick = (e) => {
      e.preventDefault();
      window.state.logout();
    };
    ordersLink.classList.remove('hidden');
  } else {
    authLink.textContent = "Login";
    authLink.href = "auth.html";
    authLink.onclick = null;
    ordersLink.classList.add('hidden');
  }
}

// Utility for fetching URL params
window.getURLParam = function(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}
