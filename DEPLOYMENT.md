# Landscaping Pro - Deployment Guide

## GitHub Setup

1. Create a new repository on GitHub (https://github.com/new)
   - Repository name: `landscaping-pro`
   - Description: "Professional landscape design and terrain analysis tool"
   - Make it public or private as needed

2. Add the remote and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/landscaping-pro.git
git branch -M main
git push -u origin main
```

## Vercel Deployment

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository connected to Vercel

### Deployment Steps

1. Go to https://vercel.com/new
2. Import the GitHub repository
3. Configure project settings:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

4. Add Environment Variables:
   - `DATABASE_URL`: Your MySQL/TiDB connection string
   - `JWT_SECRET`: Secure random string for session signing
   - `VITE_APP_ID`: Manus OAuth application ID
   - `OAUTH_SERVER_URL`: Manus OAuth server URL
   - `VITE_OAUTH_PORTAL_URL`: Manus login portal URL
   - `BUILT_IN_FORGE_API_URL`: Manus API URL
   - `BUILT_IN_FORGE_API_KEY`: Manus API key
   - `VITE_FRONTEND_FORGE_API_KEY`: Frontend API key
   - `VITE_FRONTEND_FORGE_API_URL`: Frontend API URL

5. Click "Deploy"

### Post-Deployment

1. Verify the application is running
2. Test authentication flow
3. Create a test project to verify canvas functionality
4. Test inventory management
5. Verify terrain analysis features

## Custom Domain Setup

1. In Vercel dashboard, go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records according to Vercel's instructions

## Monitoring

- Monitor build logs in Vercel dashboard
- Check application logs for errors
- Set up error tracking (optional: Sentry, LogRocket)

## Rollback

If issues occur:
1. Go to Vercel Deployments
2. Select previous successful deployment
3. Click "Promote to Production"
