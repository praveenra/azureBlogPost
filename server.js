// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const postsRouter = require('./routes/posts');

// const app = express();
// const PORT = process.env.PORT || 3000;
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mcp-blog';
// // Log URI without password for debugging
// // console.log('MongoDB host:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'))
// console.log('MongoDB host:', MONGODB_URI)
// app.use(cors());
// app.use(express.json());

// // Azure Cosmos DB for MongoDB API requires retryWrites=false
// const mongooseOptions = {
//   retryWrites: false,
//   serverSelectionTimeoutMS: 10000
// };

// app.use('/api/posts', postsRouter);

// app.get('/api/health', (req, res) => {
//   res.json({ status: 'ok', message: 'MCP Blog API is running' });
// });

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     console.log('MongoDB connected');
//     app.listen(PORT, () => {
//       console.log(`Server running at http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('MongoDB connection error:', err.message || err);
//     console.error('Full error:', err);
//     process.exit(1);
//   });


  import app from "./app.js";
  import { loadEnvironment } from "./config/env.js";
  import connectDB from "./config/db.js";
  
  async function bootstrap() {
    // 1️⃣ Load env variables
    await loadEnvironment();
  
    // 2️⃣ Connect database
    await connectDB();
  
    // 3️⃣ Start server
    const PORT = process.env.PORT || 3000;
  
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  }
  
  bootstrap().catch((err) => {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  });
  