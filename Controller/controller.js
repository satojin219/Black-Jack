var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    renderPlayerAction(player, action) {
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
        this.table.evaluateMove(player, userData);
        if (player.gameDecision["action"] == "hit") {
            this.view.addUnselctableBtn("surrender");
            this.view.addUnselctableBtn("double");
            this.view.updateUserInfo(player);
            this.view.addCard(player);
            setTimeout(() => {
                return this.renderPlayerAction(player);
            }, 1000);
        }
        else if (player.gameDecision["action"] == "double") {
            this.view.addAllUnselctableBtn();
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
            let actions = ["broken", "bust", "stand", "double", "surrender", "BlackJack"];
            if (actions.includes(player.gameStatus)) {
                setTimeout(() => {
                    this.view.updateUserInfo(player);
                    this.view.currentPlayer(View.config["actingPage"].querySelector(`#${player.name}`));
                    return this.decidePlayerAction();
                }, 1000);
            }
        }
    }
    decidePlayerAction() {
        // 全てのプレイヤーの行動が終わったらrenderHouseAction()でフェーズを切り替える。
        if (this.table.allPlayerActionsResolved()) {
            setTimeout(() => {
                this.haveTurn();
                this.view.currentPlayer(View.config["actingPage"].querySelector("#house"));
                this.renderHouseAction();
            }, 1000);
            return;
        }
        let player = this.table.getTurnPlayer();
        this.view.currentPlayer(View.config["actingPage"].querySelector(`#${player.name}`));
        if (player.type === "user") {
            if (player.gameStatus == "blackjack") {
                this.table.turnCounter++;
                this.renderPlayerAction(player);
                return;
            }
            this.view.removeAllUnselctableBtn();
        }
        else {
            this.view.addAllUnselctableBtn();
            setTimeout(() => {
                this.view.updateUserInfo(player);
                this.renderPlayerAction(player);
            }, 2000);
        }
        this.table.turnCounter++;
        console.log(this.table.turnCounter);
    }
    renderHouseAction() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.table.houseGetHand();
            yield this.view.addCard(this.table.house);
            yield this.view.updateScore(this.table.house);
            yield this.view.updateGameStatus(this.table.house);
            if (this.table.house.getHandScore() < 17) {
                yield setTimeout(() => {
                    return this.renderHouseAction();
                }, 2000);
            }
            else {
                console.log(this.table.house.gameStatus);
                this.haveTurn();
                this.view.updateGameStatus(this.table.house);
            }
        });
    }
    haveTurn(userData) {
        const player = this.table.getTurnPlayer();
        console.log(this.table.gamePhase);
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
                this.table.gamePhase = "evaluatingWinner";
                console.log("houseTurn");
            }
        }
        else if (this.table.gamePhase === "evaluatingWinner") {
            this.table.blackjackEvaluateAndGetRoundResults();
            this.table.gamePhase = "roundOver";
            console.log(this.table.resultsLog);
        }
        else {
            console.log("haveTurn内のerror");
        }
        this.table.turnCounter++;
    }
}
