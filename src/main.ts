import Game from './core/game'
import { startGameLoop } from './core/game-loop';
import './style.css'

const game = new Game();
game.init();
startGameLoop(game);