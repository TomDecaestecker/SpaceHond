import { Dust, Splash, Fire, Smoke } from './particles.js';
import { RollerSound } from './sounds.js';
import { DizzySound } from './sounds.js';

const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6
}

class State {
    constructor(state, game) {
        this.state = state;
        this.game = game;
    }
}

export class Sitting extends State {
    constructor(game) {
        super('SITTING', game);
    }

    enter() {
        this.game.player.maxFrame = 4;
        this.game.player.frameY = 5;

    }
    handleInput(input) {
        if (input.keys.includes('ArrowRight') || input.keys.includes('ArrowLeft')) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (input.keys.includes('ArrowUp')) {
            this.game.player.setState(states.JUMPING, 1);
        } else if (input.keys.includes(' ')) {
            this.game.player.setState(states.ROLLING, 2);
        }
    }
}

export class Running extends State {
    constructor(game) {
        super('RUNNING', game);
    }

    enter() {
        this.game.player.maxFrame = 8;
        this.game.player.frameY = 3;
    }
    handleInput(input) {
        this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height));
        if (input.keys.includes('ArrowDown')) {
            this.game.player.setState(states.SITTING, 0);
        } else if (input.keys.includes('ArrowUp')) {
            this.game.player.setState(states.JUMPING, 1);
        } else if (input.keys.includes(' ') && this.game.player.power > this.game.player.powerMinLimit) {
            this.game.player.setState(states.ROLLING, 2);
        }
    }
}

export class Jumping extends State {
    constructor(game) {
        super('JUMPING', game);
    }

    enter() {
        if (this.game.player.onGround()) this.game.player.speedY -= 27;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 1;

    }
    handleInput(input) {
        if (this.game.player.speedY > 0) {
            this.game.player.setState(states.FALLING, 1);
        } else if (input.keys.includes(' ') && this.game.player.power > this.game.player.powerMinLimit) {
            this.game.player.setState(states.ROLLING, 2);
        } else if (input.keys.includes('ArrowDown')) {
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Falling extends State {
    constructor(game) {
        super('FALLING', game);
    }

    enter() {
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 2;

    }
    handleInput(input) {
        if (this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (input.keys.includes('ArrowDown')) {
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Rolling extends State {
    constructor(game) {
        super('ROLLING', game);

    }

    enter() {
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 6;
        RollerSound.play();

    }
    handleInput(input) {
        this.game.particles.unshift(new Smoke(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if (this.game.player.power <= 0 || (!input.keys.includes(' ')) && this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
        } else if ((this.game.player.power <= 0 || !input.keys.includes(' ')) && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 1);
        } else if (input.keys.includes(' ') && input.keys.includes('ArrowUp') && this.game.player.onGround()) {
            this.game.player.speedY -= 27;
        } else if (input.keys.includes('ArrowDown') && !this.game.player.onGround()) {
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Diving extends State {
    constructor(game) {
        super('DIVING', game);

    }

    enter() {
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 6;
        this.game.player.speedY = 15;

    }
    handleInput(input) {
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if (this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
            for (let i = 0; i < 30; i++) {
                this.game.particles.unshift(new Splash(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height));
            }
        } else if (input.keys.includes(' ') && this.game.player.onGround()) {
            this.game.player.setState(states.ROLLING, 2);
        }
    }
}

export class Hit extends State {
    constructor(game) {
        super('HIT', game);

    }

    enter() {
        this.game.player.maxFrame = 10;
        this.game.player.frameX = 0;
        this.game.player.frameY = 4;
        DizzySound.play();
    }
    handleInput(input) {
        if (this.game.player.frameX >= 10 && this.game.gameLoss) {
            this.game.player.frameX = 0;
        } else if (this.game.player.frameX >= 10 && this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (this.game.player.frameX >= 10 && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 1);
        }
    }
}