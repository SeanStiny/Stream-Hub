import { Application, RequestHandler, Router } from 'express';
import { RouteController } from '../App';
import { TriviaService } from './TriviaService';

export class TriviaController implements RouteController {
  constructor(private path: string, private trivia: TriviaService) {}

  useRoutes(app: Application): void {
    const router = Router();

    router.get('/', this.queryBrainCells);

    app.use(this.path, router);
  }

  private queryBrainCells: RequestHandler = (req, res) => {
    if (req.query.user) {
      res.send(this.trivia.queryBrainCells(req.query.user as string));
    } else {
      res.send(this.trivia.queryBrainCells());
    }
  };
}
