const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your GA4 Measurement ID
const CLARITY_PROJECT_ID = 'CLARITY_ID_HERE'; // Replace with your Clarity Project ID
const DEBUG_ANALYTICS = true; // Set to true to see events in the browser console

// Initialize Data Layer
window.dataLayer = window.dataLayer || [];
function gtag(){
  dataLayer.push(arguments);
  if(DEBUG_ANALYTICS && arguments[0] === 'event') {
    console.log(`📊 [GA4 EVENT FIRED]: ${arguments[1]}`, arguments[2] || {});
  }
}
gtag('js', new Date());

// Important: When running locally, GA might drop cookies. 
// We pass cookie_flags if needed, but standard config is:
gtag('config', GA_MEASUREMENT_ID, {
  cookie_flags: 'SameSite=None;Secure'
});

// Load GA4 Script Dynamically
const gaScript = document.createElement('script');
gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
gaScript.async = true;
document.head.appendChild(gaScript);

// Load Clarity Script Dynamically
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", CLARITY_PROJECT_ID);

// Analytics Helper Object
const analytics = {
  trackViewItemList(items, listName) {
    gtag('event', 'view_item_list', {
      item_list_id: listName.toLowerCase().replace(/ /g, '_'),
      item_list_name: listName,
      items: items.map((product, index) => ({
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        index: index + 1
      }))
    });
  },

  trackViewItem(product) {
    gtag('event', 'view_item', {
      currency: "USD",
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1
      }]
    });
  },
  
  trackAddToCart(product, quantity) {
    gtag('event', 'add_to_cart', {
      currency: "USD",
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: quantity
      }]
    });
  },
  
  trackRemoveFromCart(product) {
    gtag('event', 'remove_from_cart', {
      currency: "USD",
      value: product.price * product.quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: product.quantity
      }]
    });
  },
  
  trackBeginCheckout(cartItems, totalValue) {
    gtag('event', 'begin_checkout', {
      currency: "USD",
      value: totalValue,
      items: cartItems.map(item => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: item.quantity
      }))
    });
  },
  
  trackPurchase(transactionId, cartItems, totalValue) {
    gtag('event', 'purchase', {
      transaction_id: transactionId,
      currency: "USD",
      value: totalValue,
      items: cartItems.map(item => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: item.quantity
      }))
    });
  },

  trackLogin(method = 'email') {
    gtag('event', 'login', {
      method: method
    });
  }
};

window.analytics = analytics;
