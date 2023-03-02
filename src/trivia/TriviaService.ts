import axios from 'axios';
import { decode } from 'html-entities';

export class TriviaService {
  private currentQuestion: TriviaQuestion | null;
  private brainCells: { [user: string]: number };

  constructor() {
    this.currentQuestion = null;
    this.brainCells = {
      jadessal: 5,
      zer0_paranoia: 15,
      moose08: 80,
      kescos: 85,
      kaelygod: 185,
      jaycam394: 795,
      LuxManning: 285,
      maxcooper23: 15,
      cookeegs: 40,
      kebab496: 120,
      phantasnick: 60,
      mike4michael: 70,
      randomiies: 115,
      trig_fish: 70,
      jakegroot0: 20,
      itmightbevid: 275,
      ka1ametafan: 20,
      santhumx: 95,
      yorikato: 40,
      heathersulu: 10,
      cake4caker: 20,
      adamxl414: 5,
      adorableweaponofdoom: 20,
      haplesshero: 10,
      slepp_slepp: 20,
      gingeralesy: 45,
      seanstiny: 15,
      btwblue: 235,
      enkipnw: 5,
      schwappyo: 15,
      poofapocalypse: 20,
      heliokto: 30,
      flare_star_: 10,
    };
  }

  async newQuestion(contestantName: string): Promise<TriviaQuestion> {
    const { data } = await axios.get('https://opentdb.com/api.php?amount=1');
    const questionData = data.results[0];

    let correctIndex;
    const answers = [...questionData.incorrect_answers];
    if (answers.length === 1) {
      if (answers[0] === 'True') {
        answers.push('False');
        correctIndex = 1;
      } else {
        answers.unshift('True');
        correctIndex = 0;
      }
    } else {
      correctIndex = Math.floor(Math.random() * answers.length);
      answers.splice(correctIndex, 0, questionData.correct_answer);
    }

    this.currentQuestion = {
      category: questionData.category.replace('Entertainment: ', ''),
      difficulty: questionData.difficulty,
      question: decode(questionData.question),
      contestant: contestantName,
      answers,
      correctIndex,
    };
    return { ...this.currentQuestion };
  }

  removeQuestion() {
    this.currentQuestion = null;
  }

  rewardUser(user: string, brainCells: number) {
    if (!this.brainCells[user.toLowerCase()]) {
      this.brainCells[user.toLowerCase()] = brainCells;
    } else {
      this.brainCells[user.toLowerCase()] += brainCells;
    }
  }

  queryCurrentQuestion() {
    return this.currentQuestion;
  }

  queryBrainCells(user?: string) {
    if (user) return this.brainCells[user.toLowerCase()];
    return { ...this.brainCells };
  }
}

interface TriviaQuestion {
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  answers: string[];
  contestant: string;
  correctIndex: number;
}
