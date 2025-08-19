# Shhh - Anonymous Messaging Wall

A beautiful, anonymous messaging application where users can share their thoughts, confessions, poetry, and anything on their mind without revealing their identity.

## Features

- **Anonymous Messaging**: Share your thoughts without revealing your identity
- **Beautiful UI**: Modern, futuristic design with smooth animations
- **Real-time Updates**: Messages appear instantly on the wall
- **Responsive Design**: Works perfectly on all devices
- **Firebase Integration**: Real-time database with Firestore
- **Cloud Hosting**: Deploy to Firebase Hosting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd shhh
```

2. Install dependencies
```bash
npm install
```

3. Set up Firebase
```bash
# Login to Firebase
npm run firebase:login

# Initialize Firebase project
npm run firebase:init
```

4. Configure environment variables
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your Firebase configuration
nano .env
```

5. Start the development server
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "shhh-anonymous-wall")
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

### 3. Get Firebase Configuration

1. In Firebase Console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → "Web"
4. Register app with a nickname
5. Copy the configuration object

### 4. Update Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 5. Deploy to Firebase

```bash
# Build and deploy
npm run firebase:deploy

# Or deploy separately
npm run build
firebase deploy
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run firebase:login` - Login to Firebase
- `npm run firebase:init` - Initialize Firebase project
- `npm run firebase:deploy` - Build and deploy to Firebase
- `npm run firebase:serve` - Serve Firebase locally

## Tech Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **Database**: Firebase Firestore
- **Hosting**: Firebase Hosting
- **Real-time**: Firestore real-time listeners

## Project Structure

```
shhh/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── App.jsx        # Main app component
│   ├── index.jsx      # App entry point
│   └── firebase.js    # Firebase configuration
├── public/            # Static assets
├── index.html         # HTML template
├── vite.config.js     # Vite configuration
├── firebase.json      # Firebase hosting config
├── firebase.rules     # Firestore security rules
├── env.example        # Environment variables template
└── package.json       # Dependencies and scripts
```

## Security Rules

The app includes Firestore security rules that:
- Allow anyone to read messages
- Allow anyone to create messages (with validation)
- Prevent message updates and deletions
- Validate message structure

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License.
