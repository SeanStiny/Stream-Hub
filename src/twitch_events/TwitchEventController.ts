import { createHmac, timingSafeEqual } from 'crypto';
import { Application, raw, Request, Response, Router } from 'express';
import { RouteController } from '../App';
import { logger } from '../logger';
import {
  CheerEvent,
  FollowEvent,
  RaidEvent,
  RedeemEvent,
  SubscriptionGiftEvent,
  SubscriptionMessageEvent,
  TwitchEventService,
} from './TwitchEventService';

// Notification request headers
const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP =
  'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE =
  'Twitch-Eventsub-Message-Signature'.toLowerCase();
const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();

// Notification message types
const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';
const MESSAGE_TYPE_NOTIFICATION = 'notification';
const MESSAGE_TYPE_REVOCATION = 'revocation';

// Prepend this string to the HMAC that's created from the message
const HMAC_PREFIX = 'sha256=';

export class TwitchEventController implements RouteController {
  private eventHandlers: { [type: string]: (event: unknown) => void };

  constructor(
    private path: string,
    private twitchEvents: TwitchEventService,
    private secret: string
  ) {
    this.eventHandlers = {};
    this.eventHandlers['channel.follow'] = this.followHandler;
    this.eventHandlers['channel.subscription.gift'] = this.giftHandler;
    this.eventHandlers['channel.subscription.message'] = this.resubHandler;
    this.eventHandlers['channel.cheer'] = this.cheerHandler;
    this.eventHandlers['channel.raid'] = this.raidHandler;
    this.eventHandlers['channel.channel_points_custom_reward_redemption.add'] =
      this.redeemHandler;
  }

  useRoutes(app: Application): void {
    const router = Router();

    router.use(
      raw({
        type: 'application/json',
      })
    );
    router.post('/callback/event', this.callbackEventHandler);

    app.use(this.path, router);
  }

  private followHandler = (event: unknown) => {
    this.twitchEvents.emitFollow(event as FollowEvent);
  };

  private giftHandler = (event: unknown) => {
    this.twitchEvents.emitSubGift(event as SubscriptionGiftEvent);
  };

  private resubHandler = (event: unknown) => {
    this.twitchEvents.emitSubMessage(event as SubscriptionMessageEvent);
  };

  private cheerHandler = (event: unknown) => {
    this.twitchEvents.emitCheer(event as CheerEvent);
  };

  private raidHandler = (event: unknown) => {
    this.twitchEvents.emitRaid(event as RaidEvent);
  };

  private redeemHandler = (event: unknown) => {
    this.twitchEvents.emitRedeem(event as RedeemEvent);
  };

  private callbackEventHandler = (req: Request, res: Response) => {
    const message = getHmacMessage(req);
    const hmac = HMAC_PREFIX + getHmac(this.secret, message); // Signature to compare

    if (
      true ===
      verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE] as string)
    ) {
      logger.debug('Signatures match');

      // Get JSON object from body, so you can process the message.
      const notification = JSON.parse(req.body);

      if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
        const event = notification.event;

        const handler = this.eventHandlers[notification.subscription.type];
        if (handler) {
          handler(event);
        }

        logger.info(`Event type: ${notification.subscription.type}`);
        logger.info(JSON.stringify(notification.event, null, 4));

        res.sendStatus(204);
      } else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
        res.status(200).send(notification.challenge);
      } else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
        res.sendStatus(204);

        logger.warn(`${notification.subscription.type} notifications revoked!`);
        logger.warn(`reason: ${notification.subscription.status}`);
        logger.warn(
          `condition: ${JSON.stringify(
            notification.subscription.condition,
            null,
            4
          )}`
        );
      } else {
        res.sendStatus(204);
        logger.warn(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
      }
    } else {
      logger.error('403'); // Signatures didn't match.
      res.sendStatus(403);
    }
  };
}

// Build the message used to get the HMAC.
function getHmacMessage(request: Request) {
  return (
    (request.headers[TWITCH_MESSAGE_ID] as string) +
    (request.headers[TWITCH_MESSAGE_TIMESTAMP] as string) +
    request.body
  );
}

// Get the HMAC.
function getHmac(secret: string, message: string) {
  return createHmac('sha256', secret).update(message).digest('hex');
}

// Verify whether your signature matches Twitch's signature.
function verifyMessage(hmac: string, verifySignature: string) {
  logger.debug(`hmac: ${hmac}`);
  logger.debug(`verifySig: ${verifySignature}`);
  return timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}
