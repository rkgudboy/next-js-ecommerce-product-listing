# ECommerce Product Listing Page

A modern e-commerce product listing and detail page built with Next.js 15, TypeScript, and Tailwind CSS. This application demonstrates a complete product catalog with shopping cart functionality, responsive design, and comprehensive testing.

## ✨ Features

- **🏪 Product Catalog**: Responsive product grid with category filtering
- **📱 Product Details**: Comprehensive product information with star ratings
- **🛒 Shopping Cart**: Full cart functionality with add/remove/update operations  
- **🎨 Modern UI**: Clean design using commerce-main theme principles
- **📱 Responsive**: Mobile-first design with seamless tablet/desktop experience
- **🌙 Dark Mode**: Automatic theme switching based on system preferences
- **♿ Accessibility**: Proper ARIA labels and keyboard navigation
- **🔧 Type Safety**: Full TypeScript implementation
- **✅ Comprehensive Testing**: 91 tests with 100% pass rate

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.4.4 | React framework with App Router |
| **TypeScript** | ^5.0 | Type safety and development experience |
| **Tailwind CSS** | ^4.0 | Utility-first styling with plugins |
| **Axios** | ^1.11.0 | HTTP client for API requests |
| **Jest** | ^30.0.5 | Testing framework |
| **React Testing Library** | ^16.3.0 | Component testing utilities |
| **Heroicons** | ^2.2.0 | Consistent SVG icon system |
| **React Hot Toast** | ^2.5.2 | Toast notifications |
| **Headless UI** | ^2.2.6 | Accessible UI components |

## 🚀 Quick Start

### Prerequisites

- **Node.js** 22.0 or later
- **npm**

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd next-js-ecommerce-product-listing
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Edit .env with your configuration (optional - defaults provided)
   ```

4. **Run health check and start development server:**
   ```bash
   npm run dev
   ```
   
   The application will:
   - ✅ Perform API health check
   - 🚀 Start on http://localhost:3000
   - 🔍 Display startup status

### Alternative Commands

```bash
# Start without health check
npm run dev:skip-check

# Run health check only
npm run health-check

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
├── src/
│   ├── app/                      # Next.js 15 App Router
│   │   ├── product/[id]/         # Dynamic product detail pages
│   │   │   └── page.tsx          # SSR product page with metadata
│   │   ├── products/             # Product listing page
│   │   ├── globals.css           # Global styles with Tailwind
│   │   ├── layout.tsx           # Root layout with providers
│   │   └── page.tsx             # Homepage with welcome + products
│   └── components/               # Reusable UI components
├── scripts/
│   └── health-check.js          # API health check script
├── .env                         # Environment variables
├── .env.example                 # Environment template
└── jest.config.js               # Jest configuration
```

## 🌐 Environment Configuration

The application uses environment variables for configuration:

```bash
# Store Configuration
NEXT_PUBLIC_STORE_NAME="E-Commerce"

# Server Configuration  
PORT=3000

# API Configuration
NEXT_PUBLIC_API_URL=https://fakestoreapi.com/products
```

### Environment Features:

- **🔗 API URL**: Configurable product data endpoint
- **🚪 Custom Port**: Configurable server port (default: 3000)
- **🏪 Store Name**: Dynamic store branding
- **✅ Health Check**: Automatic API validation on startup

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode  
npm run test:watch

# Run with coverage report
npm test -- --coverage

# Run specific test file
npm test ProductCard.test.tsx
```

### Test Structure:

| Test Suite | Tests | Coverage |
|------------|-------|----------|
| **ProductsContext** | 14 | Global state, API integration, category filtering |
| **ProductDescription** | 22 | Product display, ratings, add to cart functionality |
| **Loading Component** | 22 | UI states, accessibility, edge cases |
| **ProductService** | 9 | API calls, error handling, environment config |
| **CartContext** | 9 | Cart operations, calculations |
| **Cart Component** | 11 | Cart UI, quantity controls |
| **ProductCard** | 5 | Product display, interactions |

### Testing Features:

- **🎯 User-Centric**: Tests from user perspective using Testing Library
- **🔧 Comprehensive Mocking**: API calls, contexts, timers, environment variables  
- **⚡ Performance**: Fast test suite (< 2 seconds)
- **🔄 Async Testing**: Proper handling of API calls and state updates
- **♿ Accessibility**: Screen reader and keyboard navigation testing
- **📱 Responsive**: Component testing across different viewports


