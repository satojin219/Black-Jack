import { Player } from '../Model/Player.js';
import { GameDecision } from '../Model/Player.js';
import { Table } from '../Model/Table.js';
import { View } from '../View/view.js';

export class Controller{
  view :View;
  table :Table|null;
  constructor(){
    this.view = new View(this);
    this.view.renderStartPage();
    this.table = null;
  }

  startGame(gameType :string,userName :string){
    if(userName == "") this.table = new Table(gameType,"Bot3","ai");
    else  this.table = new Table(gameType,userName,"user");
    console.log(this.table)
    // bettingページへ移行する
    this.view.displayNone(View.config.initialForm);
    this.view.toggleFixed();
    this.view.renderBettingModal();

  }
  
  evaluteBet(userBet :number){
    while(this.table.gamePhase != "acting"){
      if(this.table.getTurnPlayer().type == "user"){
        this.haveTurn(new GameDecision(null,userBet));
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
    this.view.addUnselctableBtn();
    this.decidePlayerAction();
  }



  renderAIAction(player,action?){

    let userData = player.promptPlayer();
    if(player.type == "user"){
      let userDecision = {
        "action": action,
        "bet": player.bet
      }
      userData = player.promptPlayer();
    }

    // this.view.updateUserInfo(player);   
    this.table.evaluateMove(player, userData);
    if(player.gameDecision["action"] == "hit"){
        this.view.updateUserInfo(player);   
        this.view.addCard(player);
        setTimeout(()=>{
        return this.renderAIAction(player);
    },1000);
    }else if(player.gameDecision["action"] == "double"){
      console.log(player)
      this.view.updateUserInfo(player);   
      this.view.addCard(player);
      setTimeout(()=>{
        if(player.getHandScore() > 21) player.gameStatus = "bust";
        this.view.updateUserInfo(player);
        return this.decidePlayerAction();
    },1000); 
    }else{
      let actions  :any= ["broken", "bust", "stand","doubleStand", "surrender","BlackJack"];
      if(actions.includes(player.gameStatus)){
        setTimeout(()=>{
          this.view.updateUserInfo(player);
          return this.decidePlayerAction();
      },500);
      }
    }    
}

  decidePlayerAction(action? :string){
    if(this.table.allPlayerActionsResolved()) return;
    let player = this.table.getTurnPlayer();
    console.log(player);

    if(player.type == "user"){
      setTimeout(()=>{
        this.view.removeUnselctableBtn();
      },1000);
      return;
      
    }else{
      setTimeout(()=>{
        this.view.updateUserInfo(player)
        this.renderAIAction(player);
      
      },2000);
      // return this.decidePlayerAction();
    }
    this.table.turnCounter++;
      
  }



  haveTurn(userData ?){

    const player = this.table.getTurnPlayer();
    if(this.table.gamePhase == "betting"){
      if(this.table.onFirstPlayer()){
        // betを初期化し、カードをプレイヤーに配る
        this.table.players.forEach(player => player.bet = 0);
        this.table.blackjackAssignPlayerHands();
      }
      // AIのbetを決めるためにpromptPlayer()を呼び出す
    if(userData == undefined) userData = player.promptPlayer();
        this.table.evaluateMove(player, userData);
      
        if(this.table.onLastPlayer()){
            this.table.gamePhase = "acting";
        }
        }else if(this.table.gamePhase == "acting"){
        if(player.gameDecision["betAmount"] > 0){
          if(userData == undefined) userData = player.promptPlayer();
            this.table.evaluateMove(player, userData);
       
        } 
        if(this.table.allPlayerActionsResolved()) this.table.gamePhase = "evaluatingWinner";

 
    }else if(this.table.gamePhase === "evaluatingWinner"){
       this.table.blackjackEvaluateAndGetRoundResults();
        this.table.gamePhase = "roundOver";
     

    } else {
        console.log("haveTurn内のerror")
    }
    
    this.table.turnCounter++;
}


}

