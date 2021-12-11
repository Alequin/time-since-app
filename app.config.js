import { googleMobileAdsAppId } from "./secrets.json";

const version = 1;

export default {
  name: "time-since",
  slug: "time-since",
  version: `${version}.0.0`,
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  android: {
    package: "com.just_for_fun.time_since",
    versionCode: version,
    permissions: [], // Use minimum permissions (https://docs.expo.dev/versions/latest/config/app/#permissions)
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#000000",
    },
  },
};
