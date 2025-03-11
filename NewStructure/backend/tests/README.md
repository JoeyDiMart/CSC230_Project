# CIRT API Testing Guide

## Setup Instructions

1. Install [Postman](https://www.postman.com/downloads/)
2. Import the `CIRT_API.postman_collection.json` file into Postman
3. Set up environment variables in Postman:
   - `userId`: Will be obtained after user signup/login
   - `manuscriptId`: Will be obtained after manuscript submission
   - `posterId`: Will be obtained after poster upload

## Test Sequence

### 1. User Management Tests
1. **Sign Up**
   - Create a new user account
   - Save the returned `userId` to your environment variables
   - Expected response: 201 Created

2. **Login**
   - Login with the created credentials
   - Expected response: 200 OK with user details

3. **Get Profile**
   - Verify user profile information
   - Expected response: 200 OK with profile details

4. **Update User Role** (Admin only)
   - Change user role (author/reviewer/editor/admin)
   - Expected response: 200 OK

5. **Logout**
   - End user session
   - Expected response: 200 OK

### 2. Journal Management Tests
1. **Submit Manuscript**
   - Upload a PDF/Word document
   - Add title and abstract
   - Save the returned `manuscriptId`
   - Expected response: 201 Created

2. **Get Manuscript**
   - View manuscript details
   - Expected response: 200 OK

3. **Submit Review** (Reviewer only)
   - Upload annotated manuscript
   - Add comments and recommendation
   - Expected response: 200 OK

4. **Get Reviews** (Editor/Reviewer only)
   - View all pending reviews
   - Expected response: 200 OK

5. **Update Manuscript Decision** (Editor only)
   - Accept/Reject manuscript
   - Expected response: 200 OK

6. **Create Issue** (Editor only)
   - Create new journal issue
   - Expected response: 201 Created

7. **Get Issues**
   - View published issues
   - Expected response: 200 OK

### 3. Poster Management Tests
1. **Upload Poster**
   - Upload image file (JPEG/PNG/GIF)
   - Add title and description
   - Save the returned `posterId`
   - Expected response: 201 Created

2. **Get All Posters**
   - View approved posters
   - Expected response: 200 OK

3. **Get Pending Posters** (Admin only)
   - View posters pending approval
   - Expected response: 200 OK

4. **Get Poster by ID**
   - View specific poster details
   - Expected response: 200 OK

5. **Approve Poster** (Admin only)
   - Approve pending poster
   - Expected response: 200 OK

6. **Delete Poster** (Admin or Owner)
   - Delete poster
   - Expected response: 200 OK

## Error Cases to Test

1. **Authentication Errors**
   - Attempt actions without login
   - Expected response: 401 Unauthorized

2. **Authorization Errors**
   - Attempt admin/editor actions as regular user
   - Expected response: 403 Forbidden

3. **Validation Errors**
   - Submit incomplete/invalid data
   - Expected response: 400 Bad Request

4. **Not Found Errors**
   - Request non-existent resources
   - Expected response: 404 Not Found

## File Upload Guidelines

1. **Manuscripts**
   - Allowed formats: PDF, DOC, DOCX
   - Max size: 20MB

2. **Posters**
   - Allowed formats: JPEG, PNG, GIF
   - Max size: 5MB

## Notes
- Keep track of the IDs returned from creation endpoints
- Some endpoints require specific user roles
- File uploads must use form-data
- JSON requests must include Content-Type header
