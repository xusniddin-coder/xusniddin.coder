// Restaurant Menu Interactive Features
class RestaurantMenu {
    constructor() {
      this.menuItems = []
      this.currentFilter = "all"
      this.favorites = JSON.parse(localStorage.getItem("favorites")) || []
      this.cart = JSON.parse(localStorage.getItem("cart")) || []
      this.init()
    }
  
    init() {
      this.setupEventListeners()
      this.loadMenuData()
      this.createFilterButtons()
      this.setupSearchFunctionality()
      this.setupCartFunctionality()
      this.setupFavorites()
      this.addScrollAnimations()
      this.setupThemeToggle()
      this.displayWelcomeMessage()
    }
  
    // Display welcome message with animation
    displayWelcomeMessage() {
      setTimeout(() => {
        this.showNotification("Welcome to Little Lemon Restaurant! 🍋", "success")
      }, 1000)
    }
  
    // Setup event listeners
    setupEventListeners() {
      // Smooth scroll for navigation
      document.addEventListener("click", (e) => {
        if (e.target.matches("[data-scroll]")) {
          e.preventDefault()
          const target = document.querySelector(e.target.getAttribute("href"))
          if (target) {
            target.scrollIntoView({ behavior: "smooth" })
          }
        }
      })
  
      // Menu item interactions
      document.addEventListener("click", (e) => {
        if (e.target.closest(".menu-item")) {
          this.handleMenuItemClick(e.target.closest(".menu-item"))
        }
      })
  
      // Window scroll effects
      window.addEventListener("scroll", this.handleScroll.bind(this))
    }
  
    // Load menu data and enhance items
    loadMenuData() {
      const menuItems = document.querySelectorAll(".menu-item")
      menuItems.forEach((item, index) => {
        const name = item.querySelector(".menu-item-name").textContent
        const description = item.querySelector(".menu-item-description").textContent
        const price = item.querySelector(".menu-item-price").textContent
        const category = item.closest(".menu-section").querySelector("h2").textContent.toLowerCase().replace(/\s+/g, "-")
  
        const menuItemData = {
          id: index,
          name,
          description,
          price,
          category: category.replace(/new/g, "").trim(),
          element: item,
          rating: Math.floor(Math.random() * 2) + 4, // Random rating 4-5
          isNew: item.querySelector("span") !== null,
        }
  
        this.menuItems.push(menuItemData)
        this.enhanceMenuItem(item, menuItemData)
      })
    }
  
    // Enhance menu items with interactive features
    enhanceMenuItem(element, data) {
      // Add rating stars
      const ratingDiv = document.createElement("div")
      ratingDiv.className = "menu-item-rating"
      ratingDiv.innerHTML = "★".repeat(data.rating) + "☆".repeat(5 - data.rating)
      element.querySelector(".menu-item-content").appendChild(ratingDiv)
  
      // Add action buttons
      const actionsDiv = document.createElement("div")
      actionsDiv.className = "menu-item-actions"
      actionsDiv.innerHTML = `
              <button class="action-btn favorite-btn ${this.favorites.includes(data.id) ? "active" : ""}" 
                      data-id="${data.id}" title="Add to favorites">
                  <span class="heart">♡</span>
              </button>
              <button class="action-btn cart-btn" data-id="${data.id}" title="Add to cart">
                  <span class="cart">🛒</span>
              </button>
          `
      element.appendChild(actionsDiv)
  
      // Add hover sound effect (optional)
      element.addEventListener("mouseenter", () => {
        element.style.transform = "translateX(5px) scale(1.02)"
      })
  
      element.addEventListener("mouseleave", () => {
        element.style.transform = "translateX(0) scale(1)"
      })
    }
  
