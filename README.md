# BerkeleyBets 🐻🐻

An AI-powered sports betting platform that combines predictive analytics, live data integration, and modern web technologies to provide intelligent betting insights across NBA, NFL, and MLB.

## Overview

BerkeleyBets transforms raw sports data into actionable betting intelligence through machine learning models and real-time analytics. The platform provides users with player performance predictions, statistical analysis, and a comprehensive betting interface built on data-driven insights.

## Features

### Core Functionality
- **Multi-Sport Support**: NBA, NFL, and MLB player predictions
- **AI-Powered Predictions**: Machine learning models for player performance forecasting
- **Real-Time Data**: Live player statistics and performance metrics
- **Betting System**: Virtual Bear Bucks currency with over/under/exact betting options
- **Portfolio Management**: Track active bets, betting history, and performance analytics
- **Player Profiles**: Comprehensive stat displays with position-specific metrics

### Technical Features
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-Time Updates**: Live API integration for current player data
- **Data Persistence**: Local storage and Firebase integration for user data
- **Advanced Search**: Fuzzy search across all players and sports
- **Health Monitoring**: API status tracking and error handling

## Technology Stack

### Frontend
- **React 18**: Modern component-based UI framework
- **Tailwind CSS**: Utility-first styling framework
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **Fuse.js**: Fuzzy search functionality

### Backend
- **Node.js**: Server runtime environment
- **Express.js**: Web application framework
- **Python**: Machine learning and data processing
- **Firebase**: Authentication and data storage

### Machine Learning
- **scikit-learn**: ML model training and prediction
- **pandas**: Data manipulation and analysis
- **numpy**: Numerical computing
- **joblib**: Model serialization and loading

### Data Sources
- **ESPN API**: Player statistics and game data
- **NBA API**: Basketball-specific data
- **Custom scrapers**: MLB and NFL data collection

## Project Structure

```
BerkeleyBets/
├── client/                     # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Main application pages
│   │   ├── services/          # API service layers
│   │   └── contexts/          # React context providers
├── ml-models/                 # Machine learning models
│   ├── nba/                   # NBA prediction models
│   ├── nfl/                   # NFL prediction models
│   └── mlb/                   # MLB prediction models
├── Training Model/            # Model training scripts
├── server/                    # Backend API server
└── docs/                     # Documentation
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/BerkeleyBets.git
cd BerkeleyBets
```

2. **Install frontend dependencies**
```bash
cd client
npm install
```

3. **Install Python dependencies**
```bash
cd ../ml-models
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
# Create .env file in client directory
cp client/.env.example client/.env
# Add your Firebase and API configurations
```

5. **Start the development servers**
```bash
# Terminal 1 - Frontend
cd client
npm run dev

# Terminal 2 - ML Models (if running locally)
cd ml-models
python -m nba.get_top_players
python -m nfl.get_top_players
python -m mlb.get_top_players
```

### Configuration

#### Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication and Firestore
3. Add your Firebase configuration to `client/.env`:
```env
VITE_API_KEY=your_api_key
VITE_AUTH_DOMAIN=your_auth_domain
VITE_PROJECT_ID=your_project_id
```

#### API Configuration
The application expects ML model APIs to be running on:
- NBA: `http://localhost:3002`
- NFL: `http://localhost:3001`
- MLB: `http://localhost:3003`

## Usage

### For Users
1. **Sign up/Login**: Create an account or log in to access the platform
2. **Browse Players**: Select a sport (NBA/NFL/MLB) to view top players
3. **View Player Profiles**: Click on any player to see detailed statistics
4. **Place Bets**: Use Bear Bucks to bet on player performance metrics
5. **Track Performance**: Monitor your betting history and portfolio

### For Developers

#### Running Models Locally
```bash
# NBA models
cd ml-models/nba
python get_top_players.py
python search_players.py "LeBron James"

# NFL models
cd ../nfl
python get_top_players.py
python search_players.py "Josh Allen"

# MLB models
cd ../mlb
python get_top_players.py
python search_players.py "Aaron Judge"
```

#### Model Training
```bash
# Retrain NBA models
cd Training Model/nba
python nba_model_fixed.py

# Retrain NFL models
cd ../nfl
python nfl_model.py

# Retrain MLB models
cd ../../mlb
python train_balanced_realistic_models.py
```

## API Endpoints

### NBA API (Port 3002)
- `GET /api/nba/players` - Get all NBA players
- `GET /api/nba/players/top?limit=50` - Get top players
- `GET /api/nba/search?q=player_name` - Search players
- `GET /health` - Health check

### NFL API (Port 3001)
- `GET /api/nfl/players` - Get all NFL players
- `GET /api/nfl/players/top?limit=50` - Get top players
- `GET /api/nfl/search?q=player_name` - Search players
- `GET /health` - Health check

### MLB API (Port 3003)
- `GET /api/mlb/players` - Get all MLB players
- `GET /api/mlb/players/top?limit=50` - Get top players
- `GET /api/mlb/search?q=player_name` - Search players
- `GET /health` - Health check

## Data Models

### Player Data Structure
```javascript
{
  id: string,
  name: string,
  team: string,
  position: string,
  stats: {
    predictedPoints: number,
    confidence: number,
    // Sport-specific stats...
  },
  image: string, // Position icon
  // Additional sport-specific fields...
}
```

### Betting Data Structure
```javascript
{
  id: string,
  playerId: string,
  playerName: string,
  sport: 'nba' | 'nfl' | 'mlb',
  statType: string,
  statLabel: string,
  prediction: number,
  target: number,
  direction: 'over' | 'under' | 'exact',
  amount: number,
  potentialPayout: number,
  timestamp: string,
  status: 'active' | 'won' | 'lost' | 'cashed_out',
  confidence: number
}
```

## Model Performance

### NBA Models
- **Points Prediction**: R² score of 0.85+ across all positions
- **Rebounds/Assists**: Position-specific models with 80%+ accuracy
- **Training Data**: 3+ seasons of historical performance

### NFL Models
- **Fantasy Points**: 78% accuracy for skill position players
- **Position-Specific Stats**: Separate models for QB, RB, WR, TE
- **Training Data**: Multiple seasons with weather and matchup factors

### MLB Models
- **Batting Stats**: Hits, runs, RBIs prediction with 75%+ accuracy
- **Pitching Stats**: Strikeouts and innings pitched forecasting
- **Training Data**: Comprehensive historical statistics

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m "Add feature description"`
5. Push to your fork: `git push origin feature-name`
6. Create a Pull Request

### Code Standards
- **Frontend**: Follow React best practices, use TypeScript where applicable
- **Backend**: Follow Node.js conventions, implement proper error handling
- **ML Models**: Document model performance and training procedures
- **Testing**: Write unit tests for new features

### Areas for Contribution
- Additional sports integration (NHL, soccer, etc.)
- Improved prediction algorithms
- Enhanced UI/UX features
- Mobile app development
- Real-time betting odds integration

## Deployment

### Production Build
```bash
cd client
npm run build
```

**Disclaimer**: This platform is for educational and entertainment purposes. Users should be aware of local gambling laws and practice responsible betting habits.
