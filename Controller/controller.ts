import { Player } from '../Model/Player';
import { Table } from '../Model/Table.js';
import { View } from '../View/view.js';

export class Controller{
  view :View;
  constructor(){
    this.view = new View(this);
    this.view.renderStartPage()
  }
  startGame(gameType :string,userName :string){
    if(userName == "")new Table(gameType,"Bot3","ai");
    else new Table(gameType,userName,"user");
  }


}

