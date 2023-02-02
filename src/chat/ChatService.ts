import EventEmitter from 'events';
import { Client } from 'tmi.js';

export class ChatService {
  private events: EventEmitter;

  constructor(private tmi: Client, private channel: string) {
    this.events = new EventEmitter();

    tmi.on('chat', (channel, userstate, message, self) => {
      if (self) return;

      this.events.emit('message', {
        userId: parseInt(userstate['user-id'] || '0'),
        displayName: userstate['display-name'],
        message,
        isMod: userstate.mod,
        isSub: userstate.subscriber,
      });
    });
  }

  say(message: string) {
    this.tmi.say(this.channel, message);
  }

  onMessage(listener: (event: ChatMessageEvent) => void) {
    this.events.addListener('message', listener);
  }
}

export interface ChatMessageEvent {
  userId: number;
  displayName: string;
  message: string;
  isMod: boolean;
  isSub: boolean;
}
