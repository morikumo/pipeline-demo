const express = require('express');
const app = express();
app.disable("x-powered-by");
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'pipeline-demo is running',
    version: process.env.npm_package_version || '1.0.0',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.get('/greet/:name', (req, res) => {
  const { name } = req.params;
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name cannot be empty' });
  }
  res.json({ message: `Hello, ${name}!` });
});

// Only start the server if this file is run directly (not imported in tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
