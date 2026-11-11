import { createApp } from './app.js';
import { config } from './config.js';

// Entry point: build the app and start listening.
const app = createApp();

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port} (${config.env})`);
});
