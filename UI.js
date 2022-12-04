export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Creepster';
        this.livesImage = document.getElementById('lives');
    }
    draw(context) {
        context.save();
        //power
        context.fillStyle = 'yellow';
        context.fillRect(20, 92, this.game.player.power * 3, 10);
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'white';
        context.shadowBlur = 0;
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;
        //score
        context.fillText('Score: ' + this.game.score, 20, 50);
        //timer
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText('Time: ' + (this.game.time * 0.001).toFixed(1), 20, 80);

        //lives
        for (let i = 0; i < this.game.lives; i++) {
            context.drawImage(this.livesImage, 20 + i * 25, 110, 25, 25);
        }
        //game over messages
        if (this.game.gameOver) {
            context.textAlign = 'center';
            if (this.game.score >= this.game.winningScore) {
                this.game.gameWin = true;
                context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
                context.fillText('Joepie', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('Down to restart', this.game.width * 0.5, this.game.height * 0.5 + 20);
            } else {
                this.game.gameLoss = true;
                context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
                context.fillText('Don\'t lose hope!', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('Down to restart', this.game.width * 0.5, this.game.height * 0.5 + 20);

            }
        }
        context.restore();
    }

}