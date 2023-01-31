import { Server } from 'socket.io';
import { AlertService } from './alerts/AlertService';
import { TwitchEventService } from './twitch_events/TwitchEventService';

const io = new Server(5000);

const twitchEvents = new TwitchEventService();
new AlertService(io, twitchEvents);
