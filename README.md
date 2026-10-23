# 🛒 FreshMart - Grocery Shopping Mobile Application

> **MCA Semester III Model Examination – October 2026**  
> **Course:** Mobile Application Development using React Native  
> **Figma Reference Design Compliance:** ≥ 75%  

---

## 📱 Project Overview

**FreshMart** is a grocery shopping mobile application developed using **React Native**, **JavaScript**, and **React Navigation**. It replicates a modern grocery e-commerce mobile experience inspired by Figma grocery UI designs (fresh leaf-green aesthetics, clean card layouts, dynamic badges, and fluid navigations).

The application requires **no external backend or database** and operates smoothly using **React Context API** and **React State** for managing authentication, product catalogs, shopping cart calculations, and customer favorites.

---

## ✨ Key Features & Requirements Checklist

| Requirement | Implementation Details | Status |
|---|---|---|
| **Technology** | React Native, JavaScript, Context API, Local Sample Data | ✅ Completed |
| **User Roles** | **Admin** & **Customer** with role-based screen access and quick-switch capabilities | ✅ Completed |
| **Authentication** | Sign Up and Sign In screens with live form validation (Email regex, Phone length, Passwords) | ✅ Completed |
| **Screen 1: Home Screen** | Logo, name, Sign In/Up options, Admin/Customer toggle, search bar, banner, categories, featured & best sellers | ✅ Completed |
| **Screen 2: Products List** | Grid of groceries with images, prices, units, ratings, Add to Cart, Favorite toggle, category filters, and live search | ✅ Completed |
| **Screen 3: Customer Profile & Edit** | Customer details display, edit form (name, email, phone, address), input validations, customer-only role guard | ✅ Completed |
| **Screen 4: Add Favorites** | Customer wishlist, instant Add to Cart for individual/all items, remove action, customer-only role guard | ✅ Completed |
| **Screen 5: Product Details** | Hero image, description, nutritional facts, quantity counter, dynamic price calculation, Add to Cart & Favorites | ✅ Completed |
| **Screen 6: My Cart** | Dynamic bill breakdown (Subtotal, 5% Discount, Delivery Fee, Total), quantity +/- stepper, item removal, checkout confirmation modal | ✅ Completed |
| **Stack Navigation** | Navigates to Product Details, Edit Profile, Sign In, Sign Up | ✅ Completed |
| **Bottom Tab Navigation** | 5 Bottom Tabs: Home, Products, Favorites, Cart, Profile (with dynamic badge counters) | ✅ Completed |
| **Drawer Navigation** | Side navigation drawer with User profile header, role switcher, links to all screens, and Sign Out | ✅ Completed |

---

## 🗂️ Project Directory Structure

```
d:/react native/react native exam/
├── App.js                         # Root application entry & Context Provider setup
├── index.js                       # Expo entry point with gesture-handler initialization
├── package.json                   # Dependencies and npm execution scripts
├── app.json                       # Expo configuration
├── README.md                      # Comprehensive project documentation
└── src/
    ├── constants/
    │   └── colors.js              # Theme palette (Primary Green, Badges, Backgrounds, Shadows)
    ├── data/
    │   └── productsData.js        # Comprehensive local grocery sample datasets & user models
    ├── context/
    │   ├── AuthContext.js         # User role state (Admin/Customer), login, register, profile update
    │   ├── ProductsContext.js     # Catalog state, search, category filter, Admin inventory toggle
    │   ├── CartContext.js         # Shopping cart state, +/- quantities, dynamic bill calculations
    │   └── FavoritesContext.js    # Wishlist state, favorite toggling, customer-only access
    ├── components/
    │   ├── Header.js              # Reusable top app bar with back/menu/cart badge/role indicator
    │   ├── ProductCard.js         # Grocery card with image, badges, ratings, +/- cart, and heart toggle
    │   ├── CartItemCard.js        # Item card inside cart with thumbnail, quantity stepper, and delete
    │   ├── CategoryFilter.js      # Horizontal scrollable category pill chips
    │   ├── BannerCarousel.js      # Grocery promotional discount banner
    │   ├── CustomButton.js        # Reusable button with Primary, Outline, and Danger styles
    │   └── CustomInput.js         # Reusable form field with icons, error labels, and secure text toggle
    ├── navigation/
    │   ├── AppNavigator.js        # Stack Navigator for Root, Details, Edit Profile, Auth
    │   ├── DrawerNavigator.js     # Drawer Navigator wrapping Tabs and Admin console
    │   ├── BottomTabNavigator.js  # Bottom Tab Navigator with 5 core tabs and live badges
    │   └── CustomDrawerContent.js # Custom slide-out drawer with user profile and quick role switcher
    └── screens/
        ├── HomeScreen.js           # Screen 1: Home Screen
        ├── ProductsListScreen.js   # Screen 2: Daily Grocery Products List
        ├── ProfileScreen.js        # Screen 3: Customer Profile
        ├── EditProfileScreen.js    # Screen 3 (Contd): Customer Edit Profile with validation
        ├── FavoritesScreen.js      # Screen 4: Add Favorites & Wishlist
        ├── ProductDetailsScreen.js # Screen 5: Product Details
        ├── CartScreen.js           # Screen 6: My Cart with dynamic billing
        ├── SignInScreen.js         # Sign In screen with role selector & 1-tap demo credentials
        ├── SignUpScreen.js         # Sign Up screen with full form validation
        └── AdminDashboardScreen.js # Admin Inventory Management & store metrics
```

