import { Chess } from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE } from './messages';

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private moves: string[];
    private startTime: Date;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.startTime = new Date();

        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white",
            },
        }));

        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black",
            },
        }));

        // this.player1.onmessage = (event) => {
        //     const message = JSON.parse(event.data);
        //     if (message.type === MOVE) {
        //         this.makeMove(this.player1, message.move);
        //     }
        // }

        // this.player2.onmessage = (event) => {
        //     const message = JSON.parse(event.data);
        //     if (message.type === MOVE) {
        //         this.makeMove(this.player2, message.move);
        //     }
        // }
    }

    makeMove(socket: WebSocket, move: { from: string, to: string }): void {
        //validate the type of move using zod
        if (this.board.moves.length % 2 === 0 && socket !== this.player2)
            return;

        if (this.board.moves.length % 2 === 1 && socket !== this.player1)
            return;

        try {
            this.board.move(move);
        } catch (err) {
            console.log(err);
        }

        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                winner: this.board.turn() === 'w' ? "black" : "white",
            }));

            return;
        }

        if (this.board.moves.length % 2 === 1) {
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move,
            }));
        } else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move,
            }));
        }
    }
}