# BlogSpace — Full-Stack Blog Platform

## Setup

### Backend
```bash
cd backend
npm install
# Edit src/.env with your MongoDB URI and Cloudinary credentials
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

**backend/src/.env**
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/blogplatform
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/users/register | No | Register |
| POST | /api/users/login | No | Login |
| GET | /api/users/:id | No | Get profile |
| PUT | /api/users/:id | Yes | Update profile |
| GET | /api/users/:id/posts | No | User's posts |
| GET | /api/posts | No | All posts (paginated) |
| GET | /api/posts/:id | No | Single post |
| POST | /api/posts | Yes | Create post |
| PUT | /api/posts/:id | Yes | Update post |
| DELETE | /api/posts/:id | Yes | Delete post |
| GET | /api/posts/search?q= | No | Search posts |
| GET | /api/posts/tag/:tag | No | Posts by tag |
| GET | /api/posts/category/:cat | No | Posts by category |
| POST | /api/posts/:id/like | Yes | Toggle like |
| GET | /api/posts/:id/comments | No | Get comments |
| POST | /api/posts/:id/comments | Yes | Add comment |
| DELETE | /api/comments/:id | Yes | Delete comment |
