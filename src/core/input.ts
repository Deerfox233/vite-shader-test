export const enum Key {
    LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40,
}

const enum State {
    PRESSED = 1,
    RELEASED = 0,
}

type Handler = (state: State) => void;

export class Input {
    private keyState: State[] = [];
    private handlers: Map<Key, Handler[]> = new Map();

    constructor() {
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    public init() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    public onPressed(key: Key, pressedHandler: () => void) {
        this.handlers.set(key, [...(this.handlers.get(key) ?? []), (state: State) => {
            if (state === State.PRESSED) {
                pressedHandler();
            }
        }]);
    }

    public onReleased(key: Key, releasedHandler: () => void) {
        this.handlers.set(key, [...(this.handlers.get(key) ?? []), (state: State) => {
            if (state === State.RELEASED) {
                releasedHandler();
            }
        }]);
    }

    private handleKeyDown(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (this.keyState[e.keyCode] === State.PRESSED) {
            return;
        }

        this.keyState[e.keyCode] = State.PRESSED;

        const actions = this.handlers.get(e.keyCode);

        if (actions) {
            actions.forEach(action => action(State.PRESSED));
        }
    }

    private handleKeyUp(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (this.keyState[e.keyCode] === State.RELEASED) {
            return;
        }

        this.keyState[e.keyCode] = State.RELEASED;

        const actions = this.handlers.get(e.keyCode);

        if (actions) {
            actions.forEach(action => action(State.RELEASED));
        }
    }
}

export function registerDirectionKeys(input: Input) {
    input.onPressed(Key.UP, () => {
        console.log("UP pressed");
    });
    input.onReleased(Key.UP, () => {
        console.log("UP released");
    });
    input.onPressed(Key.DOWN, () => {
        console.log("DOWN pressed");
    });
    input.onReleased(Key.DOWN, () => {
        console.log("DOWN released");
    });
    input.onPressed(Key.LEFT, () => {
        console.log("LEFT pressed");
    });
    input.onReleased(Key.LEFT, () => {
        console.log("LEFT released");
    });
    input.onPressed(Key.RIGHT, () => {
        console.log("RIGHT pressed");
    });
    input.onReleased(Key.RIGHT, () => {
        console.log("RIGHT released");
    });
}