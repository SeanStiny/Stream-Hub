import EventEmitter from 'events';

export class TwitchEventService {
  private events: EventEmitter;

  constructor() {
    this.events = new EventEmitter();
  }

  emitFollow(event: FollowEvent) {
    this.events.emit('follow', event);
  }

  onFollow(listener: (event: FollowEvent) => void) {
    this.events.addListener('follow', listener);
  }

  emitSubMessage(event: SubscriptionMessageEvent) {
    this.events.emit('sub_message', event);
  }

  onSubMessage(listener: (event: SubscriptionMessageEvent) => void) {
    this.events.addListener('sub_message', listener);
  }

  emitSubGift(event: SubscriptionGiftEvent) {
    this.events.emit('sub_gift', event);
  }

  onSubGift(listener: (event: SubscriptionGiftEvent) => void) {
    this.events.addListener('sub_gift', listener);
  }

  emitCheer(event: CheerEvent) {
    this.events.emit('cheer', event);
  }

  onCheer(listener: (event: CheerEvent) => void) {
    this.events.addListener('cheer', listener);
  }

  emitRaid(event: RaidEvent) {
    this.events.emit('raid', event);
  }

  onRaid(listener: (event: RaidEvent) => void) {
    this.events.addListener('raid', listener);
  }
}

interface FollowEvent {
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  followed_at: string;
}

interface SubscriptionMessageEvent {
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  tier: string;
  message: {
    text: string;
    emotes: {
      begin: number;
      end: number;
      id: string;
    }[];
  };
  cumulative_months: number;
  streak_months: number | null;
  duration_months: number;
}

interface SubscriptionGiftEvent {
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  total: number;
  tier: string;
  cumulative_total: number | null;
  is_anonymous: boolean;
}

interface CheerEvent {
  is_anonymous: boolean;
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  message: string;
  bits: number;
}

interface RaidEvent {
  from_broadcaster_user_id: string;
  from_broadcaster_user_login: string;
  from_broadcaster_user_name: string;
  to_broadcaster_user_id: string;
  to_broadcaster_user_login: string;
  to_broadcaster_user_name: string;
  viewers: number;
}
