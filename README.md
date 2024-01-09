# Project README

## Overview

This demo application is designed to demonstrate the integration and capabilities of Yodl as a payment protocol.

## Tech Stack

- **Frontend**: React (TypeScript)
- **Backend**: Express (TypeScript)
- **Database**: Redis
- **Deployment**: Docker, Fly.io
- **CI/CD**: GitHub Actions

## Features

- Account top-up and crypto payments
- Yodl's payment processing API interaction
- Transaction data view and management

## Getting Started

### Server

To run the server in development mode:

```properties
npm run dev
```

For production builds and running:

```properties
npm run build
```

### Client

To start the React app in development mode:

```properties
npm run start
```

To build the app for production:

```properties
npm run build
```

## Configuration

Environment variables should be set in `.env` files and are loaded with `dotenv`.

## Deployment

Dockerfiles for development (`Dockerfile.dev`) and production (`Dockerfile.prod`) are included. Deployment configurations for Fly.io are specified in `fly.toml`.
