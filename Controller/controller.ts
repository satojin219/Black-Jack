import { Player } from '../Model/Player';
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

    this.view.displayNone(View.config.initialForm);
    this.view.renderActingPage();
    this.view.renderBettingModal();

  }


}

