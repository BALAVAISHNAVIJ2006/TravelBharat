# TravelBharat 🇮🇳

> A comprehensive tourism information platform for discovering and exploring Indian destinations with multilingual support and community reviews.

TravelBharat is a full-stack web application designed to help travelers discover, explore, and review Indian tourist destinations. The platform organizes destinations by state and city, provides detailed information, user reviews, and an admin dashboard for content management. It features responsive design and supports multiple languages (English, Hindi, and Tamil).

---

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### 🌍 Public Features (Users)
- **Browse by State & City** - Explore destinations organized hierarchically by state and city
- **Category Filtering** - Discover places in Heritage, Nature, Adventure, and Religious categories
- **Advanced Search** - Full-text search with client-side and server-side filtering options
- **Place Details** - Comprehensive information including descriptions, best time to visit, entry fees, timings, nearby attractions, and image galleries
- **Image Gallery** - Automatic Unsplash fallback for missing destination images
- **User Reviews & Ratings** - Community-driven 5-star rating system with detailed reviews in multiple languages
- **Multilingual Support** - English, Hindi, and Tamil translations via react-i18next
- **Responsive Design** - Fully responsive layout for desktop, tablet, and mobile devices
- **Pagination** - Efficient navigation through large lists and search results

### 👨‍💼 Admin Features
- **JWT-Protected Dashboard** - Secure admin-only access with token-based authentication
- **Content Management** - Create, update, and delete tourist places with multilingual field support
- **Analytics Dashboard** - View statistics on places, users, reviews, views, and popular categories/states
- **User Management** - Manage user accounts and assign/modify roles
- **Review Moderation** - Monitor all user reviews and remove inappropriate content
- **Place Analytics** - Track top-rated places and view trends

### 🔒 Security Features
- **JWT Authentication** - Secure token-based user authentication
- **Password Hashing** - bcryptjs for safe password storage
- **Rate Limiting** - API request throttling to prevent abuse (15-minute windows)
- **CORS Protection** - Cross-Origin Resource Sharing configured
- **Input Validation** - express-validator for robust input sanitization

> **Note:** Map rendering functionality is not yet implemented. Dependencies for Leaflet and react-leaflet are included for future map integration.

---

## Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Security:** bcryptjs for password hashing, express-rate-limit, express-validator
- **Middleware:** CORS, compression, dotenv

### Frontend
- **Library:** React 17
- **Routing:** React Router v6
- **HTTP Client:** axios
- **Internationalization:** react-i18next with language detector
- **UI Components:** react-image-gallery, React Toastify (notifications)
- **Styling:** Custom CSS with responsive design

### Build & Deployment
- **Frontend Build:** React Scripts
- **Package Management:** npm/yarn
- **Development:** Nodemon (optional for backend auto-reload)

---

## Project Structure

