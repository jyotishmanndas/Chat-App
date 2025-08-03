# Chat-App

A real-time chat application built with Next.js, WebSocket, and Prisma.

## Features

- **Real-time messaging**: Users can send and receive messages instantly using WebSocket connections
- **Room-based chat**: Users can join specific chat rooms using room codes
- **User authentication**: JWT-based authentication with user registration and login
- **User identification**: Messages show the actual user names instead of generic identifiers
- **Connection status**: Visual indicators show WebSocket connection status
- **Responsive design**: Modern UI that works on desktop and mobile devices

## Architecture

The application consists of three main parts:

1. **Frontend (Next.js)**: React-based web application with real-time chat interface
2. **Backend API (Express)**: REST API for user authentication and user management
3. **WebSocket Server**: Real-time communication server for chat functionality

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- pnpm package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up your environment variables:
   ```bash
   # Create .env file in the root directory
   DATABASE_URL="postgresql://username:password@localhost:5432/chat_app"
   ```

4. Set up the database:
   ```bash
   cd packages/db
   pnpm prisma generate
   pnpm prisma db push
   ```

5. Start the development servers:
   ```bash
   # Start all services
   pnpm dev
   
   # Or start them individually:
   pnpm --filter backend dev    # Backend API (port 3000)
   pnpm --filter websockets dev # WebSocket server (port 8080)
   pnpm --filter web dev        # Frontend (port 3001)
   ```

## Usage

1. **Register/Login**: Create an account or sign in to get access to the chat
2. **Join a Room**: Enter a room code to join a specific chat room
3. **Start Chatting**: Send messages and see them appear in real-time for all users in the room

## WebSocket Protocol

The WebSocket server handles the following message types:

- `join_room`: Join a specific chat room
- `leave_room`: Leave a chat room
- `send_message`: Send a message to all users in the room
- `joined_room`: Confirmation that user joined a room
- `left_room`: Confirmation that user left a room
- `message`: Incoming message from another user
- `error`: Error message from the server

## API Endpoints

- `POST /signup`: User registration
- `POST /signin`: User login
- `GET /user/:userId`: Get user information (requires authentication)

## Technologies Used

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Prisma ORM, PostgreSQL
- **Real-time**: WebSocket (ws library)
- **Authentication**: JWT tokens
- **UI Components**:  Shadcn UI
- **Package Management**: pnpm workspaces
