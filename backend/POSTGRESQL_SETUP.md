# PostgreSQL Setup Guide

This guide will help you set up PostgreSQL for the Real Estate Website project.

## Option 1: Install PostgreSQL Locally

### Windows

1. **Download PostgreSQL**:
   - Go to [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
   - Download the installer from EnterpriseDB
   - Choose the latest version

2. **Install PostgreSQL**:
   - Run the installer
   - Choose installation directory
   - Select components (all are recommended)
   - Choose data directory
   - Set password for the postgres user (remember this password!)
   - Set port (default is 5432)
   - Choose locale

3. **Verify Installation**:
   - Open pgAdmin (installed with PostgreSQL)
   - Connect to the server using the password you set
   - You should see the PostgreSQL server in the browser panel

### macOS

1. **Using Homebrew**:
   ```bash
   brew install postgresql
   brew services start postgresql
   ```

2. **Or download from the website**:
   - Go to [PostgreSQL Downloads](https://www.postgresql.org/download/macosx/)
   - Download the installer from EnterpriseDB
   - Follow the installation instructions

3. **Verify Installation**:
   ```bash
   psql --version
   ```

### Linux (Ubuntu/Debian)

1. **Install PostgreSQL**:
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```

2. **Start PostgreSQL**:
   ```bash
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

3. **Verify Installation**:
   ```bash
   sudo -u postgres psql -c "SELECT version();"
   ```

## Option 2: Use a Cloud-Hosted PostgreSQL Service

If you don't want to install PostgreSQL locally, you can use a cloud-hosted service:

### ElephantSQL (Free Tier Available)

1. Go to [ElephantSQL](https://www.elephantsql.com/)
2. Sign up for a free account
3. Create a new instance (Tiny Turtle - Free plan)
4. Once created, you'll get a connection URL
5. Update your `.env` file with the connection details:
   ```
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database
   DB_HOST=your_host
   DB_PORT=5432
   ```

### Supabase (Free Tier Available)

1. Go to [Supabase](https://supabase.com/)
2. Sign up for a free account
3. Create a new project
4. Go to Settings > Database to find your connection details
5. Update your `.env` file with the connection details

### Render (Free Tier Available)

1. Go to [Render](https://render.com/)
2. Sign up for a free account
3. Create a new PostgreSQL database
4. You'll get connection details after creation
5. Update your `.env` file with the connection details

## Setting Up the Database for the Project

After installing PostgreSQL or setting up a cloud instance:

1. **Update the `.env` file** with your PostgreSQL credentials:
   ```
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_NAME=real_estate_dev
   DB_HOST=your_host
   DB_PORT=5432
   ```

2. **Initialize the database**:
   ```bash
   npm run init-db
   ```

3. **Set up the database with sample data**:
   ```bash
   npm run setup-db
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## Troubleshooting

### Connection Issues

If you encounter connection issues:

1. **Check if PostgreSQL is running**:
   - Windows: Open Services and check if PostgreSQL service is running
   - macOS/Linux: `ps aux | grep postgres`

2. **Verify credentials**:
   - Make sure the username and password in `.env` are correct
   - Try connecting with psql: `psql -U postgres -h localhost`

3. **Check firewall settings**:
   - Make sure port 5432 is open if connecting remotely

### Permission Issues

If you encounter permission issues:

1. **Create a new user** (if needed):
   ```sql
   CREATE USER your_username WITH PASSWORD 'your_password';
   ALTER USER your_username WITH SUPERUSER;
   ```

2. **Grant privileges**:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE real_estate_dev TO your_username;
   ```

## PostgreSQL GUI Tools

For easier database management, you can use these GUI tools:

- **pgAdmin**: Comes with PostgreSQL installation
- **DBeaver**: Free universal database tool
- **TablePlus**: Modern, native tool (free version available)
- **Postico**: Simple PostgreSQL client for macOS
