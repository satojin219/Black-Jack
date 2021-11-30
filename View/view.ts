import { Card } from '../Model/card.js';
import { Player } from '../Model/Player.js';
import { GameDecision } from '../Model/Player.js';
import { Table } from '../Model/Table.js';
import { Controller } from '../Controller/controller.js';

export class View{

  public controller :Controller;
  public table :Table;

  constructor(controller :Controller,table :Table){
    this.controller = controller;
    this.table = table; 
  }

  static config :{[key: string] :HTMLElement}= {
    initialForm: document.getElementById("initial-form"),
    actingPage: document.getElementById("acting-page"),
    bettingModal: document.getElementById("betting-modal"),
    resultModal: document.getElementById("result-modal"),
  }

  static suitMark:{[key: string]: string} = {
    H: "&#9829", 
    D: "&#9830",
    C: "&#9827",
    S: "&#9824"
  }  

  static fontAwsome:{[key: string]: string} ={
    user :'<i class="fas fa-user"></i>',
    ai :'<i class="fas fa-robot"></i>'
  }




  public displayNone(ele :HTMLElement) :void{
    ele.classList.remove("d-block");
    ele.classList.add("d-none");
    ele.innerHTML = "";
  }
  
  public displayBlock(ele :HTMLElement) :void{
    ele.classList.remove("d-none");
    ele.classList.add("d-block");
  }
  
  public toggleFixed(){
    document.querySelector("body").classList.toggle("body-fixed");
  }

  public addUnselctableBtn(){
    View.config.actingPage.querySelector(".wood").classList.add("unselectableBtn")
  }
  public removeUnselctableBtn(){
    View.config.actingPage.querySelector(".wood").classList.remove("unselectableBtn")
  }
 
  renderStartPage(){
    View.config.initialForm.innerHTML = `
    <div class=" vh-100 d-flex  justify-content-center align-items-center">
    <div class="d-flex align-items-center col-lg-8 col-9 ">
      <div class="shadow-lg col-12 text-center p-4  rounded  ">
        <h2 class="text-white">Welcome to Card Game!</h2>

        <div  class="input-group my-4">
          <input id="name-input" type="text" class="form-control  input-group-prepend" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
        </div>
        
        <div  class="input-group my-4">
          <div class="input-group-prepend">
            <label class="input-group-text bg-success text-white" for="inputGroupSelect01">GameType</label>
          </div>
          <select id="game-type-select" class="custom-select" id="inputGroupSelect01">
            <option selected>Choose...</option>
            <option value="blackjack">Black Jack</option>

          </select>
        </div>

        <button id="start-btn" type="button" class="btn btn-success col-12 text-white p-3 font-weight-bold rounded-pill"><i class="fas fa-spade text-dark"></i>  <i class="fas fa-club text-dark"></i> Game Start  <i class="fas fa-diamond text-danger"></i> <i class="fas fa-heart text-danger"></i></button>
      </div>
    </div>
  </div>
    `;
    const userName =  View.config.initialForm.querySelector("#name-input") as HTMLInputElement;
    const gameType = View.config.initialForm.querySelector("#game-type-select") as HTMLSelectElement;
    const startBtn = View.config.initialForm.querySelector("#start-btn") as HTMLButtonElement;

    startBtn.addEventListener("click",()=>{
      if(gameType.value == "Choose...")return alert("ゲームを選択してください");
      if(userName.value =="Bot1" || userName.value =="Bot2")return alert("その名前は使う事ができません");
      console.log(this.controller)
      return this.controller.startGame(gameType.value,userName.value);
    })
  }

