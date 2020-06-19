/** Test helpers for launching and cleaning up Screeps Server instances */
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const common = require('@screeps/common');

process.env.STORAGE_PORT = '24567';
// process.env.STORAGE_HOST = 'localhost';

// Forks a full Screeps Server process and returns the handle
function forkServerProcess() {
  const execPath = path.resolve(
      path.dirname(require.resolve('@screeps/launcher')),
      '../bin/screeps.js',
  );
  return cp.fork(
      path.resolve(execPath),
      ['start', '--steam_api_key', process.env.STEAM_API_KEY],
      {cwd: path.join(process.cwd(), './testEnv'), stdio: 'inherit'},
  );
};

/**
 * Launches a new Screeps Server, overwrites the database file, and connects to
 * the storage process.
 *
 * Returns the server process, database, and environment handles.
 */
module.exports.launchScreepsProcess = async () => {
  const ASSETS_PATH = path.join(process.cwd(), 'testEnv', 'data');
  const TEST_ENV_PATH = path.join(process.cwd(), 'testEnv');
  fs.copyFileSync(
      path.join(ASSETS_PATH, 'orig_db.json'),
      path.join(TEST_ENV_PATH, 'db.json'),
  );
  const serverProc = forkServerProcess();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await common.storage._connect();
  // await common.storage.resetAllData();
  const {db, env} = common.storage;

  return {serverProc, db, env};
};
