class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }
    getRankNumber() {
        if (this.rank == "J" || this.rank == "Q" || this.rank == "K")
            return 10;
        else if (this.rank == "A")
            return 11;
        else
            return Number(this.rank);
    }
}
class Deck {
    constructor(gameType) {
        // このデッキが扱うゲームタイプ
        this.gameType = gameType;
        // カードの配列
        this.cards = [];
        // ゲームタイプによって、カードを初期化してください。
        if (this.gameType == "blackjack") {
            this.resetDeck();
        }
    }
    /*
       return null : このメソッドは、デッキの状態を更新します。

       カードがランダムな順番になるようにデッキをシャッフルします。
    */
    shuffle() {
        let deckSize = this.cards.length;
        for (let i = deckSize - 1; i >= 0; i--) {
            // ランダムに得た数値をインデックスとし、two pointerで入れ替えます。
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }
    /*
       String gameType : どのゲームにリセットするか
       return null : このメソッドは、デッキの状態を更新します。
    

    */
    resetDeck() {
        //TODO: ここから挙動をコードしてください。
        const suits = ["H", "D", "C", "S"];
        const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < ranks.length; j++) {
                this.cards.push(new Card(suits[i], ranks[j]));
            }
        }
    }
    /*
       return Card : ポップされたカードを返します。
       カード配列から先頭のカード要素をポップして返します。
    */
    drawOne() {
        //TODO: code behavior here
        return this.cards.pop();
    }
}
class Player {
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
class Table {
    constructor(gameType, userName, userType, betDenominations = [5, 20, 50, 100]) {
        // ゲームタイプを表します。
        this.gameType = gameType;
        // プレイヤーが選択できるベットの単位。
        this.betDenominations = betDenominations;
        // テーブルのカードのデッキ
        this.deck = new Deck(this.gameType);
        // プレイしているゲームに応じて、プレイヤー、gamePhases、ハウスの表現が異なるかもしれません。
        // 今回はとりあえず3人のAIプレイヤーとハウス、「betting」フェースの始まりにコミットしましょう。
        this.players = [];
        // プレイヤーをここで初期化してください。
        this.players.push(new Player("AI1", "ai", this.gameType));
        this.players.push(new Player(userName, userType, this.gameType));
        this.players.push(new Player("AI2", "ai", this.gameType));
        this.house = new Player('house', 'house', this.gameType);
        this.gamePhase = 'betting';
        // これは各ラウンドの結果をログに記録するための文字列の配列です。
        this.resultsLog = [];
        this.roundCounter = 0;
        this.turnCounter = 0;
    }
    /*
        Player player : テーブルは、Player.promptPlayer()を使用してGameDecisionを取得し、GameDecisionとgameTypeに応じてPlayerの状態を更新します。
        return Null : このメソッドは、プレーヤの状態を更新するだけです。

        EX:
        プレイヤーが「ヒット」し、手札が21以上の場合、gameStatusを「バスト」に設定し、チップからベットを引きます。
    */
    evaluateMove(player, gameDecision) {
        //TODO: ここから挙動をコードしてください。
        player.bet = gameDecision["amount"];
        player.gameStatus = gameDecision["action"];
        if (gameDecision["action"] == "hit") {
            player.gameStatus = "hit";
            player.hand.push(this.deck.drawOne());
            if (player.getHandScore() > 21) {
                player.gameStatus = "bust";
                player.chips -= player.bet;
                player.winAmount -= player.bet;
            }
        }
        else if (gameDecision["action"] == "stand") {
            player.gameStatus = "stand";
        }
        else if (gameDecision["action"] == "surrender") {
            player.gameStatus = "surrender";
            let lostChips = Math.floor(player.bet / 2);
            player.chips -= lostChips;
            player.winAmount -= lostChips;
        }
        else if (gameDecision["action"] == "double") {
            player.gameStatus = "double";
            player.bet *= 2;
            player.hand.push(this.deck.drawOne());
            if (player.getHandScore() > 21) {
                player.gameStatus = "bust";
                player.chips -= player.bet;
                player.winAmount -= player.bet;
            }
        }
    }
    /*
       return String : 新しいターンが始まる直前の全プレイヤーの状態を表す文字列。
        NOTE: このメソッドの出力は、各ラウンドの終了時にテーブルのresultsLogメンバを更新するために使用されます。
    */
    blackjackEvaluateAndGetRoundResults() {
        //TODO: ここから挙動をコードしてください。
        // 全てのプレイヤーの行動が終了したのでハウスも17になるまでカードを引く
        while (this.house.getHandScore() < 17)
            this.house.hand.push(this.deck.drawOne());
        let houseHandeScore = this.house.getHandScore();
        this.house.gameStatus = houseHandeScore > 21 ? "bust" : "stand";
        this.resultsLog.push(`Round: ${this.roundCounter}`);
        this.resultsLog.push(`<li>name : ${this.house.name}, score ${this.house.getHandScore()}</li>`);
        let playerResult = "";
        let result = "";
        for (let player of this.players) {
            if (player.gameStatus === 'surrender') {
                result = "surrender";
            }
            else if (player.gameStatus === 'broken') {
                result = "lose";
                // ハウスがブラックジャックの場合、
                // プレイヤーがブラックジャックの場合、「プッシュ」になります。
                // プレイヤーがブラックジャックではない場合
                // - プレイヤーがダブルの場合、ベット額の2倍を失います。
                // - プレイヤーがスタンドの場合、ベット額の1倍を失います。
            }
            else if (this.house.isBlackJack()) {
                if (player.isBlackJack()) {
                    result = "push";
                    player.winAmount = 0;
                }
                else {
                    result = "lose";
                    player.winAmount -= player.gameStatus == "double" ? player.bet * 2 : player.bet;
                }
                // ハウスがバスト、またはプレイヤーの手札がディーラの手札よりきい場合
                // プレイヤーがブラックジャックの場合、ベット額の 1.5 倍を手れます。
                // プレイヤーがダブルの場合、ベット額の 2 倍を手に入れます。
                // プレイヤーがスタンドの場合、ベット額の 1 倍を手に入れます。
            }
            else if (this.house.gameStatus == "bust" || this.house.getHandScore() < player.getHandScore()) {
                result = "win";
                player.winAmount += player.isBlackJack() ? player.bet * 1.5 : player.gameStatus == "double" ? player.bet * 2 : player.bet;
                // ハウスがバストしておらず、ハウスの手札がプレイヤーの手札より大きい場合
                // プレイヤーがダブルの場合、ベット額の 2 倍を失います。
                // プレイヤーがスタンドの場合、ベット額の 1 倍を失います。    
            }
            else if (player.gameStatus == "bust" || (this.house.gameStatus != "bust" && this.house.getHandScore() > player.getHandScore())) {
                result = "lose";
                player.winAmount -= player.gameStatus == "double" ? player.bet * 2 : player.bet;
            }
            else {
                result = "push";
                player.winAmount = 0;
            }
            playerResult += `<li>name : ${player.name}, action : ${player.gameStatus}, ${result} : ${player.winAmount}, chips : ${player.chips}, bet ${player.bet},score ${player.getHandScore()}</li>`;
        }
        this.resultsLog.push(playerResult);
    }
    /*
       return null : デッキから2枚のカードを手札に加えることで、全プレイヤーの状態を更新します。
       NOTE: プレイヤーのタイプが「ハウス」の場合は、別の処理を行う必要があります。
    */
    blackjackAssignPlayerHands() {
        //TODO: ここから挙動をコードしてください。
        for (let player of this.players) {
            if (player.gameStatus != "broken") {
                player.hand.push(this.deck.drawOne());
                player.hand.push(this.deck.drawOne());
            }
        }
        this.house.hand.push(this.deck.drawOne());
    }
    /*
       return null : テーブル内のすべてのプレイヤーの状態を更新し、手札を空の配列に、ベットを0に設定します。
    */
    blackjackClearPlayerHandsAndBets() {
        //TODO: ここから挙動をコードしてください。
        this.house.gameStatus = "betting";
        this.house.hand = [];
        this.players.forEach(player => {
            player.gameStatus = player.chips > 0 ? 'betting' : 'gameOver';
            player.hand = [];
            player.bet = 0;
            player.winAmount = 0;
        });
    }
    /*
       return Player : 現在のプレイヤー
    */
    getTurnPlayer() {
        //TODO: ここから挙動をコードしてください。
        return this.players[this.turnCounter % this.players.length];
    }
    /*
       Number userData : テーブルモデルの外部から渡されるデータです。
       return Null : このメソッドはテーブルの状態を更新するだけで、値を返しません。
    */
    haveTurn(userData) {
        //TODO: ここから挙動をコードしてください。
        const player = this.getTurnPlayer();
        // AIのbetを決めるためにpromptPlayer()を呼び出す
        if (this.gamePhase == "betting") {
            if (this.onFirstPlayer())
                this.players.forEach(player => player.bet = 0);
            if (userData == undefined)
                userData = player.promptPlayer();
            console.log(userData);
            this.evaluateMove(player, userData);
            console.log(player);
            if (this.onLastPlayer()) {
                this.blackjackAssignPlayerHands();
                this.gamePhase = "acting";
            }
        }
        else if (this.gamePhase == "acting") {
            if (player.gameDecision["betAmount"] > 0) {
                userData = player.promptPlayer();
                console.log(userData);
                this.evaluateMove(player, userData);
                console.log(player);
            }
            if (this.allPlayerActionsResolved())
                this.gamePhase = "evaluatingWinner";
        }
        else if (this.gamePhase === "evaluatingWinner") {
            this.blackjackEvaluateAndGetRoundResults();
            this.gamePhase = "roundOver";
            console.log(player);
        }
        else {
            console.log("haveTurn内のerror");
        }
        this.turnCounter++;
    }
    /*
        return Boolean : テーブルがプレイヤー配列の最初のプレイヤーにフォーカスされている場合はtrue、そうでない場合はfalseを返します。
    */
    onFirstPlayer() {
        //TODO: ここから挙動をコードしてください。
        return this.turnCounter % this.players.length == 0;
    }
    /*
        return Boolean : テーブルがプレイヤー配列の最後のプレイヤーにフォーカスされている場合はtrue、そうでない場合はfalseを返します。
    */
    onLastPlayer() {
        //TODO: ここから挙動をコードしてください。
        return this.turnCounter % this.players.length == this.players.length - 1;
    }
    /*
        全てのプレイヤーがセット{'broken', 'bust', 'stand', 'surrender'}のgameStatusを持っていればtrueを返し、持っていなければfalseを返します。
    */
    allPlayerActionsResolved() {
        //TODO: ここから挙動をコードしてください。
        let actions = ["broken", "bust", "stand", "surrender", "blackjack"];
        for (let player of this.players) {
            if (!actions.includes(player.gameStatus))
                return false;
        }
        return true;
    }
}
const table = new Table("blackjack", "ai", "ai");
while (table.gamePhase != 'roundOver') {
    table.haveTurn();
    console.log(table.gamePhase);
}
// 初期状態では、ハウスと2人以上のA.Iプレーヤーが戦います。
console.log(table.resultsLog);
