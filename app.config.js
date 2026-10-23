module.exports = ({ config }) => {
  const isDeploy =
    process.env.npm_lifecycle_event === 'predeploy' ||
    process.env.BUILD_FOR_GHPAGES === 'true';

  return {
    ...config,
    experiments: {
      ...(config.experiments || {}),
      baseUrl: isDeploy ? '/-Fresh-Mark' : '',
    },
  };
};
