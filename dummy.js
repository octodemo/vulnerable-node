/**
 * Test Data Module
 * 
 * Provides dummy data for database initialization including user accounts
 * and product catalog. This data is used to populate the database when
 * the application starts.
 * 
 * SECURITY NOTE: Contains hardcoded credentials for demonstration purposes.
 * These are intentionally weak for security testing.
 */

var dummy_info = {
  /**
   * Test User Accounts
   * 
   * Default credentials for testing:
   * - admin/admin: Administrative account with default password
   * - roberto/asdfpiuw981: Regular user account
   * 
   * VULNERABILITY: Weak credentials (OWASP A2)
   * Admin account uses trivial password "admin"
   */
  "users": [
    {
      "username": "admin",
      "password": "admin"  // VULNERABLE: Weak default password
    },
    {
      "username": "roberto",
      "password": "asdfpiuw981"
    }
  ],

  /**
   * Product Catalog
   * 
   * Dummy products with humorous descriptions for the vulnerable shop.
   * Prices are randomized on each application start for variety.
   */
  "products": [
    {
      "name": "My public privacy",
      "description": "Grant privacy in public to watch your favorite programs",
      "price": parseInt(Math.random() * 100),  // Random price 0-99
      "image": "product_1.jpg"
    },
    {
      "name": "The USB rocket",
      "description": "Be happy with your USB rocket. Functionality: none. Usability: none. The best choice!",
      "price": parseInt(Math.random() * 100),
      "image": "product_2.jpg"
    },
    {
      "name": "Walker watermelons",
      "description": "Take a walk your watermelons and make it feel comfortable.",
      "price": parseInt(Math.random() * 100),
      "image": "product_3.jpg"
    },
    {
      "name": "Potty Putter",
      "description": "The game for the avid golfers!",
      "price": 20,  // Fixed price
      "image": "product_4.jpg"
    },
    {
      "name": "Phone Fingers",
      "description": "Phone fingers work perfectly well with iPhone's touch screen and prevent fingerprints and smudges",
      "price": 3,  // Fixed price
      "image": "product_5.jpg"
    },
    {
      "name": "Daddle",
      "description": "Be the best father with Daddle: dad's saddle for horsing around.",
      "price": parseInt(Math.random() * 100),
      "image": "product_6.jpg"
    },
    {
      "name": "HD Vision",
      "description": "Reality is not enough for you? Improve your live with the HD vision glasses.",
      "price": parseInt(Math.random() * 100),
      "image": "product_7.jpg"
    },
    {
      "name": "Hangs free",
      "description": "Say goodbye to the cumbersome cables with the authentic hands free.",
      "price": parseInt(Math.random() * 100),
      "image": "product_8.jpg"
    }
  ]
}

// Export dummy data object
module.exports = dummy_info;