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
            let mobilecheck = false;
            window.mobileCheck = function () {
                (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) mobilecheck = true; })(navigator.userAgent || navigator.vendor || window.opera);
                return check;
            };
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
            if (mobilecheck) this.maxParticles = 1;
            else this.maxParticles = 200;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.score = 0;
            this.winningScore = 5;
            this.debug = false;
            this.fontColor = 'black';
            this.maxTime = 20000;
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