function Card({
  src,
  click,
  flipped,
  small,
}: {
  src: string;
  click?: (event: MouseEvent) => void;
  flipped: boolean;
  small?: boolean;
}) {
  const cardBack = `https://media.istockphoto.com/id/594473426/pt/vetorial/outline-mandala-for-coloring-book-ethnic-round-elements.jpg?s=612x612&w=0&k=20&c=5fY_WFGQML547F8cs1krLjB5BkcFZmMJHewI0mcibns=`;

  const cardSize = small ? "w-20 h-20 p-3" : "w-50 h-50 p-6";

  return (
    <div
      className={`${cardSize} rounded-lg shadow-lg border-1 border-gray-200 bg-white`}
      onClick={(event) => click?.(event as unknown as MouseEvent)}
    >
      {flipped ? (
        <img
          src={src}
          className="w-full h-full object-cover object-top rounded-md"
        />
      ) : (
        <img
          src={cardBack}
          className="w-full h-full object-cover object-top rounded-md"
        />
      )}
    </div>
  );
}

export default Card;
