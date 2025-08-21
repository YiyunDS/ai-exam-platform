# Deployment Guide

## Prerequisites

1. **GitHub Account** - For code repository
2. **Vercel Account** - For hosting (free tier available)
3. **Supabase Account** - For database and auth (free tier available)
4. **OpenAI Account** - For AI features (requires billing setup)

## Step-by-Step Deployment

### 1. Supabase Setup

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (takes ~2 minutes)
3. Go to Settings > API and copy:
   - Project URL
   - Anon public key
4. Go to SQL Editor and run the schema from `database/schema.sql`
5. Optionally run `database/seed.sql` for sample data

### 2. OpenAI Setup

1. Go to [https://platform.openai.com](https://platform.openai.com)
2. Create an API key in the API section
3. Add billing information (required for GPT-4 access)
4. Set usage limits to control costs

### 3. Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Push your code to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   OPENAI_API_KEY=sk-your_api_key
   NEXTAUTH_SECRET=your_random_secret
   NEXTAUTH_URL=https://your-app.vercel.app
   ```
6. Click "Deploy"

#### Option B: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```

### 4. Post-Deployment Setup

1. **Update NEXTAUTH_URL**: After deployment, update the `NEXTAUTH_URL` environment variable with your actual Vercel URL
2. **Configure Supabase Auth**: 
   - Go to Supabase > Authentication > URL Configuration
   - Add your Vercel URL to allowed origins
3. **Test the application**: 
   - Create a teacher account
   - Import sample students
   - Create and customize questions
   - Generate and export exams

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ0eXAiOiJKV1QiLCJhbGc...` |
| `OPENAI_API_KEY` | OpenAI API key for AI features | `sk-abc123...` |
| `NEXTAUTH_SECRET` | Random string for auth security | `your-secret-key` |
| `NEXTAUTH_URL` | Your application URL | `https://your-app.vercel.app` |

## Troubleshooting

### Build Errors
- Check that all environment variables are set correctly
- Ensure TypeScript errors are resolved
- Verify all dependencies are in `package.json`

### Database Issues
- Confirm the schema was applied correctly
- Check RLS policies are enabled
- Verify Supabase URL and key are correct

### AI Features Not Working
- Ensure OpenAI API key is valid and has billing enabled
- Check API usage limits and quotas
- Verify the model (GPT-4o-mini) is available

### Authentication Issues
- Confirm `NEXTAUTH_URL` matches your deployment URL
- Check Supabase auth configuration
- Verify allowed origins in Supabase dashboard

## Cost Estimation

### Free Tier Limits
- **Vercel**: Unlimited personal projects, 100GB bandwidth
- **Supabase**: 500MB database, 50,000 monthly active users
- **OpenAI**: Pay per use, ~$0.01-0.03 per question customization

### Scaling Considerations
- Monitor OpenAI usage costs
- Consider Supabase Pro for larger user bases
- Vercel Pro for team collaboration features

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to Git
2. **API Keys**: Rotate OpenAI keys regularly
3. **Database**: Use RLS policies (already implemented)
4. **Auth**: Strong `NEXTAUTH_SECRET` (32+ characters)
5. **HTTPS**: Vercel provides automatic SSL/TLS

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Review Supabase project logs
3. Verify OpenAI API key and billing status
4. Consult the documentation for each service