---

## 🚀 Installation & Execution Instructions

### Prerequisites
- Node.js (version 18 or newer)
- npm or bun
- Expo Go app on your physical mobile device (Android / iOS) **OR** an Android Emulator / iOS Simulator **OR** web browser

### Step 1: Install Dependencies
Open a terminal in the project directory:
```bash
npm install
```

### Step 2: Start the Expo Development Server
```bash
npx expo start
```
or
```bash
npm start
```

### Step 3: Run the Application
- **On Physical Device (Recommended for mobile feel):**  
  Scan the QR code shown in the terminal using the **Expo Go** application on your Android device (or camera app on iOS).
- **On Android Emulator:**  
  Press `a` in the terminal.
- **On iOS Simulator:**  
  Press `i` in the terminal.
- **On Web Browser (Quick Preview):**  
  Press `w` in the terminal.

---

## 🧪 Testing the Roles (Admin vs. Customer)

For convenient and rapid grading during the examination, the application provides **three different ways** to test and switch between roles:

1. **Top Bar Role Switcher (Home Screen):**  
   Tap either the `Customer` or `Admin` button at the top of the Home Screen to immediately switch roles.
2. **Side Navigation Drawer Switcher:**  
   Open the drawer menu (hamburger icon) and tap `Customer` or `Admin` under "Exam Fast Switch".
3. **Dedicated Sign In Screen:**  
   Navigate to the Sign In screen and tap **"Fill Customer Credentials"** or **"Fill Admin Credentials"** to test live authentication with pre-populated accounts.

### Role-Based Screen Access:
- **Customer Role:**  
  - Full access to browse products, add/remove items in Cart, manage Favorites, and view/edit Customer Profile.
- **Admin Role:**  
  - Displays `ADMIN` badge in headers.
  - Access to **Admin Dashboard & Inventory Control** where product stock can be toggled in real time.
  - Attempting to access customer-only screens (like Favorites or Customer Profile) shows a polite Role Guard notification informing the user that the section is customer-specific.

---

## 💡 Architecture & Viva Explanation Points

1. **State Management without Backend:**  
   Uses React's native `createContext` and `useContext` hooks to create global, reactive singletons for Cart, Favorites, Products, and Authentication. Any change in quantity on the Cart screen or Product Details instantly reflects across tab badges, drawer badges, and total calculations.
2. **Compound Navigation Hierarchy:**  
   The application implements standard React Navigation 7 patterns:
   - Root: **Stack Navigator** (`AppNavigator.js`)
   - Inside Stack: **Drawer Navigator** (`DrawerNavigator.js`)
   - Inside Drawer: **Bottom Tab Navigator** (`BottomTabNavigator.js`)
   - Screen Push: Stack screens (`ProductDetails`, `EditProfile`, `SignIn`, `SignUp`) can be opened on top with standard back button navigation.
3. **Form Validations:**  
   Implemented using JavaScript Regular Expressions for email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), numeric length checks for 10-digit mobile phone numbers, minimum length password requirements, and confirmation match verification.
4. **Figma UI Compliance:**  
   Matches the reference grocery design with:
   - Nature-inspired color palette (`#53B175`)
   - High-resolution product images
   - Category filtering with icons
   - 2-column responsive product card grid
   - Dynamic price calculation with automatic discount application and free delivery thresholds.
