import { ServiceEventListener } from '../../App';
import { TwitchEventService } from '../twitch_events/TwitchEventService';
import { AlertService } from './AlertService';

export class AlertListener implements ServiceEventListener {
  constructor(
    private alerts: AlertService,
    private twitchEvents: TwitchEventService
  ) {}

  listen() {
    this.twitchEvents.onCheer((event) => {
      this.alerts.triggerCheer({
        displayName: event.user_name,
        amount: event.bits,
        isAnonymous: event.is_anonymous,
        message: event.message,
      });
    });

    this.twitchEvents.onFollow((event) => {
      this.alerts.triggerFollow({
        displayName: event.user_name,
      });
    });

    this.twitchEvents.onRaid((event) => {
      this.alerts.triggerRaid({
        displayName: event.from_broadcaster_user_name,
        viewers: event.viewers,
      });
    });

    this.twitchEvents.onSubGift((event) => {
      this.alerts.triggerSubGift({
        displayName: event.user_name,
        total: event.total,
      });
    });

    this.twitchEvents.onSubMessage((event) => {
      this.alerts.triggerSub({
        displayName: event.user_name,
        months: event.cumulative_months,
        message: event.message.text,
      });
    });
  }
}
