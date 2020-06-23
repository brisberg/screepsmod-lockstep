function lockStepMod(config: {engine?: {}}) {
  // Common patch (for all modules)
  require('./common')(config);

  // Engine patch
  if (config.engine) {
    require('./engine')(config);
  }
};

// CommonJS Style Export
export = lockStepMod;
