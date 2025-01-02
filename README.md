# Vacation Vault

A simple app for keeping track of Vacations and photos. Built with the [T3 Stack](https://create.t3.gg/).

## Features

- Create Vacations
- Upload and caption images
- Sign-in page doubles as registration page if new email entered

## Notes

- Dates are all UTC, I didn't worry about timezones for this exercise (a library like `luxon` would help for this which i've used before )
- Photos are just uploaded to the `/upload` folder for simplicity of development and testing for now. Would use something like an S3 bucket in production.
- I used a combination of server actions and TRPC for different parts of the app to showcase both.
- Auth Pages (sign-in and sign-out) come from NextAuth

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```
3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

This project uses the following technologies:

- [Next.js](https://nextjs.org) - React framework for production
- [NextAuth.js](https://next-auth.js.org) - Authentication
- [Prisma](https://prisma.io) - Database ORM
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [tRPC](https://trpc.io) - End-to-end typesafe APIs
- [Jest](jestjs.io) - Testing Framework

## Development

- Test can be run with `npm run test` and coverage can be viewed with `npm run test:coverage`

## Deployment

This application can be deployed on:

- [Vercel](https://create.t3.gg/en/deployment/vercel)
- [Netlify](https://create.t3.gg/en/deployment/netlify)
- [Docker](https://create.t3.gg/en/deployment/docker)
