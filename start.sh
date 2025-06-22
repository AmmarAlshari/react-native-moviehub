#!/bin/bash

echo "🛠️  Do you want to install/update dependencies with 'npx expo install'? (y/n)"
read -r update_choice

if [ "$update_choice" = "y" ] || [ "$update_choice" = "Y" ]; then
  echo "📦 Installing/updating dependencies..."
  npx expo install
else
  echo "⏭️  Skipping dependency update."
fi

echo "🚀 Starting React Native project with Expo..."
npx expo start
