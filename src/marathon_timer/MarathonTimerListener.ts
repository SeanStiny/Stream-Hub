import { ServiceEventListener } from '../App';
import { TwitchEventService } from '../twitch_events/TwitchEventService';
import { MarathonTimerService } from './MarathonTimerService';

const TIME_SUB = 15 * 60 * 1000;
const TIME_BIT = 1800;

export class MarathonTimerListener implements ServiceEventListener {
  constructor(
    private marathonTimer: MarathonTimerService,
    private twitchEvents: TwitchEventService
  ) {}

  listen() {
    this.twitchEvents.onSubMessage((event) => {
      let time = 0;
      if (event.tier === '1000') {
        time = TIME_SUB;
      } else if (event.tier === '2000') {
        time = 2 * TIME_SUB;
      } else if (event.tier === '3000') {
        time = 5 * TIME_SUB;
      }
      this.marathonTimer.addTime(time);
    });

    this.twitchEvents.onCheer((event) => {
      const time = event.bits * TIME_BIT;
      this.marathonTimer.addTime(time);
    });

    this.twitchEvents.onSubGift((event) => {
      let time = 0;
      if (event.tier === '1000') {
        time = TIME_SUB;
      } else if (event.tier === '2000') {
        time = 2 * TIME_SUB;
      } else if (event.tier === '3000') {
        time = 5 * TIME_SUB;
      }
      time *= event.total;
      this.marathonTimer.addTime(time);
    });
  }
}
