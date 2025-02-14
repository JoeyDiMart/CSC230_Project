# File Management System with SuperTokens Authentication

## Introduction

This project is a secure file management system built with TypeScript and Express.js, featuring user authentication powered by SuperTokens. It's designed to help you understand how to build a modern, secure web application with TypeScript.

## Technologies Used

- **TypeScript**: A strongly-typed programming language that builds on JavaScript
- **Express.js**: A web application framework for Node.js
- **SuperTokens**: An open-source authentication solution
- **MongoDB**: A NoSQL database for storing user and file information
- **AWS S3**: Cloud storage for file uploads
- **Multer**: Middleware for handling file uploads
- **Rate Limiting**: Protection against excessive API requests

## Project Structure

```
📦server
 ┣ 📜api.ts         # API routes and business logic
 ┣ 📜config.ts      # SuperTokens and application configuration
 ┣ 📜index.ts       # Application entry point
 ┗ 📜README.md      # Project documentation (this file)
```

### File Descriptions

1. **index.ts**
   - The main entry point of the application
   - Sets up Express server and middleware
   - Configures CORS and error handling
   - Initializes SuperTokens authentication

2. **config.ts**
   - Contains SuperTokens configuration
   - Manages environment variables
   - Sets up authentication recipes (EmailPassword, Session, Dashboard, UserRoles)

3. **api.ts**
   - Implements API endpoints
   - Handles file uploads and management
   - Manages user roles and permissions
   - Implements security measures (rate limiting, input sanitization)

## Key Features

1. **User Authentication**
   - Email and password authentication
   - Session management
   - Role-based access control (Admin, User, Guest)

2. **File Management**
   - Secure file uploads to AWS S3
   - File metadata storage in MongoDB
   - File type validation
   - Size restrictions (10MB limit)

3. **Security Features**
   - Rate limiting (100 requests per 15 minutes)
   - Input sanitization
   - Secure file type validation
   - Role-based access control

## Getting Started

### Prerequisites
1. Node.js and npm installed
2. MongoDB instance (local or cloud)
3. AWS S3 bucket (for file storage)

### Environment Variables
Create a `.env` file in the root directory with these variables:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
AWS_S3_BUCKET=your_s3_bucket_name
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

### Installation Steps
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Understanding the Code

### User Management
The system uses a MongoDB schema for user management with the following fields:
- `email`: User's email address (unique)
- `first`: First name
- `last`: Last name
- `role`: User role (admin/user/guest)
- `externalUserId`: Unique identifier
- `isActive`: Account status
- `lastLogin`: Timestamp of last login

### File Upload Process
1. Files are validated for type and size
2. Uploaded directly to AWS S3
3. Metadata stored in MongoDB
4. Files can be searched by filename or keywords

### API Endpoints
- `/api/users`: User management
- `/api/files`: File operations (upload, download, search)
- `/auth/*`: Authentication endpoints (handled by SuperTokens)

## Common TypeScript Concepts Used

1. **Interfaces and Types**
   - Used for defining data structures
   - Ensures type safety throughout the application

2. **Enums**
   - Used for user roles
   - Provides type-safe way to work with fixed sets of values

3. **Async/Await**
   - Used for handling asynchronous operations
   - Makes code more readable and maintainable

## Learning Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [SuperTokens Documentation](https://supertokens.com/docs/guides)
- [MongoDB Documentation](https://docs.mongodb.com/)

## Need Help?

For questions or support:
- Create an issue in the repository
- Contact the development team
- Check the SuperTokens Discord community

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License.
