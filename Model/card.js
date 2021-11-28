export class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
        // this.isFront = false;
    }
    getRankNumber() {
        // if(!this.isFront)return 0;
        if (this.rank == "J" || this.rank == "Q" || this.rank == "K")
            return 10;
        else if (this.rank == "A")
            return 11;
        else
            return Number(this.rank);
    }
}
