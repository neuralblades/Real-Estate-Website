# Real Estate Website Backend

This is the backend API for the Real Estate Website project, built with Node.js, Express, and PostgreSQL.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Set up PostgreSQL:
   - Install PostgreSQL if you haven't already (see [PostgreSQL Setup Guide](./POSTGRESQL_SETUP.md))
   - Create a PostgreSQL user and password
   - Update the `.env` file with your PostgreSQL credentials

3. Initialize and set up the database with sample data:
   ```
   npm run setup-db
   ```
   This will:
   - Create the database if it doesn't exist
   - Create all tables based on the models
   - Seed the database with sample data

   Alternatively, you can just initialize the database without sample data:
   ```
   npm run init-db
   ```

4. Start the development server:
   ```
   npm run dev
   ```

> **Note**: For detailed PostgreSQL setup instructions, including cloud-hosted options, see the [PostgreSQL Setup Guide](./POSTGRESQL_SETUP.md).

## Sample Data

The setup script creates the following sample data:

### Users
- Admin: admin@example.com / admin123
- Agent: john@example.com / agent123
- Agent: jane@example.com / agent123

### Properties
- 3 sample properties with images, features, and details

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

# PostgreSQL Database Configuration
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=real_estate_dev
DB_HOST=localhost
DB_PORT=5432
```

## API Endpoints

### Users
- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `POST /api/users/save-property/:id` - Save property to favorites (protected)
- `DELETE /api/users/save-property/:id` - Remove property from favorites (protected)
- `GET /api/users/saved-properties` - Get saved properties (protected)
- `GET /api/users` - Get all users (admin only)

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create a new property (agent only)
- `PUT /api/properties/:id` - Update property (agent only)
- `DELETE /api/properties/:id` - Delete property (agent only)
- `GET /api/properties/featured` - Get featured properties
- `GET /api/properties/agent/:id` - Get properties by agent

### Inquiries
- `POST /api/inquiries` - Create a new inquiry
- `GET /api/inquiries` - Get all inquiries (agent only)
- `GET /api/inquiries/:id` - Get inquiry by ID (agent only)
- `PUT /api/inquiries/:id` - Update inquiry status (agent only)
- `GET /api/inquiries/property/:id` - Get inquiries for a property (agent only)
- `GET /api/inquiries/agent` - Get inquiries for agent's properties (agent only)
