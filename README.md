# TURN IT UP

A groundbreaking music release website for Maxwell Young & Thom Haha's collaboration, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- Interactive teaser page with countdown timer
- Dynamic audio visualizer with particle effects
- Embedded mini-game for user engagement
- Responsive design for all devices
- Social media sharing integration
- High-performance animations using Framer Motion

## Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm
- Git LFS (for handling large media files)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/where-have-you-been.git
   cd where-have-you-been
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration.

4. Run the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the site.

## Environment Variables

- `NEXT_PUBLIC_RELEASE_DATE`: Release date in ISO format
- `NEXT_PUBLIC_SITE_URL`: Production site URL (https://wherehaveyoubeen.blog)
- `NEXT_PUBLIC_GA_ID`: Google Analytics ID (optional)

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with `vercel --prod`

### Self-hosted

1. Build the application:

   ```bash
   pnpm build
   ```

2. Start the production server:
   ```bash
   pnpm start
   ```

## Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Follow the component structure in `src/components`

### Testing

```bash
# Run unit tests
pnpm test

# Run e2e tests
pnpm test:e2e
```

### Performance Optimization

- Images are optimized using Next.js Image component
- Fonts are preloaded and optimized
- Critical CSS is inlined
- Assets are served from CDN in production

## Maintenance

### Regular Tasks

1. Update dependencies monthly
2. Check for security vulnerabilities
3. Monitor error logs
4. Update content as needed

### Monitoring

- Use Vercel Analytics for performance monitoring
- Set up error tracking (e.g., Sentry)
- Monitor server logs regularly

## Security

- CSP headers implemented
- Regular security audits
- Protected API routes
- Sanitized user inputs

## License

Copyright © 2025 Maxwell Young & Thom Haha. All rights reserved.

## Support

For support, contact:

- Technical issues: [GitHub Issues](https://github.com/yourusername/where-have-you-been/issues)
- Content updates: Contact project maintainers
