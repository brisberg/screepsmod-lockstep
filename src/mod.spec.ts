import {ScreepsTestServer} from '@brisberg/screeps-test-server';
import q from 'q';

import {
  LOCKSTEP_COUNT,
  LOCKSTEP_LOCKED,
  LOCKSTEP_UNLOCK,
} from './constants';

/**
 * Sleep for m milliseconds
 * https://stackoverflow.com/a/48882182
 */
const sleep = (m: number) => new Promise((r) => setTimeout(r, m));

describe('ScreepsMod Lockstep', () => {
  let server: ScreepsTestServer|undefined;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let env: any;
  let pubsub: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */


  beforeEach(async () => {
    // Launch a test server with local mod enabled
    server = new ScreepsTestServer({
      mods: ['../lib/index.js'],
      steamApiKey: process.env.STEAM_API_KEY || '',
    });
    ({env, pubsub} = server);
    await server.start();
    pubsub.publish('setTickRate', 100);  // 10 ticks per sec
    await sleep(100);
  });

  afterEach(async () => {
    if (server) {
      await server.stop();
    }
    server = env = pubsub = undefined;
  });

  it('server should be paused on startup', async () => {
    expect(await env.get(LOCKSTEP_COUNT)).toEqual(0);
  });

  it('should progress two ticks when unlocked for two ticks', async () => {
    const startTime = await env.get(env.keys.GAMETIME);
    const defer = q.defer();
    pubsub.subscribe(LOCKSTEP_LOCKED, () => defer.resolve());

    pubsub.publish(LOCKSTEP_UNLOCK, 2);
    await defer.promise;

    expect(await env.get(env.keys.GAMETIME)).toEqual(startTime + 2);
    expect(await env.get(LOCKSTEP_COUNT)).toEqual(0);
  });

  it('should publish gametime over Pubsub when server becomes locked',
     async () => {
       const startTime = await env.get(env.keys.GAMETIME);
       pubsub.publish(LOCKSTEP_UNLOCK, 2);

       const defer = q.defer<number>();
       pubsub.subscribe(LOCKSTEP_LOCKED, (gameTime: number) => {
         defer.resolve(gameTime);
       });

       expect(await defer.promise).toEqual(startTime + 2);
     });
});
