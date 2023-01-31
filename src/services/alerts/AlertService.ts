import { Server } from 'socket.io';
import { TwitchEventService } from '../twitch_events/TwitchEventService';

export class AlertService {
  constructor(io: Server, twitchEvents: TwitchEventService) {
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
