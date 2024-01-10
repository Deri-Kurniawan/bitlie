# Bitlie

<p align="center">
<a href="https://skillicons.dev">
<img src="https://skillicons.dev/icons?i=express,webpack,nodejs,vercel&perline=4" />
</a>
</p>

Bitlie is a simple static URL shortener web app. This app is built with [Express.js](https://expressjs.com/), bundled with [Webpack](https://webpack.js.org/), run with [Node.js](https://nodejs.org/en/) and deployed with [Vercel](https://vercel.com/).

## Demo

You can see the demo [here](https://bitlie.deri.my.id/)

## Prerequisite

- [Express.js](https://expressjs.com/)
- [Webpack](https://webpack.js.org/)
- [Node.js](https://nodejs.org/en/)
- [Nodemon](https://nodemon.io/)
- [Vercel](https://vercel.com/)

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install Bitlie.

```bash
npm install
```

## Usage

For development mode, you can run this command to start the server and watch the changes

```bash
npm run dev
```

For production mode, you can run this command to build the app and start the server by using bundle file

```bash
npm build && npm start
```

## Project Structure

```bash
├── .git                    # Git folder (after you run git init or clone this repo)
├── .vercel                 # Vercel configuration folder (after you deploy to Vercel)
├── dist                    # Bundle file (after you run npm build)
├── node_modules            # Node modules folder (after you run npm install)
├── src                     # Main source folder
│   ├── data ──┐
│   │          └── index.js # Data source for storing short URL
│   │
│   ├── lib ───┐
│   │          └── index.js # Helper functions
│   │
│   └── server.js           # Main server file
├── .gitignore              # Ignore file/folder for git
├── LICENSE                 # License file
├── nodemon.json            # Nodemon configuration file (for development mode)
├── package.json            # NPM package file (for dependencies)
├── package-lock.json       # NPM package lock file (for dependencies)
├── README.md               # README file (this file)
├── vercel.json             # Vercel configuration file (for vercel serverless function configuration)
└── webpack.config.js       # Webpack configuration file (for bundling & minifying the source code)

```

## Deployment

You can deploy this app to Vercel by clicking this button below

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=http://github.com/deri-kurniawan/bitlie)

## License
This project is licensed under the [MIT](/LICENSE) license.

## Author
Created with ❤️ by [Deri Kurniawan](https://github.com/Deri-Kurniawan)