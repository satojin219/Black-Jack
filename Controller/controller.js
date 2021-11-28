import { GameDecision } from '../Model/Player.js';
import { Table } from '../Model/Table.js';
import { View } from '../View/view.js';
export class Controller {
    constructor() {
        this.view = new View(this);
        this.view.renderStartPage();
        this.table = null;
    }
    startGame(gameType, userName) {
        if (userName == "")
            this.table = new Table(gameType, "Bot3", "ai");
        else
            this.table = new Table(gameType, userName, "user");
        console.log(this.table);
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
        this.view.addUnselctableBtn();
        this.decidePlayerAction();
    }
    renderAIAction(player) {
        // this.view.updateUserInfo(player);
        let actions = ["broken", "bust", "stand", "doubleStand", "surrender", "BlackJack"];
        console.log(player);
        if (actions.includes(player.gameStatus)) {
            return this.view.updateUserInfo(player);
        }
        ;
        setTimeout(() => {
            if (player.gameStatus == "double" || player.gameStatus == "hit") {
                this.view.addCard(player);
                let userData = player.promptPlayer();
                console.log(userData);
                console.log(player);
                this.table.evaluateMove(player, userData);
            }
            this.view.updateUserInfo(player);
            return this.renderAIAction(player);
        }, 500);
    }
    decidePlayerAction(action) {
        if (this.table.allPlayerActionsResolved())
            return;
        let player = this.table.getTurnPlayer();
        if (player.type == "user") {
            this.view.removeUnselctableBtn();
            this.haveTurn();
        }
        else {
            setTimeout(() => {
                this.haveTurn();
                this.renderAIAction(player);
            }, 2000);
            // return this.decidePlayerAction();
        }
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
            if (player.gameDecision["betAmount"] > 0) {
                if (userData == undefined)
                    userData = player.promptPlayer();
                console.log(userData);
                this.table.evaluateMove(player, userData);
            }
            if (this.table.allPlayerActionsResolved())
                this.table.gamePhase = "evaluatingWinner";
        }
        else if (this.table.gamePhase === "evaluatingWinner") {
            this.table.blackjackEvaluateAndGetRoundResults();
            this.table.gamePhase = "roundOver";
            console.log(player);
        }
        else {
            console.log("haveTurn内のerror");
        }
        this.table.turnCounter++;
    }
}
