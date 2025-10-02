import { Button, CircularProgress, TextField } from '@mui/material';
import type { GameId, PlayerName, WaitingGame } from './types';
import { useState } from 'react';
import { StartOption } from './enums';

function LandingPage({
  waitingGames,
  showGameOptions,
  onStartGame,
}: {
  waitingGames?: WaitingGame[];
  showGameOptions?: boolean;
  onStartGame: (args: [StartOption, PlayerName, GameId?]) => void;
}) {
  const [name, setName] = useState<string>('');

  return (
    <div className="rounded-lg shadow-lg border-1  border-gray-200 bg-white p-10 flex flex-col gap-10 items-stretch justify-between">
      <div className="text-left">
        <h3 className="text-lg font-bold">Let's play Memory</h3>
        <p>You can play by yourself, choose someone who's waiting for you, or wait for someone else.</p>
      </div>
      {showGameOptions ? (
        <>
          <div className="flex gap-2">
            <TextField
              id="outlined-basic"
              label="Your name here"
              variant="outlined"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <TextField
              id="outlined-basic"
              label="Number of cards"
              variant="outlined"
              disabled
              type="number"
              value={20}
            />
          </div>

          <Button
            variant="contained"
            disabled={name.length < 3}
            onClick={() => {
              onStartGame([StartOption.MULTI, name]);
            }}
          >
            Start new game and wait for my opponent
          </Button>
          <Button
            variant="contained"
            disabled={name.length < 3}
            onClick={() => {
              onStartGame([StartOption.SINGLE, name]);
            }}
          >
            Start new game all by myself
          </Button>
          {waitingGames?.map((game) => (
            <Button
              key={game.gameId}
              variant="outlined"
              disabled={name.length < 3}
              onClick={() => {
                onStartGame([StartOption.JOIN_GAME, name, game.gameId]);
              }}
            >{`Play with ${game.playerName}`}</Button>
          ))}
        </>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}

export default LandingPage;
