import EventEmitter from 'events';
import { Server } from 'socket.io';
import { TwitchEventService } from '../twitch_events/TwitchEventService';

export class AlertService {
  private events: EventEmitter;

  constructor(private io: Server, private twitchEvents: TwitchEventService) {
    this.events = new EventEmitter();

    twitchEvents.onCheer((event) => {
      io.emit('alert', {
        type: 'cheer',
        displayName: event.user_name,
        amount: event.bits,
        isAnonymous: event.is_anonymous,
        tts: event.message,
      });
    });

    twitchEvents.onFollow((event) => {
      io.emit('alert', {
        type: 'follow',
        displayName: event.user_name,
      });
    });

    twitchEvents.onRaid((event) => {
      io.emit('alert', {
        type: 'raid',
        displayName: event.from_broadcaster_user_name,
        amount: event.viewers,
      });
    });

    twitchEvents.onSubGift((event) => {
      io.emit('alert', {
        type: 'gift',
        displayName: event.user_name,
        amount: event.total,
      });
    });

    twitchEvents.onSubMessage((event) => {
      io.emit('alert', {
        type: 'sub',
        displayName: event.user_name,
        amount: event.cumulative_months,
        tts: event.message.text,
      });
    });
  }
}
