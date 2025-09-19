# Google OAuth Setup Guide

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Step-by-Step Google OAuth Setup

### 1. Go to Google Cloud Console

Visit [Google Cloud Console](https://console.cloud.google.com/)

### 2. Create or Select a Project

- Create a new project or select an existing one
- Note down your project ID

### 3. Enable Google+ API

- Go to "APIs & Services" → "Library"
- Search for "Google+ API" and enable it
- Also enable "Google OAuth2 API" if not already enabled

### 4. Create OAuth 2.0 Credentials

- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "OAuth 2.0 Client ID"
- Choose "Web application" as the application type

### 5. Configure OAuth Consent Screen

- Go to "APIs & Services" → "OAuth consent screen"
- Choose "External" for user type (unless you have a Google Workspace)
- Fill in the required information:
  - App name: "Operations Backoffice"
  - User support email: your email
  - Developer contact information: your email

### 6. Set Authorized Redirect URIs

In your OAuth 2.0 Client ID configuration, add these authorized redirect URIs:

**For Development:**

```
http://localhost:3000/api/auth/callback/google
```

**For Production (replace with your domain):**

```
https://yourdomain.com/api/auth/callback/google
```

### 7. Get Your Credentials

After creating the OAuth client:

- Copy the "Client ID" → use as `GOOGLE_CLIENT_ID`
- Copy the "Client Secret" → use as `GOOGLE_CLIENT_SECRET`

### 8. Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use an online generator like: https://generate-secret.vercel.app/32

### 9. Create .env.local File

Create the `.env.local` file in your project root:

```bash
# Application Configuration
NEXT_PUBLIC_APP_NAME=Operations Backoffice
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Environment
NODE_ENV=development
```

## Important Notes

- **Never commit `.env.local` to version control** - it's already in `.gitignore`
- **Use different credentials for development and production**
- **Keep your client secret secure** - never expose it in client-side code
- **Test with a Google account** that you have access to during development

## Testing the Setup

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. You should be redirected to the sign-in page
4. Click "Sign in with Google"
5. Complete the Google OAuth flow
6. You should be redirected back to the dashboard

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**
   - Make sure the redirect URI in Google Console matches exactly: `http://localhost:3000/api/auth/callback/google`

2. **"invalid_client" error**
   - Check that your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
   - Make sure there are no extra spaces or characters

3. **"access_denied" error**
   - Make sure the OAuth consent screen is configured properly
   - Check that the Google+ API is enabled

4. **Session not persisting**
   - Verify your `NEXTAUTH_SECRET` is set and consistent
   - Check that `NEXTAUTH_URL` matches your current domain

## Production Deployment

For production deployment, update these environment variables:

```bash
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
```

And add the production redirect URI to your Google OAuth configuration:

```
https://yourdomain.com/api/auth/callback/google
```
