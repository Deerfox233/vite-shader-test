import Game from "./game";

export function startGameLoop(game: Game) {
    const TPS = 25;
    const TPS_INTERVAL = 1000 / TPS;

    let last = performance.now();
    let delta = 0;

    function loop() {
        const now = performance.now();
        const elapsed = now - last;
        last = now;
        delta += elapsed;

        while (delta >= TPS_INTERVAL) {
            game.update(delta);
            delta -= TPS_INTERVAL;
        }

        game.draw();

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

