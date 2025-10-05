import { GameState, MessageId, StartOption } from './enums';
import { logger } from './logger';
import type {
  ClientServerMsg,
  GameDetails,
  GameId,
  Observer,
  PlayerId,
  PlayerName,
  ServerClientMsg,
  TCard,
  WaitingGame,
} from './types';

class AppManager {
  ws?: WebSocket;
  observer?: Observer;

  public setWS(ws: WebSocket) {
    this.ws = ws;
    this.ws.onmessage = (event: MessageEvent) => this.handleMessage(event.data);
  }

  private handleMessage(data: string) {
    if (!this.observer) {
      logger.info('No observer set to handle messages.');
      return;
    }

    try {
      const message: ServerClientMsg = JSON.parse(data);
      switch (message.messageId) {
        case MessageId.WELCOME:
          this.handleMessageWelcome(message);
          break;
        case MessageId.NEW_GAME:
          this.handleMessageNewGame(message);
          break;
        case MessageId.PLAYED:
          this.handleMessagePlayed(message);
          break;
        case MessageId.CHANGE_PLAYER:
          this.handleMessageChangePlayer(message);
          break;
        case MessageId.FINISH_GAME:
          this.handleMessageFinishGame(message);
          break;
        default:
          throw new Error(`Unknown messageId`);
      }
    } catch (error) {
      logger.error(error, `Erro ao analisar a mensagem JSON: ${data}`);
    }
  }

  public subscribe(observer: Observer) {
    this.observer = observer;
  }

  private handleMessageWelcome({ currentGames }: { currentGames: WaitingGame[] }) {
    this.observer?.onWelcome(currentGames);
  }

  private handleMessageNewGame(message: { myPlayerId: 1 | 2; gameDetails: GameDetails }) {
    this.observer?.onStartGame(message.myPlayerId, message.gameDetails);
  }

  private handleMessagePlayed({ card }: { card: TCard }) {
    this.observer?.onPlayed(card);
  }

  private handleMessageChangePlayer(message: { playerId: PlayerId }) {
    this.observer?.onChangePlayer(message.playerId);
  }

  private handleMessageFinishGame(message: {
    gameState: GameState.ABORTED | GameState.FINISHED;
    winnerPlayerId: PlayerId;
  }) {
    this.observer?.onFinishGame(message.gameState, message.winnerPlayerId);
  }

  public sendStartGame(args: [StartOption, PlayerName, GameId?]) {
    this.send({ messageId: MessageId.NEW_GAME, args });
  }

  public sendPlayed = (args: [TCard]) => {
    this.send({ messageId: MessageId.PLAYED, args });
  };

  public sendChangePlayer = (singlePlayer: boolean) => {
    if (singlePlayer) {
      this.observer?.onChangePlayer();
    }

    this.send({ messageId: MessageId.CHANGE_PLAYER });
  };

  public sendFinishGame = (winnerPlayerId: PlayerId) => {
    this.send({ messageId: MessageId.FINISH_GAME, args: [winnerPlayerId] });
  };

  public sendRestart = () => {
    this.send({ messageId: MessageId.RESTART });
  };

  send(msg: ClientServerMsg) {
    this.ws?.send(JSON.stringify(msg));
  }
}

export default new AppManager();
