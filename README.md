# LinkFlow - MERN Stack Link Automation Tool

A complete link-in-bio SaaS application with advanced automation features.

## Features

- 🔗 Beautiful customizable link pages
- 📅 Smart scheduling
- 🌍 Geo-targeting
- 📱 Device targeting
- 🔄 A/B testing (URL rotation)
- 📊 Analytics with charts
- 🎨 Theme customization
- ✨ Drag & drop reordering

## Tech Stack

**Backend:** Node.js, Express, MongoDB, JWT
**Frontend:** React 18, Tailwind CSS, Chart.js, @dnd-kit

## Deployment

### Backend (Vercel)

1. Go to [Vercel](https://vercel.com)
2. Import the `server` folder
3. Add environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Random 32+ character string
   - `CLIENT_URL` - Your frontend URL (e.g., https://linkflow.vercel.app)
4. Deploy

### Frontend (Vercel)

1. Go to [Vercel](https://vercel.com)
2. Import the `client` folder
3. Add environment variables:
   - `REACT_APP_API_URL` - Your backend URL + /api (e.g., https://linkflow-api.vercel.app/api)
   - `REACT_APP_PUBLIC_URL` - Your frontend URL (e.g., https://linkflow.vercel.app)
4. Deploy

### MongoDB Atlas

1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Create database user
4. Whitelist all IPs (0.0.0.0/0) for Vercel
5. Get connection string
6. Add to backend environment variables

## Local Development

### Backend
```bash
cd server
npm install
# Create .env file with MONGODB_URI, JWT_SECRET, PORT, CLIENT_URL
npm run dev
```

### Frontend
```bash
cd client
npm install
# Create .env file with REACT_APP_API_URL, REACT_APP_PUBLIC_URL
npm start
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/linkflow
JWT_SECRET=your_super_secret_key_min_32_chars
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_PUBLIC_URL=http://localhost:3000
```

## API Endpoints

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/links` - Get links
- `POST /api/links` - Create link
- `GET /api/analytics/overview` - Analytics
- `GET /:username` - Public profile
- `GET /r/:linkId` - Redirect with tracking

## License

MIT
