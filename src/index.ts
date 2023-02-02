import { Server } from 'socket.io';
import { App } from './App';
import { EVENTSUB_SECRET, HTTP_PORT, IO_PORT } from './config';
import { logger } from './logger';
import { WebSocketListener } from './websocket/WebSocketListener';
import { WebSocketService } from './websocket/WebSocketService';
import { TwitchEventController } from './twitch_events/TwitchEventController';
import { TwitchEventService } from './twitch_events/TwitchEventService';
import { MarathonTimerService } from './marathon_timer/MarathonTimerService';
import { MarathonTimerController } from './marathon_timer/MarathonTimerController';
import { MarathonTimerListener } from './marathon_timer/MarathonTimerListener';

// Websocket server
const io = new Server(IO_PORT, { cors: { origin: '*' } });
logger.info(`Websocket listening on port ${IO_PORT}`);

// Application services
const twitchEvents = new TwitchEventService();
const alerts = new WebSocketService(io);
const marathonTimer = new MarathonTimerService(io);

const app = new App(
  HTTP_PORT,
  [
    new TwitchEventController('/twitch', twitchEvents, EVENTSUB_SECRET),
    new MarathonTimerController('/marathon_timer', marathonTimer),
  ],
  [
    new WebSocketListener(alerts, twitchEvents),
    new MarathonTimerListener(marathonTimer, twitchEvents),
  ]
);
app.start();
