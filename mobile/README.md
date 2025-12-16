# Pravasi Jaalakam Mobile App

Flutter mobile application for iOS and Android.

## Setup

1. **Install Flutter SDK** (3.0+)
2. **Install dependencies:**
   ```bash
   flutter pub get
   ```

3. **Run code generation** (for freezed, json_serializable, etc.):
   ```bash
   flutter pub run build_runner build --delete-conflicting-outputs
   ```

4. **Run the app:**
   ```bash
   flutter run
   ```

## Architecture

- **Feature-based structure** in `lib/features/`
- **Riverpod** for state management
- **GraphQL** client for API communication
- **Offline support** via Hive/local storage

## Features

- Malayalam-first UI
- Offline reading support
- Push notifications (OneSignal)
- Native performance
- Clean architecture

