import { Server } from 'socket.io';
import { AlertService } from './services/alerts/AlertService';
import { TwitchEventService } from './services/twitch_events/TwitchEventService';

const io = new Server(5000);

const twitchEvents = new TwitchEventService();
new AlertService(io, twitchEvents);