  renderCards(player:Player,target){
    let cards :Card[] = player.hand;
    
    for(let i=0; i < cards.length; i++){
      let div = document.createElement("div");
      div.className = `${player.name}-card${i+1}`;

        div.innerHTML +=`
        <div class="card">
        <div class="front">
        <span>${cards[i].rank}${View.suitMark[cards[i].suit]}</span>${View.suitMark[cards[i].suit]}<span>${cards[i].rank}${View.suitMark[cards[i].suit]}</span></div>
        <div class="back"></div>
        </div>
        `;
        target.append(div);
        const cardTarget = target.querySelector(`.${player.name}-card${i+1}`);
        const card = cardTarget.querySelector(".card");
        if(cards[i].suit == "H" || cards[i].suit == "D") card.classList.add("suit-red");
      }
    return target; 
  }

  renderPlayer(players :Player[]){
    let target = document.createElement("div");
    target.classList.add("col-12","d-flex","jusfify-content-between","text-center");

    for(let i =0; i < players.length;i++){
      target.innerHTML += `
      <div class = "d-flex justify-content-around align-items-center flex-column col-4 mb-150px">
      <div class="text-white">
          <h3>${View.fontAwsome[players[i].type]}
          ${players[i].name}</h3>
          <div class="d-md-flex">
            <p id="${players[i].name}-score" class="mx-1 my-1 p-1">Score: ${players[i].getHandScore()}</p>
            <p id="${players[i].name}-bet" class="mx-1 my-1 p-1 ">Bet: ${players[i].bet}</p>
            <p id="${players[i].name}-chips" class="mx-1 my-1 p-1">Chips: ${players[i].chips}</p>
          </div>
          <p id="${players[i].name}-status" class="mx-1 my-1 font-weight-bold p-1 ${players[i].gameStatus}">${players[i].gameStatus}</p>
        </div>

        <div id="${players[i].name}-hand" class="d-flex justify-content-around align-items-center mt-2 col-9 col-lg-5 col-md-4">
        
        </div>
        </div>
        `;
        let cardTarget = target.querySelector(`#${players[i].name}-hand`)
        this.renderCards(players[i],cardTarget); 
    }
   return target;
  }

  renderActingPage(){
    const players = this.controller.table.players;
    const house = this.controller.table.house;
    this.displayNone(View.config.initialForm);
    View.config.actingPage.innerHTML =`
<button type="button" class="btn modal-btn" data-toggle="modal" data-target="#exampleModal">
  <i class="fas fa-clipboard-list fa-4x text-white py-3 px-4 log"></i>
</button>

<div id="modal" class="modal">
  <div class="modal-body">
      <div class=" vh-100 d-flex justify-content-center align-items-center">
        <div class="d-flex justify-content-center align-items-center bg-white col-9 p-3 rounded">
          <div id="modal-target class="d-flex flex-column" id="result-log-target">
            <button for="trigger" class="close-button text-white btn btn-primary">✖️ 戻る</button>
          </div>
        </div>
      </div>    
    </div>
</div>



  <div class="d-flex justify-content-around align-items-center  flex-column text-center mb-200px mt-1 ">
    <div class="text-white">
      <h3><i class="fas fa-user-tie"></i> House</h3>
      <p class="mx-1 my-1 p-1">Score: ${house.getHandScore()}</p>

      
    </div>
    
    <div  id="house-cards-target" class="d-flex justify-content-around align-items-center mt-1 col-2 col-lg-1">

        
    </div>
     
      </div>
      
      
    </div>
  </div>

  <div id="players-target">
  </div>

<div class="wood d-flex  justify-content-center">
  <div class="d-flex justify-content-around align-items-center  p-4 col-lg-9 col-10 " >
        
        <div class="d-flex flex-column">
          <div id="surrenderBtn" href="#" class="btn-real-dent btn-blue">
            <i class="fab fa-font-awesome-flag"></i>
          </div>
          <div class="text-white font-weight-bold text-center pt-2">SURRENDER</div>
        </div>
        
        <div class="d-flex flex-column">
          <div id="standBtn" href="#" class="btn-real-dent btn-red">
            <i class="fas fa-swords"></i>
          </div>
          <div class="text-white font-weight-bold text-center pt-2">STAND</div>
        </div>
        
        
        
        <div class="d-flex flex-column ">
          <div  id="doubleBtn" href="#" class="btn-real-dent btn-yellow">
            <i class="far fa-coins"></i>
          </div>
          <div class="text-white font-weight-bold text-center pt-2">DOUBLE</div>
        </div>
        
        <div class="d-flex flex-column">
          <div id="hitBtn" href="#" class=" btn-real-dent btn-green ">
            <i class="fas fa-coin"></i>
          </div>
          <div class="text-white font-weight-bold text-center pt-2">HIT</div>
        </div>
        
      </div>
    </div>
    `;

    let cardTarget = View.config.actingPage.querySelector(`#house-cards-target`)
    this.renderCards(house,cardTarget);
    View.config.actingPage.querySelector("#players-target").append(this.renderPlayer(players))
    const front = View.config.actingPage.querySelectorAll(".front");
    const back = View.config.actingPage.querySelectorAll(".back");
    setTimeout(()=>{
      for(let i=0; i < front.length; i++){
    
        back[i].classList.add("back-rotate");
        front[i].classList.add("front-rotate");
      }
    
    },100);

    const controller = this.controller;
    const table = this.table;
    let actionList = ["surrender", "stand", "hit", "double"]
    actionList.forEach(function(action){
        let actionBtn = View.config.actingPage.querySelector(`#${action}Btn`);
        actionBtn.addEventListener("click", ()=>{
          controller.renderAIAction(table.players[1],action);
          // this.controller.renderAIAction(action);
        })
    })
  }

