import { Application, RequestHandler, Router } from 'express';
import { RouteController } from '../App';
import { MarathonTimerService } from './MarathonTimerService';

export class MarathonTimerController implements RouteController {
  constructor(
    private path: string,
    private marathonTimer: MarathonTimerService
  ) {}

  useRoutes(app: Application) {
    const router = Router();

    router.get('/', this.queryTimerHandler);
    router.get('/new', this.newTimerHandler);
    router.get('/toggle', this.togglePauseHandler);
    router.get('/addtest', (req, res) => {
      this.marathonTimer.addTime(15 * 60 * 1000);
      res.send(this.marathonTimer.queryTimer());
    });

    app.use(this.path, router);
  }

  private queryTimerHandler: RequestHandler = (req, res) => {
    const timer = this.marathonTimer.queryTimer();
    res.send(timer);
  };

  private newTimerHandler: RequestHandler = (req, res) => {
    const hours = parseInt(req.query.hours as string);
    const minutes = parseInt(req.query.minutes as string);
    const seconds = parseInt(req.query.seconds as string);

    const timer = this.marathonTimer.newTimer(
      (hours * 60 * 60 + minutes * 60 + seconds) * 1000
    );
    res.send(timer);
  };

  private togglePauseHandler: RequestHandler = (req, res) => {
    const timer = this.marathonTimer.toggleTimerPause();
    res.send(timer);
  };
}
