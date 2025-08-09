# Sample Data Generation Scripts

This directory contains scripts to generate sample data for the STEM Stars Ghana application. These scripts will populate your Supabase database with realistic test data for development and testing purposes.

## Prerequisites

1. Node.js installed on your system
2. Supabase Service Key (not the anon key) with admin privileges

## Quick Start

For the easiest setup, use the provided scripts:

**Windows:**
```cmd
.\run-all-scripts.bat
```

**Mac/Linux:**
```bash
chmod +x ./run-all-scripts.sh
./run-all-scripts.sh
```

These scripts will:
1. Check for Node.js installation
2. Install required dependencies
3. Create a `.env` file from the template if it doesn't exist
4. Prompt you to add your Supabase service key to the `.env` file
5. Run all three data generation scripts in sequence

Alternatively, you can use npm scripts:

```bash
# Install dependencies
npm install

# Create .env file from template
npm run setup

# Edit the .env file with your Supabase service key

# Run all scripts
npm run all
```

## Manual Setup

1. Install dependencies:

```bash
npm install
```

2. Set up your environment variables using one of these methods:

### Option A: Using a .env file (Recommended)

```bash
# Create a .env file from the example
npm run setup

# Then edit the .env file with your Supabase service key
```

### Option B: Setting environment variables directly

**Windows (Command Prompt):**
```cmd
set SUPABASE_SERVICE_KEY=your_service_key_here
```

**Windows (PowerShell):**
```powershell
$env:SUPABASE_SERVICE_KEY="your_service_key_here"
```

**Mac/Linux:**
```bash
export SUPABASE_SERVICE_KEY=your_service_key_here
```

## Available Scripts

### 1. Create Sample Users

This script creates sample users with different roles (student, teacher, admin) and inserts their profile data into the profiles table.

```bash
node create-sample-users.js
```

**Sample Users Created:**

- Admin: admin@stemstars.edu.gh (Password: Admin123!)
- Teachers: 
  - teacher.math@stemstars.edu.gh (Password: Teacher123!)
  - teacher.science@stemstars.edu.gh (Password: Teacher123!)
- Students: 
  - student1@stemstars.edu.gh through student5@stemstars.edu.gh (Password: Student123!)

### 2. Create Sample User Progress

This script creates sample user progress records for students to demonstrate learning progress across different modules.

```bash
node create-sample-user-progress.js
```

### 3. Create Sample Quiz Attempts

This script creates sample quiz attempt records for students to demonstrate quiz performance across different modules.

```bash
node create-sample-quiz-attempts.js
```

## Recommended Execution Order

For best results, run the scripts in this order:

1. `create-sample-users.js` - Creates the user accounts and profiles
2. `create-sample-user-progress.js` - Creates progress records for the users
3. `create-sample-quiz-attempts.js` - Creates quiz attempt records for the users

## Notes

- These scripts are designed to work with the existing database schema and will not modify the structure of your database.
- The scripts will not delete existing data, but may overwrite records with the same IDs.
- If you encounter any errors, check the console output for details.
- You can run these scripts multiple times to generate more data, but be aware that it may create duplicate records.

## Getting Your Supabase Service Key

1. Go to your Supabase project dashboard
2. Navigate to Project Settings > API
3. Find the "service_role" key (labeled as "service_role secret")
4. Copy this key and use it as your SUPABASE_SERVICE_KEY

**Important:** Keep your service key secure and never commit it to version control or expose it in client-side code.