  renderBettingModal(){
    const userInfo = this.controller.table.players[1];
    let betAmount :number= userInfo.bet;
    let chipsAmount :number= userInfo.chips;

    View.config.bettingModal.innerHTML=`
    <div class="modal  vh-100 d-flex  justify-content-center align-items-center">
    <div class="d-flex align-items-center col-lg-8 col-9 ">
      <div class="shadow-lg col-12 text-center p-5  rounded  bg-light">
        <h2 class="" id="user-bet">You Bet : $${betAmount}</h2>
        <p id="user-chips">Your Chips : $${chipsAmount}</p>
  
        <div class="my-4 d-flex justify-content-around">
       
        <button type="button" class = "btn text-white text-center bg-warning px-4 py-3 mx-1 rounded-circle rounded-lg shadow bet-btn" id="btn-5 ">5</button>
        <button type="button" class = "btn text-white text-center bg-warning px-4 py-3 mx-1 rounded-circle rounded-lg shadow bet-btn" id="btn-20 ">20</button>
        <button type="button" class = "btn text-white text-center bg-warning px-4 py-3 mx-1 rounded-circle rounded-lg shadow bet-btn"  id="btn-50 ">50</button>
        <button type="button" class = "btn text-white text-center bg-warning px-4 py-3 mx-1 rounded-circle rounded-lg shadow bet-btn" id="btn-100 ">100</button>
    
    </div>
  
        <button id="deal-btn" type="button" class="btn btn-success col-12 text-white  font-weight-bold rounded m-1"> <i class="fas fa-badge-dollar"></i> Deal  </button>
        
        <div class="d-flex justify-content-between ">
        <button id="reset-btn" type="button" class="btn btn-danger col-6 text-white  font-weight-bold rounded m-1"><i class="fas fa-trash-alt"></i>  Reset  </button>
        <button id="allIn-btn" type="button" class="btn btn-primary col-6 text-white  font-weight-bold rounded m-1"><i class="far fa-coins"></i>  All In </button>
        </div>
      </div>
    </div>
  </div>
    `;

    const betBtn = View.config.bettingModal.querySelectorAll(".bet-btn");
    const dealBtn = View.config.bettingModal.querySelector("#deal-btn");
    const resetBtn = View.config.bettingModal.querySelector("#reset-btn");
    const allInBtn = View.config.bettingModal.querySelector("#allIn-btn");
    const userBet = View.config.bettingModal.querySelector("#user-bet");
    const userChips = View.config.bettingModal.querySelector("#user-chips");


    for(let i=0; i < betBtn.length;i++){
      betBtn[i].addEventListener("click",()=>{
        if(chipsAmount < Number(betBtn[i].innerHTML)) return;
        betAmount += Number(betBtn[i].innerHTML);
        chipsAmount -=Number(betBtn[i].innerHTML);
        this.renderChipsBetAmount(userBet,userChips,betAmount,chipsAmount);

      });
    }

    resetBtn.addEventListener("click",()=>{
      betAmount = 0;
      chipsAmount = userInfo.chips;
      this.renderChipsBetAmount(userBet,userChips,betAmount,chipsAmount);

    });

    allInBtn.addEventListener("click",()=>{
      betAmount = userInfo.chips;
      chipsAmount = 0;
      this.renderChipsBetAmount(userBet,userChips,betAmount,chipsAmount);

    });

    dealBtn.addEventListener("click",()=>{
      if(betAmount == 0)return;
      this.controller.evaluteBet(betAmount)
      // this.controller.renderTable(this.controller.table);

    })
  }

