import { Server } from 'socket.io';

export class MarathonTimerService {
  private timer: MarathonTimer;

  constructor(private io: Server) {
    this.timer = {
      startTime: Date.now(),
      totalTime: 24 * 60 * 60 * 1000,
      isPaused: true,
    };

    io.on('connection', (socket) => {
      socket.on('query marathon.timer', () => {
        socket.emit('marathon.timer', this.timer);
      });
    });
  }

  newTimer(totalTime: number): MarathonTimer {
    const newTimer = {
      startTime: Date.now(),
      totalTime,
      isPaused: true,
    };
    this.timer = { ...newTimer };
    this.io.emit('marathon.timer', this.timer);
    return newTimer;
  }

  addTime(amount: number) {
    this.timer.totalTime += amount;
    this.io.emit('marathon.timer', this.timer);
    this.io.emit('marathon.delta', { time: amount });
  }

  toggleTimerPause(): MarathonTimer {
    const now = Date.now();
    if (this.timer.isPaused) {
      this.timer.isPaused = false;
      this.timer.startTime = now;
    } else {
      this.timer.isPaused = true;
      this.timer.totalTime -= now - this.timer.startTime;
    }
    this.io.emit('marathon.timer', this.timer);

    return { ...this.timer };
  }

  queryTimer(): MarathonTimer {
    return { ...this.timer };
  }
}

interface MarathonTimer {
  startTime: number;
  totalTime: number;
  isPaused: boolean;
}
