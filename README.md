# Uncensored SDK Demo

This project demonstrates the usage of the Uncensored SDK, a tool designed to enhance censorship resistance in Layer 2 (L2) blockchain networks.

## Key Concepts

### Censorship Resistance

Censorship resistance is crucial for blockchain networks. While Ethereum's L1 achieves this through numerous validators, L2 solutions often rely on centralized sequencers, making them potentially vulnerable to censorship.

### Force Inclusion

Force Inclusion is a mechanism provided by some L2 networks that allows users to submit transactions directly to the L1 Rollup contract. Our SDK helps users leverage these existing mechanisms, ensuring L2 transactions can't be indefinitely censored by sequencers.

## Available Scripts

### Development Mode

#### Start the Development Server

These commands start the application in development mode. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result. The page auto-updates as you edit the file.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### Production Build

#### Build the App for Production

These commands build an optimized version of the application for production, saved in the `.next` folder.

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Production Server

#### Start the Production Server

After building the application, use these commands to start the server in production mode.

```bash
npm run start
# or
yarn start
# or
pnpm start
```

### Code Quality

#### Run the Linter

Run these commands to start the linter, which helps maintain code quality and find any issues.

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
```
