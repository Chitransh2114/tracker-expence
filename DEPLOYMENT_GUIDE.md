# 🚀 Deployment Guide - Expense Tracker

## Prerequisites

- GitHub account
- Vercel account (free)
- Render account (free)

---

## **STEP 1: Push Code to GitHub**

### 1.1 GitHub पर नई Repository बनाओ:

1. https://github.com/new पर जाओ
2. Repository name: `tracker_expense`
3. Description: `Expense Tracker App`
4. **Create repository** पर click करो

### 1.2 Terminal में Commands चलाओ:

```bash
cd c:\Users\Dell\Desktop\tracker_expence

# Git configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@gmail.com"

# Initialize git
git init
git add .
git commit -m "Initial commit: Complete expense tracker app"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/tracker_expense.git
git branch -M main
git push -u origin main
```

---

## **STEP 2: Deploy Frontend (Vercel)**

### 2.1 Vercel पर जाओ:

1. https://vercel.com पर जाओ
2. **"Sign Up"** → GitHub से login करो

### 2.2 Project Import करो:

1. **"Add New"** → **"Project"**
2. अपनी `tracker_expense` repository select करो
3. **"Continue"**

### 2.3 Configure करो:

- **Project Name:** `tracker-expense`
- **Framework Preset:** `Vite`
- **Root Directory:** `frontend` ✅
- **Build Command:** `npm run build` ✅
- **Output Directory:** `dist` ✅

### 2.4 Environment Variables add करो:

```
VITE_API_URL = https://tracker-expense-api.onrender.com/api
```

### 2.5 **Deploy** पर click करो ✅

आपको मिलेगा: `https://tracker-expense-xxxxxx.vercel.app`

---

## **STEP 3: Deploy Backend (Render)**

### 3.1 Render पर जाओ:

1. https://render.com पर जाओ
2. **"Sign Up"** → GitHub से login करो

### 3.2 नई Web Service बनाओ:

1. **"New +"** → **"Web Service"**
2. अपनी `tracker_expense` repository select करो
3. **"Connect"**

### 3.3 Configure करो:

- **Name:** `tracker-expense-api`
- **Runtime:** `Node`
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `node src/index.js`

### 3.4 Environment Variables add करो:

```
MONGODB_URI = mongodb+srv://chitranshdwivedi063_db_user:chitranshdwivedi063_db_user@cluster0.vm25bni.mongodb.net/expense_tracker?retryWrites=true&w=majority

JWT_SECRET = super_secret_session_key_987654

MAIL_USER = dwivedichitransh020@gmail.com

MAIL_PASS = xpbzsttsuaapzqgn

NODE_ENV = production

CORS_ORIGIN = https://tracker-expense-xxxxxx.vercel.app
```

### 3.5 **Create Web Service** पर click करो ✅

आपको मिलेगा: `https://tracker-expense-api.onrender.com`

---

## **STEP 4: Update Frontend URL**

जब Render backend URL मिल जाए:

1. `frontend/.env.production.local` में update करो:

```env
VITE_API_URL=https://tracker-expense-api.onrender.com/api
```

2. Git पर push करो:

```bash
git add .
git commit -m "Update backend URL"
git push
```

Vercel automatically redeploy कर देगा! ✅

---

## **Ready to Use! 🎉**

- **Frontend:** https://tracker-expense-xxxxxx.vercel.app
- **Backend:** https://tracker-expense-api.onrender.com

---

## **Troubleshooting:**

### CORS Error आए तो:

- Render में `CORS_ORIGIN` check करो (Vercel URL होना चाहिए)

### Database Connection Error:

- MongoDB connection string सही है की नहीं check करो

### Build Failed:

- Local पर `npm run build` test करो first

---

**Need Help?** कोई issue हो तो बताना! 😊
