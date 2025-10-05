import { GameState, type MessageId, type StartOption } from './enums';

export type WaitingGame = { playerName: string; gameId: string };
export type Timeout = ReturnType<typeof setTimeout>;
export type TCard = { src: string; pairId: number; key: number; matched?: boolean };
export type Count = number;
export type Player = { id: PlayerId; name: string; matchedCards: TCard[] };

export interface GameDetails {
  id: Count;
  players: Array<Player>;
  state: GameState;
  flippedCards: TCard[];
  currentPlayerId?: PlayerId;
  numberOfCards?: number;
  scrambleOrder?: number[];
  singlePlayer?: boolean;
  winnerPlayerId?: PlayerId;
}

export type PlayerId = 1 | 2;
export type PlayerName = string;
export type GameId = string;

export interface Observer {
  onWelcome: Function;
  onStartGame: Function;
  onPlayed: Function;
  onChangePlayer: Function;
  onFinishGame: Function;
}

export type ClientServerMsg =
  | { messageId: MessageId.NEW_GAME; args: [StartOption, PlayerName, GameId?] }
  | { messageId: MessageId.PLAYED; args: [TCard] }
  | { messageId: MessageId.CHANGE_PLAYER }
  | { messageId: MessageId.FINISH_GAME; args: [PlayerId] }
  | { messageId: MessageId.RESTART };

export type ServerClientMsg =
  | { messageId: MessageId.WELCOME; currentGames: WaitingGame[] }
  | { messageId: MessageId.NEW_GAME; myPlayerId: PlayerId; gameDetails: GameDetails }
  | { messageId: MessageId.PLAYED; card: TCard }
  | { messageId: MessageId.CHANGE_PLAYER; playerId: PlayerId }
  | { messageId: MessageId.FINISH_GAME; gameState: GameState.ABORTED | GameState.FINISHED; winnerPlayerId: PlayerId };
