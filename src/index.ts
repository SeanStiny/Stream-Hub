import { Server } from 'socket.io';
import { App } from './App';
import { EVENTSUB_SECRET, HTTP_PORT, IO_PORT } from './config';
import { logger } from './logger';
import { AlertListener } from './alerts/AlertListener';
import { AlertService } from './alerts/AlertService';
import { TwitchEventController } from './twitch_events/TwitchEventController';
import { TwitchEventService } from './twitch_events/TwitchEventService';

// Websocket server
const io = new Server(IO_PORT, { cors: { origin: '*' } });
logger.info(`Websocket listening on port ${IO_PORT}`);

// Application services
const twitchEvents = new TwitchEventService();
const alerts = new AlertService(io);

const app = new App(
  HTTP_PORT,
  [new TwitchEventController('/twitch', twitchEvents, EVENTSUB_SECRET)],
  [new AlertListener(alerts, twitchEvents)]
);
app.start();
