import axios from 'axios';

export class TriviaService {
  private currentQuestion: TriviaQuestion | null;
  private brainCells: { [user: string]: number };

  constructor() {
    this.currentQuestion = null;
    this.brainCells = {};
  }

  async newQuestion(contestantName: string): Promise<TriviaQuestion> {
    const { data } = await axios.get('https://opentdb.com/api.php?amount=1');
    const questionData = data.results[0];

    const answers = [...questionData.incorrect_answers];
    const correctIndex = Math.floor(Math.random() * answers.length + 1);
    answers.splice(correctIndex, 0, questionData.correct_answer);

    this.currentQuestion = {
      category: questionData.category.replace('Entertainment: ', ''),
      difficulty: questionData.difficulty,
      question: decodeEntities(questionData.question),
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
    if (!this.brainCells[user]) {
      this.brainCells[user] = brainCells;
    } else {
      this.brainCells[user] += brainCells;
    }
  }

  queryCurrentQuestion() {
    return this.currentQuestion;
  }

  queryBrainCells(user: string) {
    return this.brainCells[user];
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

function decodeEntities(encodedString: string) {
  const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
  const translate = {
    nbsp: ' ',
    amp: '&',
    quot: '"',
    lt: '<',
    gt: '>',
  };
  return encodedString
    .replace(
      translate_re,
      (match, entity: 'nbsp' | 'amp' | 'quot' | 'lt' | 'gt') => {
        if (translate[entity]) {
        }
        return translate[entity];
      }
    )
    .replace(/&#(\d+);/gi, function (match, numStr) {
      const num = parseInt(numStr, 10);
      return String.fromCharCode(num);
    });
}
