# Can I Kite? 🪁

Real-time kitesurfing conditions and kite size recommendations for spots in the Netherlands.

## Features

### Core Features (MVP)
- **Interactive Map View**: Leaflet-powered map showing all spots with real-time status
- **Spot Overview**: View all kitesurf spots in the Netherlands with real-time conditions
- **Live Weather Data**: Real-time data from Open-Meteo API (no signup required!)
- **Kite Size Calculator**: Personalized recommendations based on rider weight, skill level, and conditions
- **Smart Filtering**: Filter by region, wind direction, water type, and more
- **Mobile-First Design**: Optimized for use on the beach
- **No API Keys Needed**: Uses completely free, open APIs

### Spot Information
- Wind conditions (speed, direction, gusts)
- Kiteability score (0-100%)
- Facilities available
- Restrictions and hazards
- Tide dependency
- Water type (sea/lake)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- That's it! No API keys needed 🎉

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/can-i-kite.git
cd can-i-kite
```

2. Install dependencies:
```bash
npm install
```

3. No environment setup needed! The app uses free, open APIs:
   - **Open-Meteo**: Free weather data, no signup required
   - **OpenStreetMap**: Free map tiles via Leaflet

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet with OpenStreetMap (free!)
- **Weather API**: Open-Meteo (free, no signup!)
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   └── page.tsx        # Main page
├── components/         # React components
│   ├── SpotCard.tsx   # Individual spot card
│   ├── SpotList.tsx   # List of spots
│   ├── SpotDetail.tsx # Detailed spot view
│   ├── FilterPanel.tsx # Filtering options
│   └── KiteSizeCalculator.tsx
├── data/              # Static data
│   └── spots.ts       # Kitesurf spot data
├── hooks/             # Custom React hooks
├── services/          # External services
│   └── weatherService.ts
├── types/             # TypeScript types
└── utils/             # Utility functions
    └── kiteCalculator.ts
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- AWS Amplify
- Netlify
- Railway
- Docker

Build command: `npm run build`
Start command: `npm start`

## API Endpoints

- `GET /api/spots` - Get all spots with conditions
- `GET /api/spots/[id]` - Get specific spot details
- `POST /api/kite-size` - Calculate recommended kite size

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Features

- User accounts and favorites
- Push notifications for ideal conditions
- Community reports and check-ins
- Tide information integration
- Multi-day forecasts
- GPS tracking integration

## License

MIT License - feel free to use this project for any purpose

## Safety Notice

⚠️ **Important**: Weather data may be delayed or inaccurate. Always check actual conditions on-site before kiting. This app is a planning tool only and should not be your only source for safety decisions.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.