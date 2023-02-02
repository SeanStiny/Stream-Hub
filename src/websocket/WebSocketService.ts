import { Server } from 'socket.io';

export class WebSocketService {
  constructor(private io: Server) {}

  emitCheer(data: CheerData) {
    this.io.emit('cheer', data);
  }

  emitFollow(data: FollowData) {
    this.io.emit('follow', data);
  }

  emitRaid(data: RaidData) {
    this.io.emit('raid', data);
  }

  emitGiftSub(data: SubGiftData) {
    this.io.emit('gift', data);
  }

  emitSub(data: SubData) {
    this.io.emit('sub', data);
  }
}

export interface CheerData {
  displayName: string;
  amount: number;
  isAnonymous: boolean;
  message: string;
}

export interface FollowData {
  displayName: string;
}

export interface RaidData {
  displayName: string;
  viewers: number;
}

export interface SubGiftData {
  displayName: string;
  total: number;
}

export interface SubData {
  displayName: string;
  months: number;
  message: string;
}
