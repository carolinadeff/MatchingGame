import { useEffect } from 'react';
import Card from './Card';
import type { TCard, GameDetails, Timeout, PlayerId } from '@/types';
import { getCards } from '@/helpers/getCards';
import PlayerScore from './PlayerScore';

function CardPanel({
  gameDetails,
  myPlayerId,
  onPlayed,
  onChangePlayer,
  onFinish,
}: {
  gameDetails: GameDetails;
  myPlayerId: number;
  onPlayed: (card: TCard) => void;
  onChangePlayer: () => void;
  onFinish: (playerId: PlayerId) => void;
}) {
  const shuffledCards = getCards(20, gameDetails.scrambleOrder!);

  let timer: Timeout;

  const iAmPlaying = gameDetails.currentPlayerId === myPlayerId;
  const players = Array.from(gameDetails.players.values());

  const matchedCards = players.map((player) => player.matchedCards).flat();
  const validCards = shuffledCards.map((card) => {
    card.matched = matchedCards.some((matched) => matched.pairId === card.pairId);
    return card;
  });

  useEffect(() => {
    if (matchedCards.length === gameDetails.numberOfCards! / 2 && iAmPlaying) {
      handleFinishGame();
    }
  }, [matchedCards]);

  useEffect(() => {
    timer = setTimeout(() => {
      handleFinishPlayerTurn();
    }, 3000);

    return () => clearTimeout(timer);
  }, [gameDetails.flippedCards]);

  function flip(card: TCard) {
    if (!gameDetails.singlePlayer && !iAmPlaying) {
      return;
    }

    const { currentPlayerId, flippedCards } = gameDetails;

    if (currentPlayerId !== myPlayerId) {
      return;
    }

    if (flippedCards.length === 0 || (flippedCards.length === 1 && !flippedCards.includes(card))) {
      onPlayed(card);
    }
  }

  function handleFinishPlayerTurn() {
    if (gameDetails.flippedCards.length === 2 && gameDetails.currentPlayerId === myPlayerId) {
      onChangePlayer();
    }
  }

  function handleFinishGame() {
    const [player1, player2] = players;
    if (!player2) {
      onFinish(player1.id);
      return;
    }
    const winnerPlayerId = player1.matchedCards.length > player2.matchedCards.length ? player1.id : player2.id;
    onFinish(winnerPlayerId);
  }

  window.onclick = () => {
    handleFinishPlayerTurn();
    clearTimeout(timer);
  };

  return (
    <div className="grid grid-cols-2 grid-rows-[fit-content_1fr] gap-[20px]">
      <PlayerScore
        player={players[0]}
        isPlaying={players[0].id === gameDetails.currentPlayerId}
        extraClass={gameDetails.singlePlayer ? 'col-span-full items-center' : 'items-end'}
        cardsExtraClass={gameDetails.singlePlayer ? `` : `-scale-x-100`}
      />
      {players[1] && (
        <PlayerScore
          player={players[1]}
          isPlaying={players[1].id === gameDetails.currentPlayerId}
          extraClass="items-start"
        />
      )}

      <div className={`flex flex-wrap gap-6 justify-center row-span-2 col-span-full`}>
        {validCards.map((card) => (
          <Card
            key={card.key}
            src={card.src}
            click={() => flip(card)}
            flipped={gameDetails.flippedCards.some((cardEl) => cardEl?.key === card?.key)}
            matched={card.matched}
            className={iAmPlaying ? '' : 'cursor-no-drop'}
          />
        ))}
      </div>
    </div>
  );
}

export default CardPanel;
