
# API Documentation

All the API's REST based


## Authentication

### Sign In

Signs in a user. 

/auth/signin

**Parameters:**
- `email`: User's email address
- `password`: User's password

**Example:**

```
await signIn('user@example.com', 'password123');

On Successful sign in, retrieve the st-access-token needed for future reference authentication.



```

### Logout

/auth/signout

Logs out the current user and removes the stored access token.

**Example:**
```
await logout();
```

## User Management



### Create/Update User
- **POST** `/api/users`
- **Auth Required:** Yes (Send on header of request Authorization: 'Bearer {Accesstoken} which is retreived from signing")

- **Body:**
  ```typescript
  {
    email: string,    // Valid email format required
    first: string,    // 2-50 characters
    last: string,     // 2-50 characters
    role?: string     // Optional: 'admin' | 'user' | 'guest'
  }
  ```
- **Response:** `201`
  ```typescript
  {
    _id: string,
    email: string,
    first: string,
    last: string,
    role: string,
    externalUserId: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date
  }
  ```

### Get Users (Paginated)
- **GET** `/api/users?page=1&limit=10`
- **Auth Required:** Yes
- **Query Parameters:**
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
- **Response:** `200`
  ```typescript
  {
    users: Array<User>,
    currentPage: number,
    totalPages: number,
    totalUsers: number
  }
  ```


## File Operations

### Upload File
  Uploads a file to the s3 with associated metadata to mongodb.Send on header of request Authorization: 'Bearer {Accesstoken} which is retreived from signin"

- **POST** `/api/upload`
- **Auth Required:** Yes
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file`: File (Max size: 10MB)
  - `keywords`: string (comma-separated, min 2 chars each)
- **Supported File Types:** 
  - image/jpeg
  - image/png
  - application/pdf
  - text/plain
- **Response:** `201`
  ```typescript
  {
    _id: string,
    filename: string,
    uploadeduser: string,
    uploaddate: Date,
    filetype: string,
    filesize: number,
    keywords: string[],
    s3_url: string,
    thumbnail_url?: string,
    createdAt: Date,
    updatedAt: Date
  }
  ```

### Search Files (Paginated)
- **GET** `/api/files?filename=test&keywords=keyword1,keyword2&page=1&limit=10`
- **Auth Required:** Yes
- **Query Parameters:**
  - `filename`: string (optional)
  - `keywords`: string (optional, comma-separated)
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
- **Response:** `200`
  ```typescript
  {
    files: Array<File>,
    currentPage: number,
    totalPages: number,
    totalFiles: number
  }
  ```

### Download File
- **GET** `/api/download/:id`
- **Auth Required:** Yes
- **Parameters:**
  - `id`: File ID
- **Response:** `200`
  - File stream with appropriate content-type header
  - Filename will be set in content-disposition header

### Delete File
- **DELETE** `/api/files/:id`
- **Auth Required:** Yes
- **Parameters:**
  - `id`: File ID
- **Response:** `200`
  ```typescript
  {
    message: string
  }
  ```

## Error Responses
All endpoints may return the following error responses:

- `400` Bad Request
  ```typescript
  {
    error: string
  }
  ```
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
  ```typescript
  {
    message: string
  }
  ```
- `500` Server Error
  ```typescript
  {
    error: string
  }
  ```

## Error Handling

### Common Error Codes
- `401`: Authentication failed
- `403`: Unauthorized access
- `404`: Resource not found
- `413`: File too large
- `429`: Too many requests

