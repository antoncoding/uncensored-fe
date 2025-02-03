# Rollup Fortress

[www.rollupfortress.xyz](https://www.rollupfortress.xyz) | [testnet.rollupfortress.xyz](https://testnet.rollupfortress.xyz)

Rollup Fortress is a platform that enables users to interact with L2 networks in a censorship-resistant way. It leverages the [Uncensored SDK](https://github.com/rollup-fortress/uncensored) to allow force inclusion of transactions through L1 when L2 sequencers attempt to censor transactions.

## Overview

This platform serves as a demo of the the Uncensored SDK. It currently supports OP Stack super chains and allows users to:

- Add custom L2 chains (currently supporting OP Stack super chains)
- Send force inclusion transactions through L1, with L2 calldata
- Monitor and track force inclusion transaction status

We're working on integrating other apps to the platform, such as DeFi applications, bridges, and more.

## Force Inclusion

For detailed technical information about how force inclusion works, and the scope of the project, visit our [Documentation](https://rollup-fortress.github.io/uncensored-book).

## Getting Started

### Development Mode

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
npm run build
# or
yarn build
```

### Production Server

```bash
npm run start
# or
yarn start
```

## Resources

- [Uncensored SDK Documentation](https://rollup-fortress.github.io/uncensored-book/)
- [SDK Repository](https://github.com/rollup-fortress/uncensored)

## Contributing

We welcome contributions! Whether it's adding support for new L2 networks, improving the UI, or enhancing documentation, please feel free to submit pull requests or open issues.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
