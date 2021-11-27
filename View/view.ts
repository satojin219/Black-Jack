import { Player } from '../Model/Player.js';
import { Table } from '../Model/Table.js';
import { Controller } from '../Controller/controller.js';

export class View{

  static config :{[key: string] :HTMLElement}= {
    initialForm: document.getElementById("initial-form"),
    actingPage: document.getElementById("acting-page"),
    bettingModal: document.getElementById("betting-modal"),
    resultModal: document.getElementById("result-modal"),
  }
  public controller :Controller;
  constructor(controller :Controller){
    this.controller = controller;
  }
  
  renderStartPage() {
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
    console.log(userName)
    console.log(gameType)

    startBtn.addEventListener("click",()=>{
      if(gameType.value == "Choose...")return alert("ゲームを選択してください");
      if(userName.value =="Bot1" || userName.value =="Bot2")return alert("その名前は使う事ができません");

      return this.controller.startGame(gameType.value,userName.value);
    })
  }

  public displayNone(ele :HTMLElement) :void{
    ele.classList.remove("d-block");
    ele.classList.add("d-none");
  }
  
  public displayBlock(ele :HTMLElement) :void{
    ele.classList.remove("d-none");
    ele.classList.add("d-block");
  }
  

}
