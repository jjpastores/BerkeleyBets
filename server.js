const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://berkeleybets.vercel.app', 'https://your-custom-domain.com']
    : ['http://localhost:3002', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: 'development'
  });
});

// Helper function to run Python scripts with enhanced error handling
function runPythonScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    // Validate script path exists
    if (!require('fs').existsSync(scriptPath)) {
      reject(new Error(`Python script not found: ${scriptPath}`));
      return;
    }

    console.log(`Executing Python script: ${scriptPath} with args: ${args.join(' ')}`);
    
    const pythonProcess = spawn('python3', [scriptPath, ...args], {
      cwd: path.dirname(scriptPath),
      timeout: 30000 // 30 second timeout
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      // Log for debugging
      if (stderr) {
        console.log(`Python stderr: ${stderr}`);
      }
      
      if (code === 0) {
        try {
          if (!stdout.trim()) {
            reject(new Error('Python script returned empty output'));
            return;
          }
          
          const result = JSON.parse(stdout);
          
          // Validate result structure
          if (!result || typeof result !== 'object') {
            reject(new Error('Python script returned invalid data structure'));
            return;
          }
          
          resolve(result);
        } catch (error) {
          console.error(`JSON parse error: ${error.message}`);
          console.error(`Raw stdout: ${stdout}`);
          reject(new Error(`Failed to parse JSON output: ${error.message}`));
        }
      } else {
        console.error(`Python script failed with code ${code}`);
        console.error(`Stderr: ${stderr}`);
        reject(new Error(`Python script failed with code ${code}: ${stderr || 'Unknown error'}`));
      }
    });

    pythonProcess.on('error', (error) => {
      console.error(`Python process error: ${error.message}`);
      reject(new Error(`Failed to spawn Python process: ${error.message}`));
    });

    // Handle timeout
    pythonProcess.on('timeout', () => {
      pythonProcess.kill();
      reject(new Error('Python script execution timed out'));
    });
  });
}

// NFL API endpoints
app.get('/api/nfl/players/top', async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const scriptPath = path.join(__dirname, 'ml-models', 'nfl', 'get_top_players.py');
    const result = await runPythonScript(scriptPath, ['ALL', limit.toString()]);
    
    res.json({
      success: true,
      players: result.players,
      position: 'ALL',
      limit: parseInt(limit),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('NFL API Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      players: []
    });
  }
});

// NBA API endpoints
app.get('/api/nba/players/top', async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const scriptPath = path.join(__dirname, 'ml-models', 'nba', 'get_top_players.py');
    const result = await runPythonScript(scriptPath, ['ALL', limit.toString()]);
    
    res.json({
      success: true,
      players: result.players,
      position: 'ALL',
      limit: parseInt(limit),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('NBA API Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      players: []
    });
  }
});

// MLB API endpoints
app.get('/api/mlb/players/top', async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const scriptPath = path.join(__dirname, 'mlb', 'get_top_players.py');
    const result = await runPythonScript(scriptPath, ['ALL', limit.toString()]);
    
    res.json({
      success: true,
      players: result.players,
      position: 'ALL',
      limit: parseInt(limit),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MLB API Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      players: []
    });
  }
});

// Search endpoints - Connected to Python search scripts
app.get('/api/nfl/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query parameter "q" is required',
        players: []
      });
    }
    
    const scriptPath = path.join(__dirname, 'ml-models', 'nfl', 'search_players.py');
    const result = await runPythonScript(scriptPath, [query]);
    
    res.json({
      success: true,
      players: result.players,
      query: query,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('NFL Search API Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      players: []
    });
  }
});

app.get('/api/nba/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query parameter "q" is required',
        players: []
      });
    }
    
    const scriptPath = path.join(__dirname, 'ml-models', 'nba', 'search_players.py');
    const result = await runPythonScript(scriptPath, [query]);
    
    res.json({
      success: true,
      players: result.players,
      query: query,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('NBA Search API Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      players: []
    });
  }
});

app.get('/api/mlb/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query parameter "q" is required',
        players: []
      });
    }
    
    const scriptPath = path.join(__dirname, 'mlb', 'search_players.py');
    const result = await runPythonScript(scriptPath, [query]);
    
    res.json({
      success: true,
      players: result.players,
      query: query,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MLB Search API Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      players: []
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 BerkeleyBets Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🏈 NFL API: http://localhost:${PORT}/api/nfl`);
  console.log(`🏀 NBA API: http://localhost:${PORT}/api/nba`);
  console.log(`⚾ MLB API: http://localhost:${PORT}/api/mlb`);
  console.log(`🎯 Unified API: http://localhost:${PORT}/api/unified`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});