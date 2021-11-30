import { Card } from "./card.js";
import { Deck } from "./Deck.js";
import { Player } from "./Player.js";
import { GameDecision } from "./Player.js";
export class Table
{
    /*
       String gameType : {"blackjack"}から選択。
       Array betDenominations : プレイヤーが選択できるベットの単位。デフォルトは[5,20,50,100]。
       return Table : ゲームフェーズ、デッキ、プレイヤーが初期化されたテーブル
    */
   public gameType :string;
   public userName :string;
   public userType :string;
   public betDenominations :number[];
   public deck :Deck;
   public players :Player[];
   public house :Player;
   public gamePhase :string;
   public resultsLog :string[];
   public roundCounter :number;
   public turnCounter :number;

    constructor(gameType,userName,userType, betDenominations = [5,20,50,100])
    {
        // ゲームタイプを表します。
        this.userName = userName;
        this.userType = userType;
        this.gameType = gameType;
        
        // プレイヤーが選択できるベットの単位。
        this.betDenominations = betDenominations;
        
        // テーブルのカードのデッキ
        this.deck = new Deck(this.gameType);
        
        // プレイしているゲームに応じて、プレイヤー、gamePhases、ハウスの表現が異なるかもしれません。
        // 今回はとりあえず3人のAIプレイヤーとハウス、「betting」フェースの始まりにコミットしましょう。
        this.players = []
        
        // プレイヤーをここで初期化してください。
        this.players.push(new Player("Bot1", "ai", this.gameType));
        this.players.push(new Player(this.userName, this.userType, this.gameType));
        this.players.push(new Player("Bot2", "ai", this.gameType));
        this.house = new Player('house', 'house', this.gameType);
        this.gamePhase = 'betting';

        // これは各ラウンドの結果をログに記録するための文字列の配列です。
        this.resultsLog = []

        this.roundCounter = 0;
        this.turnCounter = 0;
        

    }
    /*
        Player player : テーブルは、Player.promptPlayer()を使用してGameDecisionを取得し、GameDecisionとgameTypeに応じてPlayerの状態を更新します。
        return Null : このメソッドは、プレーヤの状態を更新するだけです。

        EX:
        プレイヤーが「ヒット」し、手札が21以上の場合、gameStatusを「バスト」に設定し、チップからベットを引きます。
    */
   
    evaluateMove(player :Player, gameDecision) :void{
        //TODO: ここから挙動をコードしてください。
            player.bet = gameDecision["amount"];

            player.gameStatus = gameDecision["action"];
            
            // if(this.gamePhase == "betting")player.chips -=player.bet;
            if(player.getHandScore() > 21){
                player.gameStatus = "bust";
                player.chips -= player.bet;
                player.winAmount -= player.bet;
                return;
            } 
            else if(player.isBlackJack())  player.gameStatus = "BlackJack";
            else if(gameDecision["action"] == "hit"){
            player.gameStatus = "hit";
            player.hand.push(this.deck.drawOne());
            // if(player.getHandScore() > 21){
            //     player.gameStatus = "bust";
            //     player.chips -= player.bet;
            //     player.winAmount -= player.bet;
            //     }
            }else if(gameDecision["action"] == "stand"){
                player.gameStatus = "stand";
            }else if(gameDecision["action"] == "surrender"){
                player.gameStatus = "surrender";
                let lostChips :number = Math.floor(player.bet / 2);
                player.chips -= lostChips;
                player.winAmount -= lostChips; 
            }else if(gameDecision["action"] == "double"){
                player.gameStatus = "double";
                player.bet *= 2;
                player.hand.push(this.deck.drawOne());
                // if(player.getHandScore() > 21){
                //     player.gameStatus = "bust";
                //     player.chips -= player.bet;
                //     player.winAmount -= player.bet;
                //     }else{
                //         player.gameStatus = "doubleStand";
                //     }
            }else player.gameStatus = "bet";
            player.gameDecision["action"] = player.gameStatus;
            
    }

    houseGetHand(){

        let houseHandeScore :number = this.house.getHandScore();
        
        this.house.hand.push(this.deck.drawOne());
        
        this.house.gameStatus = houseHandeScore > 21 ? "bust" : this.house.isBlackJack() ? "blackjack" : "hit";
    }

