# Loadgistix

A comprehensive logistics and load management platform connecting shippers with transporters.

## Project Structure

```
loadgistix/
├── loadgistix.api/          # .NET 7 Web API Backend
├── loadgistix.frontend/     # Angular 16 Frontend with Capacitor
└── README.md
```

## Tech Stack

### Backend (loadgistix.api)
- .NET 7 Web API
- Entity Framework Core
- SQL Server
- SignalR for real-time updates
- JWT Authentication

### Frontend (loadgistix.frontend)
- Angular 16
- Angular Material
- Tailwind CSS
- Capacitor (iOS/Android)
- Leaflet Maps
- SignalR Client

## Getting Started

### Prerequisites
- Node.js 18+
- .NET 7 SDK
- SQL Server
- Android Studio (for mobile builds)

### Backend Setup

```bash
cd loadgistix.api
dotnet restore
dotnet run
```

The API will be available at `https://localhost:44368`

### Frontend Setup

```bash
cd loadgistix.frontend
npm install
npm start
```

The app will be available at `http://localhost:4200`

### Mobile Build (Android)

```bash
cd loadgistix.frontend
npm run build
npx cap sync android
npx cap open android
```

## Features

- 🚚 Load Management
- 📍 Real-time GPS Tracking
- 💰 Bidding System
- 👥 Driver Management
- 🚗 Vehicle Fleet Management
- 📊 Dashboard Analytics
- 🔔 Real-time Notifications (SignalR)
- 📱 Mobile App (iOS/Android via Capacitor)

## Environment Configuration

### Frontend
Edit `src/environments/environment.ts`:
```typescript
export const environment = {
    production: false,
    apiDotNet: 'https://localhost:44368/api/',
    // ... other settings
};
```

### Backend
Edit `appsettings.json` for database connection and other settings.

## Deployment

See deployment guides in the `/docs` folder (coming soon).

## License

Proprietary - All rights reserved

