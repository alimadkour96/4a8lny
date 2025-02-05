
// const mongoose = require('mongoose');
// //const dotenv = require('dotenv');

// // Load environment variables
// //dotenv.config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.DB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     process.exit(1); // Exit process with failure
//   }
// };

// module.exports = connectDB;



//------------------------------------------------------------------------


// const mongoose=require('mongoose')


// exports.dbConnection=()=>{
//     mongoose.connect('mongodb://localhost:27017/4a8lny').then(()=>{
//         console.log('db connection established');
//     }).catch((err)=>{console.log('err');})
// }

// module.exports = connectDB;
//================================================
const mongoose=require('mongoose')


exports.dbConnection=()=>{
    mongoose.connect(process.env.CONNECTION_STRING).then(()=>{
        console.log('db connection established');
    })
    // .catch((err)=>{
    //     console.log(err);
    // })
}
//===============================================================

// const { MongoClient } = require('mongodb');

// // MongoDB connection URI
// const mongoose = require('mongoose');
// const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB URI
// const client = new MongoClient(uri);

// async function connectToMongoDB() {
//     try {
//         // Connect to the MongoDB server
//         await client.connect();
//         console.log('Connected to MongoDB');

//         // Select the database
//         const db = client.db('4a8lny'); 

//         // Perform database operations
//         const collection = db.collection('mycollection'); 
//         const result = await collection.insertOne({ name: 'John', age: 30 });
//         console.log('Inserted document:', result.insertedId);

//     } catch (error) {
//         console.error('Error connecting to MongoDB:', error);
//     } finally {
//         // Close the connection
//         await client.close();
//         console.log('Disconnected from MongoDB');
//     }
// }

// // Call the function to connect
// connectToMongoDB();

// module.exports = connectDB;