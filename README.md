# Real-Time Chat Application
This is a real-time chat application built using the MERN stack (MongoDB, Express.js, React, Node.js).
The application allows users to register, log in, and chat in real-time. 
Additionally, it integrates with a language model API to generate responses when a user is busy.

## Features
- User Registration and Login
- Real-Time Messaging with Socket.io
- User Status Management (AVAILABLE/BUSY)
- Automated Responses using a Language Model API
- JWT Authentication

## Installation

1. Clone the repository
    git clone https://github.com/your-username/your-repository.git
  
2. Navigate to the project directory:
    cd your-repository
   
4. Install server dependencies:
    cd server
    npm install
    
5. Install client dependencies:
    cd ../client
    npm install

## Configuration

1. Create a `.env` file in the `server` directory and add the following environment variables:
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    OPENAI_API_KEY=your_openai_api_key

## Running the Application

1. Start the server:
    nodemon server.js

## Usage

1. Register a new user.
2. Log in with your credentials.
3. Set your status to `AVAILABLE` or `BUSY`.
4. Start chatting with other users.
5. If the recipient is busy, an automated response will be generated.
