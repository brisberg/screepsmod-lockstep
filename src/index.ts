/* eslint-disable @typescript-eslint/no-var-requires */

import {ScreepsConfig} from './constants';

function lockStepMod(config: ScreepsConfig): void {
  // Common patch (for all modules)
  require('./common')(config);

  // Engine patch
  if (config.engine) {
    require('./engine')(config);
  }
}

// CommonJS Style Export
export = lockStepMod;
