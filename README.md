# MCP Blog API

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A robust REST API for the MCP Blog built with Node.js, Express, and MongoDB. Features Azure Key Vault integration for secure secret management, Swagger documentation, and comprehensive testing.

## 🚀 Features

- **RESTful API** - Complete CRUD operations for blog posts and comments
- **MongoDB Integration** - Flexible document-based data storage
- **Azure Key Vault** - Secure secret management for production deployments
- **Swagger Documentation** - Interactive API documentation at `/api-docs`
- **Comprehensive Testing** - Jest test suite with MongoDB memory server
- **Docker Support** - Containerized deployment ready
- **ES6 Modules** - Modern JavaScript with full ES6+ support
- **CORS Enabled** - Cross-origin resource sharing configured

## 📋 Prerequisites

- **Node.js** >= 20.0.0
- **MongoDB** (local installation or cloud service like Azure Cosmos DB)
- **Azure Key Vault** (for production secret management)

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mcp-blog-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

   Configure the following variables in `.env`:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/mcp-blog
   KEY_VAULT_NAME=your-key-vault-name
   NODE_ENV=development
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```
Runs the server with file watching using Node.js `--watch` flag.

### Production Mode
```bash
npm start
```
Runs the server with nodemon for automatic restarts.

The server will start on `http://localhost:3000` (or the port specified in your `.env`).

## 🧪 Testing

Run the test suite with:
```bash
npm test
```

Tests use MongoDB Memory Server for isolated testing environment.

## 📚 API Documentation

Once the server is running, visit `http://localhost:3000/api-docs` to access the interactive Swagger documentation.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Retrieve all blog posts |
| GET | `/api/posts/:id` | Get a specific post with comments |
| POST | `/api/posts` | Create a new blog post |
| PUT | `/api/posts/:id` | Update an existing post |
| DELETE | `/api/posts/:id` | Delete a post |
| POST | `/api/posts/:id/comments` | Add a comment to a post |

### Post Schema
```json
{
  "title": "string",
  "author": "string",
  "category": "string",
  "body": "string"
}
```

### Comment Schema
```json
{
  "commenter": "string",
  "text": "string"
}
```

## 🐳 Docker Deployment

Build and run with Docker:
```bash
docker build -t mcp-blog-api .
docker run -p 3000:3000 mcp-blog-api
```

## 📁 Project Structure

```
├── app.js              # Express application setup
├── server.js           # Server entry point
├── babel.config.cjs    # Babel configuration
├── Dockerfile          # Docker configuration
├── package.json        # Dependencies and scripts
├── __tests__/          # Test files
│   └── posts.test.js
├── config/             # Configuration files
│   ├── db.js          # Database connection
│   ├── index.js       # Main configuration
│   └── secrets.js     # Secret management
├── models/             # Mongoose models
│   └── Post.js        # Post model
└── routes/             # API routes
    └── posts.js       # Posts routes
```

## 🔧 Configuration

### Database Options

- **Local MongoDB**: `mongodb://localhost:27017/mcp-blog`
- **Azure Cosmos DB**: Use the connection string from Azure Portal with `retryWrites=false`

### Azure Key Vault Setup

1. Create a Key Vault in Azure Portal
2. Configure access policies for your application
3. Store sensitive configuration in Key Vault secrets
4. Update `KEY_VAULT_NAME` in your environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Review the Swagger documentation at `/api-docs`
3. Ensure all prerequisites are properly installed

## 🔄 CI/CD

This project includes configuration for automated testing and deployment. Ensure all tests pass before merging changes.

---

**Happy blogging! 📝**
