const state = {
  getCart() {
    return JSON.parse(localStorage.getItem('baby_cart') || '[]');
  },
  saveCart(cart) {
    localStorage.setItem('baby_cart', JSON.stringify(cart));
    // Dispatch custom event to notify other components (e.g., cart badge)
    window.dispatchEvent(new Event('cartUpdated'));
  },
  addToCart(product, quantity = 1) {
    const cart = this.getCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    this.saveCart(cart);
    window.analytics.trackAddToCart(product, quantity);
  },
  removeFromCart(productId) {
    let cart = this.getCart();
    const item = cart.find(i => i.id === productId);
    if(item) {
      window.analytics.trackRemoveFromCart(item);
    }
    cart = cart.filter(item => item.id !== productId);
    this.saveCart(cart);
  },
  updateQuantity(productId, quantity) {
    let cart = this.getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart(cart);
      }
    }
  },
  clearCart() {
    this.saveCart([]);
  },
  getCartTotal() {
    return this.getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },
  
  // Auth
  getUser() {
    return JSON.parse(localStorage.getItem('baby_user') || 'null');
  },
  login(email) {
    const user = { email, token: 'mock-token-' + Date.now() };
    localStorage.setItem('baby_user', JSON.stringify(user));
    window.dispatchEvent(new Event('authUpdated'));
    if (window.analytics && window.analytics.trackLogin) {
      window.analytics.trackLogin('email');
    }
    return user;
  },
  logout() {
    localStorage.removeItem('baby_user');
    window.dispatchEvent(new Event('authUpdated'));
  },

  // Orders
  getOrders() {
    return JSON.parse(localStorage.getItem('baby_orders') || '[]');
  },
  placeOrder(addressData) {
    const cart = this.getCart();
    if(cart.length === 0) return null;
    
    const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);
    const total = this.getCartTotal();
    
    const newOrder = {
      orderId,
      date: new Date().toISOString(),
      items: cart,
      total,
      shipping: addressData
    };
    
    const orders = this.getOrders();
    orders.push(newOrder);
    localStorage.setItem('baby_orders', JSON.stringify(orders));
    
    // Analytics
    window.analytics.trackPurchase(orderId, cart, total);
    
    this.clearCart();
    return newOrder;
  }
};

window.state = state;
