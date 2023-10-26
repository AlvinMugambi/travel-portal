module.exports = function override(config, env) {
  console.log('override');
  let loaders = config.resolve;
  loaders.fallback = {
    os: require.resolve('os-browserify/browser'),
    util: false,
    zlib: false,
  };

  return config;
};