    // Create filter buttons
    createFilterButtons() {
      const categories = [...new Set(this.menuItems.map((item) => item.category))]
      const filterContainer = document.createElement("div")
      filterContainer.className = "filter-container"
      filterContainer.innerHTML = `
              <h3>Filter Menu</h3>
              <div class="filter-buttons">
                  <button class="filter-btn active" data-filter="all">All Items</button>
                  ${categories
                    .map(
                      (cat) =>
                        `<button class="filter-btn" data-filter="${cat}">
                          ${cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
                      </button>`,
                    )
                    .join("")}
              </div>
          `
  
      // Insert after header
      const header = document.querySelector(".header")
      header.insertAdjacentElement("afterend", filterContainer)
  
      // Add filter functionality
      filterContainer.addEventListener("click", (e) => {
        if (e.target.matches(".filter-btn")) {
          this.filterMenu(e.target.dataset.filter)
          document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"))
          e.target.classList.add("active")
        }
      })
    }
  
    // Filter menu items
    filterMenu(category) {
      this.currentFilter = category
      this.menuItems.forEach((item) => {
        const shouldShow = category === "all" || item.category === category
        item.element.style.display = shouldShow ? "flex" : "none"
  
        if (shouldShow) {
          item.element.style.animation = "fadeInUp 0.5s ease-out forwards"
        }
      })
  
      // Hide empty sections
      document.querySelectorAll(".menu-section").forEach((section) => {
        const visibleItems = section.querySelectorAll('.menu-item[style*="flex"]')
        section.style.display = visibleItems.length > 0 ? "block" : "none"
      })
    }
  
    // Setup search functionality
    setupSearchFunctionality() {
      const searchContainer = document.createElement("div")
      searchContainer.className = "search-container"
      searchContainer.innerHTML = `
              <div class="search-box">
                  <input type="text" id="menuSearch" placeholder="Search menu items..." />
                  <button class="search-btn">🔍</button>
              </div>
          `
  
      document.querySelector(".filter-container").appendChild(searchContainer)
  
      const searchInput = document.getElementById("menuSearch")
      searchInput.addEventListener("input", (e) => {
        this.searchMenu(e.target.value)
      })
    }
  
    // Search menu items
    searchMenu(query) {
      const searchTerm = query.toLowerCase()
      this.menuItems.forEach((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchTerm) || item.description.toLowerCase().includes(searchTerm)
        const matchesFilter = this.currentFilter === "all" || item.category === this.currentFilter
  
        item.element.style.display = matchesSearch && matchesFilter ? "flex" : "none"
      })
  
      // Update section visibility
      document.querySelectorAll(".menu-section").forEach((section) => {
        const visibleItems = section.querySelectorAll('.menu-item[style*="flex"]')
        section.style.display = visibleItems.length > 0 ? "block" : "none"
      })
    }
  
    // Setup cart functionality
    setupCartFunctionality() {
      // Create cart sidebar
      const cartSidebar = document.createElement("div")
      cartSidebar.className = "cart-sidebar"
      cartSidebar.innerHTML = `
              <div class="cart-header">
                  <h3>Your Order</h3>
                  <button class="close-cart">×</button>
              </div>
              <div class="cart-items"></div>
              <div class="cart-footer">
                  <div class="cart-total">Total: $0.00</div>
                  <button class="checkout-btn">Checkout</button>
              </div>
          `
      document.body.appendChild(cartSidebar)
  
      // Cart toggle button
      const cartToggle = document.createElement("button")
      cartToggle.className = "cart-toggle"
      cartToggle.innerHTML = `🛒 <span class="cart-count">0</span>`
      document.body.appendChild(cartToggle)
  
      // Event listeners
      document.addEventListener("click", (e) => {
        if (e.target.matches(".cart-btn")) {
          const itemId = Number.parseInt(e.target.dataset.id)
          this.addToCart(itemId)
        }
        if (e.target.matches(".cart-toggle")) {
          cartSidebar.classList.toggle("open")
        }
        if (e.target.matches(".close-cart")) {
          cartSidebar.classList.remove("open")
        }
      })
  
      this.updateCartDisplay()
    }
  
    // Add item to cart
    addToCart(itemId) {
      const item = this.menuItems.find((i) => i.id === itemId)
      if (item) {
        const existingItem = this.cart.find((i) => i.id === itemId)
        if (existingItem) {
          existingItem.quantity += 1
        } else {
          this.cart.push({ ...item, quantity: 1 })
        }
  
        localStorage.setItem("cart", JSON.stringify(this.cart))
        this.updateCartDisplay()
        this.showNotification(`${item.name} added to cart! 🛒`, "success")
      }
    }
  
