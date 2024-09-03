import Game from "./game";

export function startGameLoop(game: Game) {
    const TPS = 60;
    const TPS_INTERVAL = 1000 / TPS;

    let last = performance.now();
    let delta = 0;
    let frames = 0;
    let lastFpsUpdate = performance.now();
    let fps = 0;

    function loop() {
        const now = performance.now();
        const elapsed = now - last;
        last = now;
        delta += elapsed;

        while (delta >= TPS_INTERVAL) {
            game.update(TPS_INTERVAL / 1000);
            delta -= TPS_INTERVAL;
        }

        game.draw();

        frames++;
        if (now - lastFpsUpdate >= 1000) {
            fps = frames;
            frames = 0;
            lastFpsUpdate = now;
            // console.log(`FPS: ${fps}`);
        }

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

