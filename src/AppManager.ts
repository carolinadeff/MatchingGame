import { MessageId, StartOption } from './enums';
import { logger } from './logger';
import type {
  ClientServerMsg,
  GameDetails,
  GameId,
  PlayerId,
  PlayerName,
  ServerClientMsg,
  TCard,
  WaitingGame,
} from './types';

interface Observer {
  onWelcome: Function;
  onStartGame: Function;
  onPlayed: Function;
  onChangePlayer: Function;
}

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

  public sendStartGame(args: [StartOption, PlayerName, GameId?]) {
    this.send({ messageId: MessageId.NEW_GAME, args });
  }

  public sendPlayed = (args: [TCard]) => {
    this.send({ messageId: MessageId.PLAYED, args });
  };

  public sendChangePlayer = () => {
    this.send({ messageId: MessageId.CHANGE_PLAYER });
  };

  public sendFinish = () => {
    this.send({ messageId: MessageId.FINISH_GAME });
  };

  send(msg: ClientServerMsg) {
    this.ws?.send(JSON.stringify(msg));
  }
}

export default new AppManager();
