import './App.css';
import { useState } from 'react';
import LandingPage from './LandingPage';
import AppManager from './AppManager.ts';
import type { GameDetails, WaitingGame, TCard, PlayerName, GameId, PlayerId } from './types.ts';
import { GameState, StartOption } from './enums.ts';
import CardPanel from './components/CardPanel.tsx';
import EndGameOverlayer from './components/EndGameOverlayer.tsx';

const gameDetailsInitial = {
  id: -1,
  players: [] as GameDetails['players'],
  state: GameState.UNINITIALIZED,
  flippedCards: [] as GameDetails['flippedCards'],
};

function App() {
  const [waitingGames, setWaitingGames] = useState<WaitingGame[]>([]);
  const [showGameOptions, setShowGameOptions] = useState(false);
  const [info, setInfo] = useState<GameDetails>(gameDetailsInitial);
  const [myPlayerId, setMyPlayerId] = useState(-1);

  const observerCallbacks = {
    onWelcome: (currentGames: WaitingGame[]) => {
      setInfo(gameDetailsInitial);
      setWaitingGames(currentGames);
      setShowGameOptions(true);
    },
    onStartGame: (playerId: 1 | 2, gameDetails: GameDetails) => {
      setMyPlayerId(playerId);
      gameDetails.flippedCards = [];
      setInfo(gameDetails);
    },
    onPlayed: (card: TCard) => {
      if (info.flippedCards.length < 2) {
        setInfo({ ...info, flippedCards: [...info.flippedCards, card] });
      }
    },
    onChangePlayer: (playerId?: 1 | 2) => {
      if (!info.singlePlayer && !playerId) {
        return;
      }

      const [first, second] = info.flippedCards;
      const matched = first!.pairId === second!.pairId;

      if (matched) {
        const player = info.players.find((p) => p.id === info.currentPlayerId);
        player!.matchedCards.push(first!);
      }

      const currentPlayerId = matched ? info.currentPlayerId : (playerId ?? info.currentPlayerId);

      setInfo({ ...info, currentPlayerId, flippedCards: [] });
    },
    onFinishGame: (gameState: GameState, winnerPlayerId: PlayerId) => {
      setInfo({ ...info, state: gameState, winnerPlayerId });
    },
  };

  AppManager.subscribe(observerCallbacks);

  function onStartGame(args: [StartOption, PlayerName, GameId?]) {
    AppManager.sendStartGame(args);
    setShowGameOptions(false);
  }

  function onChangePlayer() {
    AppManager.sendChangePlayer(!!info.singlePlayer);
  }

  function onPlayed(card: TCard) {
    AppManager.sendPlayed([card]);
  }

  function onFinish(winnerPlayerId: PlayerId) {
    AppManager.sendFinishGame(winnerPlayerId);
  }

  function onNewGame() {
    AppManager.sendRestart();
  }

  const started =
    info.state == GameState.PLAYING || info.state == GameState.FINISHED || info.state == GameState.ABORTED;

  return started ? (
    <>
      <CardPanel
        myPlayerId={myPlayerId}
        gameDetails={info}
        onChangePlayer={onChangePlayer}
        onPlayed={onPlayed}
        onFinish={onFinish}
      />
      <EndGameOverlayer info={info} onNewGame={onNewGame} />
    </>
  ) : (
    <LandingPage waitingGames={waitingGames} showGameOptions={showGameOptions} onStartGame={onStartGame} />
  );
}

export default App;
