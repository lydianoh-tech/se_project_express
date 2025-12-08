# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. You’ll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

### Testing

Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12
WTWR API — Express + MongoDB Backend

Features
Users

Create a new user

Retrieve all users

Retrieve a user by ID

URL validation for avatar field

MongoDB schema validation

Clothing Items

Create new clothing items

Retrieve all clothing items

Delete items by ID

Like a clothing item

Dislike a clothing item

Weather type validation (hot, warm, cold)

Temporary Authorization Middleware

All requests receive a temporary hardcoded req.user object so items can be assigned to an owner.

Error Handling (with proper status codes)
400 — Validation errors, invalid data, invalid ObjectId

404 — Not found (user/item, or non-existent route)

500 — Server error

Uses .orFail() to correctly handle missing documents

Project Structure
se_project_express/
│
├── app.js
├── routes/
│ ├── index.js
│ ├── users.js
│ └── clothingItems.js
│
├── controllers/
│ ├── users.js
│ └── clothingItems.js
│
├── models/
│ ├── user.js
│ └── clothingItem.js
│
├── middlewares/
│ └── auth.js (temporary user injection)
│
├── utils/
│ └── errors.js
│
└── README.md

Installation & Setup

1. Clone the repository
   git clone https://github.com/yourusername/wtwr-api.git
   cd wtwr-api

2. Install dependencies
   npm install

3. Start MongoDB locally

Make sure MongoDB is running (Compass or local daemon).

4. Start the server
   npm run start

or for development with auto-reload:

npm run dev

5. Server will run at:
   http://localhost:3001

(Uses PORT environment variable if set.)

API Endpoints
Users
Method Endpoint Description
GET /users Get all users
GET /users/:userId Get user by ID
POST /users Create user
Example POST body:
{
"name": "Jane Doe",
"avatar": "https://example.com/avatar.png"
}

Clothing Items
Method Endpoint Description
GET /items Get all items
POST /items Create item
DELETE /items/:itemId Delete item by ID
PUT /items/:itemId/likes Like an item
DELETE /items/:itemId/likes Remove like
Example POST body:
{
"name": "Winter Jacket",
"weather": "cold",
"imageUrl": "https://example.com/jacket.png"
}

🔧 Temporary Auth Middleware

Until real authentication is implemented, a hardcoded user is injected:

req.user = {
\_id: "YOUR_TEST_USER_ID"
};

This allows:

assigning owner to new clothing items

liking/disliking items

Testing With Postman

1. Create a test user

Use POST /users.
Your new user will appear in MongoDB Compass.

2. Copy the user’s \_id

Paste it into the temporary auth middleware.

3. Create clothing items, like/unlike, delete, etc.
   Validation
   URL validation (using validator)

Used in:

avatar

imageUrl

Enum validation

weather must be one of:

hot | warm | cold

Mongoose validation errors return 400.
🛡 Error Handling Summary
Status Meaning
400 Invalid data (validation error, invalid ObjectId)
404 Not found (user/item/route)
500 Default server error

All controllers use:

.orFail() to throw DocumentNotFoundError

.catch() to send correct status + JSON message

central error handler in app.js

Linting

Project uses ESLint.
Fix common issues using:

npm run lint
npm run lint -- --fix

License

This project is for educational use within the TripleTen software engineering program.
URL:https://lydianoh-tech.github.io/se_project_express/
