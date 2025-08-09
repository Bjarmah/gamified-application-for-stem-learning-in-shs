#!/bin/bash

echo "STEM Stars Ghana - Sample Data Generation"
echo "======================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install dependencies."
        exit 1
    fi
fi

# Check for .env file and create if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env 2>/dev/null
    echo "Please edit the .env file with your Supabase service key before continuing."
    echo "Press Enter to continue once you've updated the .env file..."
    read
fi

# Check if SUPABASE_SERVICE_KEY is set in environment or .env file
KEY_SET=0
if [ ! -z "$SUPABASE_SERVICE_KEY" ]; then
    KEY_SET=1
fi

ENV_KEY_SET=$(node -e "try { require('dotenv').config(); console.log(process.env.SUPABASE_SERVICE_KEY ? 1 : 0); } catch(e) { console.log(0); }")

if [ "$KEY_SET" -eq 0 ] && [ "$ENV_KEY_SET" -eq 0 ]; then
    echo "Error: SUPABASE_SERVICE_KEY is not set in environment or .env file."
    echo "Please set it in the .env file or using: export SUPABASE_SERVICE_KEY=your_service_key_here"
    echo "Get this from your Supabase dashboard under Project Settings > API"
    exit 1
fi

echo
echo "Step 1/3: Creating sample users..."
node create-sample-users.js
if [ $? -ne 0 ]; then
    echo "Error: Failed to create sample users."
    exit 1
fi

echo
echo "Step 2/3: Creating sample user progress data..."
node create-sample-user-progress.js
if [ $? -ne 0 ]; then
    echo "Error: Failed to create sample user progress data."
    exit 1
fi

echo
echo "Step 3/3: Creating sample quiz attempt data..."
node create-sample-quiz-attempts.js
if [ $? -ne 0 ]; then
    echo "Error: Failed to create sample quiz attempt data."
    exit 1
fi

echo
echo "======================================="
echo "Sample data generation completed successfully!"
echo
echo "You can now log in with the following credentials:"
echo
echo "Admin: admin@example.com / password123"
echo "Teacher: teacher1@example.com / password123"
echo "Student: student1@example.com / password123"
echo