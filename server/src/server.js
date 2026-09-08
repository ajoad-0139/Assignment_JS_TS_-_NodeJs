import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { getImages } from "./handlers/images.js";
import { getProperty } from "./handlers/property.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Instantiate app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Server health check
app.get("/health", (req, res) => {
    res.status(200).send("Server is healthy!");
});

// Serve the images folder at /static/images/*
app.use("/static/images", express.static(path.join(__dirname, "../resources/images")));

//Routes
app.get("/get-property", getProperty);
app.get("/images", getImages);


//ErrorHandlers


const startApp = () => {
    try {
        const PORT = process.env.APP_PORT || 3000;

        console.log(`Starting server on port: ${PORT}`);

        app.listen(PORT, () => {
            console.log(`Server is listening on port: ${PORT}`);
        });
    } catch (error) {
        console.error("Failed starting server:", error);
    }
};

startApp();