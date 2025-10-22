# Deployment Guide

## Current Deployment Status

### Frontend
✅ **Deployed to Vercel**
- Production URL: https://agentic-9c6b8b27.vercel.app
- Status: Live and functional
- Framework: Vite + React
- Deployment: Automatic via Vercel

### Backend
⚠️ **Not Yet Deployed**
- Current Status: Running locally only
- Local URL: http://localhost:8000
- Framework: Node.js + Express
- Database: In-memory storage

## Important Notes

### For Full Functionality

The application requires both frontend and backend to be running. Currently:

1. **Frontend is deployed** and accessible at https://agentic-9c6b8b27.vercel.app
2. **Backend needs to be deployed** to a Node.js hosting platform

### Backend Deployment Options

The backend can be deployed to any of these platforms:

1. **Railway** (Recommended for MVP)
   - Easy deployment
   - Free tier available
   - Automatic HTTPS

2. **Render**
   - Free tier available
   - Simple setup

3. **Heroku**
   - Well-documented
   - Easy scaling

4. **Fly.io**
   - Modern platform
   - Good performance

### Steps to Deploy Backend

1. Choose a hosting platform (e.g., Railway, Render)
2. Connect your GitHub repository
3. Set environment variables:
   ```
   PORT=8000
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   ```
4. Deploy the `backend` directory
5. Get the deployed backend URL

### Update Frontend Configuration

Once backend is deployed:

1. Update `frontend/.env`:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

2. Rebuild and redeploy frontend:
   ```bash
   cd frontend
   npm run build
   vercel deploy --prod --token $VERCEL_TOKEN
   ```

## Testing the Deployed Application

### Frontend Only (Current State)
- Browse to https://agentic-9c6b8b27.vercel.app
- UI is fully functional
- Job posting and applications will not work without backend

### Full Application (After Backend Deployment)
1. Sign up as an employer
2. Post a job
3. View jobs on public board
4. Apply to jobs
5. View applications in employer dashboard

## Firebase Configuration

For production use, you need to:

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create a Firestore database (optional, currently using in-memory)
4. Get your Firebase config credentials
5. Update environment variables in both frontend and backend

### Frontend Firebase Config
Update `frontend/.env`:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Backend Firebase Config
Update `backend/.env`:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

## Monitoring and Logs

### Frontend Logs
- View in Vercel dashboard: https://vercel.com/dashboard
- Real-time logs available during deployment

### Backend Logs
- Depends on hosting platform
- Most platforms provide log streaming in their dashboard

## Security Considerations

1. **Never commit `.env` files** - They are in .gitignore
2. **Use environment variables** for all sensitive data
3. **Enable CORS** properly in backend (already configured)
4. **Use HTTPS** for all production URLs
5. **Validate all inputs** on both frontend and backend

## Troubleshooting

### Frontend Issues
- Clear browser cache
- Check browser console for errors
- Verify API URL in .env

### Backend Issues
- Check environment variables are set
- Verify Firebase credentials
- Check CORS configuration
- Review server logs

### Connection Issues
- Ensure backend URL is accessible
- Check CORS headers
- Verify HTTPS is used (not HTTP)

## Next Steps

1. Deploy backend to chosen platform
2. Update frontend .env with backend URL
3. Redeploy frontend
4. Set up Firebase project with real credentials
5. Test full application flow
6. Monitor for errors and optimize

## Support

For issues or questions:
- Check the main README.md
- Review code comments
- Test locally first
- Check deployment platform documentation
