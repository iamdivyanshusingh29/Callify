import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';


import cors from 'cors';

import { connectToServer } from './controllers/SocketManager.js';
import usersRoutes from './routes/users.routes.js'; 

const app = express();
const server = createServer(app);
const io = connectToServer(server);

app.set("port", process.env.PORT || 8080);

app.use(cors());
app.use(express.json({ limit: "45kb" }));
app.use(express.urlencoded({ limit: "45kb" ,extended: true}));

app.use("/api/v1/users", usersRoutes);

const start = async () => {
    // const connectDB = await mongoose.connect("mongodb+srv://iamdivyanshusingh2005_db_user:v4WOU6xjCdHTp83I@callifycluster0.n6cjwv8.mongodb.net/callifyDB?retryWrites=true&w=majority");
    const connectDB = await mongoose.connect("mongodb://iamdivyanshusingh2005_db_user:v4WOU6xjCdHTp83I@ac-zjkvfpf-shard-00-00.n6cjwv8.mongodb.net:27017,ac-zjkvfpf-shard-00-01.n6cjwv8.mongodb.net:27017,ac-zjkvfpf-shard-00-02.n6cjwv8.mongodb.net:27017/?ssl=true&replicaSet=atlas-4t7uz8-shard-0&authSource=admin&appName=CallifyCluster0");
    console.log(`Connected to MongoDb ${connectDB.connection.host}`);
    server.listen(app.get("port"), "0.0.0.0" , () => {
        console.log("Server is listening at 8080 port");
    });
}

start();