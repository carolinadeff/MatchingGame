import { useEffect } from 'react';
import Card from './Card';
import type { TCard, GameDetails, Timeout } from '@/types';
import { getCards } from '@/helpers/getCards';

function CardPanel({
  gameDetails,
  myPlayerId,
  onPlayed,
  onChangePlayer,
}: {
  gameDetails: GameDetails;
  myPlayerId: number;
  onPlayed: (card: TCard) => void;
  onChangePlayer: () => void;
}) {
  const shuffledCards = getCards(20, gameDetails.scrambleOrder!);

  let timer: Timeout;

  function flip(card: TCard) {
    if (!gameDetails.singlePlayer && gameDetails.currentPlayerId !== myPlayerId) {
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

  window.onclick = () => {
    handleFinishPlayerTurn();
    clearTimeout(timer);
  };

  useEffect(() => {
    timer = setTimeout(() => {
      handleFinishPlayerTurn();
    }, 3000);

    return () => clearTimeout(timer);
  }, [gameDetails.flippedCards]);

  const players = Array.from(gameDetails.players.values());

  const matchedCards = players.map((player) => player.matchedCards).flat();
  const validCards = shuffledCards.filter((card) => !matchedCards.some((matched) => matched.pairId === card.pairId));

  useEffect(() => {
    return () => {
      console.log(shuffledCards, matchedCards, validCards);
    };
  }, [validCards]);

  return (
    <>
      <div className="grid grid-cols-2 grid-rows-[30px_1fr]">
        <h4>{players[0].name}</h4>
        <div className="flex flex-wrap mb-10">
          {players[0].matchedCards.map((card, index) => (
            <div key={index} style={{ transform: `translateX(-${index * 50}px)` }}>
              <Card small flipped src={card.src} />
            </div>
          ))}
        </div>
        {players[1] && (
          <>
            <h4>{players[1].name}</h4>
            <div className="flex flex-wrap mb-10">
              {players[1].matchedCards.map((card, index) => (
                <div key={index} style={{ transform: `translateX(-${index * 50}px)` }}>
                  <Card small flipped src={card.src} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className={`flex flex-wrap gap-6`}>
        {validCards.map((card) => (
          <Card
            key={card.key}
            src={card.src}
            click={() => flip(card)}
            flipped={gameDetails.flippedCards.some((cardEl) => cardEl?.key === card?.key)}
          />
        ))}
      </div>
    </>
  );
}

export default CardPanel;
