import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './navigation/TabNavigator';
import LoginScreen from './screens/LoginScreen';
import React, { useState } from 'react';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { ActivityIndicator } from 'react-native';

export default function App() {
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#2566ff" />;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <TabNavigator onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <LoginScreen onLogin={() => setIsLoggedIn(true)} />
      )}
    </NavigationContainer>
  );
}
