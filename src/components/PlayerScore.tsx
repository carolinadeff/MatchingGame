import type { Player } from '@/types';
import Card from './Card';

function PlayerScore({
  player,
  isPlaying,
  extraClass,
  cardsExtraClass,
}: {
  player: Player;
  isPlaying: boolean;
  extraClass?: string;
  cardsExtraClass?: string;
}) {
  return (
    <div className={`flex flex-col gap-[10px] ${extraClass}`}>
      <h4 className={`w-fit ${isPlaying ? 'font-bold' : 'opacity-50'}`}>{player.name}</h4>
      <div className={`flex ${cardsExtraClass ?? ''}`}>
        {player.matchedCards.map((card, index) => (
          <div key={index} style={{ transform: `translateX(-${index * 50}px)` }}>
            <Card small flipped src={card.src} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerScore;
