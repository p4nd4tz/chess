import { Game } from "./Game";
import { INIT_GAME, MOVE } from "./messages";

export class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket): void {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket): void {
        this.users.splice(this.users.indexOf(socket), 1);
    }

    private addHandler(socket: WebSocket): void {
        socket.onmessage = (data) => {
            const message = JSON.parse(data.toString());

            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    // start a new game
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;

                } else {
                    this.pendingUser = socket;
                }
            }

            if (message.type === MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if(game) {
                    game.makeMove(socket, message.move);
                }
            }
        }
    }
}