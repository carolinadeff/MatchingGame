import { useEffect, useState } from "react";
import Card from "./Card";

type Timeout = ReturnType<typeof setTimeout>;
type Card = { src: string; pairId: number; key: number };

function CardPanel({ cards }: { cards: Card[] }) {
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);

  const [matchedCards, setMatchedCards] = useState<Card[]>([]);

  function flip(event: MouseEvent, card: Card) {
    if (flippedCards.length < 2 && !flippedCards.includes(card)) {
      event.stopPropagation();

      setFlippedCards([...flippedCards, card]);
    }
  }

  let timer: Timeout;

  window.onclick = () => {
    setFlippedCards([]);
    clearTimeout(timer);
  };

  useEffect(() => {
    if (flippedCards.length !== 2) {
      return;
    }

    const [first, second] = flippedCards;

    if (first.pairId === second.pairId) {
      // Handle a match
      setMatchedCards([...matchedCards, first]);
    }

    //changeUser

    // Reset flipped cards after a short delay
    timer = setTimeout(() => {
      setFlippedCards([]);
    }, 3000);

    return () => clearTimeout(timer);
  }, [flippedCards]);

  return (
    <>
      <div className="flex flex-wrap mb-10">
        {matchedCards.map((card, index) => (
          <div
            key={index}
            style={{ transform: `translateX(-${index * 50}px)` }}
          >
            <Card small flipped src={card.src} />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-6">
        {cards.map(
          (card) =>
            !matchedCards.some((cardEl) => cardEl.pairId === card.pairId) && (
              <Card
                key={card.key}
                src={card.src}
                click={(event: MouseEvent) => flip(event, card)}
                flipped={flippedCards.some((cardEl) => cardEl.key === card.key)}
              />
            ),
        )}
      </div>
    </>
  );
}

export default CardPanel;
