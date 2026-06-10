# Aditya Anugrah Portfolio

Personal portfolio and digital store for Aditya Anugrah. The site contains portfolio pages, blog content, contact flow, and a lightweight digital product store with QRIS checkout support.

## Features

- Portfolio and project showcase
- Blog pages
- Contact page
- Digital product catalog
- Store order status page
- Store admin panel
- API-backed checkout and product delivery flow
- Responsive React UI

## Tech Stack

- React
- Vite
- Tailwind CSS
- Node.js API server
- PM2-ready backend entrypoint

## Local Development

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

Run the API server:

```bash
npm run api
```

Build for production:

```bash
npm run build
```

## Environment

Use `.env.example` and `server/.env.example` as references for local configuration. Do not commit real API keys, payment credentials, email passwords, or storage secrets.

## Notes

The digital store is designed for small digital product catalogs. Production secrets and deployment-specific files should stay outside Git.
