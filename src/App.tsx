import './App.css';
import { useState } from 'react';
import LandingPage from './LandingPage';
import AppManager from './AppManager.ts';
import type { GameDetails, WaitingGame, TCard, PlayerName, GameId } from './types.ts';
import { GameState, StartOption } from './enums.ts';
import CardPanel from './components/CardPanel.tsx';

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
    onChangePlayer: (playerId: 1 | 2) => {
      if (info.singlePlayer) {
        return;
      }

      const [first, second] = info.flippedCards;
      const matched = first!.pairId === second!.pairId;

      if (matched) {
        const player = info.players.find((p) => p.id === info.currentPlayerId);
        player!.matchedCards.push(first!);
      }

      setInfo({ ...info, currentPlayerId: playerId, flippedCards: [] });
    },
  };

  AppManager.subscribe(observerCallbacks);

  function onStartGame(args: [StartOption, PlayerName, GameId?]) {
    AppManager.sendStartGame(args);
    setShowGameOptions(false);
  }

  function onChangePlayer() {
    AppManager.sendChangePlayer();
  }

  function onPlayed(card: TCard) {
    AppManager.sendPlayed([card]);
  }

  const started = info.state == GameState.PLAYING || info.state == GameState.FINISHED;

  return started ? (
    <CardPanel myPlayerId={myPlayerId} gameDetails={info} onChangePlayer={onChangePlayer} onPlayed={onPlayed} />
  ) : (
    <LandingPage waitingGames={waitingGames} showGameOptions={showGameOptions} onStartGame={onStartGame} />
  );
}

export default App;
