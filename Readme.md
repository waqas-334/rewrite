# Grammar Project

This project is a React Native iOS application built with Expo dev client.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Xcode (latest version)
- CocoaPods
- iOS Simulator or physical iOS device
- Expo CLI (`npm install -g expo-cli`)

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd grammar
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Environment Setup:
   - Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   - Update the environment variables in `.env` with your values

## Environment Variables

The following environment variables are required:

```env
ADAPTY_PUBLIC_KEY=...
ADAPTY_PLACEMENT_ID=...
ADAPTY_SECRET_KEY=...
CLARITY_TOKEN=...
ENV=development #production
```

## Running the Application

1. First, prebuild the iOS application:

```bash
npx expo prebuild --platform ios
```

2. Run the iOS application:

```bash
npx expo run:ios
```

To run on a specific iOS simulator or device:

```bash
# For a specific simulator
npx expo run:ios --simulator="iPhone 14 Pro"

# For a connected device
npx expo run:ios --device
```

## Development

For development with hot reload:

```bash
npx expo start
# or
npm start
# or
yarn start
```

Then press 'i' to open iOS simulator

## Troubleshooting

If you encounter build issues:

1. Clean the build:

```bash
cd ios
xcodebuild clean
cd ..
```

2. Remove pods and reinstall:

```bash
cd ios
pod deintegrate
pod install
cd ..
```

3. prebuild with clean (recommended after updating app.json)

```bash
npx expo prebuild --platform ios --clean
npx expo run:ios
```

## Update on app store

If you are building and submiting with eas:
In app.json increase expo.ios.buildNumber, then run prebuild with clean

If You are building with xcode:
update CFBundleVersion and CFBundleShortVersionString, then archive

## License

MIT

```

```
