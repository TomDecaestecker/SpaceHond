export class InputHandler {
    constructor(game) {
        this.keys = [];
        this.touchX = '';
        this.touchY = '';
        this.touchTreshold = 30;
        this.powerTreshold = 90;
        this.game = game;
        window.addEventListener('keydown', e => {
            if ((e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowRight' ||
                e.key === 'ArrowLeft' ||
                e.key === ' ')
                && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            } else if (e.key === 'd') this.game.debug = !this.game.debug;

        });
        window.addEventListener('keyup', e => {
            if (e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowRight' ||
                e.key === 'ArrowLeft' ||
                e.key === ' ') {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
        window.addEventListener('touchstart', e => {
            this.touchX = e.changedTouches[0].pageX;
            this.touchY = e.changedTouches[0].pageY;
        });
        window.addEventListener('touchmove', e => {
            const swipeDistanceX = e.changedTouches[0].pageX - this.touchX;
            const swipeDistanceY = e.changedTouches[0].pageY - this.touchY;

            if (swipeDistanceX > this.powerTreshold && this.keys.indexOf(' ') === -1) this.keys.push(' ');
            else if (swipeDistanceX < -this.touchTreshold && this.keys.indexOf('ArrowLeft') === -1) this.keys.push('ArrowLeft');
            else if (swipeDistanceX > this.touchTreshold && this.keys.indexOf('ArrowRight') === -1) this.keys.push('ArrowRight');

            if (swipeDistanceY < -this.touchTreshold && this.keys.indexOf('ArrowUp') === -1) this.keys.push('ArrowUp');
            else if (swipeDistanceY > this.touchTreshold && this.keys.indexOf('ArrowDown') === -1) this.keys.push('ArrowDown');

        });
        window.addEventListener('touchend', e => {
            if (this.keys.indexOf('ArrowDown') != -1 && this.game.gameOver) this.game.restart();
            this.keys.splice(this.keys.indexOf('Swipeleft'), 1);
            this.keys.splice(this.keys.indexOf('ArrowRight'), 1);
            this.keys.splice(this.keys.indexOf('ArrowUp'), 1);
            this.keys.splice(this.keys.indexOf('ArrowDown'), 1);
            this.keys.splice(this.keys.indexOf(' '), 1);
            console.log(this.keys);

        });

    }

}