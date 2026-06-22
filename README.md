# Blog API

Backend-only REST API for a small blog platform. The project uses Express, MongoDB, Mongoose, JWT authentication, validation, categories, posts, and comments.

No UI is included.

## Features

- Register, login, and current-user endpoint
- JWT protected routes
- Blog posts with draft and published states
- Categories managed by admins
- Public post listing with pagination, search, category, and tag filters
- Comments on published posts
- Central validation and error handling

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Update `.env` before running:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/blog_api
JWT_SECRET=change_this_secret_before_running
JWT_EXPIRES_IN=7d
```

Create the first admin user when needed:

```bash
npm run seed:admin
```

## Scripts

```bash
npm run dev
npm start
npm run seed:admin
npm test
```

`npm test` checks JavaScript syntax for the project files.

## API Base URL

```text
http://localhost:5000/api/v1
```

## Main Routes

### Auth

```text
POST /auth/register
POST /auth/login
GET  /auth/me
```

### Categories

```text
GET    /categories
POST   /categories
PATCH  /categories/:id
DELETE /categories/:id
```

Category create, update, and delete routes require an admin token.

### Posts

```text
GET    /posts
POST   /posts
GET    /posts/mine
GET    /posts/:slug
PATCH  /posts/:id
DELETE /posts/:id
```

Post create, update, delete, and `mine` routes require authentication.

### Comments

```text
GET    /posts/:postId/comments
POST   /posts/:postId/comments
DELETE /posts/comments/:id
```

Creating and deleting comments requires authentication.

## Request Examples

Register:

```json
{
  "name": "Mohaned",
  "email": "mohaned@example.com",
  "password": "123456"
}
```

Create post:

```json
{
  "title": "Getting Started with Node APIs",
  "excerpt": "A short intro to building a REST API with Node.",
  "body": "This post explains how the API is structured and how the routes work in a practical way.",
  "category": "665f1c2e1b4e77ac01a1c123",
  "tags": ["node", "backend"],
  "status": "published"
}
```

Send protected requests with:

```text
Authorization: Bearer YOUR_TOKEN
```
