import type { TCard } from "@/types";

export function getCards(numberOfCards: number, order: number[]) {
  const cards = [] as { src: string; pairId: number }[];
  const imgs = [
    `https://www.correiodopovo.com.br/image/contentid/policy:1.969333:1679268009/image.jpg?f=2x1&q=0.9&w=768&$p$f$q$w=e685284`,
    `https://upload.wikimedia.org/wikipedia/pt/0/00/TheClashLondonCallingalbumcover.jpg`,
    `https://external-preview.redd.it/RV7LohXcOfcPCBeFoWT9jptHf_zS_VD7xWKvcqsHNao.jpg?auto=webp&s=5421c0340ee5237160f0bc78df6c63163b7d7f1b`,
    `https://cdn-images.dzcdn.net/images/artist/2ceac184bc846327f60c5b0d4247cc7a/1900x1900-000000-81-0-0.jpg`,
    `https://trippystore.com/cdn/shop/products/posters-joy-division-unknown-pleasures-poster-101455-29801701474357.jpg?v=1624320094`,
    `https://upload.wikimedia.org/wikipedia/pt/e/e9/The_Specials_album.jpg`,
    `https://is1-ssl.mzstatic.com/image/thumb/Music/be/74/45/mzi.ldxxvbsd.jpg/1200x630bb.jpg`,
    `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKJqS-jnvKi_YsR7DDVfT-Yj9LuVipWBG5TQ&s`,
    `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb70SRQyGtJbdjUEis1GEyqCYdJ_tK0eMBew&s`,
    `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJlN5jnajcGpoTTLyvN2koSfHSQtqU4HIDPw&s`,
  ].slice(0, numberOfCards / 2);

  imgs.forEach((url, index) => {
    const item = {
      src: url,
      pairId: index,
    };
    cards.push(item, item);
  });

  const scrambledCards = [] as TCard[];

  order.forEach((orderEl, i) => {
    scrambledCards[orderEl] = {
      ...cards[i],
      key: i,
    };
  });

  return scrambledCards;
}
