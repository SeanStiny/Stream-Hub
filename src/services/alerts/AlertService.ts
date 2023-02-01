import { Server } from 'socket.io';

export class AlertService {
  constructor(private io: Server) {}

  triggerCheer(alert: CheerAlert) {
    this.io.emit('cheer', alert);
  }

  triggerFollow(alert: FollowAlert) {
    this.io.emit('follow', alert);
  }

  triggerRaid(alert: RaidAlert) {
    this.io.emit('raid', alert);
  }

  triggerSubGift(alert: SubGiftAlert) {
    this.io.emit('gift', alert);
  }

  triggerSub(alert: SubAlert) {
    this.io.emit('sub', alert);
  }
}

export interface CheerAlert {
  displayName: string;
  amount: number;
  isAnonymous: boolean;
  message: string;
}

export interface FollowAlert {
  displayName: string;
}

export interface RaidAlert {
  displayName: string;
  viewers: number;
}

export interface SubGiftAlert {
  displayName: string;
  total: number;
}

export interface SubAlert {
  displayName: string;
  months: number;
  message: string;
}