## 🏗 Key Application Features

### 🏠 Homepage (`/`)
- Welcome header with configurable store name
- Category filtering with visual indicators  
- Product grid with responsive layout (1→2→3→4 columns)
- Loading states and error handling
- Redirect handling for direct product URL access

### 📋 Product Listing (`/products`)  
- Dedicated product catalog page
- Category-based filtering
- Product count display
- Consistent grid layout with homepage

### 📦 Product Details (`/product/[id]`)
- **SSR with Metadata**: SEO-optimized with dynamic titles
- **Star Ratings**: Visual rating display with filled/empty stars
- **Add to Cart**: Enhanced UX with loading states and success feedback
- **Related Products**: Category-based product suggestions
- **Breadcrumb Navigation**: Clear navigation hierarchy
- **404 Handling**: Graceful handling of invalid product IDs

### 🛒 Shopping Cart
- **Persistent State**: Cart maintained across page navigation
- **Quantity Management**: Increase/decrease/remove operations
- **Price Calculations**: Accurate totals with currency formatting
- **Cart Modal**: Slideout cart with glass-morphism design
- **Empty State**: Clear messaging when cart is empty
- **Toast Notifications**: Success feedback for cart operations

### 🎨 Design System

Based on commerce-main theme principles:

- **Colors**: Neutral palette with blue accents
- **Typography**: System fonts with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable button, card, and form styles
- **Responsive**: Mobile-first breakpoints (640px, 768px, 1024px)
- **Accessibility**: High contrast ratios and focus states

## 🚀 Performance Optimizations

- **⚡ Turbopack**: Fast development builds with Next.js 15
- **🖼 Image Optimization**: Next.js automatic image optimization
- **📦 Code Splitting**: Automatic route-based splitting
- **🔄 API Health Check**: Startup validation prevents runtime failures
- **⚡ Fast Refresh**: Hot module replacement for instant updates
- **🗜 Bundle Optimization**: Tree shaking and compression

## 🔧 Development Workflow

**Features:**
- Environment-configurable API URL
- Automatic health check on startup
- Error handling with user-friendly messages
- Loading states during data fetching

### State Management

- **ProductsContext**: Global product state with category filtering
- **CartContext**: Shopping cart operations with persistence
- **React useReducer**: Predictable state updates
- **TypeScript**: Full type safety for state and actions

### Error Handling

- **API Failures**: Graceful degradation with error messages
- **Invalid Routes**: 404 pages with navigation options
- **Network Issues**: Retry mechanisms and user feedback
- **Validation**: Form validation and user input sanitization

## 🚧 Future Enhancements

### Enhanced E-commerce
- **🔍 Advanced Search**: Full-text search with autocomplete
- **🏷 Enhanced Filtering**: Price ranges, ratings, availability
- **⭐ Reviews System**: User reviews and rating submissions
- **❤️ Wishlist**: Save products for later

### User Experience  
- **👤 User Accounts**: Registration, login, profile management
- **📱 Progressive Web App**: Offline support and app-like experience
- **🔔 Notifications**: Push notifications for deals and updates
- **🌐 Internationalization**: Multi-language and currency support

### Advanced Features
- **🤖 Recommendations**: AI-powered product suggestions
- **📊 Analytics**: User behavior tracking and insights
- **🛒 Advanced Cart**: Save for later, bulk operations
- **💳 Checkout Flow**: Payment integration and order management

### Performance & Scale
- **⚡ Virtual Scrolling**: Handle thousands of products
- **🗄 Caching**: Redis/CDN for improved performance
- **🔄 Real-time Updates**: WebSocket inventory updates
- **📈 Monitoring**: Error tracking and performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines:

- **✅ Tests Required**: All new features must include tests
- **📝 TypeScript**: Maintain type safety throughout
- **🎨 Design System**: Follow established patterns and components
- **♿ Accessibility**: Ensure WCAG 2.1 AA compliance
- **📱 Responsive**: Test across device breakpoints

---

**Built with ❤️ using Next.js 15, TypeScript, and Tailwind CSS**