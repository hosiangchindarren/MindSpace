import React, { useEffect } from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "./navigation/RootNavigator";
import { AuthenticatedUserProvider } from "./providers";
import { registerForPushNotificationsAsync, scheduleDailyNotification } from './NotificationHandler';

const App = () => {
  useEffect(() => {
    registerForPushNotificationsAsync();
    scheduleDailyNotification();
  }, []);

  return (
    <AuthenticatedUserProvider>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </AuthenticatedUserProvider>
  );
};

export default App;
