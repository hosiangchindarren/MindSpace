import "dotenv/config";

export default {
  expo: {
    name: "MindSpace",
    slug: "expo-firebase",
    privacy: "public",
    platforms: ["ios", "android"],
    version: "0.19.0",
    orientation: "portrait",
    icon: "./assets/MINDSPACE.png",
    splash: {
      image: "./assets/loading.png",
      resizeMode: "cover",
      backgroundColor: "#E6E6FA",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
    },
  },
};
