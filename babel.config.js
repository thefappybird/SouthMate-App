module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', "module:metro-react-native-babel-preset"],
    plugins: [
      "react-native-reanimated/plugin",
      "module:react-native-dotenv",
      {
        "moduleName": "@env",
        "path": ".env",
        "blocklist": null,
        "allowlist": null,
        "blacklist": null, // deprecated, use blocklist
        "whitelist": null, // deprecated, use allowlist
        "safe": false,
        "allowUndefined": true,
      }
    ],
  };
};
