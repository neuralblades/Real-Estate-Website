# 🏢 Platinum Square Real Estate

<div align="center">
  <img src="frontend/public/images/logo.png" alt="Platinum Square Real Estate Logo" width="300"/>
  <br>
  <h3>Modern Real Estate Platform for Dubai's Premium Properties</h3>
  
  ![Next.js](https://img.shields.io/badge/Next.js-13.4+-000000?style=for-the-badge&logo=next.js&logoColor=white)
  ![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![Node.js](https://img.shields.io/badge/Node.js-18.0+-339933?style=for-the-badge&logo=node.js&logoColor=white)
  ![Express](https://img.shields.io/badge/Express-4.0+-000000?style=for-the-badge&logo=express&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
</div>

## ✨ Overview

Platinum Square Real Estate is a full-stack web application designed to showcase premium properties in Dubai. The platform offers a seamless experience for property buyers, sellers, and renters with advanced search capabilities, detailed property listings, and interactive features.

<div align="center">
  <img src="frontend/public/images/screenshot-home.jpg" alt="Website Screenshot" width="80%"/>
</div>

## 🌟 Key Features

### 📱 Responsive Design
- Fully responsive layout that works perfectly on desktops, tablets, and mobile devices
- Modern UI with smooth animations and transitions

### 🏠 Property Listings
- Comprehensive property details with high-quality images
- Interactive image galleries and virtual tours
- Detailed specifications, floor plans, and location information

<div align="center">
  <img src="frontend/public/images/screenshot-property.jpg" alt="Property Listing" width="80%"/>
</div>

### 🔍 Advanced Search
- Powerful search functionality with autocomplete
- Filter properties by type, location, price range, and amenities
- Save favorite searches and properties

### 👷 Off-Plan Properties
- Dedicated section for off-plan and under-construction properties
- Developer profiles and project timelines
- Payment plan information and investment opportunities

### 🔐 User Authentication
- Secure user registration and login system
- Personalized dashboards for users
- Saved properties and search preferences

### 💬 Communication Tools
- Integrated chatbot for instant assistance
- Property inquiry forms
- Agent contact information

### 📊 Admin Dashboard
- Comprehensive admin panel for property management
- Analytics and reporting tools
- User management system

## 🛠️ Technology Stack

### Frontend
- **Next.js**: React framework for server-side rendering and static site generation
- **React**: JavaScript library for building user interfaces
- **TailwindCSS**: Utility-first CSS framework for rapid UI development
- **Headless UI**: Unstyled, accessible UI components
- **React Icons**: Icon library for React applications

### Backend
- **Node.js**: JavaScript runtime for server-side code
- **Express**: Web application framework for Node.js
- **PostgreSQL**: Relational database for data storage
- **Prisma**: Next-generation ORM for Node.js and TypeScript
- **JWT**: JSON Web Tokens for secure authentication

### APIs & Services
- **Google Maps API**: For property location visualization
- **Cloudinary**: Cloud-based image and video management

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/real-estate-website.git
   cd real-estate-website
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env.local` file in the frontend directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```
   
   Create `.env` file in the backend directory:
   ```
   PORT=5000
   DATABASE_URL=postgresql://username:password@localhost:5432/real_estate_db
   JWT_SECRET=your_jwt_secret
   ```

4. **Set up the database**
   ```bash
   cd backend
   npx prisma migrate dev
   ```

5. **Start the development servers**
   ```bash
   # Start the backend server
   cd backend
   npm run dev
   
   # Start the frontend server
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Admin Dashboard: http://localhost:3000/admin (login required)

## 📂 Project Structure

```
real-estate-website/
├── frontend/                # Next.js frontend application
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── app/             # Next.js app directory
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   ├── .env.local           # Environment variables
│   └── package.json         # Dependencies and scripts
│
├── backend/                 # Express backend application
│   ├── src/                 # Source code
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   └── utils/           # Utility functions
│   ├── prisma/              # Prisma schema and migrations
│   ├── .env                 # Environment variables
│   └── package.json         # Dependencies and scripts
│
└── README.md                # Project documentation
```

## 📱 Mobile View

<div align="center">
  <img src="frontend/public/images/screenshot-mobile.jpg" alt="Mobile View" width="300"/>
</div>

## 🔧 Configuration Options

The application can be configured through environment variables and configuration files:

- **Frontend Configuration**: `frontend/src/config/index.js`
- **Backend Configuration**: `backend/src/config/index.js`
- **Database Configuration**: `backend/prisma/schema.prisma`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

Platinum Square Real Estate - [info@platinumsquare.ae](mailto:info@platinumsquare.ae)

Concord Tower - 2902, Al Sufouh - Dubai Media City, Dubai, UAE

---

<div align="center">
  <p>© 2023 Platinum Square Real Estate. All rights reserved.</p>
</div>
