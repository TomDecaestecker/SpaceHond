import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy } from './enemies.js';
import { GroundEnemy } from './enemies.js';
import { ClimbingEnemy } from './enemies.js';
import { UI } from './UI.js';

window.addEventListener("load", function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;

    let gameOver = false;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.speed = 0;
            this.maxSpeed = 3;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.background = new Background(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            if (!navigator.userAgentData.mobile) this.maxParticles = 10;
            else this.maxParticles = 200;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.score = 0;
            this.winningScore = 10;
            this.debug = false;
            this.fontColor = 'black';
            this.maxTime = 25000;
            this.time = this.maxTime;
            this.gameOver = false;
            this.gameWin = false;
            this.gameLoss = false;
            this.lives = 5;
            this.player.setState(0, 0);
        }
        update(deltaTime) {
            //game conditions
            if (this.time > deltaTime && !this.gameOver) this.time -= deltaTime;
            else this.gameOver = true;
            if (this.gameLoss && this.player.currentState != this.player.states[6]) this.player.setState(6, 1);
            if (this.input.keys.includes('ArrowDown') && this.gameOver) this.restart();

            //background
            if (this.gameOver) this.speed = 2;
            this.background.update();
            this.player.update(this.input, deltaTime);
            //enemies
            if (this.enemyTimer > this.enemyInterval && !this.gameWin) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            if (this.gameWin) this.enemies.forEach(e => e.markedForDeletion = true);
            this.enemies.forEach(e => e.update(deltaTime));
            //particles
            this.particles.forEach(particle => particle.update());
            this.enemies = this.enemies.filter(x => !x.markedForDeletion);
            this.particles = this.particles.filter(x => !x.markedForDeletion);
            if (this.particles.length > this.maxParticles) this.particles.length = this.maxParticles;
            //collisions
            this.collisions.forEach(collision => collision.update(deltaTime))
            this.collisions = this.collisions.filter(x => !x.markedForDeletion);
            //floating messages
            this.floatingMessages.forEach(floatingMessage => floatingMessage.update());
            this.floatingMessages = this.floatingMessages.filter(x => !x.markedForDeletion);
        }
        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(e => e.draw(context));
            this.particles.forEach(particle => particle.draw(context));
            this.collisions.forEach(e => e.draw(context));
            this.UI.draw(context);
            this.floatingMessages.forEach(e => e.draw(context));
        }
        addEnemy() {
            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));
        }
        restart() {
            this.enemies.forEach(e => e.markedForDeletion = true);
            this.particles.forEach(e => e.markedForDeletion = true);
            this.collisions.forEach(e => e.markedForDeletion = true);
            this.floatingMessages.forEach(e => e.markedForDeletion = true);
            this.enemyTimer = 0;
            this.score = 0;
            this.debug = false;
            this.time = this.maxTime;
            this.gameOver = false;
            this.gameWin = false;
            this.gameLoss = false;
            this.lives = 5;
            this.player.restart();
        }
    }



    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if (!gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});