# Firebase Auth Practice - Build & Deployment Guide

## 📌 Prerequisites

Before proceeding with the build and deployment process, ensure you have the following:

- Node.js (latest LTS version) installed
- Expo CLI installed globally (`npm install -g expo-cli`)
- Firebase project set up with Authentication & Firestore/Realtime Database
- `google-services.json` placed in `android/app/` ( Please get it from your firebase console)
- EAS CLI installed (`npm install -g eas-cli`)
- Expo account logged in (`eas login`)
- Base64-encoded `google-services.json` stored in a text file at the root level for EAS Build 

## 🚀 Build Process

### 1️⃣ Install Dependencies
```sh
npm install
```

### 2️⃣ Configure EAS Build
```sh
eas build:configure
```
Follow the prompts to set up the build profile.

### 3️⃣ Build APK (Android)
```sh
eas build --platform android
```
This will generate an APK file for Android deployment.

### 4️⃣ Build IPA (iOS) *(Optional)*
```sh
eas build --platform ios
```
Ensure you have an Apple Developer account and necessary certificates configured.

## 🔧 Environment Configurations

### 1️⃣ Firebase Configuration
- `google-services.json` must be placed in `android/app/`
- Ensure Firebase Authentication & Firestore/Realtime Database rules are properly configured

### 2️⃣ Environment Variables (EAS Build)
Create a `.env` file and add necessary environment variables (if required). You can also define secrets using:
```sh
eas secret:create --name GOOGLE_SERVICES_JSON --value "$(cat google-services.json | base64)"
```

## 📦 Deployment

### 1️⃣ Deploy to Expo (OTA Updates)
```sh
expo publish
```
This will push an over-the-air update to all users.

### 2️⃣ Deploy to Play Store (Android)
- Download the APK from Expo Dashboard (`eas build:list`)
- Go to [Google Play Console](https://play.google.com/console/)
- Upload the APK and fill in the necessary details
- Submit for review

### 3️⃣ Deploy to App Store (iOS)
- Download the IPA from Expo Dashboard
- Use Transporter to upload the IPA to App Store Connect
- Submit for review

## 🛠 Troubleshooting

- **Build fails?** Run `eas build --clear-cache` and try again.
- **Firebase issues?** Check your `google-services.json` and ensure Firebase rules allow access.
- **App not updating?** Try `expo publish --release-channel production`.

## 📜 Additional Notes
- Keep the `google-services.json` file **secure** and never expose it publicly.
- Use environment variables for sensitive data in `.env`.

---
_This guide ensures a smooth build and deployment process for your React Native authentication and onboarding app._ 🚀
