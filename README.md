# Assignment on JS, TS & Node.js

A full-stack application with an Express backend and a static frontend client, integrating the Google Maps API.

## Folder Structure

```
JS/
├── client/
│   ├── assets/
│   ├── scripts/
│   ├── styles/
│   └── index.html
├── server/
│   ├── errors/
│   ├── middlewares/
│   ├── node_modules/
│   ├── resources/
│   ├── src/
│   │   ├── handlers/
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md
```

## Setup

Create a `.env` file inside the `server` root folder with the following variable:

```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## Getting Started

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm i
   ```
3. Start the app:
   ```bash
   npm start
   ```

## Usage

The Express backend server will start running on **port 3000**. Once running, you can access the frontend app by opening your browser and going to:

```
http://localhost:3000
```
