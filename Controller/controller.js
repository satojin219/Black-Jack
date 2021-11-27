import { Table } from '../Model/Table.js';
import { View } from '../View/view.js';
export class Controller {
    constructor() {
        this.view = new View(this);
        this.view.renderStartPage();
    }
    startGame(gameType, userName) {
        console.log(userName);
        console.log(gameType);
        if (userName == "") {
            console.log(new Table(gameType, "Bot3", "ai"));
            return new Table(gameType, "Bot3", "ai");
        }
        return new Table(gameType, userName, "user");
    }
}
