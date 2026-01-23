const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.watchFolders = [path.resolve(__dirname)];
config.resolver.platforms = ['ios', 'android', 'web'];

module.exports = config;