import { GameDecision } from '../Model/Player.js';
import { Table } from '../Model/Table.js';
import { View } from '../View/view.js';
export class Controller {
    constructor() {
        this.table = null;
        this.view = new View(this, this.table);
        this.view.renderStartPage();
    }
    startGame(gameType, userName) {
        if (userName == "")
            this.table = new Table(gameType, "Bot3", "ai");
        else
            this.table = new Table(gameType, userName, "user");
        this.view = new View(this, this.table);
        // bettingページへ移行する
        this.view.displayNone(View.config.initialForm);
        this.view.toggleFixed();
        this.view.renderBettingModal();
    }
    evaluteBet(userBet) {
        while (this.table.gamePhase != "acting") {
            if (this.table.getTurnPlayer().type == "user") {
                this.haveTurn(new GameDecision(null, userBet));
            }
            this.haveTurn();
        }
        // 全てのプレイヤーのbet終了後、actingページへ移行する
        this.view.displayNone(View.config.bettingModal);
        this.view.toggleFixed();
        this.view.renderActingPage();
        // for(let player of this.table.players){
        //   this.view.updateUserInfo(player);
        // }
        this.decidePlayerAction();
    }
    renderAIAction(player, action) {
        let userData;
        if (player.type == "user") {
            let userDecision = {
                "action": action,
                "bet": player.bet
            };
            userData = player.promptPlayer(userDecision);
        }
        else {
            userData = player.promptPlayer();
        }
        // this.view.updateUserInfo(player);   
        this.table.evaluateMove(player, userData);
        if (player.gameDecision["action"] == "hit") {
            this.view.addUnselctableBtn("surrender");
            this.view.addUnselctableBtn("double");
            this.view.updateUserInfo(player);
            this.view.addCard(player);
            setTimeout(() => {
                return this.renderAIAction(player);
            }, 1000);
        }
        else if (player.gameDecision["action"] == "double") {
            this.view.updateUserInfo(player);
            this.view.addCard(player);
            setTimeout(() => {
                if (player.getHandScore() > 21)
                    player.gameStatus = "bust";
                this.view.updateUserInfo(player);
                this.view.currentPlayer(View.config["actingPage"].querySelector(`#${player.name}`));
                return this.decidePlayerAction();
            }, 1000);
        }
        else {
            let actions = ["broken", "bust", "stand", "doubleStand", "surrender", "BlackJack"];
            if (actions.includes(player.gameStatus)) {
                setTimeout(() => {
                    this.view.updateUserInfo(player);
                    this.view.currentPlayer(View.config["actingPage"].querySelector(`#${player.name}`));
                    return this.decidePlayerAction();
                }, 500);
            }
        }
    }
    decidePlayerAction() {
        // 全てのプレイヤーの行動が終わったらhaveTurnでフェーズを切り替える。
        if (this.table.allPlayerActionsResolved())
            return this.haveTurn();
        let player = this.table.getTurnPlayer();
        this.view.currentPlayer(View.config["actingPage"].querySelector(`#${player.name}`));
        if (player.type === "user") {
            this.view.removeAllUnselctableBtn();
            setTimeout(() => {
            }, 1000);
        }
        else {
            this.view.addAllUnselctableBtn();
            setTimeout(() => {
                this.view.updateUserInfo(player);
                this.renderAIAction(player);
            }, 2000);
        }
        this.table.turnCounter++;
    }
    haveTurn(userData) {
        const player = this.table.getTurnPlayer();
        if (this.table.gamePhase == "betting") {
            if (this.table.onFirstPlayer()) {
                // betを初期化し、カードをプレイヤーに配る
                this.table.players.forEach(player => player.bet = 0);
                this.table.blackjackAssignPlayerHands();
            }
            // AIのbetを決めるためにpromptPlayer()を呼び出す
            if (userData == undefined)
                userData = player.promptPlayer();
            this.table.evaluateMove(player, userData);
            if (this.table.onLastPlayer()) {
                this.table.gamePhase = "acting";
            }
        }
        else if (this.table.gamePhase == "acting") {
            // if(player.gameDecision["betAmount"] > 0){
            //   if(userData == undefined) userData = player.promptPlayer();
            //     this.table.evaluateMove(player, userData);
            // } 
            if (this.table.allPlayerActionsResolved()) {
                console.log("user action finish!");
                this.table.gamePhase = "evaluatingWinner";
                console.log(this.table.gamePhase);
            }
        }
        else if (this.table.gamePhase === "evaluatingWinner") {
            this.table.blackjackEvaluateAndGetRoundResults();
            this.table.gamePhase = "roundOver";
        }
        else {
            console.log("haveTurn内のerror");
        }
        this.table.turnCounter++;
    }
}
