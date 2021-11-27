export class View {
    constructor(controller) {
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
        const userName = View.config.initialForm.querySelector("#name-input");
        const gameType = View.config.initialForm.querySelector("#game-type-select");
        const startBtn = View.config.initialForm.querySelector("#start-btn");
        startBtn.addEventListener("click", () => {
            if (gameType.value == "Choose...")
                return alert("ゲームを選択してください");
            if (userName.value == "Bot1" || userName.value == "Bot2")
                return alert("その名前は使う事ができません");
            return this.controller.startGame(gameType.value, userName.value);
        });
    }
    renderActingPage() {
        this.displayNone(View.config.initialForm);
        View.config.actingPage.innerHTML = `
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
      <p class="mx-1 my-1 p-1">Score: 0</p>
      
    </div>
    
    <div class="d-flex justify-content-around align-items-center mt-1 col-3  col-md-2">
      <div>
        <div class="card">
          <div class="front"></div>
          <div class="back"></div>
        </div>
      </div>
      <div>
        <div class="card">
          <div class="front"></div>
          <div class="back"></div>
        </div>
      </div>
      
      
    </div>
  </div>
  
  
  
  <div class="col-12 d-flex jusfify-content-between  text-center ">
    
    <div class="d-flex justify-content-around align-items-center  flex-column col-4 mb-150px" >
      <div class="text-white">
        <h3><i class="fas fa-robot"></i>
          Bot 1</h3>
          <div class="d-md-flex">
            <p class="mx-1 my-1 p-1">Score: 0</p>
            <p class="mx-1 my-1 p-1 ">Bet: 0</p>
            <p class="mx-1 my-1 p-1">Chips: 0</p>
          </div>

          
        </div>
        
        <div class="d-flex justify-content-around align-items-center mt-2  col-9 col-lg-5 col-md-4">
          <div>
            <div class="card">
              <div class="front"></div>
              <div class="back"></div>
            </div>
          </div>
          
          <div>
            <div class="card">
              <div class="front"></div>
              <div class="back"></div>
            </div>
          </div> 
        </div>
      </div>
      
      
      <div class="d-flex justify-content-around align-items-center  flex-column text-center col-4 mb-150px">
        <div class="text-white">
          <h3><i class="fas fa-user faa-float animated"></i> Jin</h3>
          <div class="d-md-flex">
            <p class="mx-1 my-1 p-1">Score: 0</p>
            <p class="mx-1 my-1 p-1">Bet: 0</p>
            <p class="mx-1 my-1 p-1">Chips: 0</p>
          </div>

          
        </div>
        
        <div class="d-flex justify-content-around align-items-center mt-2  col-9 col-lg-5 col-md-4">
          
          <div>
            <div class="card">
              <div class="front"></div>
              <div class="back"></div>
            </div>
          </div>
          <div>
            <div class="card">
              <div class="front"></div>
              <div class="back"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="d-flex justify-content-around align-items-center  flex-column col-4 text-center mb-150px">
        <div class="text-white">
          <h3><i class="fas fa-robot"></i>
            Bot 2</h3>
<div class="d-md-flex">
  <p class="mx-1 my-1 p-1">Score: 0</p>
  <p class="mx-1 my-1 p-1">Bet: 0</p>
  <p class="mx-1 my-1 p-1">Chips: 400</p>
</div>


</div>

<div class="d-flex justify-content-around align-items-center mt-2  col-9 col-lg-5 col-md-4">
  <div>
    <div class="card">
      <div class="front"></div>
      <div class="back"></div>
    </div>
  </div>
  
  <div>
    <div class="card">
      <div class="front"></div>
      <div class="back"></div>
    </div>
  </div>

</div>
</div>
</div>

</div>




<div class="wood d-flex  justify-content-center">
  
  <div class="d-flex justify-content-around align-items-center  p-4 col-lg-9 col-10 " >
        
        <div class="d-flex flex-column">
          <div href="#" class="btn-real-dent btn-blue" >
            <i class="fab fa-font-awesome-flag"></i>
          </div>
          <div class="text-white font-weight-bold text-center pt-2">SURRENDER</div>
        </div>
        
        <div class="d-flex flex-column">
          <div href="#" class="btn-real-dent btn-red" >
            <i class="fas fa-swords"></i>
          </div>
          <div class="text-white font-weight-bold text-center pt-2">STAND</div>
        </div>
        
        
        
        <div class="d-flex flex-column ">
          <div href="#" class="btn-real-dent btn-yellow" >
            <i class="far fa-coins"></i>
          </div>
          <div class="text-white font-weight-bold text-center pt-2">DOUBLE</div>
        </div>
        
        <div class="d-flex flex-column">
          <div href="#" class=" btn-real-dent btn-green" ">
            <i class="fas fa-coin"></i>
          </div>
          <div class="text-white font-weight-bold text-center pt-2">HIT</div>
        </div>
        
      </div>
    </div>

    
    `;
    }
    renderBettingModal() {
        document.querySelector("body").classList.add("body-fixed");
        const userInfo = this.controller.table.players[1];
        let betAmount = userInfo.bet;
        let chipsAmount = userInfo.chips;
        View.config.bettingModal.innerHTML = `
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
        for (let i = 0; i < betBtn.length; i++) {
            betBtn[i].addEventListener("click", () => {
                console.log(betBtn[i].innerHTML);
                if (chipsAmount < Number(betBtn[i].innerHTML))
                    return alert("これ以上賭けられません");
                betAmount += Number(betBtn[i].innerHTML);
                chipsAmount -= Number(betBtn[i].innerHTML);
                this.renderChipsBetAmount(userBet, userChips, betAmount, chipsAmount);
            });
        }
        resetBtn.addEventListener("click", () => {
            betAmount = 0;
            chipsAmount = userInfo.chips;
            this.renderChipsBetAmount(userBet, userChips, betAmount, chipsAmount);
        });
        allInBtn.addEventListener("click", () => {
            betAmount = userInfo.chips;
            chipsAmount = 0;
            this.renderChipsBetAmount(userBet, userChips, betAmount, chipsAmount);
        });
        dealBtn.addEventListener("click", () => {
        });
    }
    renderChipsBetAmount(ele1, ele2, bet, chips) {
        ele1.innerHTML = `You Bet : $${bet.toString()}`;
        ele2.innerHTML = `Your Chips : $${chips.toString()}`;
    }
    displayNone(ele) {
        ele.classList.remove("d-block");
        ele.classList.add("d-none");
        ele.innerHTML = "";
    }
    displayBlock(ele) {
        ele.classList.remove("d-none");
        ele.classList.add("d-block");
    }
}
View.config = {
    initialForm: document.getElementById("initial-form"),
    actingPage: document.getElementById("acting-page"),
    bettingModal: document.getElementById("betting-modal"),
    resultModal: document.getElementById("result-modal"),
};
