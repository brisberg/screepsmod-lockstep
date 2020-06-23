import q from 'q';

import {
  LOCKSTEP_COUNT,
  LOCKSTEP_LOCKED,
  LOCKSTEP_UNLOCK,
} from './constants';

const {ScreepsTestServer} = require('@brisberg/screeps-test-server');

describe('ScreepsMod Lockstep', () => {
  let server: typeof ScreepsTestServer;
  let db: any, env: any, pubsub: any;

  beforeEach(async () => {
    // Launch a test server with local mod enabled
    server = new ScreepsTestServer({
      mods: ['../lib/index.js'],
      steamApiKey: process.env.STEAM_API_KEY || '',
    });
    ({db, env, pubsub} = server);
    await server.start();
    pubsub.publish('setTickRate', 100);  // 10 ticks per sec
  });

  afterEach(() => {
    server.stop();
    server = db = env = pubsub = undefined;
  })

  it('server should be paused on startup', async () => {
    expect(await env.get(LOCKSTEP_COUNT)).toEqual(0);
  });

  it('should progress two ticks when server unlocked for two ticks',
     async () => {
       const startTime = await env.get(env.keys.GAMETIME);
       const defer = q.defer();
       pubsub.subscribe(
           LOCKSTEP_LOCKED,
           (gameTime: number) => defer.resolve(gameTime),
       );

       pubsub.publish(LOCKSTEP_UNLOCK, 2);
       await defer.promise;

       expect(await env.get(env.keys.GAMETIME)).toEqual(startTime + 2);
       expect(await env.get(LOCKSTEP_COUNT)).toEqual(0);
     });

  it('should publish gametime over Pubsub when server becomes locked',
     async () => {
       const startTime = await env.get(env.keys.GAMETIME);
       pubsub.publish(LOCKSTEP_UNLOCK, 2);

       const defer = q.defer();
       pubsub.subscribe(
           LOCKSTEP_LOCKED,
           (gameTime: number) => defer.resolve(gameTime),
       );

       expect(await defer.promise).toEqual(startTime + 2);
     });
});
