require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger for development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().substring(11, 19)}] ${req.method} ${req.originalUrl}`);
  next();
});

// REST API Endpoints
// 1. Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'DevScribe Backend',
    author: 'Kanak',
    timestamp: new Date().toISOString()
  });
});

// 2. Authentication routes (/api/auth/register, /api/auth/login, /api/auth/me)
app.use('/api/auth', authRoutes);
// Direct aliases: /api/register and /api/login
app.use('/api', authRoutes);

// 3. Blog post routes (/api/posts) and alias (/api/blogs)
app.use('/api/posts', postRoutes);
app.use('/api/blogs', postRoutes);

// Static frontend file serving (supporting both DevScribe and root)
const DEVSCRIBE_DIR = path.join(__dirname, '..', 'DevScribe');
const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = fs.existsSync(path.join(DEVSCRIBE_DIR, 'index.html')) ? DEVSCRIBE_DIR : ROOT_DIR;

app.use(express.static(PUBLIC_DIR));
app.use(express.static(ROOT_DIR));

// Fallback: For non-API routes, serve index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint '${req.originalUrl}' not found.`
    });
  }
  const indexPath = fs.existsSync(path.join(PUBLIC_DIR, 'index.html'))
    ? path.join(PUBLIC_DIR, 'index.html')
    : path.join(ROOT_DIR, 'index.html');
  res.sendFile(indexPath);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred.'
  });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('==========================================================');
    console.log(`  DevScribe Backend Server by Kanak`);
    console.log(`  Server running at: http://localhost:${PORT}`);
    console.log(`  REST APIs: http://localhost:${PORT}/api`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log('==========================================================');
  });
}

module.exports = app;
