import { ServiceEventListener } from '../App';
import { ChatService } from '../chat/ChatService';
import { TwitchEventService } from '../twitch_events/TwitchEventService';
import { TriviaService } from './TriviaService';

const rewards = {
  easy: 5,
  medium: 10,
  hard: 20,
};
const TIME_LIMIT = 12 * 1000;
const COMMAND_COOLDOWN = 5000;

export class TriviaListener implements ServiceEventListener {
  private commandLastUsed: number;

  constructor(
    private trivia: TriviaService,
    private twitchEvents: TwitchEventService,
    private chat: ChatService
  ) {
    this.commandLastUsed = 0;
  }

  listen() {
    this.twitchEvents.onRedeem(async (event) => {
      if (event.reward.title.toLowerCase() === 'trivia') {
        const question = await this.trivia.newQuestion(event.user_name);
        let answerString = '';
        question.answers.forEach((answer, index) => {
          answerString += ` - (${index + 1}): ${answer}`;
        });
        this.chat.say(
          `@${event.user_name} [${question.category}] [Reward: ${
            rewards[question.difficulty]
          } brain cells] ${question.question}${answerString}`
        );

        setTimeout(() => {
          if (this.trivia.queryCurrentQuestion()) {
            this.trivia.removeQuestion();
            this.chat.say(
              `@${event.user_name} Time's up! The answer was (${
                question.correctIndex + 1
              }): ${question.answers[question.correctIndex]}`
            );
          }
        }, TIME_LIMIT);
      }
    });

    this.chat.onMessage((event) => {
      const command = event.message.split(' ')[0];
      if (
        command === '!trivia' &&
        Date.now() - this.commandLastUsed >= COMMAND_COOLDOWN
      ) {
        const brainCells = this.trivia.queryBrainCells(event.displayName) || 0;
        this.chat.say(
          `@${event.displayName} You have ${brainCells} brain cells. Earn more by redeeming trivia with channel points!`
        );
        this.commandLastUsed = Date.now();
      }
      const question = this.trivia.queryCurrentQuestion();
      if (question && question.contestant === event.displayName) {
        if (
          command === '1' ||
          command === '2' ||
          command === '3' ||
          command === '4'
        ) {
          const answerIndex = parseInt(command) - 1;
          if (answerIndex === question.correctIndex) {
            this.trivia.rewardUser(
              event.displayName,
              rewards[question.difficulty]
            );
            this.chat.say(
              `@${
                event.displayName
              } Correct! You now have ${this.trivia.queryBrainCells(
                event.displayName
              )} brain cells.`
            );
          } else {
            this.chat.say(
              `@${event.displayName} Wrong! The correct answer was (${
                question.correctIndex + 1
              }): ${question.answers[question.correctIndex]}`
            );
          }
          this.trivia.removeQuestion();
        }
      }
    });
  }
}
