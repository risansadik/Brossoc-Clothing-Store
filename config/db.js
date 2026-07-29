const mongoose = require('mongoose');
const env = require('dotenv');

env.config();

const connectDB = async () => {
    try {
        let mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/brossoc-clothing';
        
        if (mongoURI.includes('<db_password>') || mongoURI.includes('<password>')) {
            console.log('MONGODB_URI contains placeholder credentials. Connecting to local MongoDB...');
            mongoURI = 'mongodb://127.0.0.1:27017/brossoc-clothing';
        }

        try {
            const conn = await mongoose.connect(mongoURI);
            console.log('MongoDb connected');
            console.log(`database host name ${conn.connection.host}`);
            console.log(`database name is: ${conn.connection.name}`);
        } catch (primaryErr) {
            console.log('Primary MongoDB connection failed:', primaryErr.message);
            console.log('Connecting to local MongoDB fallback...');
            const conn = await mongoose.connect('mongodb://127.0.0.1:27017/brossoc-clothing');
            console.log('MongoDb connected to local database');
            console.log(`database host name ${conn.connection.host}`);
            console.log(`database name is: ${conn.connection.name}`);
        }
    } catch (error) {
        console.log('DB connection error', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
