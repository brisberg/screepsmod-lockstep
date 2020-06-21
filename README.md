# Lockstep (Screeps Server Mod)
Lockstep will prevents the server from ticking unless a tick is specifically requested. Suitable for unit/integration testing of scripts where you need fine grained control over tick events.

## Installation

In your Screeps Server directory:

```npm install @brisberg/screepsmod-lockstep```

or

```yarn add @brisberg/screepsmod-lockstep```

Ensure that Screeps automatically added it to your `mods.json` file.

### Usage

From another server mod:
```javascript
// Respond to server locked event
pubsub.subscribe(pubsub.keys.LOCKSTEP_LOCKED, (gameTime) => {
  console.log(`Server locked at gameTime: ${gameTime}`);
})

pubsub.subscribe(pubsub.keys.TICK_STARTED, () => console.log('Tick!'));

// Request 5 ticks over pubsub
pubsub.publish(pubsub.keys.LOCKSTEP_UNLOCK, 5);

/// Output (logs/engine_main.log)
// Server locked at gameTime: 1
// Tick!
// Tick!
// Tick!
// Tick!
// Tick!
// Server locked at gameTime: 6
```

### Development

Clone this repo.\
```yarn install```

### Testing

```yarn test```

Utilizes a local Screeps private server with the local mod version installed. Inspect server logs in `server/logs`.

**Note:** By default, this will fail to authenticate with Steam (causing the backend process to crash and restart). If you need it to test something on the backend for some reason, you can provide your steam web token securely as an environment variable.

Create a file named `screeps-testing-env` at the project root. Add your secure token like so (no quotes):

```
// DO NOT COMMIT THIS FILE
// Configure your SteamWebApi key
STEAM_API_KEY = <Your Steam Token>
```
