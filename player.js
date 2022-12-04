import { Hit, Jumping, Sitting } from './playerStates.js';
import { Running } from './playerStates.js';
import { Falling, Rolling, Diving } from './playerStates.js';
import { CollisionAnimation } from './collisionAnimation.js';
import { FloatingMessage } from './floatingMessages.js';
import { CollisionSound } from './sounds.js';

export class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 5;
        this.speedX = 0;
        this.speedXMax = 10;
        this.speedY = 0;
        this.power = 20;
        this.powerMinLimit = 3;
        this.powerTimer = 0;
        this.powerInterval = 20;
        this.powerUpTimer = 0;
        this.powerUpInterval = 50;
        this.gravity = 1;
        this.maxFrame = 6;
        this.frameTimer = 0;
        this.fps = 15;
        this.frameInterval = 1000 / this.fps;
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game)];
    }
    update(input, deltaTime) {
        this.currentState.handleInput(input);
        this.checkCollision();

        //powered rolling state
        if (!this.game.gameOver) {
            if (this.powerUpTimer > this.powerUpInterval) {
                this.powerUpTimer = 0;
                this.power++;
            }
            else this.powerUpTimer += deltaTime;
        }

        if (this.currentState == this.states[4]) {
            if (this.powerTimer > this.powerInterval) {
                this.powerTimer = 0;
                this.power -= 3;
            }
            else this.powerTimer += deltaTime;
        }

        //horizontal movement
        if (input.keys.includes('ArrowRight') && this.currentState !== this.states[6] || this.game.gameWin) this.speedX = this.speedXMax;
        else if (input.keys.includes('ArrowLeft') && this.currentState !== this.states[6]) this.speedX = -this.speedXMax;
        else if (this.game.gameLoss) this.speedX = -this.game.speed;
        else this.speedX = 0;
        this.x += this.speedX;
        //horizontal boundary
        if (this.x < 0 && !this.game.gameOver) this.x = 0;
        else if (this.x > this.game.width - this.width && !this.game.gameOver) this.x = this.game.width - this.width;

        //vertical movement
        this.y += this.speedY;
        if (this.onGround()) this.speedY = 0;
        else this.speedY += this.gravity;
        //vertical boundary
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;

        //animation
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            this.frameX++;
        } else this.frameTimer += deltaTime;
        if (this.frameX > this.maxFrame) this.frameX = 0;;
    }

    draw(context) {
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }

    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }

    checkCollision() {
        this.game.enemies.forEach(enemy => {
            if (enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ) {
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if (this.currentState === this.states[4] ||
                    this.currentState === this.states[5]) {
                    CollisionSound.play();
                    this.game.floatingMessages.push(new FloatingMessage(this.game, '+1', enemy.x, enemy.y, 100, 50));
                } else {
                    this.setState(6, 0);
                    this.game.lives--;
                    if (this.game.lives <= 0) this.game.gameOver = true;
                }
            }
        })
    }

    restart() {
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.setState(0, 0);
        console.log(this.currentState);
        this.power = 20;
    }
}