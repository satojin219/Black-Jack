export class Card
{
  // String suit : {"H", "D", "C", "S"}
  //      String rank : {"A", "2", "3", "4", "5", "6", "7", "8", "9", "10"
   suit: string;
   rank: string;
//   カードが裏面か裏面ならスコアは０になる。
   isFront: boolean;
   
    constructor(suit:string, rank:string)
    {
        this.suit = suit;
        this.rank = rank;
        this.isFront = false;
    }
    getRankNumber()
    {   
        if(!this.isFront)return 0;
        if(this.rank == "J" || this.rank =="Q" || this.rank =="K")return 10;
        else if(this.rank == "A")return 11;
        else return Number(this.rank);
    }
    reverseCard(){
        this.isFront = true;
    }
}