import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const affirmations = [
  "You are doing great! Keep up the good work.",
  "Believe in yourself and all that you are.",
  "You have the power to create change.",
  "Every day is a new opportunity to grow.",
  "Stay positive, work hard, make it happen.",
  "Your potential is limitless.",
  "Keep pushing forward, success is near.",
  "You are stronger than you think.",
  "Embrace the journey, not just the destination.",
  "Today is a new day, filled with possibilities."
];

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

export async function scheduleDailyNotification() {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Daily Affirmation",
      body: randomAffirmation,
      android: {
        icon: './assets/notification-icon.png',
        color: 'white', 
      },
    },
    trigger: {
      hour: 11,
      minute: 0,
      repeats: true,
    },
  });
}
