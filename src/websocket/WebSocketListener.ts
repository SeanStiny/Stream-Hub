import { ServiceEventListener } from '../App';
import { TwitchEventService } from '../twitch_events/TwitchEventService';
import { WebSocketService } from './WebSocketService';

export class WebSocketListener implements ServiceEventListener {
  constructor(
    private websocket: WebSocketService,
    private twitchEvents: TwitchEventService
  ) {}

  listen() {
    this.listenToTwitch();
  }

  private listenToTwitch = () => {
    this.twitchEvents.onCheer((event) => {
      this.websocket.emitCheer({
        displayName: event.user_name,
        amount: event.bits,
        isAnonymous: event.is_anonymous,
        message: event.message,
      });
    });

    this.twitchEvents.onFollow((event) => {
      this.websocket.emitFollow({
        displayName: event.user_name,
      });
    });

    this.twitchEvents.onRaid((event) => {
      this.websocket.emitRaid({
        displayName: event.from_broadcaster_user_name,
        viewers: event.viewers,
      });
    });

    this.twitchEvents.onSubGift((event) => {
      this.websocket.emitGiftSub({
        displayName: event.user_name,
        total: event.total,
      });
    });

    this.twitchEvents.onSubMessage((event) => {
      this.websocket.emitSub({
        displayName: event.user_name,
        months: event.cumulative_months,
        message: event.message.text,
      });
    });
  };
}
