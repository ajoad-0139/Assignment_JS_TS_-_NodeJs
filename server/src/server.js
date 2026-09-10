import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandlerMiddleware } from "../middlewares/ErrorHandler.js";

import { getImages } from "./handlers/images.js";
import { getProperty } from "./handlers/property.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Instantiate app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// frontend folder
const frontendPath = path.join(__dirname, "../../client");

// Serve frontend files
app.use(express.static(frontendPath));

// server.js — add a config endpoint
app.get("/api/config", (req, res) => {
    res.json({ googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY });
});

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
app.use(errorHandlerMiddleware)


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