import express from "express";
import student from "./controller/student.js";
import professor from "./controller/professor.js";
import cors from "cors";
import cluster from "cluster";
import os from "os";

const numCpus = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCpus; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
}

else {
    const app = express();

    app.use(express.json());
    app.use('/student',student);
    app.use('/professor',professor);
    app.use(cors());

    app.get('/',(req,res) => {
        return res.status(200).json({message:"Hello World"});
    })
    app.listen(3000,()=>{console.log("server is running")});
}