    /*
       return String : 新しいターンが始まる直前の全プレイヤーの状態を表す文字列。
        NOTE: このメソッドの出力は、各ラウンドの終了時にテーブルのresultsLogメンバを更新するために使用されます。
    */
    blackjackEvaluateAndGetRoundResults(){
        //TODO: ここから挙動をコードしてください。

        // 全てのプレイヤーの行動が終了したのでハウスも17になるまでカードを引く
        // while(this.house.getHandScore() < 17) this.house.hand.push(this.deck.drawOne());
        let houseHandeScore :number = this.house.getHandScore();
        this.house.gameStatus = houseHandeScore > 21 ? "bust" : "stand";

        this.resultsLog.push(`Round: ${this.roundCounter}`);
        this.resultsLog.push(`<li>name : ${this.house.name}, score ${this.house.getHandScore()}</li>`);
        let playerResult = "";
        let result :string = "";
        for(let player of this.players){
            if(player.gameStatus === 'surrender'){
                result = "surrender";
            }else if(player.gameStatus === 'broken'){
                result = "lose";
            
                // ハウスがブラックジャックの場合、
                // プレイヤーがブラックジャックの場合、「プッシュ」になります。
                // プレイヤーがブラックジャックではない場合
                // - プレイヤーがダブルの場合、ベット額の2倍を失います。
                // - プレイヤーがスタンドの場合、ベット額の1倍を失います。
            }else if(this.house.isBlackJack()){
                if(player.isBlackJack()){
                    result = "push";
                    player.winAmount = 0;
                }else{
                    result = "lose";
                    player.winAmount -= player.gameStatus == "double" ?  player.bet * 2 : player.bet;
                }
            // ハウスがバスト、またはプレイヤーの手札がディーラの手札よりきい場合
            // プレイヤーがブラックジャックの場合、ベット額の 1.5 倍を手れます。
            // プレイヤーがダブルの場合、ベット額の 2 倍を手に入れます。
            // プレイヤーがスタンドの場合、ベット額の 1 倍を手に入れます。
            }else if(this.house.gameStatus == "bust" || this.house.getHandScore() < player.getHandScore()){
                result = "win";
                player.winAmount +=player.isBlackJack() ? player.bet * 1.5 : player.gameStatus == "double" ? player.bet * 2 : player.bet; 
            // ハウスがバストしておらず、ハウスの手札がプレイヤーの手札より大きい場合
            // プレイヤーがダブルの場合、ベット額の 2 倍を失います。
            // プレイヤーがスタンドの場合、ベット額の 1 倍を失います。    
            }else if(player.gameStatus == "bust" || (this.house.gameStatus != "bust" && this.house.getHandScore() > player.getHandScore())){
                result = "lose";
                player.winAmount -= player.gameStatus == "double" ? player.bet * 2 : player.bet; 
            }else{
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
    blackjackAssignPlayerHands(){
        //TODO: ここから挙動をコードしてください。
        for(let player of this.players){
            if(player.gameStatus != "broken"){
                player.hand.push(this.deck.drawOne()); 
                player.hand.push(this.deck.drawOne()); 
            }
        }
        this.house.gameStatus = "waiting";
        this.house.hand.push(this.deck.drawOne());
    }

    /*
       return null : テーブル内のすべてのプレイヤーの状態を更新し、手札を空の配列に、ベットを0に設定します。
    */
    blackjackClearPlayerHandsAndBets(){
        //TODO: ここから挙動をコードしてください。
        this.house.gameStatus = "waiting";
        this.house.hand = [];
        this.players.forEach(player =>{
            player.gameStatus = player.chips > 0 ? 'betting' : 'gameOver';
            player.hand = [];
            player.bet = 0;
            player.winAmount = 0;
        })
    }
    
    /*
       return Player : 現在のプレイヤー
    */
    getTurnPlayer(){
        //TODO: ここから挙動をコードしてください。
        return this.players[this.turnCounter % this.players.length];
    }

    /*
       Number userData : テーブルモデルの外部から渡されるデータです。 
       return Null : このメソッドはテーブルの状態を更新するだけで、値を返しません。
    */
    haveTurn(userData ?){
        //TODO: ここから挙動をコードしてください。
        const player = this.getTurnPlayer();
            // AIのbetを決めるためにpromptPlayer()を呼び出す
        if(this.gamePhase == "betting"){
            if(this.onFirstPlayer())this.players.forEach(player => player.bet = 0);
        if(userData == undefined) userData = player.promptPlayer();
 
            this.evaluateMove(player, userData);
            if(this.onLastPlayer()){
                this.blackjackAssignPlayerHands();
                this.gamePhase = "acting";
            }
        }else if(this.gamePhase == "acting"){
            
            if(player.gameDecision["betAmount"] > 0){
                userData = player.promptPlayer(); 
                this.evaluateMove(player, userData);
            } 
            if(this.allPlayerActionsResolved()) this.gamePhase = "evaluatingWinner";

     
        }else if(this.gamePhase === "evaluatingWinner"){
           this.blackjackEvaluateAndGetRoundResults();
            this.gamePhase = "roundOver";

        } else {
            console.log("haveTurn内のerror")
        }
        
        this.turnCounter++;
    }

    /*
        return Boolean : テーブルがプレイヤー配列の最初のプレイヤーにフォーカスされている場合はtrue、そうでない場合はfalseを返します。
    */
    onFirstPlayer() :boolean{
        //TODO: ここから挙動をコードしてください。
      
        return this.turnCounter % this.players.length == 0;
    }

    /*
        return Boolean : テーブルがプレイヤー配列の最後のプレイヤーにフォーカスされている場合はtrue、そうでない場合はfalseを返します。
    */
    onLastPlayer() :boolean{
        //TODO: ここから挙動をコードしてください。
        return this.turnCounter % this.players.length == this.players.length-1;
    }
    
    /*
        全てのプレイヤーがセット{'broken', 'bust', 'stand', 'surrender'}のgameStatusを持っていればtrueを返し、持っていなければfalseを返します。
    */
    allPlayerActionsResolved() :boolean{
        //TODO: ここから挙動をコードしてください。
        let actions  :any= ["broken", "bust", "stand","double", "surrender","BlackJack"];
        for(let player of this.players){
           if(!actions.includes(player.gameStatus)) return false;
        }
        return true;
    }
}
