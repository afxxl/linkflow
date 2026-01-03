# 🚀 Vercel Deployment Guide

## Prerequisites

1. **MongoDB Atlas Account** (Free)
   - Sign up at https://www.mongodb.com/cloud/atlas
   
2. **Vercel Account** (Free)
   - Sign up at https://vercel.com
   
3. **GitHub Account**
   - Push your code to GitHub first

---

## Step 1: Set Up MongoDB Atlas

1. Go to https://cloud.mongodb.com
2. Create a **New Project** → Name it "LinkFlow"
3. Click **"Build a Database"** → Choose **FREE** tier
4. Choose a cloud provider and region (closest to you)
5. Click **"Create Cluster"** (takes 3-5 minutes)

### Create Database User
1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Username: `linkflow`
4. Password: Click **"Autogenerate Secure Password"** → **COPY IT!**
5. Database User Privileges: **Read and write to any database**
6. Click **"Add User"**

### Whitelist IPs
1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### Get Connection String
1. Go to **Database** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like: `mongodb+srv://linkflow:<password>@cluster...`)
5. **Replace `<password>` with your actual password**
6. **Replace `<dbname>` with `linkflow`**

**Final string should look like:**
```
mongodb+srv://linkflow:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/linkflow?retryWrites=true&w=majority
```

---

## Step 2: Push to GitHub

```bash
cd /home/afsal/LinkAutomation

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - LinkFlow MERN app"

# Create repo on GitHub (go to github.com/new)
# Then link and push:
git remote add origin https://github.com/YOUR_USERNAME/linkflow.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your **linkflow** repository
4. **IMPORTANT:** Set **Root Directory** to `server`
5. Click **"Environment Variables"** and add:

```
MONGODB_URI = mongodb+srv://linkflow:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/linkflow
JWT_SECRET = generate_a_random_32_character_string_here_use_password_generator
NODE_ENV = production
CLIENT_URL = https://YOUR_FRONTEND_URL.vercel.app
```

**To generate JWT_SECRET:** Use https://passwordsgenerator.net/ (32+ characters, include symbols)

6. Click **"Deploy"**
7. Wait for deployment (2-3 minutes)
8. **Copy your backend URL** (e.g., `https://linkflow-api.vercel.app`)

---

## Step 4: Deploy Frontend to Vercel

1. Go to https://vercel.com/new again
2. Click **"Import Git Repository"**
3. Select your **linkflow** repository again
4. **IMPORTANT:** Set **Root Directory** to `client`
5. Click **"Environment Variables"** and add:

```
REACT_APP_API_URL = https://YOUR_BACKEND_URL.vercel.app/api
REACT_APP_PUBLIC_URL = https://YOUR_FRONTEND_URL.vercel.app
```

**Note:** You won't know your frontend URL yet, so:
- Deploy first
- Get the URL (e.g., `linkflow-frontend.vercel.app`)
- Go to **Settings → Environment Variables**
- Update `REACT_APP_PUBLIC_URL` with your actual URL
- Redeploy (Deployments → Click "..." → Redeploy)

6. Click **"Deploy"**
7. Wait for deployment (2-3 minutes)

---

## Step 5: Update Backend with Frontend URL

1. Go to your **backend** Vercel project
2. Go to **Settings → Environment Variables**
3. Update `CLIENT_URL` with your frontend URL
4. Go to **Deployments** → Click "..." on latest → **Redeploy**

---

## Step 6: Test Your Deployment

1. Visit your frontend URL (e.g., `https://linkflow-frontend.vercel.app`)
2. Create an account
3. Create a link
4. Visit your public page (`https://linkflow-frontend.vercel.app/yourusername`)
5. Click a link and verify it redirects
6. Check analytics

---

## Troubleshooting

### "Cannot connect to MongoDB"
- Check your MongoDB connection string
- Verify password is correct (no special characters that need encoding)
- Ensure 0.0.0.0/0 is whitelisted in Network Access

### "CORS Error"
- Make sure `CLIENT_URL` in backend matches your frontend URL exactly
- Redeploy backend after updating

### "Environment variables not working"
- Vercel requires **redeploy** after changing environment variables
- Go to Deployments → Redeploy

### "404 on API calls"
- Verify `REACT_APP_API_URL` ends with `/api`
- Check backend is deployed and running

---

## Custom Domain (Optional)

### For Frontend:
1. Go to your frontend project in Vercel
2. Settings → Domains
3. Add your domain (e.g., `linkflow.com`)
4. Follow DNS instructions

### For Backend:
1. Go to your backend project in Vercel
2. Settings → Domains
3. Add subdomain (e.g., `api.linkflow.com`)
4. Update `REACT_APP_API_URL` in frontend to use new domain
5. Update `CLIENT_URL` in backend

---

## Quick Reference

**MongoDB Atlas:** https://cloud.mongodb.com
**Vercel Dashboard:** https://vercel.com/dashboard
**GitHub:** https://github.com

**Your URLs:**
- Frontend: `https://YOUR_PROJECT.vercel.app`
- Backend: `https://YOUR_API.vercel.app`
- MongoDB: `mongodb+srv://...`

---

## Environment Variables Checklist

### Backend:
- [ ] MONGODB_URI
- [ ] JWT_SECRET (32+ chars)
- [ ] NODE_ENV (production)
- [ ] CLIENT_URL (your frontend URL)

### Frontend:
- [ ] REACT_APP_API_URL (backend URL + /api)
- [ ] REACT_APP_PUBLIC_URL (your frontend URL)

---

## 🎉 You're Live!

Once deployed:
1. Share your link: `https://YOUR_FRONTEND.vercel.app/yourusername`
2. Track analytics in real-time
3. Customize your theme
4. Set up automation features

**Need help?** Check Vercel logs in the Deployments tab.
