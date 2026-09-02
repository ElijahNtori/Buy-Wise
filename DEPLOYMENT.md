# Vercel Deployment Guide for Buy-Wise

## Prerequisites
- Vercel account (free at vercel.com)
- Supabase account (free tier available)
- Fixer.io API key (optional, for live exchange rates)

## Step 1: Prepare Environment Variables

### Supabase Setup
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings → API to get your credentials
4. Copy the Project URL and Service Role Key
5. Run the SQL schema from `supabase/schema.sql` in the Supabase SQL Editor

### Fixer.io Setup (Optional)
1. Go to [Fixer.io](https://fixer.io/)
2. Sign up for free account
3. Get your API key

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Option B: Using Vercel Dashboard
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository or upload the project
3. Vercel will detect the configuration automatically

## Step 3: Configure Environment Variables in Vercel

Go to your project settings in Vercel Dashboard → Environment Variables and add:

**Required Variables:**
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `JWT_SECRET` - A long random string for JWT token signing
- `FRONTEND_URL` - Your deployed Vercel URL (e.g., `https://buywise.vercel.app`)

**Optional Variables:**
- `FIXER_API_KEY` - Your Fixer.io API key for live exchange rates
- `EXCHANGE_RATE_USD_GHS` - Fallback exchange rate (default: 14.50)

**Email Configuration (Optional):**
- `BREVO_API_KEY` - Brevo API key for email notifications
- `BREVO_SENDER_EMAIL` - Sender email address
- `BREVO_SENDER_NAME` - Sender name

## Step 4: Update CORS Settings

After deployment, make sure to set `FRONTEND_URL` to your actual Vercel domain:
- In Vercel Dashboard → Settings → Environment Variables
- Add `FRONTEND_URL` = `https://your-project.vercel.app`
- Redeploy the project

## Step 5: Verify Deployment

1. Visit your Vercel URL
2. Check if the frontend loads
3. Test API health: `https://your-project.vercel.app/api/health`
4. Test product search functionality

## Troubleshooting

### Supabase Connection Issues
- Ensure you've run the SQL schema in Supabase SQL Editor
- Check that SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are correct
- Verify your Supabase project is active

### CORS Errors
- Make sure `FRONTEND_URL` is set correctly
- Redeploy after adding environment variables

### Build Failures
- Check Vercel build logs
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### API Not Working
- Check server logs in Vercel Dashboard
- Verify environment variables are set
- Ensure MongoDB is accessible

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `FRONTEND_URL` environment variable

## Production Considerations

- **Database**: Supabase free tier includes 500MB database storage
- **Rate Limiting**: Current limit is 100 requests per 15 minutes per IP
- **Email**: Brevo free tier allows 300 emails/day
- **Exchange Rates**: Fixer.io free tier allows 1,000 requests/month

## Monitoring

- Vercel provides built-in analytics and logs
- Check Vercel Dashboard → Analytics for traffic data
- Monitor function execution time and errors
