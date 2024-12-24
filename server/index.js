import express from "express";
import student from "./controller/student.js";
import professor from "./controller/professor.js";
import cors from "cors";
import cluster from "cluster";
import os from "os";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const numCpus = os.cpus().length;

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "API documentation for the application",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./controller/*.js"], // Path to your route files for Swagger to read the annotations
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

if (cluster.isPrimary) {
    console.log(`Pimary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCpus; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use(cors());

    // Swagger route
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use('/student', student);
    app.use('/professor', professor);

    app.get('/', (req, res) => {
        return res.status(200).json({ message: "Hello World" });
    });

    app.listen(3000, () => {
        console.log("Server is running");
    });
}