```
TravelBharat/
├── backend/                          # Node.js/Express API server
│   ├── config/
│   │   └── db.js                    # MongoDB connection configuration
│   ├── controllers/                 # Request handlers
│   │   ├── authController.js        # Auth logic (register, login)
│   │   ├── placeController.js       # Place CRUD & queries
│   │   ├── reviewController.js      # Review management
│   │   └── adminController.js       # Admin dashboard endpoints
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js                 # User schema
│   │   ├── Place.js                # Tourist place schema
│   │   └── Review.js               # Review/rating schema
│   ├── routes/                      # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── placeRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification middleware
│   │   └── validation.js           # Input validation middleware
│   ├── utils/
│   │   └── categoryHelper.js       # Category utility functions
│   ├── scripts/
│   │   ├── seed.js                # Seed database with sample data
│   │   ├── seed-sample.js         # Alternative seed data
│   │   └── normalizeCategories.js # Category normalization utility
│   ├── *.csv                        # Data files for seeding
│   ├── index.js                     # Entry point
│   ├── package.json
│   └── .env                         # Environment variables (create from .env.example)
│
├── frontend/                         # React app
│   ├── public/
│   │   └── index.html              # HTML template
│   ├── src/
│   │   ├── components/             # Reusable React components
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── PlaceCard.js
│   │   │   ├── ReviewForm.js
│   │   │   ├── ReviewList.js
│   │   │   ├── StarRating.js
│   │   │   ├── AdminForm.js
│   │   │   └── LanguageSwitcher.js
│   │   ├── pages/                  # Page components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── PlaceDetails.js
│   │   │   ├── Search.js
│   │   │   ├── StateList.js
│   │   │   ├── UserProfile.js
│   │   │   └── AdminDashboard.js
│   │   ├── locales/                # i18n translation files
│   │   │   ├── en.json            # English translations
│   │   │   ├── hi.json            # Hindi translations
│   │   │   └── ta.json            # Tamil translations
│   │   ├── utils/
│   │   │   └── categoryHelper.js
│   │   ├── App.js                  # Root component
│   │   ├── i18n.js                 # i18next configuration
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Global styles
│   ├── build/                       # Production build output (generated)
│   ├── package.json
│   └── .env                         # Environment variables (create from .env.example)
│
└── README.md                         # This file
```

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v14+ ([Download](https://nodejs.org/))
- **npm** v6+ or **yarn** v1.22+ (comes with Node.js)
- **MongoDB** v4+ - either:
  - Local installation ([Download](https://www.mongodb.com/try/download/community))
  - MongoDB Atlas cloud database ([Sign up](https://www.mongodb.com/cloud/atlas))
- **Git** (optional, for version control)

Verify installations:
```bash
node --version   # Should be v14.0.0 or higher
npm --version    # Should be v6.0.0 or higher
```

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/BALAVAISHNAVIJ2006/TravelBharat.git
cd TravelBharat
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/travelbharat?retryWrites=true&w=majority
# Or for local MongoDB:
# MONGO_URI=mongodb://localhost:27017/travelbharat

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# API
API_BASE_URL=http://localhost:5000
```

#### Seed Database (Optional)
Load sample data into your database:
```bash
node seed.js          # Main seed data
# OR
node seed-sample.js   # Alternative sample data
```

#### Start Backend Server
```bash
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install --legacy-peer-deps
```

#### Configure Environment Variables
Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_BASE_URL=http://localhost:5000
```

#### Start Development Server
```bash
npm start
# App opens at http://localhost:3000
```

### ✅ Verification
Both servers should be running:
- Backend API: http://localhost:5000/api
- Frontend App: http://localhost:3000

---

## API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |

### Places Routes (`/api/places`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all places with pagination |
| GET | `/featured` | Get featured places |
| GET | `/states` | Get all states |
| GET | `/state/:state` | Get places in a specific state |
| GET | `/category/:category` | Get places by category |
| GET | `/cities/:state` | Get cities in a state |
| GET | `/search` | Search places (query params: q, state, city, category) |
| GET | `/:id` | Get single place details |
| POST | `/:id/view` | Increment place view count |

### Reviews Routes (`/api/reviews`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/place/:placeId` | Get reviews for a place | No |
| POST | `/` | Create a review | Yes |
| GET | `/my-reviews` | Get current user's reviews | Yes |
| PUT | `/:id` | Update own review | Yes |
| DELETE | `/:id` | Delete own review | Yes |
| GET | `/all` | Get all reviews (admin only) | Yes (Admin) |

### Admin Routes (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/stats` | Get dashboard statistics | Admin |
| GET | `/places` | Get all places (admin) | Admin |
| POST | `/places` | Create new place | Admin |
| PUT | `/places/:id` | Update place | Admin |
| DELETE | `/places/:id` | Delete place | Admin |
| GET | `/users` | Get all users | Admin |
| PUT | `/users/role` | Update user role | Admin |

---

## Data Models

### Place Schema
```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  nameHi: String,           // Hindi name
  nameTa: String,           // Tamil name
  state: String (required),
  city: String (required),
  category: String (required), // Heritage, Nature, Adventure, Religious
  description: String,
  descriptionHi: String,
  descriptionTa: String,
  bestTimeToVisit: String,
  location: String,
  images: [String],         // Array of image URLs
  entryFees: String,
  timings: String,
  nearbyAttractions: [String],
  averageRating: Number,
  totalReviews: Number,
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### User Schema
```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Review Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (required, ref: 'User'),
  placeId: ObjectId (required, ref: 'Place'),
  userName: String,
  rating: Number (1-5, required),
  comment: String,
  language: String (enum: ['en', 'hi', 'ta']),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment type | `development` or `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `JWT_EXPIRE` | Token expiration time | `7d` |
| `ADMIN_USERNAME` | Default admin username | `admin` |
| `ADMIN_PASSWORD` | Default admin password | `admin123` |
| `API_BASE_URL` | API base URL | `http://localhost:5000` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API endpoint | `http://localhost:5000/api` |
| `REACT_APP_API_BASE_URL` | API base URL | `http://localhost:5000` |

---

## Troubleshooting

### Backend Issues

**Port 5000 already in use:**
```bash
# Change PORT in .env file
PORT=5001
```

**MongoDB connection fails:**
- Verify MongoDB is running (`mongod`)
- Check MONGO_URI is correct in .env
- For Atlas, ensure IP whitelist includes your IP

**JWT Token errors:**
- Clear browser localStorage
- Regenerate JWT_SECRET in .env and restart server
- Verify token expiration time is reasonable

### Frontend Issues

**CORS errors:**
- Backend CORS is enabled; check backend is running on correct port
- Verify REACT_APP_API_URL matches backend address in .env

**Dependencies conflict (`--legacy-peer-deps`):**
```bash
npm install --legacy-peer-deps
# Required for React 17 compatibility with newer packages
```

**Port 3000 in use:**
```bash
# Let React prompt you:
npm start
# When asked about port change, press 'y'
```

**Blank page or images not loading:**
- Check browser console for errors (F12)
- Verify backend API is running
- Check REACT_APP_API_URL in .env

### Database Issues

**No data showing up:**
```bash
# Run seed script to populate sample data
cd backend
node seed.js
npm start
```

**Duplicate key errors:**
```bash
# Fix by dropping collection and re-seeding
# Login to MongoDB and drop the 'places' collection, then run seed.js again
```

---

## Future Enhancements

- 🗺️ **Interactive Maps** - Leaflet/Google Maps integration for place location visualization
- 📍 **Map Coordinates** - GPS coordinates and map links for each place
- 🌐 **Broader Localization** - Expand multilingual support beyond English/Hindi/Tamil
- 🛣️ **Itinerary Planner** - Create and save multi-day travel itineraries
- 🏨 **Travel Integrations** - Link to hotel and transportation booking platforms
- 📸 **Image Upload** - Allow users to upload custom place images
- 💬 **Chat/Forum** - Community discussion features
- 🔔 **Notifications** - Email/push notifications for reviews and updates
- 🌙 **Dark Mode** - Dark theme support for better accessibility

---

## Contributing

Contributions are welcome! Here's how to contribute:

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/TravelBharat.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and commit
   ```bash
   git commit -m "Add your feature description"
   ```

4. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request** with a description of your changes

### Code Style
- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing code patterns
- Test your changes before submitting PR

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support & Contact

For questions, issues, or suggestions:
- Open an [Issue](https://github.com/yourusername/TravelBharat/issues)
- Contact: [your-email@example.com]

---

**Happy Traveling! 🚀✈️🏔️**
- SEO and performance tuning

## License
MIT
