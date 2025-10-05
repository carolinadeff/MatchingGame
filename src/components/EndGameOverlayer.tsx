import { GameState } from '@/enums';
import type { GameDetails } from '@/types';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

function EndGameOverlayer({ info, onNewGame }: { info: GameDetails; onNewGame: () => void }) {
  const finished = info.state == GameState.FINISHED;
  const aborted = info.state == GameState.ABORTED;
  const ended = finished || aborted;

  if (!ended) {
    return <></>;
  }

  const winner = info.players.find((p) => p.id === info.winnerPlayerId);
  useEffect(() => {
    if (ended) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [ended]);

  const content = (
    <div className="rounded-lg shadow-lg border-1  border-gray-200 bg-white p-10 flex flex-col gap-5 items-start justify-between">
      {finished ? (
        <>
          <h2>Game Over</h2>
          <p>Winner: {winner?.name}</p>
        </>
      ) : (
        <h2>Game Aborted</h2>
      )}
      <Button onClick={onNewGame}>New Game</Button>
    </div>
  );

  return createPortal(
    <div className="absolute z-10 top-0 left-0 w-full h-full bg-white/60 flex items-center justify-center">
      {content}
    </div>,
    document.body
  );
}

export default EndGameOverlayer;
