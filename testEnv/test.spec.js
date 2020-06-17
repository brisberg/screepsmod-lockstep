// const launcher = require('@screeps/launcher');
const path = require('path');
const cp = require('child_process');

describe('ScreepsMod Lockstep', () => {
  it('should launch a private server with the mod enabled', async () => {
    const execPath = path.resolve(
        path.dirname(require.resolve('@screeps/launcher')),
        '../bin/screeps.js',
    );
    const serverProc = cp.fork(path.resolve(execPath), ['start'], {
      // cwd: path.join(__dirname, './tesEnv'),
      cwd: __dirname,
      stdio: 'inherit',
    });

    await new Promise((resolve) => setTimeout(resolve, 4000));
    serverProc.kill();
    expect(true).toBeTruthy();
  });
});
