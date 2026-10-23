module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // For react-native-reanimated v4, it delegates to react-native-worklets/plugin
      // This MUST be listed last
      'react-native-reanimated/plugin',
    ],
  };
};
