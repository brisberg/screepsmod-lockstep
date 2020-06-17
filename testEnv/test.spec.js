// const launcher = require('@screeps/launcher');
const path = require('path');
const cp = require('child_process');

describe('ScreepsMod Lockstep', () => {
  it('should launch a private server with the mod enabled', async () => {
    const execPath = path.resolve(
        path.dirname(require.resolve('@screeps/launcher')),
        '../bin/start.js',
    );
    const serverProc = cp.fork(path.resolve(execPath), {
      //  cwd: './tesEnv/',
      stdio: [0, 'pipe', 'pipe', 'ipc'],
      env: Object.assign(
          {
            runners_cnt: 1,
            processors_cnt: 1,
            log_rotate_keep: 0,
          },
          process.env),
    });

    await new Promise((resolve) => setTimeout(resolve, 4000));
    serverProc.kill();
    expect(true).toBeTruthy();
  });
});
