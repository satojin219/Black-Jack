export class Player {
    constructor(name, type, gameType, chips = 400) {
        // プレイヤーの名前
        this.name = name;
        // プレイヤーのタイプ
        this.type = type;
        // 現在のゲームタイプ
        this.gameType = gameType;
        // プレイヤーの手札
        this.hand = [];
        // プレイヤーが所持しているチップ。
        this.chips = chips;
        // 現在のラウンドでのベットしているチップ
        this.bet = 0;
        // 勝利金額。正の数にも負の数にもなります。
        this.winAmount = 0;
        // プレイヤーのゲームの状態やアクションを表します。
        // ブラックジャックの場合、最初の状態は「betting」です。
        this.gameStatus = 'betting';
        this.gameDecision = { action: undefined, betAmount: 0 };
    }
    /*
       ?Number userData : モデル外から渡されるパラメータ。nullになることもあります。
       return GameDecision : 状態を考慮した上で、プレイヤーが行った決定。

        このメソッドは、どのようなベットやアクションを取るべきかというプレイヤーの決定を取得します。プレイヤーのタイプ、ハンド、チップの状態を読み取り、GameDecisionを返します。パラメータにuserData使うことによって、プレイヤーが「user」の場合、このメソッドにユーザーの情報を渡すことができますし、プレイヤーが 「ai」の場合、 userDataがデフォルトとしてnullを使います。
    */
    static getRandomInteger(max, min) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    promptPlayer(userData) {
        //TODO: ここから挙動をコードしてください。
        let action;
        let betAmount;
        if (this.type == "user") {
            action = userData["action"];
            betAmount = userData["bet"];
        }
        else {
            // AIの場合
            if (this.gameStatus == "betting") {
                betAmount = this.decideBetAmount();
                this.gameDecision["betAmount"] = betAmount;
            }
            else if (this.gameDecision["betAmount"] > 0) {
                action = this.decideAction();
                this.gameDecision["action"] = action;
            }
        }
        return new GameDecision(this.gameDecision["action"], this.gameDecision["betAmount"]);
    }
    // return string action
    decideAction() {
        let action;
        if (this.isBlackJack()) {
            action = "blackjack";
        }
        else if (this.getHandScore() <= 17) {
            let actions = ["hit"];
            if (this.chips > this.bet * 2)
                actions = ["hit", "double"];
            let index = Player.getRandomInteger(actions.length, 0);
            action = actions[index];
        }
        else {
            action = "stand";
        }
        return action;
    }
    //  return Number 賭ける額
    // ５～自分が持ってるチップの数でランダムな数字を取得し、100,50,20,5の順で割っていき、余情を賭ける枚数にし、合計値をbetとする。
    decideBetAmount() {
        const betDenominations = [5, 20, 50, 100];
        let betamount = Player.getRandomInteger(this.chips, 5);
        // 残りのチップがすくない時は手持ちの半分のチップを最大値としてgetRandomIntegerを呼び出す
        if (this.chips <= 200)
            betamount = Player.getRandomInteger(Math.floor(this.chips / 2), 5);
        let chip100Num = Math.floor(betamount / betDenominations[3]);
        betamount = betamount % betDenominations[3];
        let chip50Num = Math.floor(betamount / betDenominations[2]);
        betamount = betamount % betDenominations[2];
        let chip20Num = Math.floor(betamount / betDenominations[1]);
        betamount = betamount % betDenominations[1];
        let chip5Num = betamount % betDenominations[0] ? betamount % betDenominations[0] : 0;
        this.gameDecision["betAmount"] = (betDenominations[0] * chip5Num) + (betDenominations[1] * chip20Num) + (betDenominations[2] * chip50Num) + (betDenominations[3] * chip100Num);
        return this.gameDecision["betAmount"];
    }
    /*
       return Number : 手札の合計

       合計が21を超える場合、手札の各エースについて、合計が21以下になるまで10を引きます。
    */
    getHandScore() {
        let score = 0;
        let aceCount = 0;
        //TODO: ここから挙動をコードしてください。
        for (let i = 0; i < this.hand.length; i++) {
            if (this.hand[i].rank == "A")
                aceCount++;
            score += this.hand[i].getRankNumber();
        }
        ;
        if (score >= 21 && aceCount >= 1) {
            while (score >= 21 || aceCount > 0) {
                score -= 10;
                aceCount--;
            }
        }
        return score;
    }
    isBlackJack() {
        return this.getHandScore() == 21 && this.hand.length == 2;
    }
}
class GameDecision {
    constructor(action, amount) {
        // アクション
        this.action = action;
        // プレイヤーが選択する数値
        this.amount = amount;
    }
}
