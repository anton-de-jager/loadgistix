# Loadgistix

A comprehensive transport and logistics platform for managing loads, bids, vehicles, and drivers.

## 🚀 Tech Stack

- **Frontend**: Angular 16, Tailwind CSS, Angular Material
- **Backend**: .NET 8, ASP.NET Core Web API
- **Database**: Microsoft SQL Server
- **Mobile**: Capacitor (iOS & Android)
- **Real-time**: SignalR
- **Maps**: Leaflet, OpenStreetMap

## 📁 Project Structure

```
loadgistix/
├── loadgistix.api/          # .NET Web API
├── loadgistix.frontend/     # Angular Frontend
│   ├── android/             # Capacitor Android
│   ├── ios/                 # Capacitor iOS
│   └── src/                 # Angular source
└── .github/workflows/       # CI/CD pipelines
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- .NET 8 SDK
- SQL Server
- Android Studio (for mobile development)
- Java 17+ (for Android builds)

### Backend Setup

```bash
cd loadgistix.api
dotnet restore
dotnet run
```

### Frontend Setup

```bash
cd loadgistix.frontend
npm install
npm start
```

### Mobile Development

```bash
cd loadgistix.frontend
npm run build
npx cap sync android
npx cap open android
```

## 🔐 Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Required Secrets for GitHub Actions

| Secret | Description |
|--------|-------------|
| `KEYSTORE_BASE64` | Base64 encoded Android keystore |
| `KEYSTORE_PASSWORD` | Keystore password |
| `KEY_ALIAS` | Key alias (default: loadgistix) |
| `KEY_PASSWORD` | Key password |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Azure publish profile |
| `VERCEL_TOKEN` | Vercel deployment token |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

## 🚢 Deployment

### Frontend (Vercel)

1. Connect your GitHub repo to Vercel
2. Set the root directory to `loadgistix.frontend`
3. Build command: `npm run build`
4. Output directory: `dist`

### Backend (Azure App Service)

1. Create an Azure App Service (F1 free tier)
2. Download the publish profile
3. Add it as `AZURE_WEBAPP_PUBLISH_PROFILE` secret in GitHub

### Docker Deployment

```bash
docker-compose up -d
```

## 📱 Building Mobile Apps

### Android APK

```bash
cd loadgistix.frontend
npm run build
npx cap sync android
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

### iOS (requires macOS)

```bash
cd loadgistix.frontend
npm run build
npx cap sync ios
npx cap open ios
```

## 📄 License

Proprietary - All rights reserved

## 👤 Author

Anton de Jager
