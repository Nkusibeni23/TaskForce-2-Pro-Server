# Task Force Pro - Server

The backend server for Task Force Pro, a wallet web application designed to help users track financial transactions, manage budgets, and visualize their financial data.

## Overview

This server provides the backend services for Task Force Pro, managing APIs for user authentication, transaction handling, budget tracking, and reporting. It integrates **Clerk** for user authentication, utilizes **MongoDB** for database management, and includes **Swagger** for API documentation.

## Features

- **User Authentication**: Secure and seamless user authentication powered by Clerk.
- **Transaction Management**: APIs to create, update, delete, and retrieve transactions.
- **Budget Tracking**: Set and manage budgets for categories; monitor spending and receive alerts when budgets are exceeded.
- **Custom Reporting**: Generate detailed reports based on specific timeframes (daily, weekly, monthly).
- **Data Visualization**: Backend support for delivering data used in graphs and charts.
- **API Documentation**: Interactive and easy-to-use API documentation provided by Swagger.
- **Scalable Deployment**: Optimized for deployment on platforms like Netlify.

## Prerequisites

Before setting up the server, ensure you have the following installed on your system:

- Node.js (version 18 or higher recommended)
- MongoDB (local or remote database instance)
- A **Clerk** account for authentication integration

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Nkusibeni23/TaskForce-2-Pro-Server.git
   cd TaskForce-2-Pro-Server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the required environment variables:

   ```env
   MONGO_URI=<your_mongo_database_uri>
   CLERK_API_KEY=<your_clerk_api_key>
   PORT=4000
   ```

4. Build the project:

   ```bash
   npm run build
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

## API Documentation

Access the interactive Swagger API documentation at `http://localhost:<PORT>/api-docs` after starting the server.

## Scripts

- `npm run dev`: Start the development server using Nodemon.
- `npm run build`: Compile TypeScript files into JavaScript.
- `npm start`: Start the production server.

## Dependencies

**Core Dependencies**

- **Express**: Fast and minimalist web framework for Node.js.
- **Mongoose**: MongoDB object modeling tool.
- **Clerk SDK**: Authentication as a service.
- **Swagger-UI-Express**: API documentation UI.

**Development Dependencies**

- **Typescript**: Type-safe JavaScript.
- **Nodemon**: Monitor for changes during development.

## Deployment

The server can be deployed on platforms such as Netlify or Heroku. Use the following build script for production:

```bash
npm run build
npm start
```
