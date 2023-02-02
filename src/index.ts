import { Server } from 'socket.io';
import { App } from './App';
import {
  EVENTSUB_SECRET,
  HTTP_PORT,
  IO_PORT,
  TMI_PASS,
  TMI_USER,
  TWITCH_CHANNEL,
} from './config';
import { logger } from './logger';
import { WebSocketListener } from './websocket/WebSocketListener';
import { WebSocketService } from './websocket/WebSocketService';
import { TwitchEventController } from './twitch_events/TwitchEventController';
import { TwitchEventService } from './twitch_events/TwitchEventService';
import { MarathonTimerService } from './marathon_timer/MarathonTimerService';
import { MarathonTimerController } from './marathon_timer/MarathonTimerController';
import { MarathonTimerListener } from './marathon_timer/MarathonTimerListener';
import { Client } from 'tmi.js';
import { ChatService } from './chat/ChatService';
import { TriviaService } from './trivia/TriviaService';
import { TriviaListener } from './trivia/TriviaListener';

// Websocket server
const io = new Server(IO_PORT, { cors: { origin: '*' } });
logger.info(`Websocket listening on port ${IO_PORT}`);

// Twitch chat
const tmi = new Client({
  channels: [TWITCH_CHANNEL],
  identity: { username: TMI_USER, password: TMI_PASS },
  options: { skipMembership: true, debug: true },
});
tmi.connect();

// Application services
const twitchEvents = new TwitchEventService();
const alerts = new WebSocketService(io);
const marathonTimer = new MarathonTimerService(io);
const chat = new ChatService(tmi, TWITCH_CHANNEL);
const trivia = new TriviaService();

const app = new App(
  HTTP_PORT,
  [
    new TwitchEventController('/twitch', twitchEvents, EVENTSUB_SECRET),
    new MarathonTimerController('/marathon_timer', marathonTimer),
  ],
  [
    new WebSocketListener(alerts, twitchEvents),
    new MarathonTimerListener(marathonTimer, twitchEvents),
    new TriviaListener(trivia, twitchEvents, chat),
  ]
);
app.start();
