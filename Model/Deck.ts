import { Card } from "./card.js";

export class Deck
{
    /*
       String gameType : ゲームタイプの指定。{'blackjack'}から選択。
    */
   gameType :string;
   cards: Card[];
    constructor(gameType )
    {
        // このデッキが扱うゲームタイプ
        this.gameType = gameType
        // カードの配列
        this.cards = [];

        this.resetDeck();
        

    }
    
    /*
       return null : このメソッドは、デッキの状態を更新します。

       カードがランダムな順番になるようにデッキをシャッフルします。
    */
    shuffle() :void{
        let deckSize :number= this.cards.length;
        for (let i = deckSize-1; i >= 0 ; i--) {
            // ランダムに得た数値をインデックスとし、two pointerで入れ替えます。
            let j :number= Math.floor(Math.random() * (i + 1));
            let temp :Card= this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    
    }

    /*
       String gameType : どのゲームにリセットするか
       return null : このメソッドは、デッキの状態を更新します。
    

    */
    resetDeck() :void{
        //TODO: ここから挙動をコードしてください。
        const suits :string[]= ["H", "D", "C", "S"];
        const ranks :string[]= ["A",  "Q", "K"];
        // "2", "3", "4", "5", "6", "7", "8", "9", "10","J"
        for(let i :number = 0; i < suits.length; i++){
          for(let j :number = 0; j < ranks.length; j++){
            this.cards.push(new Card(suits[i],ranks[j]));
          }
        }
        this.shuffle();
    }
    
    /*
       return Card : ポップされたカードを返します。
       カード配列から先頭のカード要素をポップして返します。
    */
    drawOne() :Card{
        return this.cards.pop();
    }
}