    // Update cart display
    updateCartDisplay() {
      const cartItems = document.querySelector(".cart-items")
      const cartCount = document.querySelector(".cart-count")
      const cartTotal = document.querySelector(".cart-total")
  
      const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = this.cart.reduce((sum, item) => {
        const price = Number.parseFloat(item.price.replace("$", ""))
        return sum + price * item.quantity
      }, 0)
  
      cartCount.textContent = totalItems
      cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`
  
      cartItems.innerHTML = this.cart
        .map(
          (item) => `
              <div class="cart-item">
                  <div class="cart-item-info">
                      <div class="cart-item-name">${item.name}</div>
                      <div class="cart-item-price">${item.price} × ${item.quantity}</div>
                  </div>
                  <button class="remove-item" data-id="${item.id}">×</button>
              </div>
          `,
        )
        .join("")
    }
  
    // Setup favorites functionality
    setupFavorites() {
      document.addEventListener("click", (e) => {
        if (e.target.closest(".favorite-btn")) {
          const btn = e.target.closest(".favorite-btn")
          const itemId = Number.parseInt(btn.dataset.id)
          this.toggleFavorite(itemId, btn)
        }
      })
    }
  
    // Toggle favorite status
    toggleFavorite(itemId, button) {
      const index = this.favorites.indexOf(itemId)
      const item = this.menuItems.find((i) => i.id === itemId)
  
      if (index > -1) {
        this.favorites.splice(index, 1)
        button.classList.remove("active")
        this.showNotification(`${item.name} removed from favorites`, "info")
      } else {
        this.favorites.push(itemId)
        button.classList.add("active")
        this.showNotification(`${item.name} added to favorites! ❤️`, "success")
      }
  
      localStorage.setItem("favorites", JSON.stringify(this.favorites))
    }
  
    // Add scroll animations
    addScrollAnimations() {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
  
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
          }
        })
      }, observerOptions)
  
      document.querySelectorAll(".menu-section").forEach((section) => {
        section.style.opacity = "0"
        section.style.transform = "translateY(30px)"
        section.style.transition = "all 0.6s ease-out"
        observer.observe(section)
      })
    }
  
    // Handle scroll effects
    handleScroll() {
      const header = document.querySelector(".header")
      const scrolled = window.pageYOffset
  
      if (scrolled > 100) {
        header.style.transform = "scale(0.95)"
        header.style.opacity = "0.9"
      } else {
        header.style.transform = "scale(1)"
        header.style.opacity = "1"
      }
    }
  
    // Setup theme toggle
    setupThemeToggle() {
      const themeToggle = document.createElement("button")
      themeToggle.className = "theme-toggle"
      themeToggle.innerHTML = "🌙"
      themeToggle.title = "Toggle dark mode"
      document.body.appendChild(themeToggle)
  
      themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme")
        themeToggle.innerHTML = document.body.classList.contains("dark-theme") ? "☀️" : "🌙"
  
        const isDark = document.body.classList.contains("dark-theme")
        localStorage.setItem("darkMode", isDark)
      })
  
      // Load saved theme
      if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-theme")
        themeToggle.innerHTML = "☀️"
      }
    }
  
    // Show notification
    showNotification(message, type = "info") {
      const notification = document.createElement("div")
      notification.className = `notification ${type}`
      notification.textContent = message
  
      document.body.appendChild(notification)
  
      setTimeout(() => notification.classList.add("show"), 100)
      setTimeout(() => {
        notification.classList.remove("show")
        setTimeout(() => notification.remove(), 300)
      }, 3000)
    }
  
    // Handle menu item click for details
    handleMenuItemClick(element) {
      const itemId = Number.parseInt(element.querySelector(".cart-btn").dataset.id)
      const item = this.menuItems.find((i) => i.id === itemId)
  
      if (item) {
        this.showItemDetails(item)
      }
    }
  
    // Show item details modal
    showItemDetails(item) {
      const modal = document.createElement("div")
      modal.className = "modal-overlay"
      modal.innerHTML = `
              <div class="modal-content">
                  <button class="modal-close">×</button>
                  <h3>${item.name}</h3>
                  <div class="modal-rating">${"★".repeat(item.rating)}${"☆".repeat(5 - item.rating)}</div>
                  <p>${item.description}</p>
                  <div class="modal-price">${item.price}</div>
                  <div class="modal-actions">
                      <button class="modal-cart-btn" data-id="${item.id}">Add to Cart</button>
                      <button class="modal-favorite-btn ${this.favorites.includes(item.id) ? "active" : ""}" data-id="${item.id}">
                          ${this.favorites.includes(item.id) ? "❤️" : "♡"} Favorite
                      </button>
                  </div>
              </div>
          `
  
      document.body.appendChild(modal)
      setTimeout(() => modal.classList.add("show"), 10)
  
      // Modal event listeners
      modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.matches(".modal-close")) {
          modal.classList.remove("show")
          setTimeout(() => modal.remove(), 300)
        }
        if (e.target.matches(".modal-cart-btn")) {
          this.addToCart(Number.parseInt(e.target.dataset.id))
          modal.classList.remove("show")
          setTimeout(() => modal.remove(), 300)
        }
        if (e.target.matches(".modal-favorite-btn")) {
          this.toggleFavorite(Number.parseInt(e.target.dataset.id), e.target)
        }
      })
    }
  }
  
  // Initialize the restaurant menu when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    new RestaurantMenu()
  
    // Add some fun easter eggs
    console.log("🍋 Welcome to Little Lemon Restaurant!")
    console.log("💡 Try clicking on menu items for more details!")
  
    // Konami code easter egg
    const konamiCode = []
    const konamiSequence = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "KeyB",
      "KeyA",
    ]
  
    document.addEventListener("keydown", (e) => {
      konamiCode.push(e.code)
      if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift()
      }
  
      if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        document.body.style.animation = "rainbow 2s infinite"
        setTimeout(() => {
          document.body.style.animation = ""
        }, 5000)
      }
    })
  })
  
  // Service Worker for offline functionality (optional)
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => console.log("SW registered"))
        .catch((error) => console.log("SW registration failed"))
    })
  }
  