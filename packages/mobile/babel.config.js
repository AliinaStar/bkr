module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxRuntime: 'automatic' }]
    ],
    plugins: [
      // Закоментовано поки що
      // 'react-native-reanimated/plugin',
    ],
  };
};