  public renderChipsBetAmount(ele1,ele2,bet,chips){
    ele1.innerHTML = `You Bet : $${bet.toString()}`;
    ele2.innerHTML = `Your Chips : $${chips.toString()}`;
  }

  updateUserInfo(player){
    this.updateScore(player);
    this.updateBet(player);
    this.updateChips(player);
    this.updateGameStatus(player)
  }

  updateGameStatus(player){
    let gameStatus = View.config.actingPage.querySelector(`#${player.name}-status`);
    gameStatus.className= `mx-1 my-1 font-weight-bold p-1 ${player.gameStatus}`;
    gameStatus.innerHTML = player.gameStatus;
    // let gameStatus = View.config.actingPage.querySelector(`#${player.name}-status`);
    // gameStatus.className= `mx-1 my-1 font-weight-bold p-1 ${player.gameDecision["action"]}`;
    // gameStatus.innerHTML = player.gameDecision["action"];
  }

  updateScore(player){
    let bet = View.config.actingPage.querySelector(`#${player.name}-score`);
    bet.innerHTML = `Score: ${player.getHandScore()}`;
  }
  updateBet(player){
    let bet = View.config.actingPage.querySelector(`#${player.name}-bet`);
    bet.innerHTML = `Bet: ${player.bet}`;
  }
  updateChips(player){
    let chips = View.config.actingPage.querySelector(`#${player.name}-chips`);
    chips.innerHTML = `Chips: ${player.chips}`;
  }

  addCard(player){
    const target = View.config.actingPage.querySelector(`#${player.name}-hand`);

    let cards = player.hand;
    let cardIndex  = player.hand.length-1;

      let div = document.createElement("div");
      div.className = `${player.name}-card${cardIndex+1}`;
        div.innerHTML +=`
        <div class="card">
        <div class="front">
        <span>${cards[cardIndex].rank}${View.suitMark[cards[cardIndex].suit]}</span>${View.suitMark[cards[cardIndex].suit]}<span>${cards[cardIndex].rank}${View.suitMark[cards[cardIndex].suit]}</span></div>
        <div class="back"></div>
        </div>
        `;
      
      target.append(div);
    
      const cardTarget = target.querySelector(`.${player.name}-card${cardIndex+1}`);
      const card = cardTarget.querySelector(".card");
      const front = cardTarget.querySelector(".front");
      const back = cardTarget.querySelector(".back");
      if(cards.suit == "H" || cards.suit == "D") card.classList.add("suit-red");
      
        setTimeout(()=>{ 
            back.classList.add("back-rotate");
            front.classList.add("front-rotate");
          }
        ,10);

    }
  

}
